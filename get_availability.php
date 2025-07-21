<?php
// IMPORTANT: Configure these database connection details!
// These should match your local setup or your hosting provider's details.
define('DB_HOST', 'localhost'); 
define('DB_USER', 'root'); // Your DB username
define('DB_PASS', '');     // Your DB password
define('DB_NAME', 'cleancutz_db'); // Your DB name

// --- Service Durations ---
// This mapping is crucial for calculating available slots.
// All durations are in minutes.
$service_durations_minutes = [
    "Haircut" => 30,
    "Beard Trim" => 15,
    "Shave" => 20,
    "Wash & Cut" => 45,
    // Add all your services and their typical durations in minutes
    // Ensure these match what's displayed on your services page and stored in JS/LocalStorage
];

// --- Business Hours (24-hour format) ---
$business_start_hour = 9; // 9 AM
$business_end_hour = 18;  // 6 PM (up to 18:00, so last booking can *start* at 17:30 for 30 min slot)

// --- Slot Interval ---
// This is the smallest increment for availability slots (e.g., 15 minutes)
$slot_interval_minutes = 15;

// --- Helper function to get total duration for a service string ---
// Assumes service string is comma-separated like "Haircut, Beard Trim"
function getTotalServiceDuration($services_string, $durations_map) {
    $services = explode(',', $services_string);
    $total_duration = 0;
    foreach ($services as $service) {
        $trimmed_service = trim($service);
        if (isset($durations_map[$trimmed_service])) {
            $total_duration += $durations_map[$trimmed_service];
        }
        // If a service isn't in the map, we might want to log an error or use a default
    }
    return $total_duration;
}

// --- Helper function to round up to nearest 15 minutes ---
function roundUpToNearestInterval($minutes, $interval) {
    return ceil($minutes / $interval) * $interval;
}

// --- Database Connection ---
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    // In a production environment, you might want to log this error instead of echoing it directly.
    // For static hosting like GitHub Pages, this would fail anyway, but for local/live server it's crucial.
    header('Content-Type: application/json');
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// --- Fetch Booked Appointments ---
$events = [];
$sql = "SELECT id, full_name, service, booking_datetime, comments FROM appointments";

// Filter by date range if provided by the calendar request (e.g., for month/week view)
// FullCalendar sends start and end parameters in the GET request
if (isset($_GET['start']) && isset($_GET['end'])) {
    $start_date = $_GET['start'];
    $end_date = $_GET['end'];
    
    // Adjust SQL to fetch only within the requested date range
    // We use DATE() to ensure we get all bookings that *start* within the range
    $sql .= " WHERE DATE(booking_datetime) >= DATE('" . $conn->real_escape_string($start_date) . "') 
                 AND DATE(booking_datetime) < DATE('" . $conn->real_escape_string($end_date) . "')";
}
$sql .= " ORDER BY booking_datetime";

$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $booking_start_time = new DateTime($row['booking_datetime']);
        
        // Calculate total duration for this booking
        $duration_minutes = getTotalServiceDuration($row['service'], $service_durations_minutes);
        
        // Ensure duration is at least the slot interval, and rounded up
        $booking_duration = roundUpToNearestInterval($duration_minutes, $slot_interval_minutes);
        
        // If no duration found, default to a common slot time (e.g., 30 mins)
        if ($booking_duration == 0) {
            $booking_duration = 30; 
        }

        $booking_end_time = clone $booking_start_time;
        $booking_end_time->add(new DateInterval('PT' . $booking_duration . 'M')); // PT30M for 30 minutes

        // Create event for FullCalendar (booked slots are RED)
        $events[] = [
            'id' => $row['id'],
            'title' => $row['service'], // Display service in tooltip, or "Booked"
            'start' => $booking_start_time->format('Y-m-d\TH:i:s'),
            'end' => $booking_end_time->format('Y-m-d\TH:i:s'),
            'classNames' => ['fc-event-booked'], // Custom class for styling
            'backgroundColor' => 'var(--error-color)', // Red
            'borderColor' => 'var(--error-color)'
        ];
    }
} else {
    // Log DB error if needed
    error_log("Database query failed for get_availability.php: " . $conn->error);
}

// --- Calculate and Add Available Slots ---
// This part is more complex as it needs to generate all possible slots and then remove booked ones.
// For simplicity, we'll generate available slots within business hours for the requested date range.
// A more advanced approach would pre-calculate *all* possible slots and then just filter out booked ones.

if (isset($_GET['start']) && isset($_GET['end'])) {
    $calendar_start_date = new DateTime($_GET['start']);
    $calendar_end_date = new DateTime($_GET['end']); // This is the *end* of the requested period, so we go up to but not including this date.

    // Ensure we iterate through the dates requested by the calendar view
    $current_date = clone $calendar_start_date;

    // Iterate through each day within the calendar's view range
    while ($current_date < $calendar_end_date) {
        
        // Check if it's a weekend or a day you are closed (optional, requires more logic)
        // For now, assuming Mon-Fri business. You can add $current_date->format('N') check (1=Mon, 7=Sun).
        // Example: if ($current_date->format('N') >= 6) { continue; } // Skip Sat/Sun

        // Iterate through each 15-minute slot within business hours for the current day
        $slot_time = clone $current_date;
        $slot_time->setTime($business_start_hour, 0); // Start at business opening hour
        
        $business_end_time = clone $current_date;
        $business_end_time->setTime($business_end_hour, 0);

        // Generate slots until we reach or exceed business end time
        while ($slot_time < $business_end_time) {
            $slot_start = clone $slot_time;
            $slot_end = clone $slot_time;
            $slot_end->add(new DateInterval('PT' . $slot_interval_minutes . 'M'));

            // --- Check if this slot is already booked ---
            $is_booked = false;
            foreach ($events as $event) {
                // A slot is booked if it overlaps with an existing event.
                // Overlap condition: 
                // (EventStarts < SlotEnds) AND (EventEnds > SlotStarts)
                $event_start_dt = new DateTime($event['start']);
                $event_end_dt = new DateTime($event['end']);

                if ($event_start_dt < $slot_end && $event_end_dt > $slot_start) {
                    $is_booked = true;
                    break; // Found an overlap, this slot is booked
                }
            }

            if (!$is_booked) {
                // Add this available slot as an event (GREEN)
                $events[] = [
                    'title' => 'Available', // Display "Available" or nothing specific
                    'start' => $slot_start->format('Y-m-d\TH:i:s'),
                    'end' => $slot_end->format('Y-m-d\TH:i:s'),
                    'classNames' => ['fc-event-available'], // Custom class for styling
                    'backgroundColor' => 'var(--success-color)', // Green
                    'borderColor' => 'var(--success-color)'
                ];
            }
            
            // Move to the next slot
            $slot_time->add(new DateInterval('PT' . $slot_interval_minutes . 'M'));
        }
        
        // Move to the next day
        $current_date->add(new DateInterval('P1D'));
    }
}

// --- Output the JSON ---
header('Content-Type: application/json');
echo json_encode($events);

$conn->close();
?>