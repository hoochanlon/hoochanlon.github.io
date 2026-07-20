/* 正文图片灯箱：打开后可连续放大 / 滚轮缩放 / 拖拽平移 */
(function () {
  const OPEN_CLASS = "image-zoom-open";
  const MIN_SCALE = 1;
  const MAX_SCALE = 8;
  const CLICK_STEP = 1.4; // 每次点击放大倍率
  const WHEEL_STEP = 0.12;

  let overlay = null;
  let panel = null;
  let full = null;
  let lastFocus = null;

  let scale = 1;
  let tx = 0;
  let ty = 0;

  let dragging = false;
  let moved = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let originTx = 0;
  let originTy = 0;

  // 双指缩放
  let pinchStartDist = 0;
  let pinchStartScale = 1;

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function applyTransform() {
    if (!full) return;
    full.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    full.classList.toggle("is-zoomed", scale > 1.01);
    if (overlay) {
      overlay.classList.toggle("is-zoomed", scale > 1.01);
    }
  }

  function resetView() {
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();
  }

  /** 以视口坐标 (cx, cy) 为锚点缩放 */
  function zoomAt(cx, cy, nextScale) {
    if (!full || !panel) return;
    nextScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if (nextScale === scale) return;

    const rect = full.getBoundingClientRect();
    // 锚点相对当前图片中心的偏移
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;
    const ox = cx - midX;
    const oy = cy - midY;
    const ratio = nextScale / scale;

    tx = tx - ox * (ratio - 1);
    ty = ty - oy * (ratio - 1);
    scale = nextScale;

    if (scale <= MIN_SCALE + 0.001) {
      scale = MIN_SCALE;
      tx = 0;
      ty = 0;
    }
    applyTransform();
  }

  function close() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    panel = null;
    full = null;
    document.documentElement.classList.remove(OPEN_CLASS);
    document.removeEventListener("keydown", onKeydown);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
    dragging = false;
    scale = 1;
    tx = 0;
    ty = 0;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (!full) return;
    // + / = 放大，- 缩小，0 重置
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      const r = full.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale * CLICK_STEP);
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      const r = full.getBoundingClientRect();
      zoomAt(r.left + r.width / 2, r.top + r.height / 2, scale / CLICK_STEP);
    } else if (e.key === "0") {
      e.preventDefault();
      resetView();
    }
  }

  function openFrom(img) {
    const src = img.currentSrc || img.getAttribute("src");
    if (!src) return;

    close();
    lastFocus = document.activeElement;
    scale = 1;
    tx = 0;
    ty = 0;

    overlay = document.createElement("div");
    overlay.className = "image-zoom-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "图片预览，点击图片继续放大，滚轮缩放，拖拽平移");

    panel = document.createElement("div");
    panel.className = "image-zoom-panel";

    full = document.createElement("img");
    full.className = "image-zoom-full";
    full.src = src;
    full.alt = img.alt || "";
    full.decoding = "async";
    full.draggable = false;

    /** 加载后锁定「适配视口」的像素尺寸，后续只靠 transform 放大 */
    function freezeFitSize() {
      if (!full) return;
      // 先按 CSS max 约束布局，再读实际显示尺寸
      full.style.width = "";
      full.style.height = "";
      full.style.maxWidth = "min(96vw, 100%)";
      full.style.maxHeight = "92vh";
      // 强制 reflow
      void full.offsetWidth;
      const w = full.getBoundingClientRect().width;
      const h = full.getBoundingClientRect().height;
      if (w > 0 && h > 0) {
        full.style.width = `${w}px`;
        full.style.height = `${h}px`;
        full.style.maxWidth = "none";
        full.style.maxHeight = "none";
      }
    }

    if (full.complete) {
      freezeFitSize();
    } else {
      full.addEventListener("load", freezeFitSize, { once: true });
    }

    const hint = document.createElement("div");
    hint.className = "image-zoom-hint";
    hint.textContent = "点击放大 · 滚轮缩放 · 拖拽移动 · Esc 关闭";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "image-zoom-close";
    closeBtn.setAttribute("aria-label", "关闭预览");
    closeBtn.textContent = "×";

    panel.appendChild(full);
    overlay.appendChild(closeBtn);
    overlay.appendChild(hint);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.documentElement.classList.add(OPEN_CLASS);
    document.addEventListener("keydown", onKeydown);
    closeBtn.focus();
    applyTransform();

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });

    // 点遮罩空白关闭；点图不关
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // 点击图片：连续放大（未拖拽时）
    full.addEventListener("click", (e) => {
      e.stopPropagation();
      if (moved) {
        moved = false;
        return;
      }
      if (scale >= MAX_SCALE - 0.01) {
        // 到顶后再次点击回到适配
        resetView();
        return;
      }
      zoomAt(e.clientX, e.clientY, scale * CLICK_STEP);
    });

    // 滚轮缩放（锚点为指针）
    overlay.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 - WHEEL_STEP : 1 + WHEEL_STEP;
        zoomAt(e.clientX, e.clientY, scale * delta);
      },
      { passive: false }
    );

    // 拖拽平移
    full.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      // 多指交给 pinch
      if (e.pointerType === "touch" && e.isPrimary === false) return;
      dragging = true;
      moved = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      originTx = tx;
      originTy = ty;
      full.setPointerCapture(e.pointerId);
      full.classList.add("is-dragging");
    });

    full.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      // 仅放大后平移；适配尺寸时也允许轻微拖，便于长图
      tx = originTx + dx;
      ty = originTy + dy;
      applyTransform();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      full.classList.remove("is-dragging");
      try {
        full.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    }

    full.addEventListener("pointerup", endDrag);
    full.addEventListener("pointercancel", endDrag);

    // 双指 pinch
    let touchCache = [];

    function touchDist(a, b) {
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      return Math.hypot(dx, dy);
    }

    overlay.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 2) {
          dragging = false;
          pinchStartDist = touchDist(e.touches[0], e.touches[1]);
          pinchStartScale = scale;
          touchCache = [e.touches[0], e.touches[1]];
        }
      },
      { passive: true }
    );

    overlay.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length === 2 && pinchStartDist > 0) {
          e.preventDefault();
          const d = touchDist(e.touches[0], e.touches[1]);
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          zoomAt(midX, midY, pinchStartScale * (d / pinchStartDist));
        }
      },
      { passive: false }
    );

    overlay.addEventListener(
      "touchend",
      (e) => {
        if (e.touches.length < 2) {
          pinchStartDist = 0;
          touchCache = [];
        }
      },
      { passive: true }
    );
  }

  function isZoomable(img) {
    if (!(img instanceof HTMLImageElement)) return false;
    if (!img.closest(".prose")) return false;
    if (img.dataset.noZoom === "true" || img.classList.contains("no-zoom")) {
      return false;
    }
    if (img.closest(".image-zoom-overlay")) return false;
    if (img.naturalWidth > 0 && img.naturalWidth < 48 && img.naturalHeight < 48) {
      return false;
    }
    return Boolean(img.currentSrc || img.getAttribute("src"));
  }

  document.addEventListener(
    "click",
    (e) => {
      // 灯箱内部事件自己处理
      if (e.target.closest(".image-zoom-overlay")) return;

      const img = e.target.closest("img");
      if (!img || !isZoomable(img)) return;

      const link = img.closest("a[href]");
      if (link) e.preventDefault();

      e.preventDefault();
      openFrom(img);
    },
    true
  );
})();
