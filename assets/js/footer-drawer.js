(() => {
  const drawer = document.querySelector("[data-footer-drawer]");

  if (!drawer) return;

  const triggers = drawer.querySelectorAll(".site-footer-trigger");
  const stateAttribute = "data-footer-drawer-state";
  const open = () => drawer.setAttribute(stateAttribute, "open");
  const close = () => drawer.removeAttribute(stateAttribute);

  const paletteOpen = () => {
    const p = document.querySelector("[data-palette-switcher] .palette-switcher__panel");
    return p?.classList.contains("is-open") ?? false;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("pointerenter", open);
  });

  document.addEventListener("pointerdown", ({ target }) => {
    if (!drawer.contains(target)) {
      if (paletteOpen()) return;
      close();
    }
  });

  document.addEventListener("keydown", ({ key }) => {
    if (key === "Escape") {
      // 横幅可见时优先关横幅，本次 Esc 不关抽屉
      const banner = document.getElementById("site-banner");
      if (banner && banner.style.display !== "none") return;
      if (paletteOpen()) return;
      close();
    }
  });

  // 单独按下并松开 Shift 键时切换抽屉
  let shiftAlone = false;
  document.addEventListener("keydown", (e) => {
    shiftAlone = e.key === "Shift" && !e.ctrlKey && !e.altKey && !e.metaKey;
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "Shift" && shiftAlone) {
      const state = drawer.getAttribute("data-footer-drawer-state");
      state === "open" ? close() : open();
    }
    shiftAlone = false;
  });
})();
