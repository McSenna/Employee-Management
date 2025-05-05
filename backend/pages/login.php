<?php
     function login() {
        global $connect;
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            echo json_encode([
                'error' => true,
                'message' => 'Email and password are required'
            ]);
            return;
        }
        
        $email = $data['email'];
        $password = $data['password'];

        $stmt = $connect->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode([
                'error' => true,
                'message' => 'User not found'
            ]);
            return;
        }
        
        $user = $result->fetch_assoc();
        $stmt->close();

        if (password_verify($password, $user['password'])) {
            echo json_encode([
                'error' => false,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'] ?? 'user'
                ]
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'message' => 'Invalid password'
            ]);
        }
    }