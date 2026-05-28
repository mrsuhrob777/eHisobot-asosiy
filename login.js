// ==================== LOGIN PAGE ====================

// Redirect if already authenticated
auth.redirectIfAuthenticated();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const microsoftLoginBtn = document.getElementById('microsoftLoginBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

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

// ==================== VALIDATION ====================

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
    
    // Clear errors
    clearError(emailError);
    clearError(passwordError);
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let hasError = false;
    
    // Validate
    if (!email) {
        showError(emailError, 'Email manzilni kiriting');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError(emailError, 'Noto\'g\'ri email format');
        hasError = true;
    }
    
    if (!password) {
        showError(passwordError, 'Parolni kiriting');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError(passwordError, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Show loading
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    try {
        await auth.login(email, password);
        
        showToast('Muvaffaqiyatli kirildi!', 'success');
        
        // Save email if remember me is checked
        const rememberCheckbox = document.getElementById('remember');
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showError(passwordError, error.message);
        showToast(error.message, 'error');
        
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
});

// ==================== SOCIAL LOGIN ====================

googleLoginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    googleLoginBtn.classList.add('loading');
    googleLoginBtn.disabled = true;
    
    try {
        // Listen for popup message
        const handleMessage = (event) => {
            if (event.data.type === 'google-signin') {
                const { name, email } = event.data.user;
                
                // Create user object
                const googleUser = {
                    id: 'google_' + Date.now(),
                    fullName: name,
                    email: email,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff`,
                    provider: 'google',
                    createdAt: new Date().toISOString()
                };
                
                // Save user
                const usersDB = auth.getUsersDB();
                if (!usersDB[email]) {
                    usersDB[email] = googleUser;
                    auth.saveUsersDB(usersDB);
                }
                
                auth.setCurrentUser(googleUser);
                showToast('Google orqali muvaffaqiyatli kirildi!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
                
                // Remove listener
                window.removeEventListener('message', handleMessage);
            }
        };
        
        window.addEventListener('message', handleMessage);
        
        // Open Google Sign-In popup
        await auth.googleSignIn();
        
    } catch (error) {
        showToast('Google orqali kirish xato', 'error');
        googleLoginBtn.classList.remove('loading');
        googleLoginBtn.disabled = false;
    }
});

microsoftLoginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    microsoftLoginBtn.classList.add('loading');
    microsoftLoginBtn.disabled = true;
    
    try {
        await auth.microsoftSignIn();
        showToast('Microsoft orqali muvaffaqiyatli kirildi!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showToast('Microsoft orqali kirish xato', 'error');
        microsoftLoginBtn.classList.remove('loading');
        microsoftLoginBtn.disabled = false;
    }
});

// ==================== FORGOT PASSWORD ====================

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Parolni tiklash funksiyasi tez orada qo\'shiladi', 'info');
});

// ==================== REMEMBER ME ====================

window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('remember').checked = true;
    }
    
    // Auto-focus
    setTimeout(() => {
        if (!emailInput.value) {
            emailInput.focus();
        } else {
            passwordInput.focus();
        }
    }, 300);
});

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === emailInput) {
        e.preventDefault();
        passwordInput.focus();
    }
});
