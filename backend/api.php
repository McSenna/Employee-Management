<?php
// Uncomment the register route in api.php
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
        include './pages/register.php';
        addEmployee();
        break;
        
    case 'update':
        include './pages/update.php';
        updateEmployee();
        break;
        
    case 'delete':
        include './pages/delete.php';
        deleteEmployee();
        break;
        
    case 'get_profile':
        include './pages/get_user_profile.php';
        get_user_profile();
        break;

    case 'upload_file':
        include './pages/file_operations.php';
        uploadFile();
        break;
        
    case 'fetch_files':
        include './pages/file_operations.php';
        fetchFiles();
        break;
        
    case 'get_storage_info':
        include './pages/file_operations.php';
        getStorageInfo();
        break;
        
    case 'delete_file':
        include './pages/file_operations.php';
        deleteFile();
        break;

    case 'fetchfiles':
        include './pages/fetchfiles.php';
        fetchFiles();
        break;

    case 'store_logs':
        include './pages/logs.php';
        storeLogs($userId, $action, $details = null, $ipAddress = null);
        break;
    
    case 'fetch_logs':
        include './pages/logs.php';
        fetchLogs();
        break;
        
    default:
        $res = [
            'error' => true,
            'message' => 'Invalid action'
        ];
        echo json_encode($res);
        break;
}