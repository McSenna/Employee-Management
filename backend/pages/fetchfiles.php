<?php
    function fetchFiles() {
        global $connect; // Changed from $conn to $connect

        $stmt = $connect->prepare("SELECT * FROM employee_files");
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $data = [];
        while($users = $result->fetch_assoc()) {
            $data[] = $users;
        }
        echo json_encode($data);
    }
