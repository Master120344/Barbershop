<?php
header('Content-Type: application/json');

$recipient_email = "kyle24253@gmail.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize user input
    $fullName = filter_var(trim($_POST["fullName"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST["phone"]), FILTER_SANITIZE_STRING);
    $service = filter_var(trim($_POST["service"]), FILTER_SANITIZE_STRING);
    $date = trim($_POST["bookingDate"]);
    $time = trim($_POST["bookingTime"]);
    // Sanitize the new comments field
    $comments = filter_var(trim($_POST["comments"]), FILTER_SANITIZE_STRING);

    // Server-side validation
    if (empty($fullName) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($phone) || empty($service) || empty($date) || empty($time)) {
        echo json_encode(['success' => false, 'message' => 'Invalid data. Please fill all required fields correctly.']);
        exit;
    }

    $subject = "New Appointment Request from $fullName";

    $formatted_date = date("l, F j, Y", strtotime($date));
    $formatted_time = date("g:i A", strtotime($time));

    // Start building the email body
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
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>New Booking Request via Website</h2>
            <p><strong>Name:</strong> {$fullName}</p>
            <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
            <p><strong>Phone:</strong> <a href='tel:{$phone}'>{$phone}</a></p>
            <hr>
            <p><strong>Requested Service:</strong> {$service}</p>
            <p><strong>Requested Date:</strong> {$formatted_date}</p>
            <p><strong>Requested Time:</strong> {$formatted_time}</p>";

    // Add the comments section ONLY if comments were provided
    if (!empty($comments)) {
        $email_body .= "
            <div class='notes'>
                <p><strong>Additional Notes:</strong></p>
                <p>" . nl2br($comments) . "</p>
            </div>";
    }

    $email_body .= "
        </div>
    </body>
    </html>";

    // Email Headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: Clean Cutz Booking <noreply@cleancutz.com>' . "\r\n";
    $headers .= 'Reply-To: ' . $email . "\r\n";

    // Send Email
    if (mail($recipient_email, $subject, $email_body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Thank you! Your request has been sent. We will contact you shortly to confirm.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Sorry, there was an error sending your request. Please try again later.']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>