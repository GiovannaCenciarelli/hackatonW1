document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    // Função de validação de e-mail
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Função para animação de erro
    const triggerErrorAnimation = (element) => {
        element.style.transform = 'translateX(10px)';
        setTimeout(() => element.style.transform = 'translateX(-10px)', 50);
        setTimeout(() => element.style.transform = 'translateX(0)', 100);
    };

    // Evento de submit do formulário
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        // Validação de e-mail
        if (!isValidEmail(emailInput.value)) {
            emailError.style.display = 'block';
            emailInput.style.borderColor = '#ff4d4d';
            triggerErrorAnimation(emailInput);
            valid = false;
        } else {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '';
        }

        // Validação de senha
        if (passwordInput.value.length < 6) {
            passwordError.style.display = 'block';
            passwordInput.style.borderColor = '#ff4d4d';
            triggerErrorAnimation(passwordInput);
            valid = false;
        } else {
            passwordError.style.display = 'none';
            passwordInput.style.borderColor = '';
        }

        // Se válido, prossegue
        if (valid) {
            loginForm.classList.add('submitting');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Altere para o seu redirecionamento
            }, 1200);
        }
    });

    // Validação em tempo real
    emailInput.addEventListener('input', () => {
        if (isValidEmail(emailInput.value)) {
            emailError.style.display = 'none';
            emailInput.style.borderColor = '';
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length >= 6) {
            passwordError.style.display = 'none';
            passwordInput.style.borderColor = '';
        }
    });
});