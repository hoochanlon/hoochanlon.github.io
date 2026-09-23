(() => {
  const root = document.documentElement;
  const storageKey = "home-layout";
  const allowed = new Set(["page", "profile"]);
  const container = document.querySelector(".home-layout[data-home-layout]");
  const switcher = document.querySelector("[data-home-layout-switcher]");
  const profileFontHref = container && container.getAttribute("data-home-profile-font");
  const defaultLayout = (
    (container && container.getAttribute("data-default-layout")) ||
    (switcher && switcher.getAttribute("data-default-layout")) ||
    "page"
  ).trim().toLowerCase();

  const readStoredLayout = () => {
    try {
      return (localStorage.getItem(storageKey) || "").trim().toLowerCase();
    } catch (_) {
      return "";
    }
  };

  const writeStoredLayout = (layout) => {
    try {
      localStorage.setItem(storageKey, layout);
    } catch (_) {}
  };

  const normalize = (layout) => {
    const requested = (layout || defaultLayout).trim().toLowerCase();
    return allowed.has(requested) ? requested : (allowed.has(defaultLayout) ? defaultLayout : "page");
  };

  const syncButtons = (layout) => {
    if (!switcher) return;
    switcher.querySelectorAll("[data-home-layout-option]").forEach((button) => {
      const option = button.getAttribute("data-home-layout-option");
      const isActive = option === layout;
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.classList.toggle("is-active", isActive);
    });
  };

  const ensureProfileFont = () => {
    if (!profileFontHref || document.querySelector("[data-home-profile-font-stylesheet]")) return;
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = profileFontHref;
    stylesheet.dataset.homeProfileFontStylesheet = "";
    document.head.append(stylesheet);
  };

  const applyLayout = (layout, persist = true) => {
    const next = normalize(layout);
    if (next === "profile") ensureProfileFont();
    root.setAttribute("data-home-layout", next);
    if (container) {
      container.querySelectorAll("[data-home-layout-pane]").forEach((pane) => {
        pane.hidden = pane.getAttribute("data-home-layout-pane") !== next;
      });
    }
    if (persist) writeStoredLayout(next);
    syncButtons(next);
  };

  if (switcher) {
    const tooltipStorageKey = "home-layout-tooltip";
    const readSeenTooltips = () => {
      try {
        const raw = localStorage.getItem(tooltipStorageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter((item) => allowed.has(item)) : [];
      } catch (_) {
        return [];
      }
    };
    const writeSeenTooltips = (seen) => {
      try {
        localStorage.setItem(tooltipStorageKey, JSON.stringify(seen));
      } catch (_) {}
    };
    const markTooltipSeen = (option) => {
      if (!allowed.has(option)) return;
      const seen = readSeenTooltips();
      if (seen.includes(option)) return;
      writeSeenTooltips([...seen, option]);
    };
    const consumeTooltip = (button) => {
      const option = button.getAttribute("data-home-layout-option");
      button.classList.add("is-tooltip-spent");
      markTooltipSeen(option);
    };

    readSeenTooltips().forEach((option) => {
      const button = switcher.querySelector(`[data-home-layout-option="${option}"]`);
      if (button) button.classList.add("is-tooltip-spent");
    });

    switcher.querySelectorAll("[data-home-layout-option]").forEach((button) => {
      const tooltip = button.querySelector(".home-layout-switcher__tooltip");
      button.addEventListener("click", () => {
        applyLayout(button.getAttribute("data-home-layout-option"), true);
        consumeTooltip(button);
      });
      if (tooltip) {
        tooltip.addEventListener("transitionend", (event) => {
          if (event.propertyName !== "opacity") return;
          if (window.getComputedStyle(tooltip).opacity !== "1") return;
          consumeTooltip(button);
        });
      }
    });
  }

  applyLayout(root.getAttribute("data-home-layout") || readStoredLayout() || defaultLayout, false);
})();
