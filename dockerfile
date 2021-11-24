# pull alpine linux
FROM alpine
RUN apk update
RUN apk add ruby
RUN mkdir -p /writen/_posts && gem install rake
# 宿主机复制多个文件到镜像
COPY ["./Rakefile","_posts","/writen/_posts/"]
# 容器文件夹复制到宿主机
# `docker cp 89f4a3cc45d9:/writen/ /Users/chanlonhoo/Desktop/`