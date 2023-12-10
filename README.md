## 开发

```bash
# 进入项目目录
cd ruoyi-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 部署
```bash
# 下载nginx docker镜像
docker pull nginx:1.22.0

# 查看要挂载的目录,选择空间大的
df -h

![Alt text](image.png)

# 创建挂载目录

mkdir -p /disksda/nginx/conf
mkdir -p /disksda/nginx/log
mkdir -p /disksda/nginx/html

![Alt text](image-1.png)

# 创建nginx配置文件
#启动前需要先创建Nginx外部挂载的配置文件（ /disksda/nginx/conf/nginx.conf）
#之所以要先创建 , 是因为Nginx本身容器只存在/etc/nginx 目录 , 本身就不创建 nginx.conf 文件
#当服务器和容器都不存在 nginx.conf 文件时, 执行启动命令的时候 docker会将nginx.conf 作为目录创建 , #这并不是我们想要的结果 。
 
# 先启动容器
docker run --name nginx -p 9001:80 -d nginx
# 将容器nginx.conf文件复制到宿主机
docker cp nginx:/etc/nginx/nginx.conf /disksda/nginx/conf/nginx.conf
# 将容器conf.d文件夹下内容复制到宿主机
docker cp nginx:/etc/nginx/conf.d /disksda/nginx/conf/conf.d
# 将容器中的html文件夹复制到宿主机
docker cp nginx:/usr/share/nginx/html /disksda/nginx/

# 放dist包并创建容器
#先将之前的容器删除
docker rm -f nginx
#将dist文件夹放在服务器的/disksda/nginx/html/test 目录下，这样容器启动之后会将dist文件夹整个复制到容器里面
#修改/disksda/nginx/conf/nginx.conf 配置文件，监听9001端口，注意此端口是容器内部端口，想要访问必须映射端口，目标文件夹则是容器内部之前我们挂载好的/usr/share/nginx/html/test/dist
#最后生成容器
 docker run  --name nginx -p 80:80 -v /disksda/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /disksda/nginx/conf/conf.d:/etc/nginx/conf.d -v /disksda/nginx/log:/var/log/nginx -v /disksda/nginx/html:/usr/share/nginx/html -d nginx:1.22.0
原文链接：https://blog.csdn.net/z_xiaoluan/article/details/127859896
```