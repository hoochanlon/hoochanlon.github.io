(() => {
  const root = document.documentElement;
  const container = document.querySelector("[data-palette-switcher]");
  if (!container) return;

  const storageKey = "palette";
  const defaultPalette = (container.getAttribute("data-default-palette") || "").trim().toLowerCase();
  const options = Array.from(container.querySelectorAll("[data-palette-option]"));
  const availablePalettes = new Set(
    options.map((button) => button.getAttribute("data-palette-option")).filter(Boolean)
  );
  const resetButton = container.querySelector("[data-palette-reset]");
  const details = container.querySelector("details");

  const readStoredPalette = () => {
    try {
      return (localStorage.getItem(storageKey) || "").trim().toLowerCase();
    } catch (_) {
      return "";
    }
  };

  const writeStoredPalette = (palette) => {
    try {
      localStorage.setItem(storageKey, palette);
    } catch (_) {}
  };

  const clearStoredPalette = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (_) {}
  };

  const getComputedColor = (varName) => {
    const value = window.getComputedStyle(root).getPropertyValue(varName).replace(/\s+/g, "").trim();
    return value ? `rgb(${value})` : "";
  };

  const updateThemeColorMeta = () => {
    const meta = document.querySelector("meta[name='theme-color']");
    if (!meta) return;
    const next = root.classList.contains("dark")
      ? getComputedColor("--color-neutral-800")
      : getComputedColor("--color-neutral");
    if (next) meta.setAttribute("content", next);
  };

  const getActivePalette = () => {
    return root.getAttribute("data-palette") || defaultPalette;
  };

  const syncActiveState = () => {
    const active = getActivePalette();
    options.forEach((button) => {
      const palette = button.getAttribute("data-palette-option");
      const isActive = palette === active;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.classList.toggle("is-active", isActive);
    });
  };

  const applyPalette = (palette, persist = true) => {
    const requested = (palette || defaultPalette).trim().toLowerCase();
    const next = availablePalettes.has(requested) ? requested : defaultPalette;
    if (!next) return;
    root.setAttribute("data-palette", next);
    if (persist) {
      writeStoredPalette(next);
    }
    requestAnimationFrame(updateThemeColorMeta);
    syncActiveState();
  };

  options.forEach((button) => {
    button.addEventListener("click", () => {
      const palette = button.getAttribute("data-palette-option");
      applyPalette(palette, true);
      if (details) details.open = false;
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      clearStoredPalette();
      applyPalette(defaultPalette, false);
      if (details) details.open = false;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && details?.open) {
      details.open = false;
    }
  });

  const observer = new MutationObserver(updateThemeColorMeta);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["class", "data-palette"],
  });

  applyPalette(readStoredPalette() || defaultPalette, false);
})();
