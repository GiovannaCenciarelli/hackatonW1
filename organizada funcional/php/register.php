<?php
    error_reporting(E_ALL); // Reportar todos erros
    ini_set('display_errors', 1); // Exibir erros na tela
    ini_set('log_errors', 1); // Registrar erros em arquivo
    ini_set('error_log', __DIR__ . '/php_errors.log'); // Caminho do log
    // register.php: valida, cadastra usuário com criptografia de senha
    require_once 'config.php';

    $errors = [];
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Recebe e sanitiza
        $nome = trim($_POST['firstName'] ?? '') . ' ' . trim($_POST['lastName'] ?? '');
        $email           = trim($_POST['email'] ?? '');
        $senha = $_POST['password'] ?? '';          // Correto
        $confirmSenha = $_POST['confirmPassword'] ?? ''; // Correto
        $genero = $_POST['gender'] ?? '';           // Correto
        $terms           = isset($_POST['terms']);

        // Validações básicas
        if ($nome === '') {
            $errors[] = 'O campo Nome é obrigatório.';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Informe um e-mail válido.';
        }
        if (strlen($senha) < 6) {
            $errors[] = 'A senha deve ter ao menos 6 caracteres.';
        }
        if ($senha !== $confirmSenha) {
            $errors[] = 'As senhas não conferem.';
        }
        if (!in_array($genero, ['1','2','3'], true)) {
            $errors[] = 'Selecione um gênero válido.';
        }
        if (!$terms) {
            $errors[] = 'Você deve aceitar os Termos de Uso.';
        }

        if (empty($errors)) {
            // Verifica e-mail único
            $stmt = $pdo->prepare('SELECT id FROM usuario WHERE email = ?');
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $errors[] = 'Este e-mail já está cadastrado.';
            } else {
                // Criptografa a senha
                $hash = password_hash($senha, PASSWORD_DEFAULT);

                // Insere no banco
                $stmt = $pdo->prepare(
                    'INSERT INTO usuario (nome, email, senha, genero)
                    VALUES (?, ?, ?, ?)'
                );
                $stmt->execute([$nome, $email, $hash, $genero]);

                // Sucesso: redireciona ou exibe mensagem
                header('Location: success.html');
                exit;
            }
        }
    }
    echo "<pre>";
    print_r($_POST);
    var_dump($errors);
    echo "</pre>";
?>