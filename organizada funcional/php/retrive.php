<?php
// retrieve.php: lista todos os usuários cadastrados
require_once 'config.php';

$stmt = $pdo->query('SELECT id, nome, email, genero FROM users ORDER BY id DESC');
$users = $stmt->fetchAll();
?>