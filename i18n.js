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
    const savedLang = localStorage.getItem('preferred-language') || 'zh';
    setLanguage(savedLang);
}

// 设置语言
function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('preferred-language', lang);
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
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
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}); 