// ==================== PROFESSIONAL LOGIN SYSTEM ====================

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// ==================== VALIDATION FUNCTIONS ====================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.parentElement.querySelector('input').classList.add('shake');
    setTimeout(() => {
        errorElement.parentElement.querySelector('input').classList.remove('shake');
    }, 300);
}

function clearError(errorElement) {
    errorElement.textContent = '';
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== PASSWORD TOGGLE ====================

let isPasswordVisible = false;

togglePasswordBtn.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    
    if (isPasswordVisible) {
        passwordInput.type = 'text';
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// ==================== REAL-TIME VALIDATION ====================

emailInput.addEventListener('input', () => {
    clearError(emailError);
});

emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        showError(emailError, 'Email manzilni kiriting');
    } else if (!validateEmail(email)) {
        showError(emailError, 'Noto\'g\'ri email format');
    }
});

passwordInput.addEventListener('input', () => {
    clearError(passwordError);
});

passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, 'Parolni kiriting');
    } else if (!validatePassword(password)) {
        showError(passwordError, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    }
});

// ==================== FORM SUBMISSION ====================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError(emailError);
    clearError(passwordError);
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let hasError = false;
    
    // Validate email
    if (!email) {
        showError(emailError, 'Email manzilni kiriting');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError(emailError, 'Noto\'g\'ri email format');
        hasError = true;
    }
    
    // Validate password
    if (!password) {
        showError(passwordError, 'Parolni kiriting');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError(passwordError, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    try {
        // Simulate API call
        await simulateLogin(email, password);
        
        // Success
        showToast('Muvaffaqiyatli kirildi!');
        
        // Save email if remember me is checked
        const rememberCheckbox = document.getElementById('remember');
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Redirect after 1.5 seconds (in real app)
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
            // window.location.href = '/dashboard';
        }, 1500);
        
    } catch (error) {
        showError(passwordError, 'Email yoki parol noto\'g\'ri');
        showToast('Kirish xato', 'error');
    } finally {
        setTimeout(() => {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }, 1500);
    }
});

// ==================== SIMULATE API CALL ====================

function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Demo: accept any valid email and password >= 6 chars
            if (validateEmail(email) && validatePassword(password)) {
                resolve({ user: { email } });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1500);
    });
}

// ==================== SOCIAL LOGIN ====================

const socialButtons = document.querySelectorAll('.btn-social');

socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const provider = button.textContent.trim();
        showToast(`${provider} orqali kirish tez orada qo'shiladi`, 'info');
    });
});

// ==================== REMEMBER ME FUNCTIONALITY ====================

window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Auto-focus email input
    setTimeout(() => {
        emailInput.focus();
    }, 300);
});

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', (e) => {
    // Enter on email field -> focus password
    if (e.key === 'Enter' && document.activeElement === emailInput) {
        e.preventDefault();
        passwordInput.focus();
    }
});

// ==================== PREVENT FORM RESUBMISSION ====================

window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
});

// ==================== CONSOLE INFO ====================

console.log('%c🔐 eHisobot Login System', 'color: #2563eb; font-size: 18px; font-weight: bold;');
console.log('%cProfessional Business Login Interface', 'color: #64748b; font-size: 12px;');
console.log('%c\nDemo Credentials:', 'color: #10b981; font-size: 14px; font-weight: bold;');
console.log('Email: any valid email format');
console.log('Password: minimum 6 characters');
