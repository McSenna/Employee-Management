<?php
// Save this as logs.php in your backend/pages/ directory

function fetchLogs() {
    global $connect;
    
    // Get optional date filter parameters
    $startDate = isset($_GET['start_date']) ? $_GET['start_date'] : null;
    $endDate = isset($_GET['end_date']) ? $_GET['end_date'] : null;
    
    // Base query
    $query = "SELECT id, user_id, action, details, ip_address, created_at FROM activity_logs";
    
    // Add date filters if provided
    $whereConditions = [];
    $params = [];
    $types = "";
    
    if ($startDate) {
        $whereConditions[] = "created_at >= ?";
        $params[] = $startDate . " 00:00:00";
        $types .= "s";
    }
    
    if ($endDate) {
        $whereConditions[] = "created_at <= ?";
        $params[] = $endDate . " 23:59:59";
        $types .= "s";
    }
    
    // Combine where conditions if any exist
    if (!empty($whereConditions)) {
        $query .= " WHERE " . implode(" AND ", $whereConditions);
    }
    
    // Order by most recent first
    $query .= " ORDER BY created_at DESC";
    
    // Prepare and execute the statement
    $stmt = $connect->prepare($query);
    
    // Bind parameters if we have any
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    $data = [];
    while($log = $result->fetch_assoc()) {
        // Parse the details JSON if it exists and is valid
        if (!empty($log['details']) && $log['details'] !== 'NULL' && $log['details'] !== 'Array') {
            try {
                $decodedDetails = json_decode($log['details'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $log['details'] = $decodedDetails;
                }
            } catch (Exception $e) {
                // Keep the original string if JSON parsing fails
            }
        }
        $data[] = $log;
    }
    
    // Return the data as JSON
    echo json_encode($data);
}

function storeLogs($userId, $action, $details = null, $ipAddress = null) {
    global $connect;
    
    // Get IP address if not provided
    if ($ipAddress === null) {
        $ipAddress = $_SERVER['REMOTE_ADDR'];
    }
    
    // Convert details to JSON if it's an array
    if (is_array($details)) {
        $details = json_encode($details);
    }
    
    $stmt = $connect->prepare("INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $userId, $action, $details, $ipAddress);
    $result = $stmt->execute();
    $stmt->close();
    
    return $result;
}