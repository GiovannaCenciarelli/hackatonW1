document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  loginForm.addEventListener('submit', function (e)) {
    e.preventDefault();

    let valid = true;

    
    } else {
      emailError.style.display = 'none';
      emailInput.style.borderColor = '';
    }

    if (passwordInput.value.length < 6) {
      passwordError.style.display = 'block';
      passwordInput.style.borderColor = '#ff4d4d';
      valid = false;
    } else {
      passwordError.style.display = 'none';
      passwordInput.style.borderColor = '';
    }

    if (valid) {
      alert('Login bem-sucedido! Redirecionando...');
      // redirecionamento real aqui
    }
  });

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

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
;
