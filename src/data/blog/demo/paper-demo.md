---
pubDatetime: 2025-11-24T11:11:53Z
modDatetime: 2025-11-25T12:28:53Z
title: Paper Demo
slug: paper-demo
featured: true
draft: false
tags:
  - demo
description: 仅仅只是demo
---



```markdown file=src/data/blog/demo/paper-demo.md
---
pubDatetime: 2025-11-24T11:11:53Z
modDatetime: 2025-11-25T12:28:53Z
title: Paper Demo
slug: paper-demo
featured: true
draft: false
tags:
  - demo
description: 仅仅只是demo
---
```

目录设置：将 `## Table of contents` 插入文章


将 `// [!code ++:1]` 插入代码，效果如下：


```jsx file=src/layouts/PostDetails.astro
// [!code ++:1]
import Comments from "@/components/Comments";

<ShareLinks />

// [!code ++:1]
<Comments client:only="react" />

<hr class="my-6 border-dashed" />

<Footer />
```

详情见：https://docs.astro.build/en/guides/syntax-highlighting