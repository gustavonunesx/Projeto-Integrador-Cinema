// Variáveis globais
let currentScreen = 1;
let userCpf = '';

// Mostrar tela específica com animação
function showScreen(screenNumber) {
    const currentActive = document.querySelector('.login-screen.active');
    
    if (currentActive) {
        currentActive.classList.add('slide-out');
        
        setTimeout(() => {
            // Esconder todas as telas
            document.querySelectorAll('.login-screen').forEach(screen => {
                screen.classList.remove('active', 'slide-out');
            });
            
            // Mostrar tela desejada
            document.getElementById(`screen${screenNumber}`).classList.add('active');
            currentScreen = screenNumber;
        }, 300);
    } else {
        // Primeira vez
        document.querySelectorAll('.login-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(`screen${screenNumber}`).classList.add('active');
        currentScreen = screenNumber;
    }
}

// Mostrar tela de cadastro
function showRegister() {
    showScreen(3);
}

// Próxima tela (CPF/Email → Senha)
function nextScreen() {
    const cpfEmailInput = document.getElementById('cpfEmail');
    const cpfEmail = cpfEmailInput.value.trim();
    
    if (!cpfEmail) {
        alert('Por favor, digite seu CPF ou Email');
        cpfEmailInput.focus();
        return;
    }
    
    // Validar formato (simplificado)
    if (cpfEmail.includes('@')) {
        // É email
        if (!isValidEmail(cpfEmail)) {
            alert('Por favor, digite um email válido');
            cpfEmailInput.focus();
            return;
        }
    } else {
        // É CPF
        if (!isValidCPF(cpfEmail)) {
            alert('Por favor, digite um CPF válido');
            cpfEmailInput.focus();
            return;
        }
    }
    
    userCpf = formatCPF(cpfEmail);
    document.getElementById('displayCpf').textContent = userCpf;
    showScreen(2);
}

// Tela anterior
function prevScreen() {
    if (currentScreen === 2) {
        showScreen(1);
    }
}

// Trocar usuário
function changeUser() {
    showScreen(1);
}

// Fazer login
function login() {
    const password = document.getElementById('password').value;
    
    if (!password) {
        alert('Por favor, digite sua senha');
        return;
    }
    
    // Simular carregamento
    const btn = document.querySelector('#screen2 .btn-primary');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loading-spinner"></span>Entrando...';
    btn.disabled = true;
    
    // Simular login (em um sistema real, faria requisição para o backend)
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html'; // Redirecionar para página principal
    }, 1500);
}

// Cadastrar novo usuário
function register() {
    const name = document.getElementById('name').value.trim();
    const cpf = document.getElementById('cpfRegister').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('passwordRegister').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!name || !cpf || !phone || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    if (!isValidCPF(cpf)) {
        alert('Por favor, digite um CPF válido');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }
    
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Simular carregamento
    const btn = document.querySelector('#screen3 .btn-primary');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loading-spinner"></span>Criando conta...';
    btn.disabled = true;
    
    // Simular cadastro (em um sistema real, faria requisição para o backend)
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'index.html'; // Redirecionar para página principal
    }, 1500);
}

// Funções de validação
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCPF(cpf) {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verificar se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verificar se não é uma sequência de números iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação simplificada (em sistema real, usar validação completa do CPF)
    return true;
}

function formatCPF(cpf) {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Formatar como XXX.XXX.XXX-XX
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatação automática de CPF
document.getElementById('cpfRegister')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        e.target.value = value.substring(0, 14);
    }
});

// Formatação automática de telefone
document.getElementById('phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value.replace(/(\d{0,2})/, '($1');
        } else if (value.length <= 6) {
            value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        } else if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        e.target.value = value;
    }
});

// Login com Google (simulado)
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Login com Google - Em desenvolvimento');
        // Em sistema real: integrar com API do Google
    });
});

// Enter para avançar
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (currentScreen === 1) {
            nextScreen();
        } else if (currentScreen === 2) {
            login();
        } else if (currentScreen === 3) {
            register();
        }
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    showScreen(1);
});