#!/usr/bin/env python3
"""本站日记脚手架：填标题 → 选形态 → 按当天日期落盘。

用法（仓库根目录）:
  python create.py 今日随笔
  python create.py              # 交互问标题
  python create.py --date 2026-03-15 补记

形态（会询问，除非显式指定）:
  1  单文件   …/2026-07-20-标题.md          # 无封面时常用
  2  bundle  …/2026-07-20-标题/index.md     # 需要 feature 封面时
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent
CONTENT_POSTS = ROOT / "content" / "posts"
TZ = ZoneInfo("Asia/Shanghai")

_BAD = re.compile(r'[\\/:*?"<>|\x00-\x1f]')


def decade_bucket(year: int) -> str:
    return f"{year // 10 * 10}s"


def safe_title_segment(title: str) -> str:
    s = title.strip()
    s = _BAD.sub("", s)
    s = re.sub(r"\s+", "-", s)
    s = s.strip(".-")
    if not s:
        raise SystemExit("标题为空或清洗后为空")
    return s


def ensure_section_index(dir_path: Path, title: str) -> None:
    dir_path.mkdir(parents=True, exist_ok=True)
    index = dir_path / "_index.md"
    if index.exists():
        return
    index.write_text(
        f"""---
title: "{title}"
build:
  render: never
  list: never
  publishResources: false
---
""",
        encoding="utf-8",
    )
    print(f"  + {index.relative_to(ROOT)}")


def front_matter(title: str, when: datetime, *, bundle: bool = False) -> str:
    date_s = when.strftime("%Y-%m-%dT%H:%M:%S%z")
    if len(date_s) >= 5 and date_s[-5] in "+-" and date_s[-3] != ":":
        date_s = date_s[:-2] + ":" + date_s[-2:]
    slug = when.strftime("%Y%m%d%H%M%S")
    title_esc = title.replace("\\", "\\\\").replace('"', '\\"')
    # bundle 才有同目录封面资源；coverCaption 留给 Congo 封面说明
    cover_line = '\ncoverCaption: ""' if bundle else ""
    return f"""---
title: "{title_esc}"
date: {date_s}
draft: true
slug: "{slug}"
categories: ["随笔"]
tags: []
summary: ""
featured: false{cover_line}
---
"""


def resolve_when(date_arg: str | None) -> datetime:
    now = datetime.now(TZ)
    if not date_arg:
        return now
    raw = date_arg.strip().replace(".", "-").replace("/", "-")
    parts = [p for p in raw.split("-") if p]
    if len(parts) != 3:
        raise SystemExit(f"无法解析 --date: {date_arg}")
    y, m, d = (int(parts[0]), int(parts[1]), int(parts[2]))
    return now.replace(year=y, month=m, day=d)


def ask_title(cli_parts: list[str]) -> str:
    title = " ".join(cli_parts).strip()
    if title:
        return title
    if not sys.stdin.isatty():
        raise SystemExit("请提供标题，例如: python create.py 今日随笔")
    try:
        title = input("文章标题: ").strip()
    except EOFError:
        title = ""
    if not title:
        raise SystemExit("标题不能为空")
    return title


def ask_kind(cli_kind: str | None, leaf: str) -> str:
    """返回 'flat' | 'bundle'。未指定 --flat/--bundle 时询问。"""
    if cli_kind in ("flat", "bundle"):
        return cli_kind

    print()
    print("生成形态（多数文章无封面选 1）:")
    print(f"  1) 单文件  {leaf}.md")
    print(f"  2) bundle  {leaf}/index.md   ← 需要 feature 封面图时")
    print("  直接回车 = 1")
    try:
        choice = input("选择 [1/2]: ").strip()
    except EOFError:
        choice = ""

    if choice in ("", "1"):
        return "flat"
    if choice == "2":
        return "bundle"
    raise SystemExit("无效选择，请输入 1 或 2")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="按当天日期创建本站 Hugo 日记（交互选择单文件 / bundle）"
    )
    parser.add_argument("title", nargs="*", help="文章标题")
    kind = parser.add_mutually_exclusive_group()
    kind.add_argument(
        "--flat",
        action="store_const",
        const="flat",
        dest="kind",
        help="非交互：单文件 …/YYYY-MM-DD-标题.md",
    )
    kind.add_argument(
        "--bundle",
        action="store_const",
        const="bundle",
        dest="kind",
        help="非交互：page bundle …/YYYY-MM-DD-标题/index.md",
    )
    parser.add_argument(
        "--date",
        metavar="YYYY-MM-DD",
        help="写作日（默认今天 Asia/Shanghai）",
    )
    args = parser.parse_args()

    title = ask_title(args.title)
    when = resolve_when(args.date)
    year, month = when.year, when.month
    bucket = decade_bucket(year)
    day = when.strftime("%Y-%m-%d")
    leaf = f"{day}-{safe_title_segment(title)}"
    kind_val = ask_kind(args.kind, leaf)

    decade_dir = CONTENT_POSTS / bucket
    year_dir = decade_dir / f"{year}"
    month_dir = year_dir / f"{month:02d}"

    ensure_section_index(decade_dir, bucket)
    ensure_section_index(year_dir, str(year))
    ensure_section_index(month_dir, f"{year}-{month:02d}")

    body = front_matter(title, when, bundle=(kind_val == "bundle"))
    if kind_val == "flat":
        target = month_dir / f"{leaf}.md"
        if target.exists():
            raise SystemExit(f"已存在: {target.relative_to(ROOT)}")
        target.write_text(body, encoding="utf-8")
    else:
        bundle = month_dir / leaf
        target = bundle / "index.md"
        if target.exists():
            raise SystemExit(f"已存在: {target.relative_to(ROOT)}")
        if bundle.exists():
            raise SystemExit(f"已存在目录: {bundle.relative_to(ROOT)}")
        bundle.mkdir(parents=True, exist_ok=False)
        target.write_text(body, encoding="utf-8")

    print(f"已创建: {target.relative_to(ROOT)}")
    print("预览:   hugo server -D")
    print(
        f"URL:    /posts/{year}/{when.strftime('%Y%m%d%H%M%S')}/  (slug；draft 需 -D)"
    )


if __name__ == "__main__":
    main()
