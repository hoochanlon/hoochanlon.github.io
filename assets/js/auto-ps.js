(() => {
  const ROOT_SELECTOR = ".prose";
  const SKIP_SELECTOR = [
    "a",
    "pre",
    "code",
    "kbd",
    "samp",
    "script",
    "style",
    "textarea",
    "input",
    "select",
    "ruby",
    "rt",
    "rp",
    ".katex",
    ".math",
    ".mermaid",
    ".sc-code",
    ".sc-ps",
    ".sc-ps-block",
  ].join(",");
  const BRACKETED = /（[^（）\n]+）|\([^()\n]+\)/g;

  const shouldSkip = (node) => {
    const parent = node.parentElement;
    return !parent || parent.closest(SKIP_SELECTOR);
  };

  const bracketize = (textNode) => {
    const source = textNode.nodeValue;
    if (!source || !BRACKETED.test(source)) return;

    BRACKETED.lastIndex = 0;

    const fragment = document.createDocumentFragment();
    let cursor = 0;

    for (const match of source.matchAll(BRACKETED)) {
      if (match.index > cursor) {
        fragment.append(document.createTextNode(source.slice(cursor, match.index)));
      }

      const note = document.createElement("span");
      note.className = "sc-ps";
      note.textContent = match[0];
      fragment.append(note);

      cursor = match.index + match[0].length;
    }

    if (cursor < source.length) {
      fragment.append(document.createTextNode(source.slice(cursor)));
    }

    textNode.replaceWith(fragment);
  };

  const applyAutoPs = () => {
    document.querySelectorAll(ROOT_SELECTOR).forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
      });
      const nodes = [];

      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      nodes.forEach(bracketize);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAutoPs, { once: true });
  } else {
    applyAutoPs();
  }
})();
