<?php
    // config.php: dados de conexão com o banco de dados
    $host   = 'localhost';
    $db     = 'site_w1';      // ajuste para o nome do seu banco
    $user   = 'hack';
    $pass   = '1234';                // padrão do MAMP
    $charset= 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        die('Erro de conexão: ' . $e->getMessage());
    }
?>