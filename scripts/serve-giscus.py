#!/usr/bin/env python3
"""本地 giscus 主题预览服务。

为什么需要它：giscus 用 `<link crossorigin="anonymous">` 加载自定义主题 CSS，
所以本地预览不仅需要 HTTPS（mixed-content 限制），还需要服务端返回 CORS 头。
hugo serve 两者都不提供，于是用这个小服务专门喂 static/giscus/ 下的 CSS。

用法：
  1. 一次性：`mkcert -install`（macOS 需 sudo，把本地 CA 装进系统钥匙串）
  2. `scripts/dev-giscus.sh`            # 自动生成证书并启动本服务
  或手动：
     cd certs && mkcert localhost
     python3 scripts/serve-giscus.py 8443 certs/localhost.pem certs/localhost-key.pem

然后 hugo serve 会因 config/development/params.toml 把 giscus themeBaseURL
指到 https://localhost:8443，编辑 static/giscus/*.css 后刷新页面即可看到。
"""
import http.server
import socketserver
import ssl
import sys
import pathlib
import functools

ROOT = pathlib.Path(__file__).resolve().parent.parent / "static" / "giscus"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8443
CERT = sys.argv[2] if len(sys.argv) > 2 else "localhost.pem"
KEY = sys.argv[3] if len(sys.argv) > 3 else "localhost-key.pem"


class CORSHandler(http.server.SimpleHTTPRequestHandler):
    """Serve static/giscus/ with permissive CORS + no-cache for live editing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def log_message(self, fmt, *args):
        # 简洁日志：只打方法 + 路径
        sys.stderr.write(f"  {self.command} {self.path}\n")


def main():
    if not ROOT.is_dir():
        sys.exit(f"[giscus] 找不到 {ROOT}，请在项目根目录运行")

    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    try:
        ctx.load_cert_chain(CERT, KEY)
    except FileNotFoundError:
        sys.exit(
            f"[giscus] 找不到证书 {CERT}/{KEY}。\n"
            "先运行 `mkcert -install`（一次性），再 `scripts/dev-giscus.sh`。"
        )

    handler = functools.partial(CORSHandler)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
        print(f"[giscus] HTTPS+CORS 服务:  https://localhost:{PORT}")
        print(f"[giscus] 根目录:           {ROOT}")
        print("[giscus] Ctrl+C 退出。编辑 static/giscus/*.css 后刷新页面即可。")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[giscus] 已退出。")


if __name__ == "__main__":
    main()
