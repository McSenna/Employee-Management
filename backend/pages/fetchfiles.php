<?php
    function fetchFiles() {
        global $connect;

        $stmt = $connect->prepare("
            SELECT 
                ef.*,
                CONCAT(e.first_name, ' ', e.last_name) as employee_name,
                e.department as employee_department,
                e.job_title as employee_job_title
            FROM employee_files ef
            LEFT JOIN employees e ON ef.employee_id = e.id
            ORDER BY ef.uploaded_at DESC
        ");
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);
        } else {
            echo json_encode(['error' => true, 'message' => 'Failed to fetch files']);
        }
        $stmt->close();
    }
