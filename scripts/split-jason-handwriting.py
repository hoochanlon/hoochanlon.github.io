#!/usr/bin/env python3
"""
想法页清松手写体：常用字首包 + 按字频粗切片。

产物：
  static/fonts/jason-handwriting1/first.woff2
  static/fonts/jason-handwriting1/chunk-NN.woff2
  static/fonts/jason-handwriting1/result.css

首包覆盖 ASCII / 中文标点 / 站点最高频 300 汉字，供 preload。
其余站内汉字按字频切成约 400 字一片。不切生僻字，缺字回落到霞鹜。
"""

from __future__ import annotations

import argparse
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
FIRST_HAN = 300
CHUNK_HAN = 400
PUNCT = "，。！？：；、“”‘’（）【】《》…—·、．￥"


def load_available(font_path: Path) -> set[int]:
    font = TTFont(font_path)
    try:
        return set((font.getBestCmap() or {}).keys())
    finally:
        font.close()


def ordered_site_han(available: set[int] | None = None) -> list[int]:
    counts: Counter[int] = Counter()
    for path in CONTENT_DIR.rglob("*.md"):
        text = path.read_text(encoding="utf-8", errors="replace")
        text = re.sub(r"^---.*?---\s*", "", text, flags=re.S)
        for ch in text:
            if "\u4e00" <= ch <= "\u9fff":
                counts[ord(ch)] += 1
    ordered = [cp for cp, _ in counts.most_common()]
    if available is not None:
        ordered = [cp for cp in ordered if cp in available]
    return ordered


def base_unicodes(available: set[int] | None = None) -> set[int]:
    base = set(range(0x20, 0x7F))
    base.update(ord(ch) for ch in PUNCT)
    if available is not None:
        base = {cp for cp in base if cp in available}
    return base


def write_subset(src: Path, dst: Path, unicodes: set[int]) -> int:
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
    if start == end:
        return f"U+{start:X}"
    return f"U+{start:X}-{end:X}"


def face_rule(filename: str, unicodes: set[int]) -> str:
    return (
        "@font-face{"
        f'font-family:"{FAMILY}";'
        f'src:url("./{filename}")format("woff2");'
        "font-style:normal;font-weight:400;font-display:swap;"
        f"unicode-range:{unicode_range_css(unicodes)}"
        "}"
    )


def chunked(items: list[int], size: int) -> list[list[int]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def plan_sets(available: set[int] | None = None) -> tuple[set[int], list[set[int]]]:
    common = ordered_site_han(available)
    first = set(base_unicodes(available))
    first.update(common[:FIRST_HAN])
    remaining = [cp for cp in common[FIRST_HAN:] if cp not in first]
    chunks = [set(group) for group in chunked(remaining, CHUNK_HAN)]
    return first, chunks


def write_css(first: set[int], chunks: list[set[int]]) -> Path:
    faces = [face_rule("first.woff2", first)]
    for index, unicodes in enumerate(chunks, start=1):
        faces.append(face_rule(f"chunk-{index:02d}.woff2", unicodes))
    css_path = OUT_DIR / "result.css"
    css_path.write_text(
        "/* Generated for ideas page: first pack + frequency chunks */\n"
        + "".join(faces)
        + "\n",
        encoding="utf-8",
    )
    return css_path


def expected_files(chunk_count: int) -> set[str]:
    names = {"first.woff2", "result.css"}
    names.update(f"chunk-{index:02d}.woff2" for index in range(1, chunk_count + 1))
    return names


def prune_extra(keep: set[str]) -> None:
    for path in OUT_DIR.iterdir():
        if path.name not in keep:
            path.unlink()
            print(f"removed extra {path.name}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--css-only",
        action="store_true",
        help="只根据站点用字写 result.css，不重新裁切 woff2",
    )
    args = parser.parse_args()

    if not args.css_only and not FONT_SRC.exists():
        raise SystemExit(f"missing source font: {FONT_SRC}")

    available = None if args.css_only else load_available(FONT_SRC)
    first, chunks = plan_sets(available)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if not args.css_only:
        for old in OUT_DIR.glob("*.woff2"):
            old.unlink()
        first_size = write_subset(FONT_SRC, OUT_DIR / "first.woff2", first)
        print(f"first: {len(first)} cps, {first_size / 1024:.1f} KB")
        for index, unicodes in enumerate(chunks, start=1):
            name = f"chunk-{index:02d}.woff2"
            size = write_subset(FONT_SRC, OUT_DIR / name, unicodes)
            print(f"{name}: {len(unicodes)} cps, {size / 1024:.1f} KB")

    css_path = write_css(first, chunks)
    prune_extra(expected_files(len(chunks)))
    print(f"faces: {1 + len(chunks)}")
    print(f"css: {css_path.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
