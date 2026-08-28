# Matplotlib 自动渲染系统 ✨

已成功为你的博客集成 matplotlib 自动渲染功能！

## 🎯 核心功能

将 Markdown 中标记的 Python matplotlib 代码块自动渲染成图片，并在博客中展示。

## 📦 已完成的集成

### 1. 预处理脚本
- **位置**：`scripts/render_matplotlib.py`
- **功能**：扫描 Markdown、执行代码、生成图片
- **特性**：基于代码哈希的缓存机制，避免重复渲染

### 2. Hugo Shortcode
- **位置**：`layouts/shortcodes/matplotlib.html`
- **功能**：展示生成的图片，支持懒加载和响应式

### 3. 样式文件
- **位置**：`assets/css/custom/matplotlib.css`
- **功能**：美化图片展示，支持深色模式

### 4. CI/CD 集成
- **位置**：`.github/workflows/hugo.yml`
- **功能**：在部署前自动渲染所有 matplotlib 代码块

## 🚀 使用示例

在 Markdown 中添加代码块，用 `matplotlib` 标记：

````markdown
```python matplotlib
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.set_title('简单示例')
fig.savefig(OUT)  # OUT 变量自动设置
plt.close(fig)
```
````

推送到 GitHub 后，会自动渲染并部署。

## ✅ 测试结果

```
📊 统计: 找到 1 个代码块，成功渲染 1 个
生成的图片: static/generated-plots/matplotlib_98e280d9788c.png (595KB)
```

## 📚 详细文档

查看 `docs/matplotlib-rendering.md` 获取完整使用说明。

## 🔧 本地开发

```bash
# 推荐：直接使用项目级开发入口
pnpm dev

# 如果希望输入 hugo dev，需要让项目内包装器优先于系统 Hugo
PATH="$PWD/bin:$PATH" hugo dev

# 安装依赖
pip install matplotlib

# 渲染所有代码块
python scripts/render_matplotlib.py

# 预览（不实际执行）
python scripts/render_matplotlib.py --dry-run
```

## 🎨 架构特点

- **职责分离**：渲染逻辑与内容展示分离
- **缓存优化**：相同代码不重复渲染
- **跨平台**：自动适配 macOS/Linux 字体
- **自动化**：推送即部署，无需手动操作

---

现在你可以在任何文章中使用这个功能了！🎉
