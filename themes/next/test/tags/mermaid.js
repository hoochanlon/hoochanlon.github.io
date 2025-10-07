'use strict';


const { escapeHTML } = require('hexo-util');

const result = `A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]`;

describe('mermaid', () => {
  const mermaid = require('../../scripts/tags/mermaid');

  it('default', () => {
    mermaid(['graph', 'TD'], result).should.eql(`<pre>
<code class="mermaid">
graph TD
${escapeHTML(result)}
</code>
</pre>`);
  });
});
