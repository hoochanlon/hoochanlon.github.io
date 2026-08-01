gsap.set("svg", { visibility: "visible" });
gsap.to("#headStripe", {
  y: 0.5,
  rotation: 1,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
  duration: 1 });

gsap.to("#spaceman", {
  y: 0.5,
  rotation: 1,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
  duration: 1 });

gsap.to("#craterSmall", {
  x: -3,
  yoyo: true,
  repeat: -1,
  duration: 1,
  ease: "sine.inOut" });

gsap.to("#craterBig", {
  x: 3,
  yoyo: true,
  repeat: -1,
  duration: 1,
  ease: "sine.inOut" });

gsap.to("#planet", {
  rotation: -2,
  yoyo: true,
  repeat: -1,
  duration: 1,
  ease: "sine.inOut",
  transformOrigin: "50% 50%" });


gsap.to("#starsBig g", {
  rotation: "random(-30,30)",
  transformOrigin: "50% 50%",
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut" });

gsap.fromTo(
"#starsSmall g",
{ scale: 0, transformOrigin: "50% 50%" },
{ scale: 1, transformOrigin: "50% 50%", yoyo: true, repeat: -1, stagger: 0.1 });

gsap.to("#circlesSmall circle", {
  y: -4,
  yoyo: true,
  duration: 1,
  ease: "sine.inOut",
  repeat: -1 });

gsap.to("#circlesBig circle", {
  y: -2,
  yoyo: true,
  duration: 1,
  ease: "sine.inOut",
  repeat: -1 });


gsap.set("#glassShine", { x: -68 });

gsap.to("#glassShine", {
  x: 80,
  duration: 2,
  rotation: -30,
  ease: "expo.inOut",
  transformOrigin: "50% 50%",
  repeat: -1,
  repeatDelay: 8,
  delay: 2 });


const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');

burger.addEventListener('click', e => {
  burger.dataset.state === 'closed' ? burger.dataset.state = "open" : burger.dataset.state = "closed";
  nav.dataset.state === "closed" ? nav.dataset.state = "open" : nav.dataset.state = "closed";
});

// 从配置初始化页面内容
function initPageContent() {
  if (typeof Config404 === 'undefined') return;

  // 获取当前语言
  const currentLang = localStorage.getItem('language') || Config404.defaultLanguage;
  const text = Config404.i18n[currentLang];
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang;

  // 更新页面标题
  document.title = text.pageTitle;

  // 更新文案
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const desktopText = document.querySelector('.desktop-text');
  const mobileText = document.querySelector('.mobile-text');
  const searchButton = document.querySelector('.btn.green');

  if (h1) h1.textContent = text.title;
  if (h2) h2.innerHTML = text.subtitle;
  if (desktopText) desktopText.innerHTML = text.desktopDescription;
  if (mobileText) mobileText.innerHTML = text.mobileDescription;
  if (searchButton) {
    searchButton.onclick = () => window.location.href = text.searchButtonUrl;
    const buttonLabel = searchButton.querySelector('.button-label');
    if (buttonLabel) buttonLabel.innerHTML = text.searchButtonText;
  }

  // 更新社交链接
  const socialLinks = document.querySelector('.social-links');
  if (socialLinks && Config404.social) {
    socialLinks.innerHTML = Config404.social.map(item => `
      <a href="${item.url}" title="${item.title}" target="_blank">
        <svg class="social-icon ${item.iconClass}" aria-hidden="true"><use href="#${item.iconId}"></use></svg>
      </a>
    `).join('');
  }

  // 更新侧边栏菜单
  const navUl = document.querySelector('nav ul');
  if (navUl && text.sidebarItems) {
    navUl.innerHTML = text.sidebarItems.map(item => `
      <li>
        <a href="${item.url}">${item.name}</a>
      </li>
    `).join('');
  }

  // 默认展开侧边栏
  if (Config404.sidebar.defaultOpen) {
    burger.dataset.state = "open";
    nav.dataset.state = "open";
  }
}

// 语言切换功能
function toggleLanguageDropdown() {
  const dropdown = document.getElementById('langDropdown');
  dropdown.classList.toggle('show');
}

// 点击外部关闭下拉框
document.addEventListener('click', function(e) {
  const dropdown = document.getElementById('langDropdown');
  const toggleBtn = document.querySelector('.lang-toggle-btn');
  
  if (dropdown && toggleBtn && !dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

function switchLanguage(lang) {
  localStorage.setItem('language', lang);
  
  // 更新下拉框选项状态
  document.querySelectorAll('.lang-option').forEach(option => {
    option.classList.remove('active');
    if (option.dataset.lang === lang) {
      option.classList.add('active');
    }
  });
  
  // 关闭下拉框
  document.getElementById('langDropdown').classList.remove('show');
  
  // 重新初始化内容
  initPageContent();
}

// 初始化语言选项
function initLanguageButtons() {
  const currentLang = localStorage.getItem('language') || Config404.defaultLanguage;
  
  // 设置初始激活状态
  document.querySelectorAll('.lang-option').forEach(option => {
    if (option.dataset.lang === currentLang) {
      option.classList.add('active');
    }
    
    // 绑定点击事件
    option.addEventListener('click', function() {
      switchLanguage(this.dataset.lang);
    });
  });
}

// 主题切换功能
function toggleTheme() {
  const html = document.documentElement;
  const checkbox = document.getElementById('theme-checkbox');
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  checkbox.checked = newTheme === 'dark';
}

// 页面加载时恢复主题
(function() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const checkbox = document.getElementById('theme-checkbox');
      if (checkbox) {
        checkbox.checked = savedTheme === 'dark';
      }
      initPageContent();
      initLanguageButtons();
    });
  } else {
    const checkbox = document.getElementById('theme-checkbox');
    if (checkbox) {
      checkbox.checked = savedTheme === 'dark';
    }
    initPageContent();
    initLanguageButtons();
  }
})();
