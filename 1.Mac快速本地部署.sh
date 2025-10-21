#!/bin/bash

# 适用于在安装了 Node.js 和 Git（可选，推荐）之后，快速部署 Hexo 博客的脚本

# 设置 Hexo 项目路径
HEXO_PATH="$HOME/Documents/GitHub/hoochanlon.github.io"
cd "$HEXO_PATH" || exit

# 检查依赖是否完整
echo "正在检查依赖是否完整..."
npm ls --depth=0 > /dev/null 2>&1
ERR=$?

echo "npm ls 返回值：$ERR"

if [ $ERR -ne 0 ]; then
    echo "依赖不完整，执行 npm install..."
    npm install
    # 启动 Hexo 本地服务
    osascript -e 'tell app "Terminal" to do script "cd '$HEXO_PATH' && hexo clean && hexo g && gulp && hexo s"'
else
    echo "依赖完整，无需安装。"
fi

# 保留窗口并启动 Hexo 本地服务
echo "正在启动 Hexo 本地服务..."
osascript -e 'tell app "Terminal" to do script "cd '$HEXO_PATH' && hexo clean && hexo g && gulp && hexo s"'
