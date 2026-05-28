// ==================== AUTHENTICATION SYSTEM ====================

// Google OAuth Configuration (Demo - replace with real credentials)
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// ==================== LOCAL STORAGE KEYS ====================
const STORAGE_KEYS = {
    USER: 'ehisobot_user',
    TOKEN: 'ehisobot_token',
    USERS_DB: 'ehisobot_users_db'
};

// ==================== AUTH CLASS ====================
class AuthSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initGoogleSignIn();
    }

    // Initialize Google Sign-In
    initGoogleSignIn() {
        // Load Google Sign-In API
        if (typeof gapi !== 'undefined') {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'profile email'
                });
            });
        }
    }

    // Register new user
    register(fullName, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Get existing users
                    const usersDB = this.getUsersDB();
                    
                    // Check if email already exists
                    if (usersDB[email]) {
                        reject(new Error('Bu email allaqachon ro\'yxatdan o\'tgan'));
                        return;
                    }
                    
                    // Create new user
                    const newUser = {
                        id: Date.now().toString(),
                        fullName,
                        email,
                        password: this.hashPassword(password),
                        createdAt: new Date().toISOString(),
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`
                    };
                    
                    // Save to database
                    usersDB[email] = newUser;
                    this.saveUsersDB(usersDB);
                    
                    // Auto login after registration
                    this.setCurrentUser(newUser);
                    
                    resolve(newUser);
                } catch (error) {
                    reject(error);
                }
            }, 1000);
        });
    }

    // Login user
    login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const usersDB = this.getUsersDB();
                    const user = usersDB[email];
                    
                    if (!user) {
                        reject(new Error('Email yoki parol noto\'g\'ri'));
                        return;
                    }
                    
                    // Verify password
                    if (user.password !== this.hashPassword(password)) {
                        reject(new Error('Email yoki parol noto\'g\'ri'));
                        return;
                    }
                    
                    // Set current user
                    this.setCurrentUser(user);
                    
                    resolve(user);
                } catch (error) {
                    reject(error);
                }
            }, 1000);
        });
    }

    // Google Sign-In
    async googleSignIn() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate Google OAuth
                const mockGoogleUser = {
                    id: 'google_' + Date.now(),
                    fullName: 'Google User',
                    email: 'user@gmail.com',
                    avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff',
                    provider: 'google',
                    createdAt: new Date().toISOString()
                };
                
                const usersDB = this.getUsersDB();
                
                // Check if user exists
                if (!usersDB[mockGoogleUser.email]) {
                    usersDB[mockGoogleUser.email] = mockGoogleUser;
                    this.saveUsersDB(usersDB);
                }
                
                this.setCurrentUser(mockGoogleUser);
                resolve(mockGoogleUser);
            }, 1500);
        });
    }

    // Microsoft Sign-In (Demo)
    async microsoftSignIn() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const mockMicrosoftUser = {
                    id: 'microsoft_' + Date.now(),
                    fullName: 'Microsoft User',
                    email: 'user@outlook.com',
                    avatar: 'https://ui-avatars.com/api/?name=Microsoft+User&background=00A4EF&color=fff',
                    provider: 'microsoft',
                    createdAt: new Date().toISOString()
                };
                
                const usersDB = this.getUsersDB();
                
                if (!usersDB[mockMicrosoftUser.email]) {
                    usersDB[mockMicrosoftUser.email] = mockMicrosoftUser;
                    this.saveUsersDB(usersDB);
                }
                
                this.setCurrentUser(mockMicrosoftUser);
                resolve(mockMicrosoftUser);
            }, 1500);
        });
    }

    // Logout
    logout() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, this.generateToken(user));
    }

    // Get users database
    getUsersDB() {
        const dbStr = localStorage.getItem(STORAGE_KEYS.USERS_DB);
        return dbStr ? JSON.parse(dbStr) : {};
    }

    // Save users database
    saveUsersDB(db) {
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
    }

    // Simple password hashing (use bcrypt in production)
    hashPassword(password) {
        // Simple hash for demo (use proper hashing in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Generate token
    generateToken(user) {
        return btoa(JSON.stringify({
            userId: user.id,
            email: user.email,
            timestamp: Date.now()
        }));
    }

    // Protect page (redirect if not authenticated)
    protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // Redirect if already authenticated
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Create global auth instance
const auth = new AuthSystem();

// ==================== HELPER FUNCTIONS ====================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');
    
    if (!toast || !toastMessage) return;
    
    // Set icon based on type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toast.style.borderLeftColor = '#10b981';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.style.borderLeftColor = '#ef4444';
    } else if (type === 'info') {
        toastIcon.className = 'fas fa-info-circle';
        toast.style.borderLeftColor = '#2563eb';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showError(errorElement, message) {
    if (!errorElement) return;
    errorElement.textContent = message;
    const input = errorElement.parentElement?.querySelector('input');
    if (input) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 300);
    }
}

function clearError(errorElement) {
    if (!errorElement) return;
    errorElement.textContent = '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function getPasswordStrength(password) {
    if (!password) return { strength: '', text: '' };
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Complexity checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) {
        return { strength: 'weak', text: 'Zaif' };
    } else if (strength <= 4) {
        return { strength: 'medium', text: 'O\'rtacha' };
    } else {
        return { strength: 'strong', text: 'Kuchli' };
    }
}

// Console info
console.log('%c🔐 eHisobot Auth System', 'color: #2563eb; font-size: 18px; font-weight: bold;');
console.log('%cAuthentication system initialized', 'color: #10b981; font-size: 12px;');
if (auth.isAuthenticated()) {
    console.log('%cCurrent user:', 'color: #64748b; font-size: 12px;', auth.currentUser);
}
