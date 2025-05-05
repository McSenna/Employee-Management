<?php 
    function register() {
        global $connect;

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            echo json_encode([
                'error' => true,
                'message' => 'Name, email and password are required'
            ]);
            return;
        }
        
        $name = $data['name'];
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        $stmt = $connect->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode([
                'error' => true,
                'message' => 'Email already in use'
            ]);
            return;
        }
        $stmt = $connect->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password);
        
        if ($stmt->execute()) {
            echo json_encode([
                'error' => false,
                'message' => 'Registration successful'
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'message' => 'Registration failed: ' . $stmt->error
            ]);
        }
        
        $stmt->close();
    }
