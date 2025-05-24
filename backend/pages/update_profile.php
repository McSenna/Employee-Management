<?php
function update_profile() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Get employee ID from request
        $employee_id = isset($_POST['employee_id']) ? intval($_POST['employee_id']) : 0;
        
        if ($employee_id <= 0) {
            throw new Exception('Invalid employee ID');
        }
        
        // Check if employee exists
        $checkStmt = $connect->prepare("SELECT id FROM employees WHERE id = ?");
        $checkStmt->bind_param("i", $employee_id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception('Employee not found');
        }
        $checkStmt->close();
        
        // Prepare update data
        $updateFields = [];
        $types = "";
        $params = [];
        
        // Handle text fields
        $textFields = [
            'first_name' => 's',
            'last_name' => 's',
            'email' => 's',
            'address' => 's'
        ];
        
        foreach ($textFields as $field => $type) {
            if (isset($_POST[$field]) && !empty($_POST[$field])) {
                $updateFields[] = "$field = ?";
                $types .= $type;
                $params[] = $_POST[$field];
            }
        }

        // Handle phone field separately to allow empty values
        if (isset($_POST['phone'])) {
            // Sanitize phone number - remove any non-digit characters except + and -
            $phone = preg_replace('/[^0-9+\-]/', '', $_POST['phone']);
            $updateFields[] = "phone = ?";
            $types .= "s";
            $params[] = $phone;
        }
        
        // Handle profile picture upload
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['profile_picture'];
            
            // Validate file type
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($file['type'], $allowedTypes)) {
                throw new Exception('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
            }
            
            // Validate file size (max 2MB)
            if ($file['size'] > 2 * 1024 * 1024) {
                throw new Exception('File size too large. Maximum size is 2MB.');
            }
            
            // Create upload directory if it doesn't exist
            $uploadDir = '../uploads/profile_pictures/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'profile_' . $employee_id . '_' . time() . '.' . $extension;
            $filepath = $uploadDir . $filename;
            
            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                $updateFields[] = "profile_picture = ?";
                $types .= "s";
                $params[] = 'uploads/profile_pictures/' . $filename;
            } else {
                throw new Exception('Failed to upload profile picture.');
            }
        }
        
        if (empty($updateFields)) {
            throw new Exception('No fields to update');
        }
        
        // Add updated_at timestamp
        $updateFields[] = "updated_at = NOW()";
        
        // Build and execute update query
        $sql = "UPDATE employees SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $types .= "i";
        $params[] = $employee_id;
        
        $stmt = $connect->prepare($sql);
        if (!$stmt) {
            throw new Exception('Failed to prepare update statement: ' . $connect->error);
        }
        
        $stmt->bind_param($types, ...$params);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to update profile: ' . $stmt->error);
        }
        
        // Fetch updated user data
        $selectStmt = $connect->prepare("
            SELECT id, employee_id, first_name, last_name, email, department, 
                   job_title, role, profile_picture, phone, address, hire_date, created_at, updated_at
            FROM employees 
            WHERE id = ?
        ");
        $selectStmt->bind_param("i", $employee_id);
        $selectStmt->execute();
        $updatedUser = $selectStmt->get_result()->fetch_assoc();
        $selectStmt->close();
        
        $res['message'] = 'Profile updated successfully';
        $res['user'] = $updatedUser;
        
    } catch (Exception $e) {
        $res['error'] = true;
        $res['message'] = $e->getMessage();
    }
    
    echo json_encode($res);
} 