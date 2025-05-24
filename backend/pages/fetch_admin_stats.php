<?php
function fetch_admin_stats() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Get total employee count
        $totalStmt = $connect->prepare("SELECT COUNT(*) as total FROM employees WHERE role != 'admin'");
        $totalStmt->execute();
        $totalResult = $totalStmt->get_result()->fetch_assoc();
        $res['total_employees'] = $totalResult['total'];
        $totalStmt->close();
        
        // Get department-wise employee count with department IDs
        $deptStmt = $connect->prepare("
            SELECT 
                department,
                COUNT(*) as count,
                MIN(id) as department_id
            FROM employees 
            WHERE role != 'admin'
            GROUP BY department
            ORDER BY count DESC
        ");
        $deptStmt->execute();
        $deptResult = $deptStmt->get_result();
        $departments = [];
        while ($row = $deptResult->fetch_assoc()) {
            $departments[] = $row;
        }
        $res['department_stats'] = $departments;
        $deptStmt->close();
        
        // Get active users (users who have logged in within the last 24 hours)
        $activeUsersStmt = $connect->prepare("
            SELECT COUNT(DISTINCT user_id) as active_users 
            FROM activity_logs 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        ");
        $activeUsersStmt->execute();
        $activeUsersResult = $activeUsersStmt->get_result()->fetch_assoc();
        $res['active_users'] = $activeUsersResult['active_users'];
        $activeUsersStmt->close();
        
        // Get recent system logs
        $logsStmt = $connect->prepare("
            SELECT * FROM activity_logs 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        $logsStmt->execute();
        $logsResult = $logsStmt->get_result();
        $logs = [];
        while ($row = $logsResult->fetch_assoc()) {
            $logs[] = $row;
        }
        $res['logs'] = $logs;
        $logsStmt->close();
        
        // Get recent activities with user details
        $activityStmt = $connect->prepare("
            SELECT al.*, 
                   CONCAT(e.first_name, ' ', e.last_name) as user_name,
                   e.department,
                   e.role
            FROM activity_logs al
            LEFT JOIN employees e ON al.user_id = e.id
            ORDER BY al.created_at DESC
            LIMIT 10
        ");
        $activityStmt->execute();
        $activityResult = $activityStmt->get_result();
        $activities = [];
        while ($row = $activityResult->fetch_assoc()) {
            $activities[] = $row;
        }
        $res['recent_activities'] = $activities;
        $activityStmt->close();
        
    } catch (Exception $e) {
        $res['error'] = true;
        $res['message'] = $e->getMessage();
    }
    
    echo json_encode($res);
} 