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
      if (paletteOpen()) return;
      close();
    }
  });
})();
