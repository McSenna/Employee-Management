<?php
// pages/fetch.php - For fetching employees

function fetchData() {
    global $conn;
    $res = ['error' => false];
    
    try {
        // Check for filter parameters
        $department = isset($_GET['department']) ? $conn->real_escape_string($_GET['department']) : '';
        $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
        
        // Base query
        $sql = "SELECT e.* FROM employees e WHERE 1=1";
        
        // Add filters if provided
        if (!empty($department)) {
            $sql .= " AND e.department = '$department'";
        }
        
        if (!empty($search)) {
            $sql .= " AND (e.full_name LIKE '%$search%' OR e.role LIKE '%$search%')";
        }
        
        $sql .= " ORDER BY e.id DESC";
        
        $result = $conn->query($sql);
        $employees = [];
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Get files for each employee
                $filesSql = "SELECT id, file_name, original_name, file_type FROM employee_files WHERE employee_id = {$row['id']}";
                $filesResult = $conn->query($filesSql);
                $files = [];
                
                if ($filesResult->num_rows > 0) {
                    while ($fileRow = $filesResult->fetch_assoc()) {
                        $files[] = $fileRow;
                    }
                }
                
                // Add files to employee data
                $row['files'] = $files;
                $employees[] = $row;
            }
        }
        
        $res['employees'] = $employees;
        $res['count'] = count($employees);
        
    } catch (Exception $e) {
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
    
    echo json_encode($res);
}

// pages/login.php - For user login

function login() {
    global $conn;
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
        
        $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        
        if (empty($email) || empty($password)) {
            $res = [
                'error' => true,
                'message' => 'Email and password are required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check user credentials in database
        $sql = "SELECT id, username, email, password, role_id FROM users WHERE email = '$email'";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Update last login timestamp
                $updateSql = "UPDATE users SET last_login = NOW() WHERE id = {$user['id']}";
                $conn->query($updateSql);
                
                // Get role name
                $roleSql = "SELECT role_name FROM roles WHERE id = {$user['role_id']}";
                $roleResult = $conn->query($roleSql);
                $role = $roleResult->fetch_assoc();
                
                // Return user data (excluding password)
                unset($user['password']);
                $user['role'] = $role['role_name'];
                
                $res['user'] = $user;
                $res['message'] = 'Login successful';
            } else {
                $res = [
                    'error' => true,
                    'message' => 'Invalid password'
                ];
            }
        } else {
            $res = [
                'error' => true,
                'message' => 'User not found'
            ];
        }
        
    } catch (Exception $e) {
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
    
    echo json_encode($res);
}

// pages/register.php - For user registration

