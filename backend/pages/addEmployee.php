<?php 
     function addEmployee() {
        global $connect;

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || !isset($data['position']) || !isset($data['salary'])) {
            echo json_encode([
                'error' => true,
                'message' => 'Name, position and salary are required'
            ]);
            return;
        }
        
        $name = $data['name'];
        $position = $data['position'];
        $salary = $data['salary'];
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        
        $stmt = $connect->prepare("INSERT INTO employees (name, position, salary, email, phone) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdss", $name, $position, $salary, $email, $phone);
        
        if ($stmt->execute()) {
            echo json_encode([
                'error' => false,
                'message' => 'Employee added successfully',
                'id' => $connect->insert_id
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'message' => 'Failed to add employee: ' . $stmt->error
            ]);
        }
        
        $stmt->close();
    }
