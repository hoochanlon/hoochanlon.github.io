/**
 * Butterfly 顶部导航标题滚动检测（基于字符长度）
 * 当标题字数超过设定阈值时触发滚动动画
 */

(function() {
  function checkTitleScroll() {
    const title = document.querySelector('.nav-page-title .site-name:first-child');
    if (!title) return;

    const text = title.textContent.trim();

    // 🧮 统计字符数：中文算 1 个，英文/数字算 0.5 个
    const charCount = text.split('').reduce((count, ch) => {
      // 中文（含全角字符）匹配范围
      return count + (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(ch) ? 1 : 0.5);
    }, 0);

    // 🚦 设置滚动触发阈值（中文约 18 字，英文约 24 字）
    const threshold = 18;

    if (charCount > threshold) {
      title.classList.add('scroll-enabled');
    } else {
      title.classList.remove('scroll-enabled');
    }

    console.log(`[nav-scroll] 标题长度: ${charCount}, 阈值: ${threshold}, 滚动: ${charCount > threshold}`);
  }

  window.addEventListener('load', () => {
    checkTitleScroll();

    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => setTimeout(checkTitleScroll, 200));
  });

  window.addEventListener('resize', checkTitleScroll);
})();
