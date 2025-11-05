@echo off
SETLOCAL EnableDelayedExpansion

:: 适用于在安装了 Node.js 和 Git（可选，推荐） 之后，快速部署 Hexo 博客的脚本

:: 设置 Hexo 项目路径
SET HEXO_PATH=%USERPROFILE%\Documents\GitHub\hoochanlon.github.io
cd /d !HEXO_PATH!

:: 检查依赖是否完整
echo 正在检查依赖是否完整...
cmd /c "npm ls --depth=0 >nul 2>nul"
SET ERR=!ERRORLEVEL!
echo npm ls 返回值：!ERR!

IF !ERR! NEQ 0 (
    echo 依赖不完整，执行 npm install...
    npm install
   start cmd /k "cd /d %HEXO_PATH% && hexo clean && hexo g && gulp && hexo s"
) ELSE (
    echo 依赖完整，无需安装。
)

:: 保留窗口并启动 Hexo 本地服务
echo 正在启动 Hexo 本地服务...
start cmd /k "cd /d %HEXO_PATH% && hexo clean && hexo g && gulp && hexo s"
ENDLOCAL

