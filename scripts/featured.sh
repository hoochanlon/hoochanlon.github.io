#!/usr/bin/env bash
# 精选文章管理工具
# - 集中列出所有 featured: true 的文章（按 featuredWeight 降序）
# - 交互式调整 featuredWeight（越大越靠前，主页精选区按此排序）
#
# 文章不挪位、URL 零影响；精选状态完全由 frontmatter 标记。
#
# 用法：
#   scripts/featured.sh            # 交互模式：列表 + 改权重
#   scripts/featured.sh --list     # 仅列表，不进入交互
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTENT_DIR="$ROOT_DIR/content/posts"
map_file=""  # 全局：供 EXIT trap 在 main 返回后清理

# 颜色
if [[ -t 1 ]]; then
  B='\033[1m'; DIM='\033[2m'; CYAN='\033[36m'; YEL='\033[33m'; GRN='\033[32m'; RED='\033[31m'; R='\033[0m'
else
  B=''; DIM=''; CYAN=''; YEL=''; GRN=''; RED=''; R=''
fi

# 扫描 content/posts 下所有 .md，提取 frontmatter 字段，筛选 featured: true
# 输出（TAB 分隔）：weight \t title \t date \t filepath
scan_featured() {
  find "$CONTENT_DIR" -name "*.md" -print0 | while IFS= read -r -d '' f; do
    awk -v file="$f" '
      BEGIN { in_fm=0; featured=""; weight=""; title=""; date="" }
      /^---[[:space:]]*$/ {
        in_fm++
        if (in_fm == 2) {
          if (featured == "true") {
            w = (weight == "" ? "0" : weight)
            printf "%s\t%s\t%s\t%s\n", w, title, date, file
          }
          exit
        }
        next
      }
      in_fm == 1 {
        line = $0
        sub(/^[[:space:]]+/, "", line)
        if (line ~ /^featured:/) {
          val = line; sub(/^featured:[[:space:]]*/, "", val)
          sub(/[[:space:]]*#.*$/, "", val); sub(/[[:space:]]+$/, "", val)
          featured = val
        } else if (line ~ /^featuredWeight:/) {
          val = line; sub(/^featuredWeight:[[:space:]]*/, "", val)
          sub(/[[:space:]]*#.*$/, "", val); sub(/[[:space:]]+$/, "", val)
          weight = val
        } else if (line ~ /^title:/) {
          val = line; sub(/^title:[[:space:]]*/, "", val)
          gsub(/^["'"'"']/, "", val); gsub(/["'"'"']$/, "", val)
          title = val
        } else if (line ~ /^date:/) {
          val = line; sub(/^date:[[:space:]]*/, "", val)
          sub(/[[:space:]]*#.*$/, "", val); sub(/[[:space:]]+$/, "", val)
          date = val
        }
      }
    ' "$f"
  done
}

# 渲染列表，同时把「编号:路径」写入临时映射文件供交互查询
render_list() {
  local map_file="$1"
  : > "$map_file"
  printf "\n${B}精选文章列表${R}（按 featuredWeight 降序，越大越靠前）\n"
  printf "${DIM}──────────────────────────────────────────────────────────────────────${R}\n"
  printf "${B}%-4s %-6s %-12s %-40s %s${R}\n" "序号" "权重" "日期" "标题" "路径"
  printf "${DIM}──────────────────────────────────────────────────────────────────────${R}\n"
  local idx=1
  scan_featured | sort -t$'\t' -k1,1nr | while IFS=$'\t' read -r weight title date filepath; do
    local rel="${filepath#$ROOT_DIR/}"
    # 标题过长截断
    local t="$title"; ((${#t} > 36)) && t="${t:0:35}…"
    printf "%-6s %-8s %-14s %-38s ${DIM}%s${R}\n" "[$idx]" "$weight" "${date:0:10}" "$t" "$rel"
    echo "$idx:$filepath" >> "$map_file"
    idx=$((idx + 1))
  done
  printf "${DIM}──────────────────────────────────────────────────────────────────────${R}\n"
}

# 修改某文件 frontmatter 的 featuredWeight
# 若字段不存在，则在 featured: 行后插入
set_weight() {
  local filepath="$1" new_w="$2"
  if grep -qE '^[[:space:]]*featuredWeight:' "$filepath"; then
    sed -i '' -E "s/^([[:space:]]*featuredWeight:[[:space:]]*).*/\1${new_w}/" "$filepath"
  else
    # 在 featured: 行后插入 featuredWeight
    sed -i '' -E "/^[[:space:]]*featured:.*/a\\
featuredWeight: ${new_w}
" "$filepath"
  fi
}

main() {
  if [[ ! -d "$CONTENT_DIR" ]]; then
    printf "${RED}✗ 内容目录不存在：$CONTENT_DIR${R}\n" >&2
    exit 1
  fi

  map_file="$(mktemp -t featured_map.XXXXXX)"  # 赋值到全局，供 trap 清理
  trap 'rm -f "$map_file"' EXIT

  render_list "$map_file"

  # 仅列表模式
  if [[ "${1:-}" == "--list" ]]; then
    return 0
  fi

  # 交互模式
  local count
  count="$(wc -l < "$map_file" | tr -d ' ')"
  if [[ "$count" == "0" ]]; then
    printf "${YEL}未找到 featured: true 的文章。${R}\n"
    return 0
  fi

  echo
  while true; do
    printf "${CYAN}输入序号调整权重（1-%s），或 q 退出：${R}" "$count"
    read -r choice
    case "$choice" in
      q|Q|quit|exit) printf "${GRN}已退出。${R}\n"; break ;;
      ''|*[!0-9]*) printf "${RED}无效输入，请输入数字或 q。${R}\n"; continue ;;
    esac
    if (( choice < 1 || choice > count )); then
      printf "${RED}序号超出范围（1-%s）。${R}\n" "$count"
      continue
    fi
    local target
    target="$(grep "^${choice}:" "$map_file" | head -1 | cut -d: -f2-)"
    [[ -z "$target" ]] && { printf "${RED}未找到对应文件。${R}\n"; continue; }

    local cur_w
    cur_w="$(awk -v f="$target" '
      BEGIN{in_fm=0;w=""}
      /^---[[:space:]]*$/{in_fm++;if(in_fm==2)exit;next}
      in_fm==1 && /^[[:space:]]*featuredWeight:/{w=$0;sub(/^[^:]*:[[:space:]]*/,"",w);sub(/[[:space:]]*#.*$/,"",w);sub(/[[:space:]]+$/,"",w)}
    ' "$target")"
    cur_w="${cur_w:-（未设置）}"
    local tname
    tname="$(awk -v f="$target" '
      BEGIN{in_fm=0;t=""}
      /^---[[:space:]]*$/{in_fm++;if(in_fm==2)exit;next}
      in_fm==1 && /^[[:space:]]*title:/{t=$0;sub(/^[^:]*:[[:space:]]*/,"",t);gsub(/^["'"'"']/,"",t);gsub(/["'"'"']$/,"",t)}
    ' "$target")"

    printf "${B}文章：${R}%s\n" "$tname"
    printf "${B}当前权重：${R}%s  ${DIM}(越大越靠前)${R}\n" "$cur_w"
    printf "${CYAN}输入新权重（直接回车跳过）：${R}"
    read -r new_w
    [[ -z "$new_w" ]] && { printf "${DIM}已跳过。${R}\n"; continue; }
    if [[ ! "$new_w" =~ ^[0-9]+$ ]]; then
      printf "${RED}权重需为非负整数。${R}\n"
      continue
    fi

    set_weight "$target" "$new_w"
    printf "${GRN}✓ 已更新 featuredWeight = %s${R}\n" "$new_w"
    printf "${DIM}%s${R}\n" "${target#$ROOT_DIR/}"

    # 刷新列表
    echo
    render_list "$map_file"
    echo
  done
}

main "$@"
