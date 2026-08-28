/**
 * 文章目录：可折叠树 + 滚动追踪高亮 + 自动展开/定位
 *
 * 数据流：
 *   .toc [data-sc-toc] > nav#TableOfContents
 *     → enhanceTree：有子 ul 的 li 挂 toggle（默认展开）
 *     → buildIndex：TOC a[href^="#"] ↔ 正文 heading
 *     → onScroll：按视口判定线选 activeId
 *       → setActive：高亮、展开祖先、必要时 scrollIntoView
 */
(function () {
  const ACTIVE = "is-active";
  const OPEN = "is-open";
  const BRANCH = "sc-toc__item--branch";
  const TOP_OFFSET = 96;

  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function hashOf(href) {
    if (!href) return "";
    const i = href.indexOf("#");
    return i >= 0 ? decodeURIComponent(href.slice(i + 1)) : "";
  }

  function resolveNav(mount) {
    if (!mount) return null;
    if (mount.id === "TableOfContents") return mount;
    return qs("#TableOfContents", mount) || (mount.matches && mount.matches("nav") ? mount : null);
  }

  function enhanceTree(nav) {
    qsa("li", nav).forEach((li) => {
      if (li.classList.contains(BRANCH)) return;
      const childList = li.querySelector(":scope > ul");
      const link = li.querySelector(":scope > a");
      if (!childList || !link) return;

      li.classList.add("sc-toc__item", BRANCH, OPEN);

      const row = document.createElement("div");
      row.className = "sc-toc__row";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "sc-toc__toggle";
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "展开/折叠子目录");
      toggle.innerHTML = '<span class="sc-toc__chevron" aria-hidden="true"></span>';

      link.parentNode.insertBefore(row, link);
      row.appendChild(toggle);
      row.appendChild(link);

      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(li, !li.classList.contains(OPEN));
      });
    });
  }

  function setOpen(li, open) {
    li.classList.toggle(OPEN, open);
    const btn = li.querySelector(":scope > .sc-toc__row > .sc-toc__toggle");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function expandAncestors(link) {
    let node = link && link.closest("li");
    while (node) {
      if (node.classList.contains(BRANCH)) setOpen(node, true);
      const parent = node.parentElement;
      node = parent ? parent.closest("li") : null;
    }
  }

  function buildIndex(nav) {
    return qsa('a[href^="#"]', nav)
      .map((link) => {
        const id = hashOf(link.getAttribute("href"));
        if (!id) return null;
        const heading = document.getElementById(id);
        if (!heading) return null;
        return { id, link, heading };
      })
      .filter(Boolean);
  }

  function pickActive(entries) {
    if (!entries.length) return null;
    const y = window.scrollY + TOP_OFFSET;
    let current = entries[0];
    for (let i = 0; i < entries.length; i++) {
      const top = entries[i].heading.getBoundingClientRect().top + window.scrollY;
      if (top <= y) current = entries[i];
      else break;
    }
    return current;
  }

  function setActive(nav, entry, scrollToc) {
    qsa("a." + ACTIVE, nav).forEach((a) => a.classList.remove(ACTIVE));
    if (!entry) return;

    entry.link.classList.add(ACTIVE);
    expandAncestors(entry.link);

    if (!scrollToc) return;
    const scroller = nav.closest(".toc--sidebar");
    if (!scroller) return;
    const linkRect = entry.link.getBoundingClientRect();
    const boxRect = scroller.getBoundingClientRect();
    const pad = 28;
    if (linkRect.top < boxRect.top + pad || linkRect.bottom > boxRect.bottom - pad) {
      entry.link.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function initNav(nav) {
    if (!nav || nav.dataset.scTocReady === "1") return;
    nav.dataset.scTocReady = "1";
    nav.classList.add("sc-toc");

    enhanceTree(nav);
    const entries = buildIndex(nav);
    if (!entries.length) return;

    let lastId = "";
    let ticking = false;
    let clicking = false;
    let clickTimer = 0;

    const refresh = (scrollToc) => {
      const active = pickActive(entries);
      const id = active ? active.id : "";
      if (id === lastId) return;
      lastId = id;
      setActive(nav, active, scrollToc);
    };

    const onScroll = () => {
      if (clicking || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        refresh(true);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !nav.contains(a)) return;
      const id = hashOf(a.getAttribute("href"));
      const entry = entries.find((x) => x.id === id);
      if (!entry) return;
      clicking = true;
      lastId = id;
      setActive(nav, entry, true);
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clicking = false;
        refresh(false);
      }, 500);
    });

    if (location.hash) {
      const id = hashOf(location.hash);
      const entry = entries.find((x) => x.id === id);
      if (entry) {
        lastId = id;
        setActive(nav, entry, true);
      }
    }

    refresh(false);
  }

  function boot() {
    const seen = new Set();
    const tryInit = (el) => {
      const nav = resolveNav(el);
      if (!nav || seen.has(nav)) return;
      seen.add(nav);
      initNav(nav);
    };

    qsa(".toc [data-sc-toc]").forEach(tryInit);
    qsa(".toc #TableOfContents").forEach(tryInit);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.scrollToTOC = function () {
    const toc = document.querySelector('.toc [data-sc-toc]') || document.querySelector('#TableOfContents');
    if (toc) {
      toc.scrollIntoView({ behavior: "smooth" });
    }
  };
})();
