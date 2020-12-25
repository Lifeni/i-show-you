<p align="center">
  <img width="150px" alt="Logo" src="logo.svg" />
</p>

<h1 align="center">I Show You</h1>
<p align="center">一个关于数据展示与分享的 Web 应用，可自行部署</p>
<p align="center"><a href="README.md">English</a> | 中文</p>

## 介绍

**应用处于测试阶段，数据结构与 API 设计可能会发生变动，请不要储存重要数据。**

- [x] 💻 现代化的界面，基于 IBM 的 Carbon 设计系统。
- [x] 🚀 可以自托管，使用 docker-compose 构建自己的应用。
- [ ] 📱 移动界面友好, 支持响应式设计和渐进式 Web 应用。
- [ ] 🌐 支持国际化，目前支持中文、英文以及 Emoji。
- [ ] // TODO

## 快速开始

推荐使用 Docker Compose 进行部署。

1. 下载仓库中的 `docker-compose.yml` 文件到你自己的机器，最好选择一个单独的文件夹，因为应用的配置文件会存放在 `文件夹/configs/main.yml` 中。
   
2. 新建 `main.yml` 文件，放在 `文件夹/configs/main.yml` ，内容如下。

    ```yml
    server:
      jwt-secret:
        file: golang
        admin: password
    
    admin:
          password: 1234
	```
    
    详细配置请查看文档 [配置 | I Show You](https://lifeni.github.io/i-show-you/config/) 。
    
3. 在文件夹下执行下面的命令启动容器。

    ```shell
    docker-compose up -d
    ```

    `-d` 命令代表后台执行，去掉可以查看实时输出。
    
> 注意：应用默认暴露 8080 端口，如果出现端口冲突，或者你想使用自己的 MongoDB，可以自行修改 yml 文件。

## 文档

文档正在编写中。

文档在 https://lifeni.github.io/i-show-you 。

## 演示

应用还处于开发状态，数据可能会被随时删除。

演示在 https://i-show-you.dev.lifeni.life 。

## 遇到问题

### 你的设备可能不支持编辑（Your device may not support editing）

应用使用  [Monaco Editor](https://microsoft.github.io/monaco-editor/) 作为编辑器，而这个编辑器目前并不支持移动浏览器和移动框架。如果仍要进行编辑，可能会出现无法删除、文字丢失等问题。

关于 Monaco Editor 的更多信息，可以查看 [microsoft/monaco-editor: A browser based code editor](https://github.com/Microsoft/monaco-editor#monaco-editor) 。

## 开发配置

// TODO

### 前提

- 前端部分: Node 14+, Yarn
- 后端部分: Go 1.15+, MongoDB

### 配置

#### 前端

进入项目文件夹，并安装依赖：

```shell script
cd webapp && yarn
```

启动开发服务器：

```shell script
yarn start
```

#### 文档

进入项目文件夹，并安装依赖：

```shell script
cd docs && yarn
```

启动开发服务器：

```shell script
yarn docs:dev
```

## 开源协议

MIT License
