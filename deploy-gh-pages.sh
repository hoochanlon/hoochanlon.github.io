# 确保脚本抛出遇到的错误
set -e

cd _site

if [ -d ".git" ];then
  rm -rf  .git
fi
# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME
# 脚本参考 http://wmm66.com/index/article/detail/id/62.html

git init
git add .
sudo git commit -m 'deploy'
git remote add origin https://github.com/hoochanlon/hoochanlon.github.io.git
git checkout -b gh-pages
sudo git push origin gh-pages -f

cd -