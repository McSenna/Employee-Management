<?php
function fetchData() {
    global $connect;

    // Get all rows starting from the second (OFFSET 1)
    $stmt = $connect->prepare("SELECT * FROM employees LIMIT 100 OFFSET 1");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    $data = [];
    while($users = $result->fetch_assoc()) {
        $data[] = $users;
    }
    echo json_encode($data);
}
?>
