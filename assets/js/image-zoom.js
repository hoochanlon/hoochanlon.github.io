/* 正文图片灯箱：打开后可连续放大 / 滚轮缩放 / 拖拽平移 */
(function () {
  const OPEN_CLASS = "image-zoom-open";
  const MIN_SCALE = 1;
  const MAX_SCALE = 8;
  const CLICK_STEP = 1.4; // 每次点击放大倍率
  const WHEEL_STEP = 0.12;
  const WHEEL_NAV_THRESHOLD = 90;
  const WHEEL_NAV_RELEASE = 4;

  let overlay = null;
  let panel = null;
  let full = null;
  let counter = null;
  let prevBtn = null;
  let nextBtn = null;
  let lastFocus = null;

  let gallery = [];
  let currentIndex = -1;

  let scale = 1;
  let tx = 0;
  let ty = 0;

  let dragging = false;
  let moved = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragDx = 0;
  let dragDy = 0;
  let originTx = 0;
  let originTy = 0;

  // 双指缩放
  let pinchStartDist = 0;
  let pinchStartScale = 1;

  let wheelNavDx = 0;
  let wheelNavLocked = false;
  let wheelNavLockedAt = 0;

  function getImageSrc(img) {
    return img.currentSrc || img.getAttribute("src") || "";
  }

  function getImageTitle(img) {
    return img.getAttribute("title") || img.getAttribute("aria-label") || img.alt || "";
  }

  function toGalleryItem(img) {
    return {
      img,
      src: getImageSrc(img),
      alt: img.alt || "",
      title: getImageTitle(img),
    };
  }

  function getGalleryFor(img) {
    const phoneShots = img.closest(".sc-phone-shots");
    if (!phoneShots) {
      return [toGalleryItem(img)].filter((item) => item.src);
    }

    return Array.from(phoneShots.querySelectorAll("img"))
      .filter(isZoomable)
      .map(toGalleryItem)
      .filter((item) => item.src);
  }

  function updateNav() {
    const total = gallery.length;
    const canNavigate = total > 1;
    if (overlay) overlay.classList.toggle("has-gallery", canNavigate);
    if (counter) counter.textContent = canNavigate ? `${currentIndex + 1} / ${total}` : "";
    if (prevBtn) prevBtn.hidden = !canNavigate;
    if (nextBtn) nextBtn.hidden = !canNavigate;
  }

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

  function showAt(index) {
    if (!full || gallery.length === 0) return;
    currentIndex = (index + gallery.length) % gallery.length;
    const item = gallery[currentIndex];

    full.removeAttribute("style");
    full.classList.remove("is-zoomed", "is-dragging");
    wheelNavDx = 0;
    wheelNavLocked = true;
    wheelNavLockedAt = Date.now();
    resetView();
    full.src = item.src;
    full.alt = item.alt;
    full.title = item.title;

    if (full.complete) {
      freezeFitSize();
    } else {
      full.addEventListener("load", freezeFitSize, { once: true });
    }

    updateNav();
  }

  function go(delta) {
    if (gallery.length <= 1) return;
    showAt(currentIndex + delta);
  }

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
    counter = null;
    prevBtn = null;
    nextBtn = null;
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
    gallery = [];
    currentIndex = -1;
    wheelNavDx = 0;
    wheelNavLocked = false;
    wheelNavLockedAt = 0;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowLeft" && scale <= 1.01) {
      e.preventDefault();
      go(-1);
      return;
    }
    if (e.key === "ArrowRight" && scale <= 1.01) {
      e.preventDefault();
      go(1);
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
    const src = getImageSrc(img);
    if (!src) return;

    close();
    lastFocus = document.activeElement;
    scale = 1;
    tx = 0;
    ty = 0;
    gallery = getGalleryFor(img);
    currentIndex = Math.max(
      0,
      gallery.findIndex((item) => item.img === img || item.src === src)
    );

    overlay = document.createElement("div");
    overlay.className = "image-zoom-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "图片预览，左右切换，点击图片继续放大，滚轮缩放，拖拽平移");

    panel = document.createElement("div");
    panel.className = "image-zoom-panel";

    full = document.createElement("img");
    full.className = "image-zoom-full";
    full.decoding = "async";
    full.draggable = false;

    const hint = document.createElement("div");
    hint.className = "image-zoom-hint";
    hint.textContent = "点击放大 · 滚轮缩放 · 拖拽移动 · Esc 关闭";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "image-zoom-close";
    closeBtn.setAttribute("aria-label", "关闭预览");
    closeBtn.textContent = "×";

    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "image-zoom-nav image-zoom-nav--prev";
    prevBtn.setAttribute("aria-label", "上一张图片");
    prevBtn.textContent = "‹";

    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "image-zoom-nav image-zoom-nav--next";
    nextBtn.setAttribute("aria-label", "下一张图片");
    nextBtn.textContent = "›";

    counter = document.createElement("div");
    counter.className = "image-zoom-counter";
    counter.setAttribute("aria-live", "polite");

    panel.appendChild(full);
    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);
    overlay.appendChild(counter);
    overlay.appendChild(hint);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.documentElement.classList.add(OPEN_CLASS);
    document.addEventListener("keydown", onKeydown);
    showAt(currentIndex);
    closeBtn.focus();

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      go(-1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      go(1);
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

    // 触控板横向手势翻图；纵向滚动继续缩放（锚点为指针）
    overlay.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        const absX = Math.abs(e.deltaX);
        const absY = Math.abs(e.deltaY);
        const canWheelNavigate =
          gallery.length > 1 && scale <= 1.01 && !e.ctrlKey && absX > absY * 1.4 && absX > 1;

        if (canWheelNavigate) {
          const now = Date.now();
          if (wheelNavLocked && now - wheelNavLockedAt > 700) {
            wheelNavLocked = false;
            wheelNavDx = 0;
          }

          if (absX <= WHEEL_NAV_RELEASE) {
            wheelNavDx = 0;
            wheelNavLocked = false;
            wheelNavLockedAt = 0;
            return;
          }

          if (wheelNavLocked) return;

          wheelNavDx += e.deltaX;
          if (Math.abs(wheelNavDx) >= WHEEL_NAV_THRESHOLD) {
            go(wheelNavDx > 0 ? 1 : -1);
            wheelNavDx = 0;
            wheelNavLocked = true;
            wheelNavLockedAt = now;
          }
          return;
        }

        wheelNavDx = 0;
        wheelNavLocked = false;
        wheelNavLockedAt = 0;
        if (absY <= 1) return;
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
      dragDx = 0;
      dragDy = 0;
      originTx = tx;
      originTy = ty;
      full.setPointerCapture(e.pointerId);
      full.classList.add("is-dragging");
    });

    full.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragDx = dx;
      dragDy = dy;
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
      if (scale <= 1.01 && Math.abs(dragDx) > 60 && Math.abs(dragDx) > Math.abs(dragDy) * 1.5) {
        go(dragDx < 0 ? 1 : -1);
      }
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
