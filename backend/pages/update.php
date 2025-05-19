<?php 
    function updateEmployee() {
        global $connect;
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            echo json_encode([
                'error' => true,
                'message' => 'Employee ID is required'
            ]);
            return;
        }
        
        $id = $data['id'];
        $name = $data['name'] ?? null;
        $position = $data['position'] ?? null;
        $salary = $data['salary'] ?? null;
        $email = $data['email'] ?? null;
        $phone = $data['phone'] ?? null;

        $query = "UPDATE employees SET ";
        $params = [];
        $types = "";
        
        if ($name !== null) {
            $query .= "name = ?, ";
            $params[] = $name;
            $types .= "s";
        }
        
        if ($position !== null) {
            $query .= "position = ?, ";
            $params[] = $position;
            $types .= "s";
        }
        
        if ($salary !== null) {
            $query .= "salary = ?, ";
            $params[] = $salary;
            $types .= "d";
        }
        
        if ($email !== null) {
            $query .= "email = ?, ";
            $params[] = $email;
            $types .= "s";
        }
        
        if ($phone !== null) {
            $query .= "phone = ?, ";
            $params[] = $phone;
            $types .= "s";
        }
        $query = rtrim($query, ", ");
        
        $query .= " WHERE id = ?";
        $params[] = $id;
        $types .= "i";
        
        $stmt = $connect->prepare($query);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            echo json_encode([
                'error' => false,
                'message' => 'Employee updated successfully'
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'message' => 'Failed to update employee: ' . $stmt->error
            ]);
        }
        
        $stmt->close();
    }
  