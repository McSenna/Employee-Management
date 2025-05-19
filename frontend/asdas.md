<?php
require_once 'file_operations.php'; 
function addEmployee() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Check for POST data first (FormData from axios)
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_FILES)) {
            $email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : ''; // Normalize email to lowercase
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
            // Fallback for JSON data (though FormData should be primary)
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
            
            $email = isset($data['email']) ? trim(strtolower($data['email'])) : '';
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
        
        // Check if email already exists - USING PREPARED STATEMENT with CASE-INSENSITIVE comparison
        $checkSql = "SELECT id FROM employees WHERE LOWER(email) = ?";
        $checkStmt = $connect->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $res = [
                'error' => true,
                'message' => 'Email already registered: ' . $email
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
        
        // Process profile picture if uploaded
        $profilePicturePath = null;
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/profile_pictures/';
            
            // Create directory if it doesn't exist
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $fileName = time() . '_' . bin2hex(random_bytes(8)) . '_' . basename($_FILES['profile_picture']['name']);
            $targetFilePath = $uploadDir . $fileName;
            
            // Check file type
            $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
            
            if (in_array($fileType, $allowedTypes)) {
                // Move uploaded file
                if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $targetFilePath)) {
                    $profilePicturePath = 'uploads/profile_pictures/' . $fileName;
                } else {
                    error_log("Failed to move uploaded profile picture");
                }
            } else {
                error_log("Invalid profile picture format: " . $fileType);
            }
        }
        
        // Insert new employee with profile picture if available
        if ($profilePicturePath) {
            $sql = "INSERT INTO employees (employee_id, first_name, last_name, email, password, department, job_title, role, hire_date, age, profile_picture) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $connect->prepare($sql);
            $stmt->bind_param("ssssssssis", $employeeId, $firstName, $lastName, $email, $hashedPassword, $department, $jobTitle, $role, $hireDate, $age, $profilePicturePath);
        } else {
            $sql = "INSERT INTO employees (employee_id, first_name, last_name, email, password, department, job_title, role, hire_date, age) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $connect->prepare($sql);
            $stmt->bind_param("sssssssssi", $employeeId, $firstName, $lastName, $email, $hashedPassword, $department, $jobTitle, $role, $hireDate, $age);
        }
        
        if ($stmt->execute()) {
            $userId = $connect->insert_id;
            
            // Handle file uploads using uploadFile() from file_operations.php
            $fileCount = 0;
            while (isset($_FILES["file_{$fileCount}"])) {
                $_POST['employee_id'] = $userId;
                $_POST['file_type'] = isset($_POST["file_type_{$fileCount}"]) ? $_POST["file_type_{$fileCount}"] : 'other';
                $_POST['description'] = isset($_POST["file_description_{$fileCount}"]) ? $_POST["file_description_{$fileCount}"] : '';
                
                $_FILES['file'] = $_FILES["file_{$fileCount}"];
                
                ob_start();
                uploadFile();
                $uploadResult = json_decode(ob_get_clean(), true);
                
                if (isset($uploadResult['error']) && $uploadResult['error']) {
                    error_log("File upload failed for file_{$fileCount}: " . $uploadResult['message']);
                }
                
                $fileCount++;
            }
            
            // Log the activity
            $action = 'Add Employee';
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

function register() {
    // Call the addEmployee function for registration
    addEmployee();
}