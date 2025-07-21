<?php
// Set headers to return a JSON response
header('Content-Type: application/json');

// The email address where you want to receive bookings
$recipient_email = "kyle24253@gmail.com";

// Simple check to ensure the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Data Sanitization and Validation ---
    // Sanitize user input to prevent XSS attacks and other vulnerabilities
    $fullName = filter_var(trim($_POST["fullName"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING);
    $service = filter_var(trim($_POST["service"]), FILTER_SANITIZE_STRING);
    $date = trim($_POST["bookingDate"]);
    $time = trim($_POST["bookingTime"]);

    // Server-side validation
    if (empty($fullName) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($phone) || empty($service) || empty($date) || empty($time)) {
        echo json_encode(['success' => false, 'message' => 'Invalid data. Please fill all required fields correctly.']);
        exit;
    }

    // --- Email Composition ---
    $subject = "New Appointment Request from $fullName";

    // Format the date and time for better readability
    $formatted_date = date("l, F j, Y", strtotime($date));
    $formatted_time = date("g:i A", strtotime($time));

    // Create the email body with HTML for better formatting
    $email_body = "
    <html>
    <head>
        <title>New Appointment Request</title>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; }
            h2 { color: #d4af37; }
            strong { color: #555; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>New Booking Request via Website</h2>
            <p><strong>Name:</strong> {$fullName}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Phone:</strong> {$phone}</p>
            <hr>
            <p><strong>Requested Service:</strong> {$service}</p>
            <p><strong>Requested Date:</strong> {$formatted_date}</p>
            <p><strong>Requested Time:</strong> {$formatted_time}</p>
        </div>
    </body>
    </html>";

    // --- Email Headers ---
    // To send HTML mail, the Content-type header must be set
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    // More headers
    $headers .= 'From: Clean Cutz Booking <noreply@yourdomain.com>' . "\r\n"; // Replace with your domain if possible
    $headers .= 'Reply-To: ' . $email . "\r\n";

    // --- Send Email ---
    if (mail($recipient_email, $subject, $email_body, $headers)) {
        // If mail is sent successfully, return a success JSON response
        echo json_encode(['success' => true, 'message' => 'Thank you! Your request has been sent. We will contact you shortly to confirm.']);
    } else {
        // If mail fails to send, return an error JSON response
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your request. Please try again later.']);
    }

} else {
    // If the request method is not POST, return an error
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>