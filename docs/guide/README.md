# 指南

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



// TODO