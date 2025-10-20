// typewriter-effect.js
(function () {
  class TypeWriter {
    constructor(element, textLines = [], opts = {}) {
      this.el = element;
      this.lines = Array.isArray(textLines) ? textLines : [String(textLines || '')];
      this.speed = opts.speed || 40;         // 单字符间隔 ms
      this.lineDelay = opts.lineDelay || 300; // 行间延迟 ms
      this.index = 0;    // overall char index not needed; we manage per line
      this.cursorEl = opts.cursorEl || null;
    }

    async start() {
      for (let i = 0; i < this.lines.length; i++) {
        await this.typeLine(this.lines[i], i);
        if (i < this.lines.length - 1) {
          await this.wait(this.lineDelay);
          // 插入换行元素
          const br = document.createElement('div');
          br.className = 'post-typewriter-text-line';
          this.el.appendChild(br);
        }
      }
      // 打字完后让光标闪烁（若提供）
      if (this.cursorEl) this.cursorEl.classList.add('tw-cursor-blink');
    }

    typeLine(line, lineNo = 0) {
      return new Promise((resolve) => {
        const container = document.createElement('div');
        container.className = 'post-typewriter-text-line';
        this.el.appendChild(container);
        let i = 0;
        const timer = setInterval(() => {
          if (i < line.length) {
            container.textContent += line.charAt(i);
            i++;
          } else {
            clearInterval(timer);
            resolve();
          }
        }, this.speed);
      });
    }

    wait(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
  }

  // 等待页面就绪（兼容 preloader / pjax）
  function waitForPageReady() {
    return new Promise((resolve) => {
      const preloader = document.querySelector('#loading-box');
      if (preloader) {
        const check = () => {
          if (preloader.style.display === 'none' ||
              preloader.style.opacity === '0' ||
              !document.body.contains(preloader)) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      } else {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
      }
    });
  }

  // 获取 typewriter 文本（优先 article front-matter -> 全局配置）
  function getTypewriterText() {
    // 1) 尝试从 HTML meta / data 属性获取（兼容不同主题）
    const el = document.querySelector('#post') || document.querySelector('.post') || document.querySelector('article');
    if (!el) return null;

    // 优先尝试 data-typewriter 属性（方便模板输出）
    const dataAttr = el.getAttribute('data-typewriter');
    if (dataAttr) return parseLines(dataAttr);

    // 其次尝试全局配置变量（若主题有 window.GLOBAL_CONFIG_SITE.typewriter）
    if (window.GLOBAL_CONFIG_SITE && window.GLOBAL_CONFIG_SITE.typewriter) {
      return parseLines(window.GLOBAL_CONFIG_SITE.typewriter);
    }

    // 最后尝试从 page front-matter 渲染到 DOM（作者可在模板里把 front-matter 输出到 meta）
    const meta = document.querySelector('meta[name="typewriter"]');
    if (meta && meta.content) return parseLines(meta.content);

    return null;
  }

  // 把文本按换行或分隔符拆成数组
  function parseLines(raw) {
    if (!raw) return null;
    // 如果是 JSON 数组字符串，尝试解析
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch (e) { /* ignore */ }
    // 否则按换行或 “|||” 分割，并 trim
    return raw.split(/\r?\n|\|\|\|/).map(s => s.trim()).filter(Boolean);
  }

  async function main() {
    await waitForPageReady();
    setTimeout(() => {
      // 只在文章页运行：检测 #post 或 article 标识
      const postEl = document.querySelector('#post') || document.querySelector('article.post') || document.querySelector('article');
      if (!postEl) return;

      const lines = getTypewriterText();
      if (!lines || lines.length === 0) return;

      // 创建容器并插入文章最前
      const container = document.createElement('div');
      container.className = 'post-typewriter-container';
      container.innerHTML = `
        <div class="post-typewriter-header">
          <i class="fas fa-robot" aria-hidden="true"></i>
          <span class="post-typewriter-title">AI 摘要</span>
        </div>
        <div class="post-typewriter-content">
          <div class="post-typewriter-icon"><i class="fas fa-quote-left" aria-hidden="true"></i></div>
          <div class="post-typewriter-text"></div>
          <div class="post-typewriter-cursor">|</div>
        </div>
      `;

      // 插入到文章内容最前（兼容不同容器 id/class）
      const articleContainer = document.querySelector('#article-container') || postEl;
      articleContainer.insertBefore(container, articleContainer.firstChild);

      const textEl = container.querySelector('.post-typewriter-text');
      const cursor = container.querySelector('.post-typewriter-cursor');

      // 初始化并开始（可传 speed 等配置）
      const tw = new TypeWriter(textEl, lines, { speed: 24, lineDelay: 250, cursorEl: cursor });

      // 初始样式（淡入）
      container.style.opacity = '0';
      container.style.transform = 'translateY(12px)';
      setTimeout(() => {
        container.style.transition = 'all 0.45s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        setTimeout(() => tw.start(), 320);
      }, 100);

    }, 1000); // 延迟 1 秒开始（参考原文）
  }

  if (typeof window.pjax !== 'undefined') {
    document.addEventListener('pjax:complete', main);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
