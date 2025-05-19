<?php
function deleteEmployee() {
    global $connect;
    
    // Get the FormData input
    $data = $_POST; // FormData is sent as POST
    if (isset($data['id'])) {
        $employeeId = $data['id'];
        
        // Prepare the DELETE query using the primary key 'id'
        $stmt = $connect->prepare("DELETE FROM employees WHERE id = ?");
        $stmt->bind_param('i', $employeeId); // Use 'i' for integer (id is an integer)
        
        if ($stmt->execute()) {
            $json = [
                'error' => false,
                'message' => 'Employee deleted successfully'
            ];
        } else {
            $json = [
                'error' => true,
                'message' => 'Failed to delete employee'
            ];
        }
        
        $stmt->close();
    } else {
        $json = [
            'error' => true,
            'message' => 'Employee ID not provided'
        ];
    }
    
    echo json_encode($json);
}
?>