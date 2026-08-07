(() => {
  const drawer = document.querySelector("[data-footer-drawer]");

  if (!drawer) return;

  const triggers = drawer.querySelectorAll(".site-footer-trigger");
  const stateAttribute = "data-footer-drawer-state";
  const open = () => drawer.setAttribute(stateAttribute, "open");
  const close = () => drawer.removeAttribute(stateAttribute);

  triggers.forEach((trigger) => {
    trigger.addEventListener("pointerenter", open);
  });

  document.addEventListener("pointerdown", ({ target }) => {
    if (!drawer.contains(target)) close();
  });

  document.addEventListener("keydown", ({ key }) => {
    if (key === "Escape") close();
  });
})();
