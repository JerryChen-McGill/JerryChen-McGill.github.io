// 语言包
const translations = {
    zh: {
        "title": "Jerry Chen",
        "subtitle": "不会改bug的博士生是个好的AI开发者",
        "about.title": "关于我",
        "about.line1": "100+粉丝博主，小红书账号：智学计划",
        "about.line2": "AI课程开发师",
        "about.line3": "独立开发者，已开发多款AI产品",
        "projects.title": "我开发的产品",
        "projects.card1.title": "新作品正在路上",
        "projects.card1.badge": "致力于开发顶级产品", 
        "projects.card1.desc": "不要着急，Jerry正在火速开发新作品中，敬请期待哦~",
        "projects.card1.button": "在 App Store 查看",
        
        "projects.card2.title": "哆啦出题小助手",
        "projects.card2.badge": "应用付费榜 Top1",
        "projects.card2.desc": "轻松帮你出数学题目，支持多种题型，智能生成个性化练习题。",
        "projects.card2.button": "在 微信小程序 查看",
        
        "projects.card3.title": "喵喵彩纸",
        "projects.card3.badge": "3天登上分类榜 Top20",
        "projects.card3.desc": "简易易用的彩纸，支持360度全色调节，满足各种场景需求。",
        "projects.card3.button": "在 微信小程序 查看",
        
        "notes.title": "我的笔记",
        "notes.article1.title": "花了23分钟开发了个小程序，会有人用吗？",
        "notes.article1.link": "链接",
        "notes.article1.desc": "我发觉编程真的要简单了。",
        
        "notes.article2.title": "0按钮极简主义贪吃蛇小游戏，想不想试试",
        "notes.article2.link": "链接",
        "notes.article2.desc": "我也想玩...",
        
        "footer.contact": "联系我:",
        "footer.email": "邮箱：chenshuaichina@outlook.com"
    },
    en: {
        "title": "Jerry Chen",
        "subtitle": "AI Potential Explorer | Ph.D. Student in Learning Sciences | Independent Developer",
        "about.title": "About Me",
        "about.line1": "100+ Followers, RedNote Account: 智学计划",
        "about.line2": "AI Course Developer",
        "about.line3": "Independent Developer, Created Multiple AI Products",
        "projects.title": "My Products",
        "projects.card1.title": "New Project Coming Soon",
        "projects.card1.badge": "Aim to develop top products",
        "projects.card1.desc": "Stay tuned! Jerry is rapidly developing new products~",
        "projects.card1.button": "View on App Store",
        
        "projects.card2.title": "Dora Math Assistant",
        "projects.card2.badge": "No.1 in Paid Apps",
        "projects.card2.desc": "Easily generate math problems, supporting various types and personalized exercises.",
        "projects.card2.button": "View on WeChat Mini Program",
        
        "projects.card3.title": "MiaoMiao Color Paper",
        "projects.card3.badge": "Top 20 in Category within 3 Days",
        "projects.card3.desc": "Simple and easy-to-use color paper, supporting 360° color adjustment for all scenarios.",
        "projects.card3.button": "View on WeChat Mini Program",
        
        "notes.title": "My Notes",
        "notes.article1.title": "Developed a Mini Program in 23 Minutes - Will Anyone Use It?",
        "notes.article1.link": "Link",
        "notes.article1.desc": "I found programming has become really simple.",
        
        "notes.article2.title": "Zero-Button Minimalist Snake Game - Want to Try?",
        "notes.article2.link": "Link",
        "notes.article2.desc": "I want to play too...",
        
        "footer.contact": "Contact Me:",
        "footer.email": "Email: chenshuaichina@outlook.com"
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
    
    // 更新所有需要翻译的文本
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang][key]) {
            // 如果元素是链接按钮，只更新文本节点
            if (element.classList.contains('link-with-image')) {
                // 保存原有的图片元素
                const img = element.querySelector('img');
                element.textContent = translations[lang][key];
                // 重新添加图片元素
                if (img) {
                    element.appendChild(img);
                }
            } else {
                element.textContent = translations[lang][key];
            }
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

    // 添加按钮点击切换预览图片的功能
    document.querySelectorAll('.link-with-image').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止链接跳转
            // 移除其他按钮的激活状态
            document.querySelectorAll('.link-with-image').forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.classList.remove('active');
                }
            });
            // 切换当前按钮的激活状态
            btn.classList.toggle('active');
        });
    });

    // 点击其他地方关闭预览图片
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.link-with-image')) {
            document.querySelectorAll('.link-with-image').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    });
}); 