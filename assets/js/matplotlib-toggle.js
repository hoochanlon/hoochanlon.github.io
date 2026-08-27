(() => {
  const CARD_SELECTOR = "[data-matplotlib-card]";
  const TAB_SELECTOR = "[data-matplotlib-tab]";
  const PANEL_SELECTOR = "[data-matplotlib-panel]";
  const CODE_BLOCK_SELECTOR = ".sc-code, .highlight-wrapper, .highlight, pre";

  function findCodeBlock(card) {
    let current = card.previousElementSibling;

    while (current) {
      if (current.matches(CODE_BLOCK_SELECTOR)) {
        return current;
      }

      current = current.previousElementSibling;
    }

    return null;
  }

  function getTabs(card) {
    return Array.from(card.querySelectorAll(TAB_SELECTOR));
  }

  function getPanels(card) {
    const panels = new Map();

    card.querySelectorAll(PANEL_SELECTOR).forEach((panel) => {
      panels.set(panel.dataset.matplotlibPanel, panel);
    });

    return panels;
  }

  function setActiveTab(card, view) {
    const normalizedView = view === "code" ? "code" : "image";
    const tabs = getTabs(card);
    const panels = getPanels(card);

    card.dataset.activeView = normalizedView;

    tabs.forEach((tab) => {
      const isActive = tab.dataset.matplotlibTab === normalizedView;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel, panelView) => {
      panel.hidden = panelView !== normalizedView;
    });
  }

  function moveCodeBlock(card) {
    const codePanel = card.querySelector('[data-matplotlib-panel="code"]');
    const codeBlock = findCodeBlock(card);

    if (!codePanel || !codeBlock || codeBlock.closest(CARD_SELECTOR) === card) {
      return false;
    }

    codeBlock.classList.add("matplotlib-card__code");
    codePanel.appendChild(codeBlock);
    return true;
  }

  function mountCard(card, index) {
    if (card.dataset.mounted === "true") {
      return;
    }

    const imagePanel = card.querySelector('[data-matplotlib-panel="image"]');
    const codePanel = card.querySelector('[data-matplotlib-panel="code"]');
    const tabs = getTabs(card);

    if (!imagePanel || !codePanel || tabs.length === 0) {
      return;
    }

    const uid = card.dataset.matplotlibId || `matplotlib-card-${index}`;
    card.dataset.matplotlibId = uid;

    tabs.forEach((tab) => {
      const view = tab.dataset.matplotlibTab === "code" ? "code" : "image";
      tab.id = `${uid}-tab-${view}`;
      tab.setAttribute("aria-controls", `${uid}-panel-${view}`);
      tab.addEventListener("click", () => {
        setActiveTab(card, view);
      });

      tab.addEventListener("keydown", (event) => {
        const key = event.key;
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) {
          return;
        }

        event.preventDefault();

        const views = ["image", "code"];
        const currentIndex = views.indexOf(card.dataset.activeView || "image");
        let nextIndex = currentIndex;

        if (key === "ArrowLeft") nextIndex = (currentIndex - 1 + views.length) % views.length;
        if (key === "ArrowRight") nextIndex = (currentIndex + 1) % views.length;
        if (key === "Home") nextIndex = 0;
        if (key === "End") nextIndex = views.length - 1;

        setActiveTab(card, views[nextIndex]);
        const nextTab = tabs.find((item) => item.dataset.matplotlibTab === views[nextIndex]);
        nextTab?.focus();
      });
    });

    imagePanel.id = `${uid}-panel-image`;
    codePanel.id = `${uid}-panel-code`;
    imagePanel.setAttribute("aria-labelledby", `${uid}-tab-image`);
    codePanel.setAttribute("aria-labelledby", `${uid}-tab-code`);

    moveCodeBlock(card);
    setActiveTab(card, card.dataset.defaultView || "image");
    card.dataset.mounted = "true";
  }

  function mountAll() {
    document.querySelectorAll(CARD_SELECTOR).forEach((card, index) => {
      mountCard(card, index);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll, { once: true });
  } else {
    mountAll();
  }
})();
