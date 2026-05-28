// ==================== AUTHENTICATION SYSTEM ====================

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnop.apps.googleusercontent.com'; // Demo ID

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
        this.googleUser = null;
        this.initGoogleSignIn();
    }

    // Initialize Google Sign-In
    initGoogleSignIn() {
        // Load Google Identity Services
        this.loadGoogleScript();
    }

    // Load Google Sign-In script
    loadGoogleScript() {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
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

    // Google Sign-In with popup
    async googleSignIn() {
        return new Promise((resolve, reject) => {
            try {
                // Create Google Sign-In popup simulation
                const popup = this.createGooglePopup();
                
                // Simulate Google account selection
                setTimeout(() => {
                    popup.close();
                    
                    // Simulate successful Google sign-in
                    const mockGoogleUser = {
                        id: 'google_' + Date.now(),
                        fullName: 'Google User',
                        email: 'user@gmail.com',
                        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
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
                }, 2000);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    // Create Google Sign-In popup
    createGooglePopup() {
        const width = 500;
        const height = 600;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);
        
        // Create popup window
        const popup = window.open(
            'about:blank',
            'Google Sign-In',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
        );
        
        if (popup) {
            // Create Google-like popup content
            popup.document.write(`
                <!DOCTYPE html>
                <html lang="uz">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Google orqali kirish</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: 'Google Sans', Roboto, Arial, sans-serif;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            padding: 20px;
                        }
                        .container {
                            max-width: 450px;
                            text-align: center;
                        }
                        .logo {
                            margin-bottom: 20px;
                        }
                        .logo svg {
                            width: 75px;
                            height: 24px;
                        }
                        h1 {
                            font-size: 24px;
                            font-weight: 400;
                            color: #202124;
                            margin-bottom: 10px;
                        }
                        p {
                            font-size: 14px;
                            color: #5f6368;
                            margin-bottom: 30px;
                        }
                        .accounts {
                            border: 1px solid #dadce0;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .account {
                            padding: 16px;
                            display: flex;
                            align-items: center;
                            gap: 16px;
                            cursor: pointer;
                            transition: background 0.2s;
                            text-align: left;
                        }
                        .account:hover {
                            background: #f8f9fa;
                        }
                        .account + .account {
                            border-top: 1px solid #dadce0;
                        }
                        .avatar {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            background: #4285f4;
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 18px;
                            font-weight: 500;
                        }
                        .info {
                            flex: 1;
                        }
                        .name {
                            font-size: 14px;
                            color: #202124;
                            font-weight: 500;
                            margin-bottom: 2px;
                        }
                        .email {
                            font-size: 12px;
                            color: #5f6368;
                        }
                        .add-account {
                            display: flex;
                            align-items: center;
                            gap: 16px;
                            padding: 16px;
                            color: #1a73e8;
                            font-size: 14px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: background 0.2s;
                            border-top: 1px solid #dadce0;
                        }
                        .add-account:hover {
                            background: #f8f9fa;
                        }
                        .add-icon {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            border: 2px solid #dadce0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 24px;
                        }
                        .spinner {
                            display: inline-block;
                            width: 24px;
                            height: 24px;
                            border: 3px solid #f3f3f3;
                            border-top: 3px solid #4285f4;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                            margin: 20px auto;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        .loading-text {
                            font-size: 14px;
                            color: #5f6368;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <svg viewBox="0 0 75 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fill-rule="evenodd">
                                    <path d="M10.73 0c-2.42 0-4.42 2-4.42 4.42v15.16c0 2.42 2 4.42 4.42 4.42h15.16c2.42 0 4.42-2 4.42-4.42V4.42C30.31 2 28.31 0 25.89 0H10.73zm14.05 12.47l-6.52 6.52c-.73.73-1.92.73-2.65 0l-3.26-3.26c-.73-.73-.73-1.92 0-2.65.73-.73 1.92-.73 2.65 0l1.94 1.94 5.19-5.19c.73-.73 1.92-.73 2.65 0 .73.73.73 1.92 0 2.64z" fill="#4285F4"/>
                                    <text font-family="Google Sans, Roboto, Arial, sans-serif" font-size="18" fill="#5f6368" x="35" y="18">Google</text>
                                </g>
                            </svg>
                        </div>
                        <h1>Hisobni tanlang</h1>
                        <p>eHisobot tizimiga kirish uchun</p>
                        
                        <div class="accounts" id="accounts" style="display:block">
                            <div class="account" onclick="selectAccount('Demo User', 'demo@gmail.com')">
                                <div class="avatar">D</div>
                                <div class="info">
                                    <div class="name">Demo User</div>
                                    <div class="email">demo@gmail.com</div>
                                </div>
                            </div>
                            <div class="account" onclick="selectAccount('Test User', 'test@gmail.com')">
                                <div class="avatar">T</div>
                                <div class="info">
                                    <div class="name">Test User</div>
                                    <div class="email">test@gmail.com</div>
                                </div>
                            </div>
                            <div class="add-account" onclick="selectAccount('Yangi Foydalanuvchi', 'user@gmail.com')">
                                <div class="add-icon">+</div>
                                <span>Boshqa hisob qo'shish</span>
                            </div>
                        </div>
                        
                        <div id="loading" style="display:none">
                            <div class="spinner"></div>
                            <div class="loading-text">Kirilmoqda...</div>
                        </div>
                    </div>
                    
                    <script>
                        function selectAccount(name, email) {
                            document.getElementById('accounts').style.display = 'none';
                            document.getElementById('loading').style.display = 'block';
                            
                            // Send message to parent window
                            window.opener.postMessage({
                                type: 'google-signin',
                                user: { name, email }
                            }, '*');
                            
                            // Close popup after 1 second
                            setTimeout(() => {
                                window.close();
                            }, 1000);
                        }
                    </script>
                </body>
                </html>
            `);
        }
        
        return popup;
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
