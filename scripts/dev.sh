#!/usr/bin/env bash
# 一键启动本地开发环境：giscus 主题预览 + hugo serve + matplotlib 热加载
# - 启动前自动清理残留进程（避免端口冲突）
# - 输出带颜色前缀（[giscus] 青 / [hugo] 黄 / [render] 绿），方便区分
# - Content/脚本/模板变更时，自动重跑 matplotlib 预渲染
# - Ctrl+C 同时关闭所有服务，互不残留
#
# 用法：
#   scripts/dev.sh
set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

GISCUS_PORT=8443
HUGO_PORT=1313

CYAN='\033[36m'
YELLOW='\033[33m'
GREEN='\033[32m'
RESET='\033[0m'

prefix() {
  awk -v l="$1" -v c="$2" -v r="$RESET" '{printf "%s[%s]%s %s\n", c, l, r, $0; fflush()}'
}


render_matplotlib() {
  printf "${GREEN}→ 重跑 matplotlib 预渲染${RESET}\n"
  if python3 scripts/render_matplotlib.py; then
    printf "${GREEN}✓ matplotlib 预渲染完成${RESET}\n"
  else
    printf "${YELLOW}⚠️  matplotlib 预渲染失败${RESET}\n"
  fi
}

watch_matplotlib() {
  if ! command -v fswatch >/dev/null 2>&1; then
    printf "${YELLOW}⚠️  未找到 fswatch，热加载仅保留 Hugo 自身能力${RESET}\n"
    return 0
  fi

  printf "${GREEN}→ 启动 matplotlib 文件监听${RESET}\n"
  fswatch -0 "${WATCH_ROOTS[@]}" \
    | while IFS= read -r -d '' changed; do
        case "$changed" in
          *.md|*.html|*.css|*.py|*.mjs|*.sh)
            if [[ "$changed" =~ $WATCH_EXTENSIONS ]]; then
              printf "${CYAN}[watch]${RESET} 变化: %s\n" "$changed"
              render_matplotlib
            fi
            ;;
        esac
      done
}

cleanup() {
  echo
  printf "${YELLOW}→ 关闭服务…${RESET}\n"
  pkill -9 -f "serve-giscus.py" 2>/dev/null || true
  pkill -9 -f "hugo serve" 2>/dev/null || true
  pkill -9 -f "fswatch" 2>/dev/null || true
  sleep 0.3
  printf "${GREEN}✓ 已关闭${RESET}\n"
}
trap cleanup EXIT

# 启动前清理可能残留的端口占用
pre_clean() {
  for port in "$GISCUS_PORT" "$HUGO_PORT"; do
    if lsof -ti :"$port" >/dev/null 2>&1; then
      printf "${YELLOW}⚠️  端口 %s 被占用，清理中…${RESET}\n" "$port"
      lsof -ti :"$port" | xargs kill -9 2>/dev/null || true
    fi
  done
  sleep 0.3
}

main() {
  printf "${GREEN}→ 启动本地开发环境${RESET}\n"
  pre_clean
  render_matplotlib

  # 后台启动 giscus 主题预览
  printf "${GREEN}→ giscus 预览: https://localhost:%s${RESET}\n" "$GISCUS_PORT"
  scripts/dev-giscus.sh 2>&1 | prefix "giscus" "$CYAN" &

  # 后台启动 matplotlib 预渲染监听
  watch_matplotlib 2>&1 | prefix "render" "$GREEN" &

  # 前台启动 hugo（阻塞，Ctrl+C 退出后触发 cleanup）
  printf "${GREEN}→ hugo 站点:  http://localhost:%s${RESET}\n" "$HUGO_PORT"
  hugo serve 2>&1 | prefix "hugo" "$YELLOW"
}

main "$@"
