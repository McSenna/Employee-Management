<?php
require_once 'file_operations.php'; // Include file_operations.php for uploadFile()

function register() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Get JSON data from request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $res = [
                'error' => true,
                'message' => 'Invalid request format'
            ];
            echo json_encode($res);
            return;
        }
        
        // Extract and sanitize input data
        $username = isset($data['username']) ? trim($data['username']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        $age = isset($data['age']) ? (int)$data['age'] : 0;
        $firstName = isset($data['first_name']) ? trim($data['first_name']) : '';
        $lastName = isset($data['last_name']) ? trim($data['last_name']) : '';
        $department = isset($data['department']) ? trim($data['department']) : '';
        $jobTitle = isset($data['job_title']) ? trim($data['job_title']) : '';
        $hireDate = isset($data['hire_date']) ? trim($data['hire_date']) : date('Y-m-d');
        $employeeId = isset($data['employee_id']) ? trim($data['employee_id']) : '';
        $role = isset($data['role']) ? trim($data['role']) : 'employee';
        
        // Validate required fields
        if (empty($username) || empty($email) || empty($password)) {
            $res = [
                'error' => true,
                'message' => 'Username, email and password are required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $res = [
                'error' => true,
                'message' => 'Invalid email format'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate passwordab
        if (strlen($password) < 8) {
            $res = [
                'error' => true,
                'message' => 'Password must be at least 8 characters long'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate age if provided
        if ($age && ($age < 18 || $age > 100)) {
            $res = [
                'error' => true,
                'message' => 'Age must be between 18 and 100'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check if email already exists - USING PREPARED STATEMENT
        $checkSql = "SELECT id FROM employees WHERE email = ?";
        $checkStmt = $connect->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $res = [
                'error' => true,
                'message' => 'Email already registered'
            ];
            echo json_encode($res);
            $checkStmt->close();
            return;
        }
        $checkStmt->close();
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate employee ID if not provided
        if (empty($employeeId) && !empty($department)) {
            $deptPrefix = strtoupper(substr($department, 0, 3));
            $randomNum = mt_rand(10000, 99999);
            $employeeId = $deptPrefix . $randomNum;
        }
        
        // Insert new employee
        $sql = "INSERT INTO employees (employee_id, first_name, last_name, email, password, department, job_title, role, hire_date, age) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sssssssssi", $employeeId, $firstName, $lastName, $email, $hashedPassword, $department, $jobTitle, $role, $hireDate, $age);
        
        if ($stmt->execute()) {
            $userId = $connect->insert_id;
            
            // Log the registration activity
            $action = 'register';
            $details = 'New employee registration';
            $ipAddress = $_SERVER['REMOTE_ADDR'];
            
            $logSql = "INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)";
            $logStmt = $connect->prepare($logSql);
            $logStmt->bind_param("isss", $userId, $action, $details, $ipAddress);
            $logStmt->execute();
            $logStmt->close();
            
            $res['user_id'] = $userId;
            $res['employee_id'] = $employeeId;
            $res['message'] = 'Registration successful';
        } else {
            $res = [
                'error' => true,
                'message' => 'Registration failed: ' . $stmt->error
            ];
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
    
    echo json_encode($res);
    return;
}

function addEmployee() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Check for POST data first
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST)) {
            // Process form data as FormData
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';
            $age = isset($_POST['age']) ? (int)$_POST['age'] : 0;
            $firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : '';
            $lastName = isset($_POST['last_name']) ? trim($_POST['last_name']) : '';
            $department = isset($_POST['department']) ? trim($_POST['department']) : '';
            $jobTitle = isset($_POST['job_title']) ? trim($_POST['job_title']) : '';
            $hireDate = isset($_POST['hire_date']) ? trim($_POST['hire_date']) : date('Y-m-d');
            $employeeId = isset($_POST['employee_id']) ? trim($_POST['employee_id']) : '';
            $role = isset($_POST['role']) ? trim($_POST['role']) : 'employee';
        } else {
            // Try to get JSON data from request body as fallback
            $jsonData = file_get_contents('php://input');
            $data = json_decode($jsonData, true);
            
            if (!$data) {
                $res = [
                    'error' => true,
                    'message' => 'No valid data received. Please submit form data or JSON.'
                ];
                echo json_encode($res);
                return;
            }
            
            $email = isset($data['email']) ? trim($data['email']) : '';
            $password = isset($data['password']) ? $data['password'] : '';
            $age = isset($data['age']) ? (int)$data['age'] : 0;
            $firstName = isset($data['first_name']) ? trim($data['first_name']) : '';
            $lastName = isset($data['last_name']) ? trim($data['last_name']) : '';
            $department = isset($data['department']) ? trim($data['department']) : '';
            $jobTitle = isset($data['job_title']) ? trim($data['job_title']) : '';
            $hireDate = isset($data['hire_date']) ? trim($data['hire_date']) : date('Y-m-d');
            $employeeId = isset($data['employee_id']) ? trim($data['employee_id']) : '';
            $role = isset($data['role']) ? trim($data['role']) : 'employee';
        }
        
        // Validate required fields
        if (empty($email) || empty($password)) {
            $res = [
                'error' => true,
                'message' => 'Email and password are required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate first and last name
        if (empty($firstName) || empty($lastName)) {
            $res = [
                'error' => true, 
                'message' => 'First name and last name are required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $res = [
                'error' => true,
                'message' => 'Invalid email format'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate password strength (minimum 8 characters)
        if (strlen($password) < 8) {
            $res = [
                'error' => true,
                'message' => 'Password must be at least 8 characters long'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate department
        if (empty($department)) {
            $res = [
                'error' => true,
                'message' => 'Department is required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate job title
        if (empty($jobTitle)) {
            $res = [
                'error' => true,
                'message' => 'Job title is required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Validate age if provided
        if ($age && ($age < 18 || $age > 100)) {
            $res = [
                'error' => true,
                'message' => 'Age must be between 18 and 100'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check if email already exists - USING PREPARED STATEMENT
        $checkSql = "SELECT id FROM employees WHERE email = ?";
        $checkStmt = $connect->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $res = [
                'error' => true,
                'message' => 'Email already registered'
            ];
            echo json_encode($res);
            $checkStmt->close();
            return;
        }
        $checkStmt->close();
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Generate employee ID if not provided
        if (empty($employeeId) && !empty($department)) {
            $deptPrefix = strtoupper(substr($department, 0, 3));
            $randomNum = mt_rand(10000, 99999);
            $employeeId = $deptPrefix . $randomNum;
        }
        
        // Handle profile picture upload
        $profilePicturePath = null;
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/profile_pictures/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileName = $employeeId . '_' . time() . '_' . basename($_FILES['profile_picture']['name']);
            $filePath = $uploadDir . $fileName;
            
            // Validate file type and size (e.g., max 2MB, only images)
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            $maxSize = 2 * 1024 * 1024; // 2MB
            
            if (!in_array($_FILES['profile_picture']['type'], $allowedTypes)) {
                $res = [
                    'error' => true,
                    'message' => 'Invalid profile picture format. Only JPEG, PNG, or GIF allowed.'
                ];
                echo json_encode($res);
                return;
            }
            
            if ($_FILES['profile_picture']['size'] > $maxSize) {
                $res = [
                    'error' => true,
                    'message' => 'Profile picture size exceeds 2MB limit.'
                ];
                echo json_encode($res);
                return;
            }
            
            if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $filePath)) {
                $profilePicturePath = $filePath;
            } else {
                $res = [
                    'error' => true,
                    'message' => 'Failed to upload profile picture.'
                ];
                echo json_encode($res);
                return;
            }
        }
        
        // Insert new employee
        $sql = "INSERT INTO employees (employee_id, first_name, last_name, email, password, department, job_title, role, hire_date, age, profile_picture) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param("sssssssssis", $employeeId, $firstName, $lastName, $email, $hashedPassword, $department, $jobTitle, $role, $hireDate, $age, $profilePicturePath);
        
        if ($stmt->execute()) {
            $userId = $connect->insert_id;
            
            // Handle file uploads using uploadFile() from file_operations.php
            $fileCount = 0;
            while (isset($_FILES["file_{$fileCount}"])) {
                // Prepare $_POST and $_FILES for uploadFile()
                $_POST['employee_id'] = $userId;
                $_POST['file_type'] = isset($_POST["file_type_{$fileCount}"]) ? $_POST["file_type_{$fileCount}"] : 'other';
                $_POST['description'] = isset($_POST["file_description_{$fileCount}"]) ? $_POST["file_description_{$fileCount}"] : '';
                
                // Temporarily move the file to $_FILES['file']
                $_FILES['file'] = $_FILES["file_{$fileCount}"];
                
                // Call uploadFile() and capture output
                ob_start();
                uploadFile();
                $uploadResult = json_decode(ob_get_clean(), true);
                
                // Check if upload was successful
                if (isset($uploadResult['error']) && $uploadResult['error']) {
                    error_log("File upload failed for file_{$fileCount}: " . $uploadResult['message']);
                }
                
                $fileCount++;
            }
            
            // Log the activity
            $action = 'add_employee';
            $details = 'New employee added: ' . $firstName . ' ' . $lastName;
            $ipAddress = $_SERVER['REMOTE_ADDR'];
            
            $logSql = "INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)";
            $logStmt = $connect->prepare($logSql);
            $logStmt->bind_param("isss", $userId, $action, $details, $ipAddress);
            $logStmt->execute();
            $logStmt->close();
            
            $res['user_id'] = $userId;
            $res['employee_id'] = $employeeId;
            $res['message'] = 'Employee added successfully';
        } else {
            $res = [
                'error' => true,
                'message' => 'Failed to add employee: ' . $stmt->error
            ];
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
        error_log("Error in addEmployee: " . $e->getMessage());
    }
    
    echo json_encode($res);
    return;
}
?>