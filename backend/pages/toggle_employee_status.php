<?php
function toggleEmployeeStatus() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Get the JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['employee_id'])) {
            throw new Exception('Employee ID is required');
        }
        
        $employee_id = $input['employee_id'];
        
        // First, check current status
        $checkStmt = $connect->prepare("SELECT is_active FROM employees WHERE id = ?");
        $checkStmt->bind_param("i", $employee_id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        $employee = $result->fetch_assoc();
        $checkStmt->close();
        
        if (!$employee) {
            throw new Exception('Employee not found');
        }
        
        // Toggle the status
        $newStatus = $employee['is_active'] ? 0 : 1;
        
        $updateStmt = $connect->prepare("UPDATE employees SET is_active = ? WHERE id = ?");
        $updateStmt->bind_param("ii", $newStatus, $employee_id);
        
        if ($updateStmt->execute()) {
            $res['success'] = true;
            $res['is_active'] = $newStatus;
            $res['message'] = $newStatus ? 'Employee enabled successfully' : 'Employee disabled successfully';
        } else {
            throw new Exception('Failed to update employee status');
        }
        
        $updateStmt->close();
        
    } catch (Exception $e) {
        $res['error'] = true;
        $res['message'] = $e->getMessage();
    }
    
    echo json_encode($res);
} 