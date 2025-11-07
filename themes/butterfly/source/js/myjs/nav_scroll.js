(function() {
  // -----------------------------
  // 动态返回按钮逻辑
  // -----------------------------
  function initBackLink() {
    const backLink = document.getElementById('nav-back');
    const backText = document.getElementById('nav-back-text');
    if (!backLink || !backText) return;

    const from = new URLSearchParams(window.location.search).get('from');
    if (from && /^\d+$/.test(from)) {
      backLink.href = (from === '1') ? '/' : `/page/${from}/#content-inner`;
      backText.textContent = ' ' + window._p?.('post.back_to_current_page') || ' 返回所在页';
    } else {
      backLink.href = '/';
      backText.textContent = ' ' + window._p?.('post.back_to_home') || ' 返回首页';
    }
  }

  // -----------------------------
  // 标题滚动逻辑
  // -----------------------------
  function initScrollTitle() {
    const siteName = document.querySelector('.nav-page-title .site-name:first-child');
    if (!siteName) return;

    const maxWidth = 200;
    const actualWidth = siteName.scrollWidth;

    if (actualWidth > maxWidth) {
      siteName.classList.add('scroll-enabled');
    } else {
      siteName.classList.remove('scroll-enabled');
    }
  }

  // -----------------------------
  // 初始化函数：执行两个逻辑
  // -----------------------------
  function initNavScripts() {
    initBackLink();
    initScrollTitle();
  }

  // 页面首次加载
  document.addEventListener('DOMContentLoaded', initNavScripts);

  // 窗口调整大小
  window.addEventListener('resize', initScrollTitle);

  // PJAX 页面切换后（Butterfly / Volantis / Matery 通用）
  document.addEventListener('pjax:complete', () => {
    setTimeout(initNavScripts, 200);
  });

  // swup 兼容
  document.addEventListener('swup:contentReplaced', initNavScripts);
})();
