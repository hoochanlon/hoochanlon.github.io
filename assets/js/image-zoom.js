/* 正文图片：点击放大（灯箱） */
(function () {
  const OPEN_CLASS = "image-zoom-open";

  let overlay = null;
  let lastFocus = null;

  function close() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.documentElement.classList.remove(OPEN_CLASS);
    document.removeEventListener("keydown", onKeydown);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function openFrom(img) {
    const src = img.currentSrc || img.getAttribute("src");
    if (!src) return;

    close();
    lastFocus = document.activeElement;

    overlay = document.createElement("div");
    overlay.className = "image-zoom-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "图片预览");

    const panel = document.createElement("div");
    panel.className = "image-zoom-panel";

    const full = document.createElement("img");
    full.className = "image-zoom-full";
    full.src = src;
    full.alt = img.alt || "";
    full.decoding = "async";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "image-zoom-close";
    closeBtn.setAttribute("aria-label", "关闭预览");
    closeBtn.textContent = "×";

    panel.appendChild(full);
    overlay.appendChild(closeBtn);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.documentElement.classList.add(OPEN_CLASS);
    document.addEventListener("keydown", onKeydown);
    closeBtn.focus();

    // 点遮罩关闭；点大图不关，方便长图拖动查看
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target === closeBtn) close();
    });
  }

  function isZoomable(img) {
    if (!(img instanceof HTMLImageElement)) return false;
    if (!img.closest(".prose")) return false;
    if (img.dataset.noZoom === "true" || img.classList.contains("no-zoom")) {
      return false;
    }
    // 忽略明显的装饰性极小图
    if (img.naturalWidth > 0 && img.naturalWidth < 48 && img.naturalHeight < 48) {
      return false;
    }
    return Boolean(img.currentSrc || img.getAttribute("src"));
  }

  document.addEventListener(
    "click",
    (e) => {
      const img = e.target.closest("img");
      if (!img || !isZoomable(img)) return;

      // figure 内若包了链接，仍优先灯箱而不是跳走
      const link = img.closest("a[href]");
      if (link) e.preventDefault();

      e.preventDefault();
      openFrom(img);
    },
    true
  );
})();
