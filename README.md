# hoochanlon.github.io

**主站（推荐）：** https://hoochanlon.github.io

* [短代码](https://jpanther.github.io/congo/zh-hans/docs/shortcodes/)
* [富文本](https://jpanther.github.io/congo/samples/rich-content/)

<p align="center">
  <img width="710" alt="blog" src="https://cdn.jsdelivr.net/gh/hoochanlon/hoochanlon.github.io@main/static/design/blog.png">
</p>

**Lighthouse Score**

<p align="center">
    <img width="710" alt="Lighthouse Score" src="https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/imgs/special/lighthouse-score.svg">
</p>

## 域名

- 长期入口用 `https://hoochanlon.github.io/`，不依赖会过期的自定义域。
- `baseURL` 固定 github.io；**不要**提交 `static/CNAME`。
- 静态资源用根相对路径，避免页和资源不在同一域名导致裂图/无样式。
- 若 Pages 仍绑着 `blog.hoochanlon.moe`：Settings → Pages → Custom domain → **Remove**。

### 自定义域过期

内容在 GitHub，域名过期不影响 `github.io` 访问。  
Pages 里若还挂着旧域就 Remove；DNS 记录可顺手删掉。外链仍指向旧域会失效，属正常。

## 本地 / 部署

```bash
hugo server -D          # 需 Hugo Extended
npm install             # 仅压图脚本需要（生成 package-lock.json 后可提交，CI 会走 npm ci）
npm run optimize-images # 批量压 content/static/assets 大图（可先 :dry）
```

推送 `main` 后 Actions 会先装 `sharp`、跑 `optimize-images`，再 `hugo` 发布。  
本地若装不了 npm 依赖，可只依赖 CI 压图；源文件仍会在 runner 里被压缩进 `public/`。


