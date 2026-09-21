#!/usr/bin/env python3
"""
想法页清松手写体：单文件完整版本，优化秒开体验。

产物：
  static/fonts/jason-handwriting1/ideas-full.woff2
  static/fonts/jason-handwriting1/ideas-full.css

策略：
- 将站点所有用到的汉字打包成单个 woff2 文件
- 配合 preload 实现真正的秒开体验
- 避免多chunk导致的网络瀑布流延迟
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT_SRC = Path("/tmp/jason-font/full.woff2")
CONTENT_DIR = ROOT / "content"
OUT_DIR = ROOT / "static/fonts/jason-handwriting1"
FAMILY = "JasonHandwriting1"
PUNCT = "，。！？：；、""''（）【】《》…—·、．￥"


def load_available(font_path: Path) -> set[int]:
    """加载字体文件中所有可用的字符码位"""
    font = TTFont(font_path)
    try:
        return set((font.getBestCmap() or {}).keys())
    finally:
        font.close()


def collect_site_chars(available: set[int]) -> set[int]:
    """收集站点内容中所有用到的字符"""
    used: set[int] = set()
    
    # 基础字符：ASCII + 标点
    used.update(range(0x20, 0x7F))
    used.update(ord(ch) for ch in PUNCT)
    
    # 统计站点内所有中文字符和全角字符
    for path in CONTENT_DIR.rglob("*.md"):
        text = path.read_text(encoding="utf-8", errors="replace")
        # 移除 front matter
        text = re.sub(r"^---.*?---\s*", "", text, flags=re.S)
        for ch in text:
            cp = ord(ch)
            # CJK统一汉字
            if 0x4E00 <= cp <= 0x9FFF:
                used.add(cp)
            # 全角ASCII和全角符号 (！＂＃等)
            elif 0xFF01 <= cp <= 0xFF5E:
                used.add(cp)
            # 全角空格
            elif cp == 0x3000:
                used.add(cp)
    
    # 只保留字体中实际存在的字符
    used = {cp for cp in used if cp in available}
    return used


def write_subset(src: Path, dst: Path, unicodes: set[int]) -> int:
    """裁切字体文件"""
    font = TTFont(src)
    opts = Options()
    opts.layout_features = ["*"]
    opts.desubroutinize = True
    opts.hinting = False
    opts.flavor = "woff2"
    subsetter = Subsetter(options=opts)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    dst.parent.mkdir(parents=True, exist_ok=True)
    font.save(dst)
    font.close()
    return dst.stat().st_size


def unicode_range_css(unicodes: set[int]) -> str:
    """生成 unicode-range CSS 属性值"""
    ordered = sorted(unicodes)
    ranges: list[str] = []
    start = prev = ordered[0]
    for cp in ordered[1:]:
        if cp == prev + 1:
            prev = cp
            continue
        ranges.append(format_range(start, prev))
        start = prev = cp
    ranges.append(format_range(start, prev))
    return ",".join(ranges)


def format_range(start: int, end: int) -> str:
    """格式化单个 unicode 范围"""
    if start == end:
        return f"U+{start:X}"
    return f"U+{start:X}-{end:X}"


def write_css(unicodes: set[int]) -> Path:
    """生成 CSS @font-face 规则"""
    css_content = f"""/* Generated for ideas page: single-file full version */
@font-face {{
  font-family: "{FAMILY}";
  src: url("./ideas-full.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  unicode-range: {unicode_range_css(unicodes)};
}}
"""
    css_path = OUT_DIR / "ideas-full.css"
    css_path.write_text(css_content, encoding="utf-8")
    return css_path


def main() -> None:
    if not FONT_SRC.exists():
        raise SystemExit(f"缺少源字体文件: {FONT_SRC}")
    
    print("正在加载字体...")
    available = load_available(FONT_SRC)
    print(f"字体包含 {len(available)} 个字符")
    
    print("正在扫描站点内容...")
    used_chars = collect_site_chars(available)
    print(f"站点使用了 {len(used_chars)} 个字符")
    
    # 生成单文件字体
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    woff2_path = OUT_DIR / "ideas-full.woff2"
    print(f"正在生成 {woff2_path.name}...")
    file_size = write_subset(FONT_SRC, woff2_path, used_chars)
    print(f"✓ {woff2_path.name}: {len(used_chars)} 字符, {file_size / 1024:.1f} KB")
    
    # 生成 CSS
    css_path = write_css(used_chars)
    print(f"✓ {css_path.name}: {css_path.stat().st_size / 1024:.1f} KB")
    
    print("\n完成！现在更新 HTML 中的引用即可。")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
