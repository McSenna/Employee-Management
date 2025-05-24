<?php
session_start();

function uploadFile() {
    global $connect; // Changed from $conn to $connect to match connection.php
    
    try {
        // Check if file and required data are present
        if (!isset($_FILES['file']) || !isset($_POST['employee_id']) || !isset($_POST['file_type'])) {
            echo json_encode(['error' => true, 'message' => 'Missing required data']);
            return;
        }

        $employee_id = intval($_POST['employee_id']);
        $file_type = $_POST['file_type'];
        $description = $_POST['description'] ?? '';
        
        // Validate file upload
        if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['error' => true, 'message' => 'File upload error']);
            return;
        }
        
        $file = $_FILES['file'];
        $file_name = $file['name'];
        $file_tmp = $file['tmp_name'];
        $file_size = $file['size'];
        $file_error = $file['error'];
        
        // Check file size (40MB limit)
        if ($file_size > 40 * 1024 * 1024) {
            echo json_encode(['error' => true, 'message' => 'File size exceeds 40MB limit']);
            return;
        }
        
        // Get file extension and MIME type
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $mime_type = mime_content_type($file_tmp);
        
        // Create upload directory if it doesn't exist
        $upload_dir = '../uploads/employees/' . $employee_id . '/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        // Generate unique filename to prevent conflicts
        $new_file_name = uniqid() . '_' . $file_name;
        $file_path = $upload_dir . $new_file_name;
        
        // Move uploaded file
        if (!move_uploaded_file($file_tmp, $file_path)) {
            echo json_encode(['error' => true, 'message' => 'Failed to move uploaded file']);
            return;
        }
        
        // Insert file record into database
        $sql = "INSERT INTO employee_files (employee_id, file_name, file_path, file_type, description, size, mime_type) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $connect->prepare($sql);
        
        if (!$stmt) {
            // If prepare fails, delete the uploaded file
            unlink($file_path);
            echo json_encode(['error' => true, 'message' => 'Database prepare failed: ' . $connect->error]);
            return;
        }
        
        $relative_path = 'uploads/employees/' . $employee_id . '/' . $new_file_name;
        
        $stmt->bind_param("issssss", 
            $employee_id,
            $file_name, 
            $relative_path, 
            $file_type, 
            $description, 
            $file_size, 
            $mime_type
        );
        
        if ($stmt->execute()) {
            echo json_encode([
                'error' => false, 
                'message' => 'File uploaded successfully',
                'file_id' => $connect->insert_id
            ]);
        } else {
            // If database insert fails, delete the uploaded file
            unlink($file_path);
            echo json_encode(['error' => true, 'message' => 'Database error: ' . $stmt->error]);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode(['error' => true, 'message' => 'Server error: ' . $e->getMessage()]);
    }
}

function fetchFiles() {
    global $connect; // Changed from $conn to $connect
    
    if (!isset($_GET['employee_id'])) {
        echo json_encode(['error' => true, 'message' => 'Employee ID is required']);
        return;
    }
    
    $employee_id = intval($_GET['employee_id']);
    
    $sql = "SELECT * FROM employee_files WHERE employee_id = ? ORDER BY uploaded_at DESC";
    $stmt = $connect->prepare($sql);
    $stmt->bind_param("i", $employee_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $files = [];
        
        while ($row = $result->fetch_assoc()) {
            $files[] = $row;
        }
        
        echo json_encode(['error' => false, 'files' => $files]);
    } else {
        echo json_encode(['error' => true, 'message' => 'Database error: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function getStorageInfo() {
    global $connect; // Changed from $conn to $connect
    
    if (!isset($_GET['employee_id'])) {
        echo json_encode(['error' => true, 'message' => 'Employee ID is required']);
        return;
    }
    
    $employee_id = intval($_GET['employee_id']);
    
    // Calculate total storage used by the employee
    $sql = "SELECT SUM(size) as total_size FROM employee_files WHERE employee_id = ?";
    $stmt = $connect->prepare($sql);
    $stmt->bind_param("i", $employee_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        $used_storage = $row['total_size'] ? round($row['total_size'] / (1024 * 1024), 2) : 0;
        $total_storage = 150; // 150MB limit
        
        echo json_encode([
            'error' => false,
            'used_storage' => $used_storage,
            'total_storage' => $total_storage
        ]);
    } else {
        echo json_encode(['error' => true, 'message' => 'Database error: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function deleteFile() {
    global $connect; // Changed from $conn to $connect
    
    // Get JSON input for POST requests
    $input = json_decode(file_get_contents('php://input'), true);
    $file_id = $input['file_id'] ?? null;
    
    if (!$file_id) {
        echo json_encode(['error' => true, 'message' => 'File ID is required']);
        return;
    }
    
    // First, get file info
    $sql = "SELECT file_path FROM employee_files WHERE id = ?";
    $stmt = $connect->prepare($sql);
    $stmt->bind_param("i", $file_id);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $file = $result->fetch_assoc();
        
        if ($file) {
            // Delete from database
            $delete_sql = "DELETE FROM employee_files WHERE id = ?";
            $delete_stmt = $connect->prepare($delete_sql);
            $delete_stmt->bind_param("i", $file_id);
            
            if ($delete_stmt->execute()) {
                // Delete physical file
                $file_path = '../' . $file['file_path'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
                
                echo json_encode(['error' => false, 'message' => 'File deleted successfully']);
            } else {
                echo json_encode(['error' => true, 'message' => 'Database error: ' . $delete_stmt->error]);
            }
            
            $delete_stmt->close();
        } else {
            echo json_encode(['error' => true, 'message' => 'File not found']);
        }
    } else {
        echo json_encode(['error' => true, 'message' => 'Database error: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function toggleFileStatus() {
    global $connect;
    $res = ['error' => false];
    
    try {
        if (!isset($_POST['file_id'])) {
            throw new Exception('File ID is required');
        }
        
        $file_id = $_POST['file_id'];
        
        // First, check current status
        $checkStmt = $connect->prepare("SELECT is_active FROM employee_files WHERE id = ?");
        $checkStmt->bind_param("i", $file_id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        $file = $result->fetch_assoc();
        $checkStmt->close();
        
        if (!$file) {
            throw new Exception('File not found');
        }
        
        // Toggle the status
        $newStatus = $file['is_active'] ? 0 : 1;
        
        $updateStmt = $connect->prepare("UPDATE employee_files SET is_active = ? WHERE id = ?");
        $updateStmt->bind_param("ii", $newStatus, $file_id);
        
        if ($updateStmt->execute()) {
            $res['success'] = true;
            $res['is_active'] = $newStatus;
            $res['message'] = $newStatus ? 'File enabled successfully' : 'File disabled successfully';
        } else {
            throw new Exception('Failed to update file status');
        }
        
        $updateStmt->close();
        
    } catch (Exception $e) {
        $res['error'] = true;
        $res['message'] = $e->getMessage();
    }
    
    echo json_encode($res);
}
?>