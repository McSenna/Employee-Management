<?php
    include_once './config/connection.php';
    include_once './header.php';
    
    header('Content-Type: application/json');

    $res = ['error' => false];
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    switch($action) {
        case 'fetch':
            include './pages/fetch.php';
            fetchData();
            break;

        case 'login':
            include './pages/login.php';
            login();
            break;
            
        case 'register':
            include './pages/register.php';
            register();
            break;
            
        case 'add':
        include './pages/addEmployee.php';
            addEmployee();
            break;
            
        case 'update':
            updateEmployee();
            break;
            
        case 'delete':
            deleteEmployee();
            break;
            
        default:
            $res = [
                'error' => true,
                'message' => 'Invalid action'
            ];
            echo json_encode($res);
            break;
    }
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
    
    function deleteEmployee() {
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
        
        $stmt = $connect->prepare("DELETE FROM employees WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'error' => false,
                'message' => 'Employee deleted successfully'
            ]);
        } else {
            echo json_encode([
                'error' => true,
                'message' => 'Failed to delete employee: ' . $stmt->error
            ]);
        }
        
        $stmt->close();
    }