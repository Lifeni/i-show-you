# 配置

配置文件夹在执行 `docker-compose.yml` 的那个文件夹下，名字为 configs。

默认情况下这个文件中不会有文件，需要自己新建文件。

## main.yml

这个文件是主要的配置文件。

```yml
server:
  jwt-secret:
    file: golang
    admin: password

admin:
  password: 1234
```

| 字段                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| server.jwt-secret.file  | 为文件创建者的 JWT 加密秘钥，用于验证文件的创建者（只有创建者才可以修改文件） |
| server.jwt-secert.admin | 后台管理页面的 JWT 加密秘钥，用于验证管理员权限              |
| admin.password          | 后台管理页面的密码                                           |

