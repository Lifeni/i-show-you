# 快速开始

**注意：目前应用还处于测试阶段，可能会出现一些不可预料的问题，包括但不限于数据丢失、程序崩溃、浏览器卡死等问题，请不要储存重要数据！**

## 前提

推荐使用 Docker Compose 进行部署。

在执行下面的步骤之前请确保机器上装有比较新的 Docker 以及 Docker Compose，目前镜像仅支持 Linux 的 amd64 版本。

## 安装与运行

1. 下载仓库中的 [docker-compose.yml](https://github.com/Lifeni/i-show-you/blob/master/build/docker-compose.yml) 文件到你自己的机器，最好新建一个单独的 `文件夹` 然后把文件放进去。

   <details>
     <summary>docker-compose.yml</summary>

   <br/>

   [点这里下载](https://raw.githubusercontent.com/Lifeni/i-show-you/master/build/docker-compose.yml)。

   ```yml
   version: '3'

   services:
     mongo:
       image: mongo:latest
       container_name: i-show-you-mongo
       restart: always
       # ports:
       #   - 27017:27017
       volumes:
         - data:/data/db
       networks:
         - network

     app:
       image: lifeni/i-show-you:latest
       container_name: i-show-you-app
       restart: always
       ports:
         - 8080:8080
       volumes:
         - ./configs:/app/configs
       networks:
         - network
       depends_on:
         - mongo

   volumes:
     data:

   networks:
     network:
   ```

   <br/>

   </details>

2. 新建 [main.yml](https://github.com/Lifeni/i-show-you/blob/master/configs/main.yml) 文件，放在 `文件夹/configs/main.yml` ，内容如下。

   <details>
     <summary>main.yml 及字段说明</summary>

   <br/>

   ```yml
   database:
     host: mongo
     port: 27017

   app:
     history:
       enable: true
       save_period: 60

     admin:
       enable: true
       try_count: 3
       ban_period: 120

   secret:
     jwt_key:
       file: # your_file_key
       admin: # your_admin_key

     admin: # your_admin_password
   ```

   默认情况下只需要添加 secret 中的三个配置即可：

   - `jwt_key.file` 用于加密文件所有者的 JWT 的秘钥
   - `jwt_key.admin` 用于加密管理员页面的 JWT 的秘钥
   - `admin` 管理员页面登录密码

   <br/>

   </details>

   详细配置请查看文档 [配置 | I Show You](https://lifeni.github.io/i-show-you/config/) 。

3. 在 `文件夹` 下执行下面的命令启动容器。

   ```shell
   docker-compose up -d
   ```

   `-d` 命令代表后台执行，去掉可以查看实时输出。

4. 打开 [http://localhost:8080](http://localhost:8080) 或者反向代理 8080 端口，查看前端页面。

   > 注意：应用默认暴露 8080 端口，如果出现端口冲突，或者你想使用自己的 MongoDB，可以自行修改 yml 文件来更换端口。