function register() {
    global $conn;
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
        
        $username = isset($data['username']) ? $conn->real_escape_string($data['username']) : '';
        $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        
        if (empty($username) || empty($email) || empty($password)) {
            $res = [
                'error' => true,
                'message' => 'All fields are required'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check if email already exists
        $checkSql = "SELECT id FROM users WHERE email = '$email'";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows > 0) {
            $res = [
                'error' => true,
                'message' => 'Email already registered'
            ];
            echo json_encode($res);
            return;
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Default role_id for new registrations is 3 (user)
        $roleId = 3;
        
        // Insert new user
        $sql = "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $username, $email, $hashedPassword, $roleId);
        
        if ($stmt->execute()) {
            $userId = $conn->insert_id;
            
            $res['user_id'] = $userId;
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
}

// pages/delete.php - For deleting employees

function deleteEmployee() {
    global $conn;
    $res = ['error' => false];
    
    try {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if ($id <= 0) {
            $res = [
                'error' => true,
                'message' => 'Invalid employee ID'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check if employee exists
        $checkSql = "SELECT id FROM employees WHERE id = $id";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            $res = [
                'error' => true,
                'message' => 'Employee not found'
            ];
            echo json_encode($res);
            return;
        }
        
        // Get file paths before deleting employee
        $filesSql = "SELECT file_name FROM employee_files WHERE employee_id = $id";
        $filesResult = $conn->query($filesSql);
        $filesToDelete = [];
        
        if ($filesResult->num_rows > 0) {
            while ($fileRow = $filesResult->fetch_assoc()) {
                $filesToDelete[] = '../uploads/' . $fileRow['file_name'];
            }
        }
        
        // Delete employee (will cascade delete files in database)
        $sql = "DELETE FROM employees WHERE id = $id";
        
        if ($conn->query($sql)) {
            // Delete physical files
            foreach ($filesToDelete as $file) {
                if (file_exists($file)) {
                    unlink($file);
                }
            }
            
            $res['message'] = 'Employee deleted successfully';
        } else {
            $res = [
                'error' => true,
                'message' => 'Failed to delete employee: ' . $conn->error
            ];
        }
        
    } catch (Exception $e) {
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
    
    echo json_encode($res);
}

// pages/update.php - For updating employee information

function updateEmployee() {
    global $conn;
    $res = ['error' => false];
    
    try {
        // Get employee ID and data
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        
        if ($id <= 0) {
            $res = [
                'error' => true,
                'message' => 'Invalid employee ID'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check if employee exists
        $checkSql = "SELECT id FROM employees WHERE id = $id";
        $checkResult = $conn->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            $res = [
                'error' => true,
                'message' => 'Employee not found'
            ];
            echo json_encode($res);
            return;
        }
        
        // Get form data
        $fullName = isset($_POST['fullName']) ? $conn->real_escape_string($_POST['fullName']) : '';
        $age = isset($_POST['age']) ? intval($_POST['age']) : 0;
        $role = isset($_POST['role']) ? $conn->real_escape_string($_POST['role']) : '';
        $department = isset($_POST['department']) ? $conn->real_escape_string($_POST['department']) : '';
        $hireDate = isset($_POST['hireDate']) ? $conn->real_escape_string($_POST['hireDate']) : '';
        
        // Validate inputs
        if (empty($fullName) || $age < 18 || empty($role) || empty($department) || empty($hireDate)) {
            $res = [
                'error' => true,
                'message' => 'All fields are required and age must be at least 18'
            ];
            echo json_encode($res);
            return;
        }
        
        // Check if password is being updated
        $passwordUpdate = '';
        if (!empty($_POST['password'])) {
            $hashedPassword = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $passwordUpdate = ", password = '$hashedPassword'";
        }
        
        // Update employee data
        $sql = "UPDATE employees SET 
                full_name = '$fullName', 
                age = $age, 
                role = '$role', 
                department = '$department', 
                hire_date = '$hireDate'
                $passwordUpdate
                WHERE id = $id";
        
        if ($conn->query($sql)) {
            // Handle file uploads if any
            $uploadDir = '../uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $fileCount = isset($_POST['fileCount']) ? intval($_POST['fileCount']) : 0;
            $uploadedFiles = [];
            
            for ($i = 0; $i < $fileCount; $i++) {
                $fileKey = "file$i";
                
                if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] == 0) {
                    $file = $_FILES[$fileKey];
                    $fileName = $file['name'];
                    $fileTmpName = $file['tmp_name'];
                    $fileSize = $file['size'];
                    $fileType = $file['type'];
                    
                    // Generate unique filename
                    $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
                    $newFileName = $id . '_' . uniqid() . '.' . $fileExt;
                    $destination = $uploadDir . $newFileName;
                    
                    // Check file size (max 10MB)
                    if ($fileSize > 10000000) {
                        continue; // Skip files larger than 10MB
                    }
                    
                    // Move uploaded file
                    if (move_uploaded_file($fileTmpName, $destination)) {
                                             // Save file information to database
                        $fileSql = "INSERT INTO employee_files (employee_id, file_name, original_name, file_type) 
                                    VALUES (?, ?, ?, ?)";
                        $fileStmt = $conn->prepare($fileSql);
                        $fileStmt->bind_param("isss", $id, $newFileName, $fileName, $fileType);
                        $fileStmt->execute();
                        $uploadedFiles[] = $fileName;
                        $fileStmt->close();
                    }
                }
            }
            
            $res['message'] = 'Employee updated successfully';
            $res['uploaded_files'] = $uploadedFiles;
        } else {
            $res = [
                'error' => true,
                'message' => 'Failed to update employee: ' . $conn->error
            ];
        }
        
    } catch (Exception $e) {
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }
    
    echo json_encode($res);
}