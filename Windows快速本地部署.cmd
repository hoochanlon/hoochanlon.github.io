@echo off
SETLOCAL EnableDelayedExpansion

:: �������ڰ�װ�� Node.js �� Git����ѡ���Ƽ��� ֮�󣬿��ٲ��� Hexo ���͵Ľű�

:: ���� Hexo ��Ŀ·��
SET HEXO_PATH=%USERPROFILE%\Documents\GitHub\hoochanlon.github.io
cd /d !HEXO_PATH!

:: ��������Ƿ�����
echo ���ڼ�������Ƿ�����...
cmd /c "npm ls --depth=0 >nul 2>nul"
SET ERR=!ERRORLEVEL!
echo npm ls ����ֵ��!ERR!

IF !ERR! NEQ 0 (
    echo ������������ִ�� npm install...
    npm install
   start cmd /k "cd /d %HEXO_PATH% && hexo clean && hexo g && gulp && hexo s"
) ELSE (
    echo �������������谲װ��
)

:: �������ڲ����� Hexo ���ط���
echo �������� Hexo ���ط���...
start cmd /k "cd /d %HEXO_PATH% && hexo clean && hexo g && gulp && hexo s"
ENDLOCAL

