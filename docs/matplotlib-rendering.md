# Matplotlib 渲染系统

自动将 Markdown 中的 matplotlib 代码块渲染成图片的完整解决方案。

## 工作流程

```
Markdown 文件（含标记的代码块）
  ↓
预处理脚本扫描并执行 Python 代码
  ↓
生成图片到 static/generated-plots/
  ↓
替换代码块为 Hugo shortcode
  ↓
Hugo 构建并部署
```

## 使用方法

### 1. 在 Markdown 中标记代码块

使用 `matplotlib` 标记来标识需要渲染的 Python 代码块：

````markdown
```python matplotlib
import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(10, 6))
x = np.linspace(0, 10, 100)
ax.plot(x, np.sin(x), label='sin(x)')
ax.plot(x, np.cos(x), label='cos(x)')
ax.legend()
ax.set_title('三角函数图像')

# OUT 变量会被自动设置，也可以手动指定
# 如果不设置，脚本会自动添加
fig.savefig(OUT, bbox_inches='tight', dpi=150)
plt.close(fig)
```
````

或者简写：

````markdown
```matplotlib
from pathlib import Path
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
fig.savefig(OUT)
plt.close(fig)
```
````

### 2. 本地预览

在项目根目录运行：

```bash
# 检查会处理哪些文件（不实际执行）
python scripts/render_matplotlib.py --dry-run

# 实际渲染
python scripts/render_matplotlib.py
```

生成的图片会保存在 `static/generated-plots/` 目录，文件名基于代码内容的哈希值。

### 3. 开发模式热加载

直接运行：

```bash
# 推荐：直接使用项目级开发入口
pnpm dev

# 如果希望输入 hugo dev，需要让项目内包装器优先于系统 Hugo
PATH="$PWD/bin:$PATH" hugo dev
```

这个命令会同时启动：

- `hugo serve`：负责页面、模板、CSS 的热更新
- `fswatch` 监听：内容或渲染脚本变化时，自动重跑 `scripts/render_matplotlib.py`
- `scripts/dev-giscus.sh`：本地 giscus 预览

开发时你只需要改 Markdown 里的 matplotlib 代码，保存后会自动重新渲染成 PNG，再由 Hugo 触发页面刷新。

如果本机没有 `fswatch`，`dev.sh` 仍然可以启动 Hugo，但 matplotlib 这一层不会自动重跑，需要手动执行 `python scripts/render_matplotlib.py`。

### 4. 自动化部署

1. **输出路径**：使用 `OUT` 变量或让脚本自动处理
2. **关闭图形**：记得调用 `plt.close(fig)` 避免内存泄漏
3. **中文字体**：脚本会自动检测系统字体，支持 macOS 和 Linux
4. **超时限制**：单个代码块执行时间不超过 30 秒

## 高级用法

### 自定义图片显示

shortcode 支持额外参数：

```markdown
{{< matplotlib src="/generated-plots/matplotlib_abc123.png" 
    alt="自定义图片描述" 
    caption="图1：这是图表说明文字" >}}
```

### 手动引用已生成的图片

如果不想每次都重新执行代码，可以：

1. 运行一次生成图片
2. 记下图片路径
3. 手动使用 shortcode 引用

## 架构特点

### 职责分离
- **预处理脚本**：代码执行、图片生成
- **Hugo shortcode**：图片展示、样式控制
- **GitHub Actions**：自动化集成

### 缓存机制
- 基于代码内容哈希生成文件名
- 相同代码不会重复渲染
- 图片可以版本控制

### 跨平台兼容
- 自动检测 macOS / Linux 字体
- 适配不同的系统路径
- 统一的输出格式

## 故障排除

### 图片未生成
- 检查代码是否有语法错误
- 确保调用了 `fig.savefig(OUT)`
- 查看脚本输出的错误信息

### 中文显示为方框
- macOS：确保系统安装了 PingFang 或宋体
- Linux：安装 `fonts-noto-cjk` 包

### 本地测试失败
```bash
# 安装依赖
pip install matplotlib

# 检查 Python 版本（需要 3.8+）
python --version
```

## 文件结构

```
.
├── scripts/
│   └── render_matplotlib.py      # 核心渲染脚本
├── layouts/
│   └── shortcodes/
│       └── matplotlib.html        # Hugo shortcode
├── assets/css/custom/
│   └── matplotlib.css             # 样式文件
├── static/
│   └── generated-plots/           # 生成的图片（自动创建）
└── .github/workflows/
    └── hugo.yml                   # CI/CD 配置
```

## 未来扩展

可以轻松扩展支持其他绘图库：
- Plotly（交互式图表）
- Seaborn（统计可视化）
- Graphviz（图论可视化）
- D3.js（数据驱动文档）
