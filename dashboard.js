// ==================== DASHBOARD PAGE ====================

// Protect page - redirect if not authenticated
auth.protectPage();

// DOM Elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');
const greeting = document.getElementById('greeting');
const logoutBtn = document.getElementById('logoutBtn');

// ==================== INITIALIZE DASHBOARD ====================

function initDashboard() {
    const user = auth.getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set user info
    userName.textContent = user.fullName || 'Foydalanuvchi';
    userEmail.textContent = user.email;
    
    if (user.avatar) {
        userAvatar.src = user.avatar;
    }
    
    // Set greeting based on time
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour < 12) {
        greetingText = 'Xayrli tong';
    } else if (hour < 18) {
        greetingText = 'Xayrli kun';
    } else {
        greetingText = 'Xayrli kech';
    }
    
    greeting.textContent = `${greetingText}, ${user.fullName?.split(' ')[0] || 'Foydalanuvchi'}!`;
}

// ==================== LOGOUT ====================

logoutBtn.addEventListener('click', () => {
    if (confirm('Hisobingizdan chiqmoqchimisiz?')) {
        auth.logout();
    }
});

// ==================== USER MENU ====================

const userMenu = document.getElementById('userMenu');
let userMenuOpen = false;

userMenu.addEventListener('click', () => {
    userMenuOpen = !userMenuOpen;
    
    if (userMenuOpen) {
        // Show dropdown menu (you can implement this)
        console.log('User menu clicked');
    }
});

// ==================== STATS ANIMATION ====================

function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        stat.style.opacity = '0';
        
        setTimeout(() => {
            stat.style.transition = 'opacity 0.5s ease';
            stat.style.opacity = '1';
        }, 100);
    });
}

// ==================== INITIALIZE ====================

window.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    animateStats();
    
    console.log('%c📊 Dashboard loaded successfully', 'color: #10b981; font-size: 14px; font-weight: bold;');
    console.log('%cUser:', 'color: #64748b; font-size: 12px;', auth.getCurrentUser());
});

// ==================== ACTIVITY TRACKING ====================

// Track page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('User left the page');
    } else {
        console.log('User returned to the page');
        // Refresh data if needed
    }
});

// ==================== RESPONSIVE SIDEBAR ====================

const sidebar = document.querySelector('.sidebar');
let sidebarOpen = false;

// Add mobile menu toggle (if you want to add a hamburger button)
function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
        sidebar.style.transform = 'translateX(0)';
    } else {
        sidebar.style.transform = 'translateX(-100%)';
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && sidebarOpen) {
            toggleSidebar();
        }
    }
});

// ==================== NAVIGATION ====================

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // You can add routing logic here
        console.log('Navigating to:', item.textContent.trim());
    });
});

// ==================== QUICK ACTIONS ====================

const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim();
        console.log('Action clicked:', action);
        
        // Add your action handlers here
        switch(action) {
            case 'Yangi hisob-faktura':
                alert('Yangi hisob-faktura yaratish oynasi ochiladi...');
                break;
            case 'Mijoz qo\'shish':
                alert('Mijoz qo\'shish oynasi ochiladi...');
                break;
            case 'Hisobot eksport':
                alert('Hisobot eksport qilinmoqda...');
                break;
            case 'Sozlamalar':
                alert('Sozlamalar sahifasiga o\'tilmoqda...');
                break;
        }
    });
});

// ==================== NOTIFICATIONS ====================

const notificationBtn = document.querySelector('.icon-btn');

if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        alert('Bildirishnomalar:\n\n1. Yangi to\'lov qabul qilindi\n2. Hisob-faktura yuborildi\n3. Mijoz ma\'lumotlari yangilandi');
    });
}

// ==================== AUTO REFRESH ====================

// Auto refresh stats every 30 seconds (optional)
setInterval(() => {
    if (!document.hidden) {
        console.log('Auto refreshing stats...');
        // You can implement actual data fetching here
    }
}, 30000);
