---
sidebar: auto
---

# 配置

配置文件夹在存放 docker-compose.yml 的那个文件夹下，名字为 configs。

默认情况下这个文件中不会有文件，需要自己新建文件。

## main.yml

这个文件是主要的配置文件。

```yml
# host:                The name of the database configured in docker compose, the default: mongo
# port:                The default MongoDB port: 27017

database:
  host: mongo
  port: 27017

# history:             Record the history of the file
# history.enable:      The default: true
# history.save_period: If the last save was __ (seconds) ago,
#                        save the last save as history, the default: 60

# admin:               Settings related to the administrator page
# admin.enable:        The default: true
# admin.try_count:     Maximum allowed number of attempts for incorrect password,
#                        login will be banned after more than __ attempt(s), the default: 3
# admin.ban_period:    Duration of login banned (minutes), the default: 120

app:
  history:
    enable: true
    save_period: 60

  admin:
    enable: true
    try_count: 3
    ban_period: 120

# jwt_key:             Encryption key used for JWT
# jwt_key.file:        JWT key used to verify file owner
# jwt_key.admin:       JWT key used to authenticate the administrator

# admin:               Administrator page password

secret:
  jwt_key:
    file: your_file_key
    admin: your_admin_key

  admin: your_admin_password
```

### database

数据库相关。

| 字段 | 描述                 | 默认值 |
| ---- | -------------------- | ------ |
| host | 连接数据库的地址 [1] | mongo  |
| port | 连接数据库的端口     | 27017  |

[1] 如果使用 Docker Compose 启动，需要填写配置文件中的数据库名字

### app

应用功能相关。

| 字段                | 描述                                                     | 默认值 |
| ------------------- | -------------------------------------------------------- | ------ |
| history.enable      | 开启历史记录功能                                         | true   |
| history.save_period | 如果上一次修改是 \_\_ 之前，就保存修改前的文件，单位：秒 | 60     |
| admin.enable        | 开启管理员页面                                           | true   |
| admin.try_count     | 密码错误的最大尝试次数                                   | 3      |
| admin.ban_period    | 所有尝试用完后，禁止登录的时间，单位：分钟               | 120    |

### secret

密码相关。

| 字段          | 描述                            | 默认值 |
| ------------- | ------------------------------- | ------ |
| jwt_key.file  | 用于加密文件所有者的 JWT 的秘钥 | -      |
| jwt_key.admin | 用于加密管理员页面的 JWT 的秘钥 | -      |
| admin         | 管理员页面登录密码              | -      |
