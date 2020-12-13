# 配置

// TODO

## main.yml

```yml
server:
  jwt-secret:
    file: golang
    admin: password

admin:
  password: 1234
```

- `server.jwt-secret.file` 为文件创建者的 JWT 加密秘钥，用于验证文件的创建者（只有创建者才可以修改文件）。

- `server.jwt-secert.admin` 为后台管理页面的 JWT 加密秘钥，用于验证管理员权限。

- `admin.password` 为后台管理页面的密码。