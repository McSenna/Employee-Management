<?php
function updateEmployee() {
    global $connect;
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
        $checkResult = $connect->query($checkSql);
        
        if ($checkResult->num_rows === 0) {
            $res = [
                'error' => true,
                'message' => 'Employee not found'
            ];
            echo json_encode($res);
            return;
        }
        
        // Get form data
        $fullName = isset($_POST['fullName']) ? $connect->real_escape_string($_POST['fullName']) : '';
        $age = isset($_POST['age']) ? intval($_POST['age']) : 0;
        $role = isset($_POST['role']) ? $connect->real_escape_string($_POST['role']) : '';
        $department = isset($_POST['department']) ? $connect->real_escape_string($_POST['department']) : '';
        $hireDate = isset($_POST['hireDate']) ? $connect->real_escape_string($_POST['hireDate']) : '';
        
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
        
        if ($connect->query($sql)) {
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
                        $fileStmt = $connect->prepare($fileSql);
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
                'message' => 'Failed to update employee: ' . $connect->error
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