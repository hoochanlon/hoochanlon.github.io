// This rehype plugin prepares Markdown-rendered images for GLightbox.
// It finds standalone <img> elements and wraps them in
// <a class="glightbox"> anchors pointing to the image source so that
// clicks open the lightbox. It also carries the image alt text into
// GLightbox's slide title via data attributes.
// author：游钓四方（https://blog.lhasa.icu）

// 使用全局类型声明替代直接导入
interface HASTNode {
  type: string;
  children?: HASTNode[];
  tagName?: string;
  properties?: Record<string, any>;
}

interface HASTElement extends HASTNode {
  type: 'element';
  tagName: string;
  properties?: Record<string, any>;
  children?: HASTNode[];
}

interface HASTRoot extends HASTNode {
  type: 'root';
  children: HASTNode[];
}

type Plugin = (options?: any) => (tree: any) => any;

/**
 * Rehype plugin: walk the HAST and wrap non-anchored images into
 * GLightbox-ready anchors belonging to the "markdown" gallery.
 */
const rehypeGlightboxImages: Plugin = () => {
  return (tree: HASTRoot) => {
    // Narrow an unknown node to a specific HAST element (optionally by tag name)
    const isElement = (n: unknown, name?: string): n is HASTElement => {
      if (!n || typeof n !== 'object') return false;
      const node = n as HASTNode;
      return node.type === "element" && (!name || node.tagName === name);
    };

    // Convenience guard for <a> elements
    const isAnchor = (n: unknown): n is HASTElement => isElement(n, "a");

    // Replace an <img> with an <a class="glightbox"> that contains the image,
    // sets href to the image source, and forwards alt as the slide title.
    const wrapImage = (node: HASTElement, parent: HASTElement, index: number) => {
      const src = String(node.properties?.src || "");
      if (!src) return;
      const alt = String(node.properties?.alt || "");
      const a: HASTElement = {
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
      (parent.children as HASTNode[])[index] = a;
    };

    // Depth-first traversal: when an <img> is found and its parent is not <a>,
    // wrap it for GLightbox and stop descending into that subtree.
    const walk = (node: HASTNode, parent: HASTElement | null = null) => {
      if (!node) return;
      if (isElement(node, "img") && parent && !isAnchor(parent)) {
        const index = parent.children!.indexOf(node);
        wrapImage(node as HASTElement, parent, index);
        return;
      }
      const children = node.children;
      if (Array.isArray(children)) {
        for (const child of children) walk(child, node as HASTElement);
      }
    };

    walk(tree);
  };
};

export default rehypeGlightboxImages;