// ==================== REGISTER PAGE ====================

// Redirect if already authenticated
auth.redirectIfAuthenticated();

// DOM Elements
const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const registerBtn = document.getElementById('registerBtn');
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');
const microsoftRegisterBtn = document.getElementById('microsoftRegisterBtn');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// ==================== PASSWORD TOGGLE ====================

let isPasswordVisible = false;
let isConfirmPasswordVisible = false;

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

toggleConfirmPasswordBtn.addEventListener('click', () => {
    isConfirmPasswordVisible = !isConfirmPasswordVisible;
    
    if (isConfirmPasswordVisible) {
        confirmPasswordInput.type = 'text';
        toggleConfirmPasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        confirmPasswordInput.type = 'password';
        toggleConfirmPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// ==================== PASSWORD STRENGTH ====================

passwordInput.addEventListener('input', () => {
    clearError(passwordError);
    
    const password = passwordInput.value;
    const { strength, text } = getPasswordStrength(password);
    
    strengthFill.className = 'strength-fill ' + strength;
    strengthText.className = 'strength-text ' + strength;
    strengthText.textContent = text;
});

// ==================== VALIDATION ====================

fullNameInput.addEventListener('input', () => {
    clearError(fullNameError);
});

fullNameInput.addEventListener('blur', () => {
    const fullName = fullNameInput.value.trim();
    
    if (!fullName) {
        showError(fullNameError, 'To\'liq ismingizni kiriting');
    } else if (fullName.length < 3) {
        showError(fullNameError, 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak');
    }
});

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

passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, 'Parolni kiriting');
    } else if (!validatePassword(password)) {
        showError(passwordError, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    }
});

confirmPasswordInput.addEventListener('input', () => {
    clearError(confirmPasswordError);
});

confirmPasswordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!confirmPassword) {
        showError(confirmPasswordError, 'Parolni tasdiqlang');
    } else if (password !== confirmPassword) {
        showError(confirmPasswordError, 'Parollar mos kelmaydi');
    }
});

// ==================== FORM SUBMISSION ====================

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear errors
    clearError(fullNameError);
    clearError(emailError);
    clearError(passwordError);
    clearError(confirmPasswordError);
    
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    let hasError = false;
    
    // Validate full name
    if (!fullName) {
        showError(fullNameError, 'To\'liq ismingizni kiriting');
        hasError = true;
    } else if (fullName.length < 3) {
        showError(fullNameError, 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak');
        hasError = true;
    }
    
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
    
    // Validate confirm password
    if (!confirmPassword) {
        showError(confirmPasswordError, 'Parolni tasdiqlang');
        hasError = true;
    } else if (password !== confirmPassword) {
        showError(confirmPasswordError, 'Parollar mos kelmaydi');
        hasError = true;
    }
    
    // Check terms agreement
    if (!agreeTerms) {
        showToast('Foydalanish shartlarini qabul qilishingiz kerak', 'error');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Show loading
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;
    
    try {
        await auth.register(fullName, email, password);
        
        showToast('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showError(emailError, error.message);
        showToast(error.message, 'error');
        
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;
    }
});

// ==================== SOCIAL REGISTER ====================

googleRegisterBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    googleRegisterBtn.classList.add('loading');
    googleRegisterBtn.disabled = true;
    
    try {
        await auth.googleSignIn();
        showToast('Google orqali muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showToast('Google orqali ro\'yxatdan o\'tish xato', 'error');
        googleRegisterBtn.classList.remove('loading');
        googleRegisterBtn.disabled = false;
    }
});

microsoftRegisterBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    microsoftRegisterBtn.classList.add('loading');
    microsoftRegisterBtn.disabled = true;
    
    try {
        await auth.microsoftSignIn();
        showToast('Microsoft orqali muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showToast('Microsoft orqali ro\'yxatdan o\'tish xato', 'error');
        microsoftRegisterBtn.classList.remove('loading');
        microsoftRegisterBtn.disabled = false;
    }
});

// ==================== AUTO FOCUS ====================

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        fullNameInput.focus();
    }, 300);
});

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (document.activeElement === fullNameInput) {
            e.preventDefault();
            emailInput.focus();
        } else if (document.activeElement === emailInput) {
            e.preventDefault();
            passwordInput.focus();
        } else if (document.activeElement === passwordInput) {
            e.preventDefault();
            confirmPasswordInput.focus();
        }
    }
});
