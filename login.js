// ===== DOM ELEMENTS =====
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginBtn = document.getElementById('loginBtn');
const successMessage = document.getElementById('successMessage');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// ===== PASSWORD TOGGLE =====
let passwordVisible = false;

togglePasswordBtn.addEventListener('click', () => {
    passwordVisible = !passwordVisible;
    
    if (passwordVisible) {
        passwordInput.type = 'text';
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
    
    // Animation effect
    togglePasswordBtn.style.transform = 'translateY(-50%) scale(1.2)';
    setTimeout(() => {
        togglePasswordBtn.style.transform = 'translateY(-50%) scale(1)';
    }, 200);
});

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    
    // Shake animation
    element.parentElement.querySelector('input').style.animation = 'shake 0.3s ease';
    setTimeout(() => {
        element.parentElement.querySelector('input').style.animation = '';
    }, 300);
}

function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

// Real-time email validation
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        showError(emailError, 'Email manzilni kiriting');
    } else if (!validateEmail(email)) {
        showError(emailError, 'Noto\'g\'ri email format');
    } else {
        hideError(emailError);
        emailInput.parentElement.querySelector('input').style.borderColor = 'rgba(16, 185, 129, 0.5)';
    }
});

emailInput.addEventListener('input', () => {
    hideError(emailError);
    emailInput.style.borderColor = 'rgba(255, 255, 255, 0.5)';
});

// Real-time password validation
passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, 'Parolni kiriting');
    } else if (password.length < 6) {
        showError(passwordError, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    } else {
        hideError(passwordError);
        passwordInput.parentElement.querySelector('input').style.borderColor = 'rgba(16, 185, 129, 0.5)';
    }
});

passwordInput.addEventListener('input', () => {
    hideError(passwordError);
    passwordInput.style.borderColor = 'rgba(255, 255, 255, 0.5)';
});

// ===== FORM SUBMISSION =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset errors
    hideError(emailError);
    hideError(passwordError);
    
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
    } else if (password.length < 6) {
        showError(passwordError, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
        hasError = true;
    }
    
    // If has error, stop
    if (hasError) {
        // Shake the login button
        loginBtn.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            loginBtn.style.animation = '';
        }, 300);
        return;
    }
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate API call (2 seconds delay)
    try {
        await simulateLogin(email, password);
        
        // Success!
        showSuccessMessage();
        
        // Reset form after success
        setTimeout(() => {
            loginForm.reset();
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        // Handle error
        showError(passwordError, 'Email yoki parol noto\'g\'ri');
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
        // Shake effect
        loginBtn.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            loginBtn.style.animation = '';
        }, 300);
    }
});

// ===== SIMULATE LOGIN API =====
function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For demo: accept any email with password length >= 6
            if (password.length >= 6) {
                resolve({ success: true, user: { email } });
            } else {
                reject({ error: 'Invalid credentials' });
            }
        }, 2000);
    });
}

// ===== SUCCESS MESSAGE =====
function showSuccessMessage() {
    successMessage.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// ===== SOCIAL LOGIN BUTTONS =====
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const provider = button.classList.contains('google') ? 'Google' : 'GitHub';
        
        // Add loading animation
        button.style.opacity = '0.7';
        button.style.transform = 'scale(0.95)';
        
        // Simulate social login
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1)';
            
            // Show message
            alert(`${provider} orqali kirish tez orada qo'shiladi!`);
        }, 300);
    });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Enter key in any input focuses next or submits
    if (e.key === 'Enter' && document.activeElement === emailInput) {
        e.preventDefault();
        passwordInput.focus();
    }
});

// ===== INPUT ANIMATIONS =====
const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');

inputs.forEach(input => {
    // Add focus animation
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
        input.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// ===== PREVENT COPY-PASTE FOR PASSWORD (OPTIONAL) =====
// Uncomment if you want to prevent password copy-paste
/*
passwordInput.addEventListener('paste', (e) => {
    e.preventDefault();
    showError(passwordError, 'Parolni nusxalash mumkin emas');
    setTimeout(() => hideError(passwordError), 2000);
});
*/

// ===== AUTO-FOCUS ON LOAD =====
window.addEventListener('load', () => {
    // Add slight delay for better UX
    setTimeout(() => {
        emailInput.focus();
    }, 600);
});

// ===== FORM FIELD AUTO-SAVE (Optional - using localStorage) =====
const rememberCheckbox = document.getElementById('remember');

// Load saved email if exists
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
});

// Save email on form submit if "Remember me" is checked
loginForm.addEventListener('submit', () => {
    if (rememberCheckbox.checked) {
        localStorage.setItem('rememberedEmail', emailInput.value.trim());
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});

// ===== FORGOT PASSWORD LINK =====
const forgotLink = document.querySelector('.forgot-link');

forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add animation
    forgotLink.style.transform = 'scale(0.95)';
    setTimeout(() => {
        forgotLink.style.transform = 'scale(1)';
    }, 100);
    
    // Show alert (in real app, would open modal or redirect)
    alert('Parolni tiklash funksiyasi tez orada qo\'shiladi!\n\nEmail manzilingizga link yuboriladi.');
});

// ===== SIGNUP LINK =====
const signupLink = document.querySelector('.signup-link');

signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add animation
    signupLink.style.transform = 'scale(0.95)';
    setTimeout(() => {
        signupLink.style.transform = 'scale(1)';
    }, 100);
    
    // Show alert (in real app, would redirect to signup page)
    alert('Ro\'yxatdan o\'tish sahifasiga yo\'naltirilmoqda...');
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🔐 Professional Login Page', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cCreated with ❤️ using HTML, CSS & JavaScript', 'color: #ec4899; font-size: 14px;');
console.log('%c\nFeatures:\n- Glass morphism design\n- Smooth animations\n- Form validation\n- Responsive layout\n- Password toggle\n- Remember me functionality', 'color: #10b981; font-size: 12px;');

// ===== EASTER EGG: Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s ease infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 Easter egg topildi! Siz maxfiy kodni topdingiz!');
        }, 2000);
    }
});

// Rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
