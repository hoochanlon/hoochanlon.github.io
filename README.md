# hoochanlon.github.io

个人博客「无声的多数」· Hugo + [Congo](https://github.com/jpanther/congo) · GitHub Pages（Actions 部署）

**正式访问地址（推荐、长期稳定）：**  
https://hoochanlon.github.io/

不想折腾主题了…

**Lighthouse Score**

<p align="center">
    <img width="710" alt="Lighthouse Score" src="https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/imgs/special/lighthouse-score.svg">
</p>

---

## 域名策略（推荐做法）

| 用途 | 地址 | 说明 |
| --- | --- | --- |
| **主站 / 书签 / 分享** | `https://hoochanlon.github.io/` | 随 GitHub 账号走，不依赖付费域名 |
| 自定义域 `blog.hoochanlon.moe` | **不作为主入口** | 会过期；且易和 `baseURL`、HTTPS 纠缠出裂图/无样式 |

仓库内约定：

- `config/_default/hugo.toml` 的 `baseURL` = `https://hoochanlon.github.io/`
- **不要**再提交 `static/CNAME`（有 CNAME 时 Pages 会把自定义域当主站）
- CSS / JS / 图片等静态资源使用**根相对路径**（`/css/...`、`/img/...`），避免「页在 A 域、资源写死 B 域」

### 你需要在 GitHub 网页上做的一步（必做）

截图里若仍显示 Custom domain = `blog.hoochanlon.moe`，请：

1. 打开仓库 **Settings → Pages**
2. **Custom domain** 一栏点 **Remove**（不要只改仓库代码）
3. 确认 **Build and deployment → Source** = **GitHub Actions**
4. 等部署完成后，用无痕窗口打开：  
   https://hoochanlon.github.io/  
   - 地址栏应**停在** `hoochanlon.github.io`，不要再 301 到 `blog.hoochanlon.moe`  
   - 头像、精选封面应正常（与页面同域）

未 Remove 时：即使 `baseURL` 已是 github.io，访问 `github.io` 仍可能被重定向到自定义域，裂图/HTTP 警告会继续出现。

### 为何会出现裂图 / 无样式（备忘）

- 页在 `blog.hoochanlon.moe`，图/CSS 绝对地址却是 `hoochanlon.github.io` → 跨域或国内访问 github.io 失败 → **裂图**
- 用 `http://` 打开自定义域，资源却是 `https://` 且带 `integrity` → 浏览器 SRI/CORS 拦截 → **无样式**
- Firefox「未使用 HTTPS」：整站走了明文 `http://`，与内容对错无关，换 `https://` 或只用 github.io 即可

---

## 自定义域名过期时怎么处理

**站点本身：不用慌。**  
内容在 GitHub 仓库 + Pages 上；过期的是 DNS 域名，不是博客数据。

| 情况 | 做什么 |
| --- | --- |
| 域名到期、不再续费 | **什么都不用改仓库**也能继续用 `https://hoochanlon.github.io/` |
| Pages 里还挂着过期域名 | Settings → Pages → Custom domain → **Remove** |
| 仓库里又出现了 `static/CNAME` | 删掉并提交；以后不要为过期域再加回来 |
| DNS / Cloudflare 解析还在 | 可删掉指向 GitHub 的 A/CNAME 记录（可选清理） |
| 外链、朋友圈还是旧域名 | 能改则改成 github.io；改不了的会打不开，属预期 |
| 以后又买了新域名想挂上 | ① Pages 填新域并按 GitHub 文档配 DNS ② 再决定是否写 `static/CNAME` ③ **更稳妥仍是 github.io 做 `baseURL`，资源保持根相对路径** |

**不要**在域名快过期或证书未就绪时，把 `baseURL` 改成自定义域再全站分享——容易再次出现 HTTP/证书/跨域资源问题。

---

## 本地预览

```bash
# 需 Hugo Extended（版本可与 .github/workflows/hugo.yml 对齐）
hugo server -D
```

浏览器打开终端提示的本地地址即可。

## 部署

- 推送到 `main` → Actions 工作流 `Deploy Hugo site to Pages` 自动构建并发布
- 手动：Actions 里对该 workflow 选 **Run workflow**

---

## 目录要点

| 路径 | 作用 |
| --- | --- |
| `config/_default/` | 站点与菜单等配置 |
| `content/` | 文章与页面 |
| `layouts/` | 站点级覆盖（404、资源根相对路径等） |
| `static/` | 直接拷贝的静态文件（勿放会绑死过期域的 CNAME） |
| `themes/congo/` | 主题（vendoring 进仓，非 submodule） |
| `.github/workflows/hugo.yml` | Pages 构建与发布 |
