// lightbox-init.js
(function() {
  'use strict';

  // 检查是否在浏览器环境中
  if (typeof window === 'undefined') return;

  let glightboxInstance = null;

  /**
   * 初始化 GLightbox
   */
  function initLightbox() {
    try {
      // 确保每个锚点指向实际渲染的图像源
      const anchors = document.querySelectorAll('a.glightbox');
      if (!anchors.length) return;

      anchors.forEach(anchor => {
        const img = anchor.querySelector('img');
        if (!img) return;

        // 优先使用响应式图像的 currentSrc，回退到 src
        const finalSrc = img.currentSrc || img.src;
        if (finalSrc && anchor.getAttribute('href') !== finalSrc) {
          anchor.setAttribute('href', finalSrc);
        }

        // 如果没有设置标题，则将 alt 文本作为幻灯片标题
        const alt = img.getAttribute('alt');
        if (alt && !anchor.dataset.title) {
          anchor.dataset.title = alt;
        }
      });

      // 清除现有的 lightbox 实例
      if (glightboxInstance && glightboxInstance.destroy) {
        glightboxInstance.destroy();
        glightboxInstance = null;
      }

      // 检查 GLightbox 是否已加载
      if (typeof GLightbox === 'function') {
        glightboxInstance = GLightbox({
          selector: 'a.glightbox',
          touchNavigation: true,
          loop: true,
          autoplayVideos: false,
          // 可选的额外配置
          openEffect: 'zoom',
          closeEffect: 'zoom',
          slideEffect: 'slide',
          moreText: '查看更多',
          moreLength: 60,
          closeButton: true,
          draggable: true,
          descPosition: 'bottom'
        });
        
        console.log('GLightbox 初始化成功');
      } else {
        console.warn('GLightbox 库未加载，请确保已引入 GLightbox 脚本');
      }
    } catch (error) {
      console.error('GLightbox 初始化失败:', error);
    }
  }

  /**
   * 清理函数
   */
  function cleanup() {
    if (glightboxInstance && glightboxInstance.destroy) {
      glightboxInstance.destroy();
      glightboxInstance = null;
    }
  }

  /**
   * 页面加载完成后初始化
   */
  function init() {
    // 移除之前的事件监听器以避免重复绑定
    document.removeEventListener('astro:after-swap', init);
    document.removeEventListener('DOMContentLoaded', init);
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initLightbox();
    } else {
      document.addEventListener('DOMContentLoaded', initLightbox);
    }
    
    // Astro 视图过渡后重新初始化
    document.addEventListener('astro:after-swap', initLightbox);
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', cleanup);
  }

  // 开始初始化
  init();

  // 可选：导出为全局变量（如果需要从其他地方调用）
  window.lightboxUtils = {
    init: initLightbox,
    cleanup: cleanup,
    getInstance: () => glightboxInstance
  };

})();