class AppManager {
    constructor() {
        this.appsData = null;
        this.currentLang = 'en'; // 默认英语
        this.hideTimer = null;
        this.showTimer = null;
        this.isShowing = false; // 标志位，防止显示和隐藏冲突
        this.init();
    }

    async init() {
        try {
            // 从JSON文件加载app数据
            const response = await fetch('apps.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.appsData = await response.json();
            
            // 渲染所有app
            this.renderApps();
            
            // 监听语言切换
            this.setupLanguageListener();
        } catch (error) {
            console.error('Failed to load apps data:', error);
            this.showError();
        }
    }

    showError() {
        const gridContainer = document.getElementById('appGrid');
        if (gridContainer) {
            gridContainer.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px;">
                    <h3>加载失败</h3>
                    <p>无法加载应用数据，请检查网络连接或刷新页面。</p>
                </div>
            `;
        }
    }

    renderApps() {
        const gridContainer = document.getElementById('appGrid');
        if (!gridContainer || !this.appsData) return;

        // 清空容器
        gridContainer.innerHTML = '';

        // 渲染个人资料app
        this.renderProfileApp(gridContainer);

        // 渲染所有应用app
        this.appsData.apps.forEach(app => {
            this.renderAppCard(gridContainer, app);
        });
    }

    renderProfileApp(container) {
        const profile = this.appsData.profile;
        const profileHtml = `
            <div class="app-icon-container profile-app" data-app-id="profile">
                <div class="app-icon profile-icon clickable-app-icon" data-type="profile" data-qr="images/redNote.jpg" data-email="chenshuaichina@outlook.com">
                    <img src="${profile.icon}" alt="${profile.alt}" class="avatar-img">
                </div>
                <div class="app-name">${profile.name[this.currentLang]}</div>
                <div class="app-tooltip profile-tooltip" style="display: none;">
                    <button class="tooltip-close"></button>
                    <div class="app-info-card">
                        <h3>${profile.name[this.currentLang]}</h3>
                        <p class="profile-subtitle">${profile.subtitle[this.currentLang]}</p>
                        <div class="profile-details">
                            ${profile.details[this.currentLang].map(detail => `<p>${detail}</p>`).join('')}
                        </div>
                        <img src="images/redNote.jpg" alt="${this.currentLang === 'zh' ? '小红书二维码' : 'RedNote QR Code'}" class="qr-code-image">
                        <p class="qr-instruction">${this.currentLang === 'zh' ? '扫描二维码关注小红书' : 'Scan QR code to follow RedNote'}</p>
                        <div class="email-section">
                            <p class="email-label">${this.currentLang === 'zh' ? '邮箱联系方式：' : 'Email:'}</p>
                            <p class="email-address">chenshuaichina@outlook.com</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', profileHtml);
    }

    renderAppCard(container, app) {
        let appHtml = '';
        
        if (app.qrCode) {
            // 有二维码的app，点击显示信息和二维码整合的信息卡
            appHtml = `
                <div class="app-icon-container" data-app-id="${app.id}">
                    <div class="app-icon clickable-app-icon" data-type="qr" data-qr="${app.qrCode}">
                        <img src="${app.icon}" alt="${app.alt}">
                    </div>
                    <div class="app-name">${app.name[this.currentLang]}</div>
                    <div class="app-tooltip" style="display: none;">
                        <button class="tooltip-close"></button>
                        <div class="app-info-card">
                            <h3>${app.name[this.currentLang]}</h3>
                            <p class="app-category">${app.category[this.currentLang]}</p>
                            <p class="app-description">${app.description[this.currentLang]}</p>
                            <img src="${app.qrCode}" alt="小程序二维码" class="qr-code-image">
                            <p class="qr-instruction">扫描二维码使用小程序</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (app.button && app.button.link) {
            // 有链接的app，点击显示信息卡，包含跳转按钮
            appHtml = `
                <div class="app-icon-container" data-app-id="${app.id}">
                    <div class="app-icon clickable-app-icon" data-type="link" data-link="${app.button.link}">
                        <img src="${app.icon}" alt="${app.alt}">
                    </div>
                    <div class="app-name">${app.name[this.currentLang]}</div>
                    <div class="app-tooltip" style="display: none;">
                        <button class="tooltip-close"></button>
                        <h3>${app.name[this.currentLang]}</h3>
                        <p class="app-category">${app.category[this.currentLang]}</p>
                        <p class="app-description">${app.description[this.currentLang]}</p>
                        <a href="${app.button.link}" target="_blank" class="app-button">${app.button.text ? app.button.text[this.currentLang] : (this.currentLang === 'zh' ? '访问网站' : 'Visit Website')}</a>
                    </div>
                </div>
            `;
        }

        container.insertAdjacentHTML('beforeend', appHtml);
    }

    setupLanguageListener() {
        const langButtons = document.querySelectorAll('.lang-option');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.lang;
                if (newLang !== this.currentLang) {
                    this.currentLang = newLang;
                    this.updateLanguageUI();
                    this.renderApps(); // 重新渲染所有内容
                }
                // 选择语言后关闭菜单
                const menuDropdown = document.getElementById('menuDropdown');
                if (menuDropdown) {
                    menuDropdown.classList.remove('show');
                }
            });
        });

        // 添加应用图标点击事件监听器
        this.setupAppClickListener();
    }

    setupAppClickListener() {
        // 使用事件委托处理点击
        document.addEventListener('click', (e) => {
            // 如果点击的是tooltip内的链接按钮，允许默认行为（跳转）
            if (e.target.closest('.app-button')) {
                return;
            }
            
            // 点击关闭按钮
            if (e.target.closest('.tooltip-close')) {
                e.preventDefault();
                e.stopPropagation();
                this.hideInfoCard();
                return;
            }
            
            // 点击遮罩层关闭
            if (e.target.classList.contains('tooltip-overlay')) {
                this.hideInfoCard();
                return;
            }
            
            // 先检查是否点击应用图标（优先处理）
            const clickableIcon = e.target.closest('.clickable-app-icon');
            if (clickableIcon) {
                e.preventDefault();
                e.stopPropagation();
                
                const iconContainer = clickableIcon.closest('.app-icon-container');
                const tooltip = iconContainer.querySelector('.app-tooltip');
                
                if (tooltip) {
                    // 如果已经显示，则关闭；否则显示
                    if (tooltip.classList.contains('show')) {
                        this.hideInfoCard();
                    } else {
                        // 直接显示，不需要延迟
                        this.showInfoCard(tooltip);
                    }
                }
                return;
            }
            
            // 如果tooltip已经显示，点击外部区域关闭（但不包括图标和tooltip内容）
            const visibleTooltip = document.querySelector('.app-tooltip.show');
            if (visibleTooltip) {
                // 确保点击的不是图标或tooltip内的任何内容
                if (!e.target.closest('.clickable-app-icon') && 
                    !visibleTooltip.contains(e.target)) {
                    this.hideInfoCard();
                    return;
                }
            }
        });
    }
    
    showInfoCard(tooltip) {
        // 清除所有可能的隐藏定时器
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
        
        // 先立即隐藏所有其他tooltip（同步操作）
        document.querySelectorAll('.app-tooltip').forEach(t => {
            if (t !== tooltip) {
                t.classList.remove('show');
                t.style.display = 'none';
            }
        });
        
        // 创建遮罩层
        let overlay = document.querySelector('.tooltip-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'tooltip-overlay';
            document.body.appendChild(overlay);
        }
        
        // 设置tooltip的display为block（同步操作）
        tooltip.style.display = 'block';
        
        // 立即添加show类（同步操作），这样可以防止后续的关闭检查误判
        tooltip.classList.add('show');
        
        // 显示遮罩层
        overlay.classList.add('show');
        
        // 使用setTimeout触发重排，确保动画能正确执行
        setTimeout(() => {
            // 强制重排以确保动画
            tooltip.offsetHeight;
        }, 0);
    }
    
    hideInfoCard() {
        // 如果正在显示过程中，不要立即隐藏
        if (this.isShowing) {
            return;
        }
        
        // 清除所有可能的显示定时器
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }
        
        // 隐藏遮罩层
        const overlay = document.querySelector('.tooltip-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        // 隐藏所有tooltip
        document.querySelectorAll('.app-tooltip').forEach(tooltip => {
            tooltip.classList.remove('show');
        });
        
        // 延迟设置display:none，让动画完成
        this.hideTimer = setTimeout(() => {
            document.querySelectorAll('.app-tooltip').forEach(tooltip => {
                tooltip.style.display = 'none';
            });
            this.hideTimer = null;
        }, 300);
    }

    showProfileModal(qrCodePath, appName, email) {
        // 创建个人资料模态框
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-content">
                <div class="qr-modal-header">
                    <h3>${appName}</h3>
                    <span class="qr-close">&times;</span>
                </div>
                <div class="qr-modal-body">
                    <img src="${qrCodePath}" alt="小红书二维码" class="qr-code-image">
                    <p class="qr-instruction">扫描二维码关注小红书</p>
                    <div class="email-section">
                        <p class="email-label">邮箱联系方式：</p>
                        <p class="email-address">${email}</p>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(modal);

        // 添加CSS样式
        this.addModalStyles();

        // 关闭事件
        const closeBtn = modal.querySelector('.qr-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showQRCodeModal(qrCodePath, appName) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-modal-content">
                <div class="qr-modal-header">
                    <h3>${appName}</h3>
                    <span class="qr-close">&times;</span>
                </div>
                <div class="qr-modal-body">
                    <img src="${qrCodePath}" alt="小程序二维码" class="qr-code-image">
                    <p class="qr-instruction">扫描二维码使用小程序</p>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(modal);

        // 添加CSS样式
        this.addModalStyles();

        // 关闭事件
        const closeBtn = modal.querySelector('.qr-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    addModalStyles() {
        // 检查是否已经添加过样式
        if (document.getElementById('qr-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'qr-modal-styles';
        style.textContent = `
            .qr-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .qr-modal-content {
                background: white;
                border-radius: 20px;
                padding: 0;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
                overflow: hidden;
            }

            .qr-modal-header {
                background: #f8f9fa;
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .qr-modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
                font-weight: 600;
            }

            .qr-close {
                font-size: 24px;
                color: #666;
                cursor: pointer;
                line-height: 1;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .qr-close:hover {
                background: #e9ecef;
                color: #333;
            }

            .qr-modal-body {
                padding: 30px;
                text-align: center;
            }

            .qr-code-image {
                width: 250px;
                height: 250px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
            }

            .qr-instruction {
                color: #666;
                font-size: 14px;
                margin: 0;
                font-weight: 500;
            }

            .email-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
            }

            .email-label {
                color: #666;
                font-size: 14px;
                margin: 0 0 8px 0;
                font-weight: 500;
            }

            .email-address {
                color: #007AFF;
                font-size: 16px;
                margin: 0;
                font-weight: 600;
                font-family: monospace;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @media (max-width: 480px) {
                .qr-modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .qr-code-image {
                    width: 200px;
                    height: 200px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    updateLanguageUI() {
        // 更新按钮状态
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    // 添加新app的方法
    addApp(appData) {
        this.appsData.apps.push(appData);
        this.renderApps();
    }

    // 删除app的方法
    removeApp(appId) {
        this.appsData.apps = this.appsData.apps.filter(app => app.id !== appId);
        this.renderApps();
    }

    // 更新app的方法
    updateApp(appId, newData) {
        const appIndex = this.appsData.apps.findIndex(app => app.id === appId);
        if (appIndex !== -1) {
            this.appsData.apps[appIndex] = { ...this.appsData.apps[appIndex], ...newData };
            this.renderApps();
        }
    }

    // 获取app数据的方法
    getApp(appId) {
        return this.appsData.apps.find(app => app.id === appId);
    }
}

// 等待DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const appManager = new AppManager();
});