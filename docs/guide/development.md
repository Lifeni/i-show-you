# 开发配置

## 前提

- 前端：Node 14+, Yarn
- 后端：Go 1.15+
- 数据库：MongoDB
- 可选：Nginx, Docker

应用使用 Echo（Golang 框架）来托管前端文件（8080 端口），默认（生产）情况下需要将生成的静态文件放置到 /server 文件夹的 /public 目录下，但是这样不适合开发环境，因为 React 的开发服务器默认使用 3000 端口，而不是生成静态文件。

所以在开发时，推荐使用 Nginx 作为反向代理的服务器，将 `/` 路径代理到 3000 端口的 `/`，将 `/api` 路径代理到 8080 端口的 `/api`，再将 `/websocket` 路径代理到 8080 端口的 `/websocket`，绕过 Echo 的托管。我使用的 [nginx.conf](configs/nginx.conf) 可以在项目的 /configs 文件夹中找到，默认托管 80 端口，仅供参考使用。

另外开发环境下需要自己启动一个 MongoDB，这里推荐使用 Docker 进行安装。

```shell
docker run -d -p 27017:27017 mongo
```

## 配置

1. 克隆项目，进入项目文件夹。

   ```shell
   git clone https://github.com/Lifeni/i-show-you.git
   cd i-show-you
   ```

2. 安装前端依赖。

   ```shell
   cd webapp
   yarn
   ```

3. 在配置好 Nginx 与 MongoDB 之后，运行 Go 程序。

   ```shell
   cd ../server
   go run .
   ```

   不要忘了命令最后的点。如果可以正常运行，则会出现 Echo 的字符画 Logo 以及 `Connected to database` 的字样。之后打开 Nginx 配置中设定的地址即可（如果使用我提供的配置文件，则默认地址为 http://localhost ，也就是本地 80 端口）。