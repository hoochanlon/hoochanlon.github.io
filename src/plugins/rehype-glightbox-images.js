// src/plugins/rehype-glightbox-images.js

/**
 * Rehype plugin: walk the HAST and wrap non-anchored images into
 * GLightbox-ready anchors belonging to the "markdown" gallery.
 * @returns {import('unified').Plugin}
 */
const rehypeGlightboxImages = () => {
  return (tree) => {
    // Narrow an unknown node to a specific HAST element (optionally by tag name)
    const isElement = (n, name) => 
      !!n && n.type === "element" && (!name || n.tagName === name);

    // Convenience guard for <a> elements
    const isAnchor = (n) => isElement(n, "a");

    // Replace an <img> with an <a class="glightbox"> that contains the image,
    // sets href to the image source, and forwards alt as the slide title.
    const wrapImage = (node, parent, index) => {
      const src = String(node.properties?.src || "");
      if (!src) return;
      const alt = String(node.properties?.alt || "");
      const a = {
        type: "element",
        tagName: "a",
        properties: {
          href: src,
          className: ["glightbox"],
          "data-gallery": "markdown",
          ...(alt ? { "data-title": alt } : {}),
        },
        children: [node],
      };
      parent.children[index] = a;
    };

    // Depth-first traversal: when an <img> is found and its parent is not <a>,
    // wrap it for GLightbox and stop descending into that subtree.
    const walk = (node, parent = null) => {
      if (!node) return;
      if (isElement(node, "img") && parent && !isAnchor(parent)) {
        const index = parent.children.indexOf(node);
        wrapImage(node, parent, index);
        return;
      }
      const children = node.children;
      if (Array.isArray(children)) {
        for (const child of children) walk(child, node);
      }
    };

    walk(tree);
  };
};

export default rehypeGlightboxImages;