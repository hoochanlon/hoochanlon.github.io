#!/usr/bin/env python3
"""
Matplotlib 代码块预渲染脚本

扫描 content/ 下的 Markdown 文件，查找标记为 matplotlib 的代码块，
执行代码生成图片，并替换为图片引用。

用法：
    python scripts/render_matplotlib.py [--dry-run]
"""

import hashlib
import re
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Tuple

# 项目根目录
ROOT = Path(__file__).parent.parent
CONTENT_DIR = ROOT / "content"
STATIC_DIR = ROOT / "static"
OUTPUT_DIR = STATIC_DIR / "generated-plots"
RENDERER_VERSION = "2026-08-27-v2"

# matplotlib 代码块模式：```python matplotlib 或 ```matplotlib
PATTERN = re.compile(
    r'```(?:[^\n`]*\s+)?matplotlib\s*\n(.*?)```',
    re.DOTALL | re.MULTILINE
)

RENDER_BLOCK_PATTERN = re.compile(
    r'^\n*(?:<!-- matplotlib-render:start -->.*?<!-- matplotlib-render:end -->\n*)',
    re.DOTALL,
)


def ensure_output_dir():
    """确保输出目录存在"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def code_hash(code: str) -> str:
    """生成代码的哈希值作为文件名"""
    payload = f"{RENDERER_VERSION}\n{code}"
    return hashlib.sha256(payload.encode()).hexdigest()[:12]


CJK_FONT_BOOTSTRAP = r'''
from pathlib import Path as _MatplotlibRenderPath

import matplotlib.pyplot as _matplotlib_render_plt
from matplotlib import font_manager as _matplotlib_render_fm
from matplotlib import rcParams as _matplotlib_render_rcParams

_matplotlib_render_font_candidates = [
    # Windows：中文 + 日文常见字体
    r'C:/Windows/Fonts/msyh.ttc',
    r'C:/Windows/Fonts/msyhbd.ttc',
    r'C:/Windows/Fonts/simhei.ttf',
    r'C:/Windows/Fonts/simsun.ttc',
    r'C:/Windows/Fonts/meiryo.ttc',
    r'C:/Windows/Fonts/YuGothM.ttc',
    r'C:/Windows/Fonts/msgothic.ttc',
    # macOS：中文 + 日文常见字体
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/Supplemental/Songti.ttc',
    '/System/Library/Fonts/Supplemental/Hiragino Sans GB.ttc',
    '/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc',
    '/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc',
    '/Library/Fonts/Arial Unicode.ttf',
    # Linux / GitHub Actions：推荐安装 fonts-noto-cjk
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
    '/usr/share/fonts/opentype/noto/NotoSansCJKsc-Regular.otf',
    '/usr/share/fonts/opentype/noto/NotoSansCJKjp-Regular.otf',
    '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc',
]

_matplotlib_render_font_path = next(
    (font for font in _matplotlib_render_font_candidates if _MatplotlibRenderPath(font).exists()),
    None,
)

if _matplotlib_render_font_path:
    _matplotlib_render_fm.fontManager.addfont(_matplotlib_render_font_path)
    CJK_FONT_PROP = _matplotlib_render_fm.FontProperties(fname=_matplotlib_render_font_path)
    CJK_FONT_NAME = CJK_FONT_PROP.get_name()
    _matplotlib_render_rcParams['font.family'] = CJK_FONT_NAME
    _matplotlib_render_rcParams['font.sans-serif'] = [CJK_FONT_NAME]
else:
    CJK_FONT_PROP = None
    CJK_FONT_NAME = 'sans-serif'

_matplotlib_render_rcParams['axes.unicode_minus'] = False
'''


def content_date_for_file(md_path: Path) -> str:
    """提取文章日期，优先使用文件名里的 YYYY-MM-DD。"""
    match = re.search(r'(\d{4}-\d{2}-\d{2})', md_path.name)
    if match:
        return match.group(1)
    return datetime.fromtimestamp(md_path.stat().st_mtime).strftime('%Y-%m-%d')


def inject_after_imports(code: str, injection: str) -> str:
    """把注入内容插到导入语句后面，尽量不打断原始代码结构。"""
    lines = code.splitlines()
    insert_at = 0

    for index, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith(('import ', 'from ')) or not stripped:
            insert_at = index + 1
            continue
        break

    return '\n'.join(lines[:insert_at] + [injection.strip()] + lines[insert_at:])


def build_render_block(img_url: str) -> str:
    return (
        "\n\n<!-- matplotlib-render:start -->\n"
        f"{{{{< matplotlib src=\"{img_url}\" >}}}}\n"
        "<!-- matplotlib-render:end -->\n"
    )


def adapt_code_for_rendering(code: str, output_path: Path) -> str:
    code = re.sub(
        r'OUT\s*=\s*Path\([\'"].*?[\'"]\)',
        f'OUT = Path("{output_path}")',
        code,
    )

    code = re.sub(
        r"rcParams\s*\[\s*['\"]font\.family['\"]\s*\]\s*=\s*[^\n]+",
        "rcParams['font.family'] = CJK_FONT_NAME",
        code,
    )
    code = re.sub(
        r"plt\.rcParams\s*\[\s*['\"]font\.family['\"]\s*\]\s*=\s*[^\n]+",
        "plt.rcParams['font.family'] = CJK_FONT_NAME",
        code,
    )

    if 'OUT = Path' not in code:
        code = inject_after_imports(code, f'OUT = Path("{output_path}")')

    return inject_after_imports(code, CJK_FONT_BOOTSTRAP)



def execute_matplotlib_code(code: str, output_path: Path) -> bool:
    """
    在临时环境中执行 matplotlib 代码
    返回是否成功
    """
    adapted_code = adapt_code_for_rendering(code, output_path)
    
    # 创建临时 Python 文件
    with tempfile.NamedTemporaryFile(
        mode='w', suffix='.py', delete=False, encoding='utf-8'
    ) as f:
        f.write(adapted_code)
        temp_file = Path(f.name)
    
    try:
        # 执行 Python 脚本
        result = subprocess.run(
            [sys.executable, str(temp_file)],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            print(f"❌ 执行失败: {result.stderr}", file=sys.stderr)
            return False
        
        if not output_path.exists():
            print(f"❌ 图片未生成: {output_path}", file=sys.stderr)
            return False
        
        return True
    
    except subprocess.TimeoutExpired:
        print(f"❌ 执行超时", file=sys.stderr)
        return False
    
    finally:
        temp_file.unlink(missing_ok=True)


def process_markdown_file(
    md_path: Path, dry_run: bool = False
) -> Tuple[int, int]:
    """
    处理单个 Markdown 文件
    返回 (找到的代码块数, 成功渲染的数量)
    """
    content = md_path.read_text(encoding='utf-8')
    matches = list(PATTERN.finditer(content))
    
    if not matches:
        return 0, 0
    
    print(f"\n📄 {md_path.relative_to(ROOT)}")
    
    replacements = []
    success_count = 0
    
    article_date = content_date_for_file(md_path)

    for match in matches:
        code = match.group(1).strip()
        code_id = code_hash(code)
        
        # 生成图片文件名
        img_filename = f"{article_date}-{code_id}.png"
        img_path = OUTPUT_DIR / img_filename
        img_url = f"/generated-plots/{img_filename}"
        
        print(f"  🔍 发现代码块 {code_id}...", end=" ")
        
        if img_path.exists():
            print("✓ 已存在")
            success_count += 1
        elif dry_run:
            print("⏭️  跳过 (dry-run)")
        else:
            # 执行代码生成图片
            if execute_matplotlib_code(code, img_path):
                print("✅ 生成成功")
                success_count += 1
            else:
                print("❌ 生成失败")
                continue
        
        existing_render = RENDER_BLOCK_PATTERN.match(content[match.end():])
        span_end = match.end() + (existing_render.end() if existing_render else 0)
        replacement = content[match.start():match.end()] + build_render_block(img_url)
        replacements.append((match.start(), span_end, replacement))
    
    # 执行替换（从后向前，避免位置偏移）
    if replacements and not dry_run:
        new_content = content
        for start, end, replacement in reversed(replacements):
            new_content = new_content[:start] + replacement + new_content[end:]
        
        # 只在内容真正变化时才写入，避免触发 Hugo 无意义的重建
        if new_content != content:
            md_path.write_text(new_content, encoding='utf-8')
            print(f"  💾 已更新 Markdown 文件")
        else:
            print(f"  ✓ 内容无变化，跳过写入")
    
    return len(matches), success_count


def main():
    import argparse
    parser = argparse.ArgumentParser(description='渲染 Markdown 中的 matplotlib 代码块')
    parser.add_argument('--dry-run', action='store_true', help='仅检查，不执行')
    args = parser.parse_args()
    
    ensure_output_dir()
    
    print("🚀 开始扫描 Markdown 文件...")
    
    # 递归查找所有 .md 文件
    md_files = list(CONTENT_DIR.rglob("*.md"))
    total_blocks = 0
    total_success = 0
    
    for md_file in md_files:
        blocks, success = process_markdown_file(md_file, args.dry_run)
        total_blocks += blocks
        total_success += success
    
    print(f"\n{'='*60}")
    print(f"📊 统计: 找到 {total_blocks} 个代码块，成功渲染 {total_success} 个")
    
    if args.dry_run:
        print("⚠️  这是 dry-run 模式，未实际修改文件")
    
    return 0 if total_success == total_blocks else 1


if __name__ == "__main__":
    sys.exit(main())
