<p align="center">
  <img width="150px" alt="Logo" src="logo.svg" />
</p>

<h1 align="center">I Show You</h1>
<p align="center">一个关于数据展示与分享的 Web 应用，可自行部署</p>
<p align="center"><a href="README.md">English</a> | 中文</p>

## 介绍

> **应用处于测试阶段，数据结构与 API 设计可能会发生变动，请不要储存重要数据。**

这是一个用于分享文本、代码等数据的 Web 应用，类似 Gist。

- **🍺 还算好用的功能**

  为现代浏览器设计，支持多标签页切换、代码高亮、文件预览、历史记录、自动保存、自动更新文件内容等功能。

- **🎨 好看的界面**

  细节讲究，使用 IBM 的 Carbon 设计系统，同时适配移动端界面。

- **🚀 可以自己部署**

  使用 Docker Compose 进行部署和统一管理，只需根据文档编写好配置文件即可运行，同时提供部分自定义选项。

应用使用 React / TypeScript 与 Echo / Golang 实现，数据库使用的是 MongoDB，不支持 IE 11 及其他过时浏览器。

## 演示

演示在 https://i-show-you.dev.lifeni.life 。

应用还处于开发状态，数据可能会被随时删除，**请不要在演示网站上储存重要数据或者将网站用于违法用途**。

## 快速开始

推荐使用 Docker Compose 进行部署。

在执行下面的步骤之前请确保机器上装有比较新的 Docker 以及 Docker Compose，目前镜像仅支持 Linux 的 amd64 版本。

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

## 文档

文档正在编写中。

文档在 https://lifeni.github.io/i-show-you 。

## 遇到问题

#### 你的设备可能不支持编辑（Your device may not support editing）

应用使用 [Monaco Editor](https://microsoft.github.io/monaco-editor/) 作为编辑器，而这个编辑器目前并不支持移动浏览器和移动框架。如果仍要进行编辑，可能会出现无法删除、文字丢失等问题。

关于 Monaco Editor 的更多信息，可以查看 [microsoft/monaco-editor: A browser based code editor](https://github.com/Microsoft/monaco-editor#monaco-editor) 。

#### PC 上输入中文的时候会漏字

如果你用的是 QQ 拼音输入法，则可能会出现这个问题，切换到搜狗输入法或者微软输入法即可解决。

## 截图

![主页](https://file.lifeni.life/dashboard/i-show-you/0.webp)

![文件编辑页](https://file.lifeni.life/dashboard/i-show-you/1.webp)

![文件分享页面](https://file.lifeni.life/dashboard/i-show-you/2.webp)

![文件设置](https://file.lifeni.life/dashboard/i-show-you/3.webp)

![文件历史](https://file.lifeni.life/dashboard/i-show-you/4.webp)

![删除文件的确认](https://file.lifeni.life/dashboard/i-show-you/5.webp)

![文件预览](https://file.lifeni.life/dashboard/i-show-you/6.webp)

![登录管理页面](https://file.lifeni.life/dashboard/i-show-you/7.webp)

![管理页面](https://file.lifeni.life/dashboard/i-show-you/8.webp)

## 开发配置

开发之前，你需要先配置开发环境：

| 类型   | 要求                 |
| ------ | -------------------- |
| 前端   | Node 14+, Yarn       |
| 后端   | Go 1.15+             |
| 数据库 | MongoDB              |
| 可选的 | Nginx, Caddy, Docker |

应用使用 Echo（Golang 框架）来托管前端文件（8080 端口），默认（生产）情况下需要将生成的静态文件放置到 /server 文件夹的 /public 目录下，但是这样不适合开发环境，因为 React 的开发服务器默认使用 3000 端口，而不是生成静态文件。

所以在开发时，推荐使用 Nginx（也提供了 Caddy 的配置文件）作为反向代理的服务器，将 `/` 路径代理到 3000 端口的 `/`，将 `/api` 路径代理到 8080 端口的 `/api`，再将 `/websocket` 路径代理到 8080 端口的 `/websocket`，绕过 Echo 的托管。我使用的 [nginx.conf](configs/nginx.conf) 可以在项目的 /configs 文件夹中找到，默认托管 80 端口，仅供参考使用。

另外开发环境下需要自己启动一个 MongoDB，这里推荐使用 Docker 进行安装。

```shell
docker run -d -p 27017:27017 mongo
```

之后你可以启动项目：

1. 克隆项目，进入项目文件夹。

   ```shell
   git clone https://github.com/Lifeni/i-show-you.git
   cd i-show-you
   ```

2. 安装前端依赖。

   ```shell
   cd web
   yarn
   ```

3. 在配置好 Nginx（或者 Caddy）与 MongoDB 之后，运行 Go 程序。

   ```shell
   cd ../server
   go run .
   ```

   不要忘了命令最后的点。如果可以正常运行，则会出现 Echo 的字符画 Logo 以及 `Connected to database` 的字样。之后打开 Nginx（或者 Caddy）配置中设定的地址即可（如果使用我提供的配置文件，则默认地址为 http://localhost ，也就是本地 80 端口）。

## 开源协议

MIT License
