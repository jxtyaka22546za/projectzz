<?php
session_start();
require '../manage_waste/db_connect.php'; 
header('Content-Type: application/json');

try {
    $sql = "SELECT username, points FROM users WHERE role = 'member' ORDER BY points DESC LIMIT 10";
    $stmt = $pdo->query($sql);
    $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $myPoints = 0;
    if (isset($_SESSION['username'])) {
        $stmtMy = $pdo->prepare("SELECT points FROM users WHERE username = ?");
        $stmtMy->execute([$_SESSION['username']]);
        $userRow = $stmtMy->fetch();
        $myPoints = $userRow ? (int)$userRow['points'] : 0;
    }

    echo json_encode([
        'leaderboard' => $leaderboard,
        'my_points' => $myPoints
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>