<?php
function fetch_hr_stats() {
    global $connect;
    $res = ['error' => false];
    
    try {
        // Get total employee count
        $totalStmt = $connect->prepare("SELECT COUNT(*) as total FROM employees WHERE role != 'admin'");
        $totalStmt->execute();
        $totalResult = $totalStmt->get_result()->fetch_assoc();
        $res['total_employees'] = $totalResult['total'];
        $totalStmt->close();
        
        // Get department-wise employee count
        $deptStmt = $connect->prepare("
            SELECT department, COUNT(*) as count 
            FROM employees 
            WHERE role != 'admin'
            GROUP BY department
        ");
        $deptStmt->execute();
        $deptResult = $deptStmt->get_result();
        $departments = [];
        while ($row = $deptResult->fetch_assoc()) {
            $departments[] = $row;
        }
        $res['department_stats'] = $departments;
        $deptStmt->close();
        
        // Get recent hires (last 30 days)
        $recentHiresStmt = $connect->prepare("
            SELECT id, employee_id, first_name, last_name, department, job_title, hire_date 
            FROM employees 
            WHERE role != 'admin' 
            AND hire_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            ORDER BY hire_date DESC
            LIMIT 5
        ");
        $recentHiresStmt->execute();
        $recentHiresResult = $recentHiresStmt->get_result();
        $recentHires = [];
        while ($row = $recentHiresResult->fetch_assoc()) {
            $recentHires[] = $row;
        }
        $res['recent_hires'] = $recentHires;
        $recentHiresStmt->close();
        
        // Get upcoming work anniversaries (next 30 days)
        $anniversariesStmt = $connect->prepare("
            SELECT id, employee_id, first_name, last_name, department, job_title, hire_date,
                   TIMESTAMPDIFF(YEAR, hire_date, CURDATE()) + 1 as upcoming_years
            FROM employees 
            WHERE role != 'admin'
            AND DATE_FORMAT(hire_date, '%m-%d') 
                BETWEEN DATE_FORMAT(CURDATE(), '%m-%d')
                AND DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 30 DAY), '%m-%d')
            ORDER BY DATE_FORMAT(hire_date, '%m-%d')
            LIMIT 5
        ");
        $anniversariesStmt->execute();
        $anniversariesResult = $anniversariesStmt->get_result();
        $anniversaries = [];
        while ($row = $anniversariesResult->fetch_assoc()) {
            $anniversaries[] = $row;
        }
        $res['upcoming_anniversaries'] = $anniversaries;
        $anniversariesStmt->close();
        
        // Get role distribution
        $roleStmt = $connect->prepare("
            SELECT role, COUNT(*) as count 
            FROM employees 
            WHERE role != 'admin'
            GROUP BY role
        ");
        $roleStmt->execute();
        $roleResult = $roleStmt->get_result();
        $roles = [];
        while ($row = $roleResult->fetch_assoc()) {
            $roles[] = $row;
        }
        $res['role_stats'] = $roles;
        $roleStmt->close();
        
        // Get file statistics
        $fileStatsStmt = $connect->prepare("
            SELECT 
                COUNT(*) as total_files,
                SUM(size) as total_size,
                COUNT(DISTINCT employee_id) as employees_with_files
            FROM employee_files
        ");
        $fileStatsStmt->execute();
        $fileStats = $fileStatsStmt->get_result()->fetch_assoc();
        $res['file_stats'] = [
            'total_files' => (int)$fileStats['total_files'],
            'total_size' => round($fileStats['total_size'] / (1024 * 1024), 2), // Convert to MB
            'employees_with_files' => (int)$fileStats['employees_with_files']
        ];
        $fileStatsStmt->close();

        // Get file type distribution
        $fileTypesStmt = $connect->prepare("
            SELECT file_type, COUNT(*) as count
            FROM employee_files
            GROUP BY file_type
            ORDER BY count DESC
            LIMIT 5
        ");
        $fileTypesStmt->execute();
        $fileTypesResult = $fileTypesStmt->get_result();
        $fileTypes = [];
        while ($row = $fileTypesResult->fetch_assoc()) {
            $fileTypes[] = $row;
        }
        $res['file_type_stats'] = $fileTypes;
        $fileTypesStmt->close();
        
        // Get recent activities
        $activityStmt = $connect->prepare("
            SELECT al.*, 
                   CONCAT(e.first_name, ' ', e.last_name) as employee_name,
                   e.department
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