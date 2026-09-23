#!/usr/bin/env python3
"""从 UTF-8 文本文件生成 WOFF2 字体子集。"""

from __future__ import annotations

import argparse
import os
import shlex
import sys
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont


def read_text(paths: list[Path], inline_text: list[str]) -> str:
    parts = [path.read_text(encoding="utf-8-sig") for path in paths]
    parts.extend(inline_text)
    return "\n".join(parts)


def subset_font(source: Path, output: Path, text: str, ignore_missing: bool) -> tuple[int, int]:
    requested = {ord(char) for char in text if char not in "\r\n\t"}
    if not requested:
        raise ValueError("输入文本没有可用于子集的字符")

    with TTFont(source) as font:
        cmap = font.getBestCmap() or {}
        available = requested & cmap.keys()
        missing = sorted(requested - cmap.keys())
        if missing and not ignore_missing:
            rendered = "".join(chr(codepoint) for codepoint in missing)
            raise ValueError(f"字体不包含这些字符（{len(missing)} 个）：{rendered}")
        if not available:
            raise ValueError("输入字符均不受源字体支持")

        options = Options()
        options.flavor = "woff2"
        options.layout_features = ["*"]
        subsetter = Subsetter(options=options)
        subsetter.populate(unicodes=available)
        subsetter.subset(font)
        font.flavor = "woff2"

        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_name(f".{output.name}.{os.getpid()}.tmp")
        try:
            font.save(temporary)
            temporary.replace(output)
        finally:
            temporary.unlink(missing_ok=True)

    return len(available), len(missing)


def prompt(label: str) -> str:
    entered = input(label).strip()
    if entered.lower() == "q":
        raise KeyboardInterrupt
    return entered


def confirm(label: str, default: bool) -> bool:
    while True:
        entered = prompt(label).lower()
        if not entered:
            return default
        if entered in {"y", "yes"}:
            return True
        if entered in {"n", "no"}:
            return False
        print("请输入 y 或 n。")


def parse_entered_path(value: str) -> Path:
    parts = shlex.split(value)
    return Path(parts[0] if len(parts) == 1 else value).expanduser()


def prompt_path(label: str) -> Path:
    while True:
        entered = prompt(f"{label}（可拖入文件，输入 q 取消）: ")
        if not entered:
            print("请提供路径。")
            continue
        try:
            path = parse_entered_path(entered)
        except (ValueError, OSError):
            print("无法识别路径，请重试。")
            continue
        if path.is_file():
            return path
        print(f"文件不存在：{path}")


def interactive_text() -> str:
    while True:
        choice = prompt("文本来源 [1] 文本文件  [2] 直接粘贴: ")
        if choice in {"1", "2"}:
            break
        print("请输入 1 或 2。")

    if choice == "1":
        return read_text([prompt_path("文本文件")], [])

    print("粘贴文本，完成后在新的一行输入 .")
    lines: list[str] = []
    while True:
        line = input()
        if line == ".":
            return "\n".join(lines)
        if line.lower() == "q":
            raise KeyboardInterrupt
        lines.append(line)


def interactive_main() -> int:
    print("字体子集生成器（输入 q 可取消）")
    try:
        source = prompt_path("源字体文件")
        text = interactive_text()
        output = source.with_name(f"{source.stem}-subset.woff2")
        entered = prompt(f"输出文件 [{output}]（回车使用默认路径）: ")
        try:
            output = parse_entered_path(entered) if entered else output
        except (ValueError, IndexError):
            print("无法识别输出路径。", file=sys.stderr)
            return 1
        if source.resolve() == output.resolve():
            print("输出路径不能覆盖源字体。", file=sys.stderr)
            return 1

        requested = {ord(char) for char in text if char not in "\r\n\t"}
        if not requested:
            print("文本没有可用于子集的字符。", file=sys.stderr)
            return 1
        with TTFont(source) as font:
            available = requested & (font.getBestCmap() or {}).keys()
        missing = requested - available
        print(f"将纳入 {len(available)} 个字符；源字体缺少 {len(missing)} 个字符。")
        if missing:
            print("缺少字符：" + "".join(chr(codepoint) for codepoint in sorted(missing)))
            print("缺字会由浏览器回退到其他字体显示。")
        if not available:
            print("输入文本中没有源字体支持的字符。", file=sys.stderr)
            return 1

        if output.exists() and not confirm("输出文件已存在，覆盖吗？[y/N] ", default=False):
            print("已取消，未覆盖现有文件。")
            return 0
        if not confirm(f"生成 {output}？[Y/n] ", default=True):
            print("已取消。")
            return 0
        included, skipped = subset_font(source, output, text, ignore_missing=True)
        print(f"生成完成：{output}（{included} 个字符，{output.stat().st_size:,} 字节）")
        if skipped:
            print(f"未纳入 {skipped} 个源字体不支持的字符。")
        return 0
    except (EOFError, KeyboardInterrupt):
        print("\n已取消。")
        return 130
    except (OSError, UnicodeError, ValueError, KeyError, ImportError) as error:
        print(f"错误：{error}", file=sys.stderr)
        return 1


def main() -> int:
    if len(sys.argv) == 1:
        return interactive_main()

    parser = argparse.ArgumentParser(
        description="按 UTF-8 文本中的字符，从 TTF/OTF/WOFF/WOFF2 字体生成 WOFF2 子集。"
    )
    parser.add_argument("font", type=Path, help="源字体文件")
    parser.add_argument(
        "text_files",
        nargs="*",
        type=Path,
        help="一个或多个 UTF-8 文本文件；也可仅使用 --text 传入简短文本",
    )
    parser.add_argument(
        "--text",
        action="append",
        default=[],
        help="直接追加文本，可重复指定；通常建议将大段文本放入文件",
    )
    parser.add_argument("-o", "--output", required=True, type=Path, help="输出 WOFF2 文件")
    parser.add_argument(
        "--ignore-missing",
        action="store_true",
        help="忽略源字体不支持的字符；默认遇到缺字时报错",
    )
    args = parser.parse_args()

    if not args.font.is_file():
        parser.error(f"源字体不存在：{args.font}")
    if not args.text_files and not args.text:
        parser.error("请提供至少一个文本文件或 --text")

    absent = [path for path in args.text_files if not path.is_file()]
    if absent:
        parser.error("文本文件不存在：" + ", ".join(map(str, absent)))
    if args.font.resolve() == args.output.resolve():
        parser.error("输出路径不能覆盖源字体")
    if args.output.exists():
        parser.error(f"输出文件已存在，为避免覆盖请指定新路径：{args.output}")

    try:
        text = read_text(args.text_files, args.text)
        included, missing = subset_font(args.font, args.output, text, args.ignore_missing)
    except (OSError, UnicodeError, ValueError, KeyError, ImportError) as error:
        print(f"错误：{error}", file=sys.stderr)
        return 1

    print(f"已生成：{args.output}（{included} 个字符，{args.output.stat().st_size:,} 字节）")
    if missing:
        print(f"已忽略源字体不支持的字符：{missing} 个")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
