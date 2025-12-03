// This rehype plugin prepares Markdown-rendered images for GLightbox.
// It finds standalone <img> elements and wraps them in
// <a class="glightbox"> anchors pointing to the image source so that
// clicks open the lightbox. It also carries the image alt text into
// GLightbox's slide title via data attributes.
// author：游钓四方（https://blog.lhasa.icu）

import type { Plugin } from "unified";
import type { Root, Element } from "hast";

/**
 * Rehype plugin: walk the HAST and wrap non-anchored images into
 * GLightbox-ready anchors belonging to the "markdown" gallery.
 */
const rehypeGlightboxImages: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // Narrow an unknown node to a specific HAST element (optionally by tag name)
    const isElement = (n: unknown, name?: string): n is Element =>
      !!n && (n as any).type === "element" && (!name || (n as any).tagName === name);

    // Convenience guard for <a> elements
    const isAnchor = (n: unknown): n is Element => isElement(n, "a");

    // Replace an <img> with an <a class="glightbox"> that contains the image,
    // sets href to the image source, and forwards alt as the slide title.
    const wrapImage = (node: Element, parent: Element, index: number) => {
      const src = String((node.properties as any)?.src || "");
      if (!src) return;
      const alt = String((node.properties as any)?.alt || "");
      const a: Element = {
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
      (parent.children as any[])[index] = a;
    };

    // Depth-first traversal: when an <img> is found and its parent is not <a>,
    // wrap it for GLightbox and stop descending into that subtree.
    const walk = (node: any, parent: any = null) => {
      if (!node) return;
      if (isElement(node, "img") && parent && !isAnchor(parent)) {
        const index = parent.children.indexOf(node);
        wrapImage(node as Element, parent as Element, index);
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