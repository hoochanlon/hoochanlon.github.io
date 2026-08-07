#!/usr/bin/env bash
# 启动本地 giscus 主题预览服务（HTTPS + CORS），让 hugo serve 时能实时看到
# static/giscus/*.css 的改动。详见 scripts/serve-giscus.py 顶部说明。
#
# 用法：
#   scripts/dev-giscus.sh           # 启动预览服务（前台，Ctrl+C 退出）
#   另开一个终端跑：hugo serve       # 站点本身
# 然后浏览器开 http://localhost:1313/posts/... ，评论区就会用本地 CSS。
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PORT="${1:-8443}"
CERT_DIR="certs"
# mkcert localhost 127.0.0.1 ::1 → localhost+2.pem / localhost+2-key.pem
CERT="$CERT_DIR/localhost+2.pem"
KEY="$CERT_DIR/localhost+2-key.pem"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "✗ 未安装 mkcert。请先运行：brew install mkcert" >&2
  exit 1
fi

# 首次运行：生成 localhost 证书（mkcert -install 只需做一次，见下方提示）
if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
  mkdir -p "$CERT_DIR"
  echo "→ 生成 localhost 证书到 $CERT_DIR/ …"
  (cd "$CERT_DIR" && mkcert localhost 127.0.0.1 "::1")
fi

if ! security find-certificate -c "mkcert" /Library/Keychains/System.keychain >/dev/null 2>&1 \
   && ! security find-certificate -c "mkcert" ~/Library/Keychains/login.keychain-db >/dev/null 2>&1; then
  echo "⚠️  似乎还没运行过 \`mkcert -install\`（浏览器不信任证书的话 giscus 会加载失败）。"
  echo "    请另开终端执行（一次性，需 sudo）： ! mkcert -install"
  echo
fi

echo "→ 启动 giscus 主题预览 https://localhost:$PORT …"
echo "  编辑 static/giscus/*.css 后刷新页面即可看到变化。"
exec python3 scripts/serve-giscus.py "$PORT" "$CERT" "$KEY"
