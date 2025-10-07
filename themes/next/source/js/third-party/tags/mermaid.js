/* global NexT, CONFIG, mermaid */

document.addEventListener('page:loaded', async () => {
  const mermaidElements = document.querySelectorAll('pre > .mermaid');
  if (mermaidElements.length) {
    await NexT.utils.getScript(CONFIG.mermaid.js, {
      condition: window.mermaid
    });
    mermaidElements.forEach(element => {
      const box = document.createElement('div');
      box.className = 'code-container';
      const newElement = document.createElement('div');
      newElement.innerHTML = element.innerHTML;
      newElement.className = 'mermaid';
      box.appendChild(newElement);
      if (CONFIG.codeblock.copy_button.enable) {
        NexT.utils.registerCopyButton(box, box, element.textContent);
      }
      const parent = element.parentNode;
      parent.parentNode.replaceChild(box, parent);
    });
    mermaid.initialize({
      theme    : CONFIG.darkmode && window.matchMedia('(prefers-color-scheme: dark)').matches ? CONFIG.mermaid.theme.dark : CONFIG.mermaid.theme.light,
      logLevel : 4,
      flowchart: { curve: 'linear' },
      gantt    : { axisFormat: '%m/%d/%Y' },
      sequence : { actorMargin: 50 }
    });
    mermaid.run();
  }
});
