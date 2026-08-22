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
hugo server -D           # 需 Hugo Extended
pnpm install             # 仅压图需要；生成 pnpm-lock.yaml 后建议提交
pnpm optimize-images     # 压 content/static/assets 大图（可先 :dry）
```

### 图片压缩

- 脚本：`pnpm optimize-images`（sharp；最长边 >1600 会缩小，有明显收益才写回）
- 本地跑会**改仓库里的原图**；提交后仓库与线上都变小
- 推 `main` 时 CI 也会压一遍，但只作用于构建产物，**不会**回写 git

### Dependabot

对于个人 Hugo 博客 来说，关掉或大幅收紧 Dependabot 通常更合适。

| 点         | 说明                                          |
| :--------- | :-------------------------------------------- |
| 站点本质   | 内容站，不是长期维护的 npm 应用               |
| 噪音来源   | 主要是 `themes/congo` 的主题开发依赖          |
| 收益有限   | 合这些 PR 几乎不提升站点安全，还可能弄乱主题  |
| 真正该管的 | Hugo 版本、主题大版本、根目录 `sharp`（偶尔） |

主题 `themes/congo` 自带 npm 清单时，Dependabot 容易对主题依赖刷 PR，一般**不要合并**（跟上游主题即可）。

少 PR：仓库 **Settings → Code security / Advanced Security → Dependabot**  

- 关 **security updates**（自动开 PR 的主开关）  
- **version updates** 保持关，不要 Enable  
- alerts 可留可关  

按钮写 **Disable** = 当前已开；写 **Enable** = 当前已关。旧 PR 需手动 Close。


