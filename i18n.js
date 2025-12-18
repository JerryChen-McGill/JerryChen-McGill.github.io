// 语言包 - 只保留页面标题等基础翻译
const translations = {
    zh: {
        "title": "Jerry Chen",
        "subtitle": "AI Coder | 不会写代码的博士生不是好AI独立开发"
    },
    en: {
        "title": "Jerry Chen", 
        "subtitle": "AI Potential Explorer | Ph.D. Student in Learning Sciences | Independent Developer"
    }
};

// 初始化语言
function initLanguage() {
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    setLanguage(savedLang);
}

// 设置语言
function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('preferred-language', lang);
    
    // 更新按钮状态
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // 更新页面标题等基础翻译
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    
    // 菜单切换
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menuDropdown');
    
    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle('show');
        });
        
        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.classList.remove('show');
            }
        });
    }
    
    // 语言选择
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
            const menuDropdown = document.getElementById('menuDropdown');
            if (menuDropdown) {
                menuDropdown.classList.remove('show');
            }
        });
    });
}); 