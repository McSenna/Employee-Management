<?php
function get_user_profile() {
    global $connect;
    
    // Check if user is logged in by checking for user ID
    if (!isset($_GET['user_id']) || empty($_GET['user_id'])) {
        echo json_encode([
            'error' => true,
            'message' => 'User ID is required'
        ]);
        return;
    }
    
    $userId = $_GET['user_id'];
    
    // Prepare the SQL statement to prevent SQL injection
    $stmt = $connect->prepare("
        SELECT id, employee_id, first_name, last_name, email, department, 
               job_title, role, profile_picture, hire_date, created_at, updated_at
        FROM employees 
        WHERE id = ?
    ");
    
    if (!$stmt) {
        echo json_encode([
            'error' => true,
            'message' => 'Database preparation error: ' . $connect->error
        ]);
        return;
    }
    
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'error' => true,
            'message' => 'User not found'
        ]);
        return;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Ensure the profile picture URL is absolute if it's set
    if (!empty($user['profile_picture'])) {
        // If the URL doesn't already start with http:// or https://
        if (!preg_match('/^(http|https):\/\//', $user['profile_picture'])) {
            // If it starts with a slash, it's a relative path from the domain root
            if (substr($user['profile_picture'], 0, 1) === '/') {
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
                $user['profile_picture'] = $protocol . $_SERVER['HTTP_HOST'] . $user['profile_picture'];
            } else {
                // Otherwise, it's a path relative to the API endpoint
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
                $baseUrl = $protocol . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);
                $user['profile_picture'] = $baseUrl . '/' . $user['profile_picture'];
            }
        }
    }
    
    // Don't return sensitive data like password
    // Create a full name field for convenience
    $user['full_name'] = $user['first_name'] . ' ' . $user['last_name'];
    
    echo json_encode([
        'error' => false,
        'user' => $user
    ]);
}