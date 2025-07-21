<?php
header('Content-Type: application/json');

// IMPORTANT: For testing, set this to your email. For production, you might want to fetch this from a config file.
$recipient_email = "kyle24253@gmail.com"; 

// --- Service Durations (Example) ---
// You'll need to define how long each service takes.
// This is crucial for the availability calculation.
// For this PHP script, we're just confirming the booking. The duration logic will primarily be in get_availability.php and JS.
// However, if you need to *display* durations in confirmation, you'd process this.
// For now, we just store the service string.
$service_durations = [
    "Haircut" => 30,
    "Beard Trim" => 15,
    "Shave" => 20,
    "Wash & Cut" => 45,
    // Add all your services and their typical durations in minutes
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize user input
    $fullName = filter_var(trim($_POST["fullName"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING);
    // FIX: Now correctly reads 'service' as per the HTML hidden input name
    $service = filter_var(trim($_POST["service"]), FILTER_SANITIZE_STRING); 
    $date = trim($_POST["bookingDate"]);
    $time = trim($_POST["bookingTime"]);
    $comments = filter_var(trim($_POST["comments"]), FILTER_SANITIZE_STRING);

    // Server-side validation
    $errors = [];
    if (empty($fullName)) {
        $errors['fullName'] = 'Full name is required.';
    } elseif (!preg_match("/^[a-zA-Z\s'-]+$/", $fullName)) {
        $errors['fullName'] = 'Please enter a valid name.';
    }

    if (empty($email)) {
        $errors['email'] = 'Email address is required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address.';
    }

    if (empty($phone)) {
        $errors['phone'] = 'Phone number is required.';
    } elseif (!preg_match("/^\d{3}-\d{3}-\d{4}$/", $phone)) { // Validate the dashed format
        $errors['phone'] = 'Use format 123-456-7890.';
    }
    
    if (empty($service)) {
        $errors['service'] = 'No services selected.';
    }

    if (empty($date)) {
        $errors['bookingDate'] = 'Please select a date.';
    } else {
        // Check if date is in the past
        $selectedDateTime = new DateTime($date . ' ' . $time);
        $now = new DateTime();
        if ($selectedDateTime < $now) {
            $errors['bookingDate'] = 'Date and time cannot be in the past.';
        }
    }

    if (empty($time)) {
        $errors['bookingTime'] = 'Please select a time.';
    } else {
        // Check time constraints (9 AM to 6 PM)
        list($hours, $minutes) = explode(':', $time);
        if ($hours < 9 || $hours >= 18 || ($hours == 18 && $minutes > 0)) {
            $errors['bookingTime'] = 'Select between 9 AM and 6 PM.';
        }
    }

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors, 'message' => 'Please correct the errors in the form.']);
        exit;
    }

    // If validation passes, prepare email
    $subject = "New Appointment Request from Clean Cutz - {$fullName}";

    $formatted_date = date("l, F j, Y", strtotime($date));
    $formatted_time = date("g:i A", strtotime($time));

    $email_body = "
    <html>
    <head>
        <title>New Appointment Request</title>
        <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; background-color: #f9f9f9;}
            h2 { color: #d4af37; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            p { margin: 10px 0; }
            strong { color: #333; }
            .notes { background-color: #fff; border-left: 3px solid #d4af37; padding: 15px; margin-top: 15px; }
            a { color: #1a0dab; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>New Booking Request via Website</h2>
            <p><strong>Name:</strong> {$fullName}</p>
            <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
            <p><strong>Phone:</strong> <a href='tel:{$phone}'>{$phone}</a></p>
            <hr>
            <p><strong>Requested Service(s):</strong> {$service}</p>
            <p><strong>Requested Date:</strong> {$formatted_date}</p>
            <p><strong>Requested Time:</strong> {$formatted_time}</p>";

    if (!empty($comments)) {
        $email_body .= "
            <div class='notes'>
                <p><strong>Additional Notes:</strong></p>
                <p>" . nl2br(htmlspecialchars($comments)) . "</p>
            </div>";
    }

    $email_body .= "
        </div>
    </body>
    </html>";

    // Email Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    // IMPORTANT: Change 'noreply@cleancutz.com' to a valid sender email for your domain.
    // If sending from localhost or a non-configured domain, emails might be marked as spam or rejected.
    $headers .= 'From: Clean Cutz Booking <noreply@yourdomain.com>' . "\r\n"; 
    $headers .= 'Reply-To: ' . $email . "\r\n";

    // Send Email
    if (mail($recipient_email, $subject, $email_body, $headers)) {
        // If email sent successfully, we assume booking is made (for now).
        // In a real scenario, you'd save this to a database *before* sending the email.
        echo json_encode(['success' => true, 'message' => 'Thank you! Your request has been sent. We will contact you shortly to confirm.']);
    } else {
        // Log the error if mail() fails
        error_log("mail() failed to send booking confirmation email. Recipient: {$recipient_email}");
        // Still return success if the *booking data* is intended to be stored elsewhere and email is secondary,
        // but for this setup, email failure might mean booking didn't happen.
        // For simplicity, let's assume email failure means a problem.
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your request. Please try again later.']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>