<?php
function login() {
    global $connect;
    $res = ['error' => false];

    try {
        $inputJSON = file_get_contents('php://input');
        $data = json_decode($inputJSON, true);

        error_log("Login request data: " . $inputJSON);

        if (!$data) {
            $res = [
                'error' => true,
                'message' => 'Invalid request format'
            ];
            echo json_encode($res);
            return;
        }

        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? $data['password'] : '';

        error_log("Login attempt for email: " . $email);

        if (empty($email) || empty($password)) {
            $res = [
                'error' => true,
                'message' => 'Email and password are required'
            ];
            echo json_encode($res);
            return;
        }

        // Updated query to match your employees table schema
        $stmt = $connect->prepare("SELECT id, employee_id, first_name, last_name, email, password, department, job_title, role, profile_picture FROM employees WHERE email = ?");
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $connect->error);
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $employee = $result->fetch_assoc();
            
            // Debug stored password hash
            error_log("Stored hash: " . $employee['password']);
            error_log("Entered password: " . $password);
            
            // First try password_verify for properly hashed passwords
            $passwordCorrect = password_verify($password, $employee['password']);
            
            // If that fails, check if the password is stored in plaintext or using older hash methods
            if (!$passwordCorrect) {
                // Check if password is stored as plaintext (not recommended but sometimes happens)
                if ($password === $employee['password']) {
                    $passwordCorrect = true;
                    
                    // Upgrade to proper hash
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $updatePwStmt = $connect->prepare("UPDATE employees SET password = ? WHERE id = ?");
                    if ($updatePwStmt) {
                        $updatePwStmt->bind_param("si", $hashedPassword, $employee['id']);
                        $updatePwStmt->execute();
                    }
                }
                
                // Check for MD5 hash (older systems might use this)
                else if (md5($password) === $employee['password']) {
                    $passwordCorrect = true;
                    
                    // Upgrade to proper hash
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $updatePwStmt = $connect->prepare("UPDATE employees SET password = ? WHERE id = ?");
                    if ($updatePwStmt) {
                        $updatePwStmt->bind_param("si", $hashedPassword, $employee['id']);
                        $updatePwStmt->execute();
                    }
                }
            }

            if ($passwordCorrect) {
                // Update last login (you might want to add a last_login field to your employees table)
                $updateStmt = $connect->prepare("UPDATE employees SET updated_at = NOW() WHERE id = ?");
                if ($updateStmt) {
                    $updateStmt->bind_param("i", $employee['id']);
                    $updateStmt->execute();
                }

                // Prepare response with employee data
                unset($employee['password']);
                
                // Add full name to response
                $employee['full_name'] = $employee['first_name'] . ' ' . $employee['last_name'];
                
                $res['employee'] = $employee;
                $res['message'] = 'Login successful';

                $activityStmt = $connect->prepare("INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)");
                if ($activityStmt) {
                    $action = "login";
                    $details = "Employee logged in";
                    $ip_address = $_SERVER['REMOTE_ADDR'];
                    $activityStmt->bind_param("isss", $employee['id'], $action, $details, $ip_address);
                    $activityStmt->execute();
                }
            } else {
                $res = [
                    'error' => true,
                    'message' => 'Invalid email or password (wrong password)'
                ];
            }
        } else {
            $res = [
                'error' => true,
                'message' => 'Invalid email or password (email not found)'
            ];
        }

    } catch (Exception $e) {
        error_log("Login exception: " . $e->getMessage());
        $res = [
            'error' => true,
            'message' => 'Exception: ' . $e->getMessage()
        ];
    }

    error_log("Login response: " . json_encode($res));
    echo json_encode($res);
}