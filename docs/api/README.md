---
sidebar: auto
---

# API

应用的部分 API 设计如下，你可以根据自己的需求单独调用。

API 设计采用 RESTful 方案，异常尽量使用 HTTP 自带的状态表示，并包含文字说明与文档链接。部分 API 的设计方式参考自 [GitHub REST API - GitHub Docs](https://docs.github.com/cn/free-pro-team@latest/rest) 。

## `/api`

### `GET` `/ping`

测试服务是否正常。

Request: `GET` `/api/ping`

Response: `200` `TEXT` 

```
pong
```

### `GET` `/file/:id`

获取指定文件。

Request: `GET` `/api/file/:id`

Response: `200` `JSON` 

```json
{
    "message":"Got it",
    "data":{
        "id":"08098f93-0ea4-415d-9d39-7ddef326b9b1",
        "created_at":"2020-12-31T17:07:02.297Z",
        "updated_at":"2020-12-31T17:07:02.297Z",
        "name":"",
        "type":"",
        "content":"",
        "options":{
            "auto_save":true,
            "word_wrap":false,
            "font_family":"'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace",
            "font_size":14,
            "line_height":22,
            "updated_at":"2020-12-31T17:07:02.297Z"
        }
    },
    "authentication":"owner"
}
```

### `GET` `/file/:id/raw`

获取指定文件的内容。

Request: `GET` `/api/file/:id/raw`

Response: `200` `TEXT` 

```
File content ...
```

### `GET` `/file/:id/history`

获取指定文件的修改历史。

Request: `GET` `/api/file/:id/history`

Response: `200` `JSON` 

其中 data 为一个数组，对应文件的多次历史。

```json
{
    "message": "Got it", 
    "data": [
        {
            "id": "d21396b0-2375-4fd6-b25e-b5f724257ca0", 
            "created_at": "2020-12-25T09:08:46.701Z", 
            "updated_at": "2020-12-25T09:08:57.901Z", 
            "name": "Test.js", 
            "type": "text", 
            "content": "...", 
            "options": {
                "auto_save": true, 
                "word_wrap": false, 
                "font_family": "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace", 
                "font_size": 14, 
                "line_height": 22, 
                "updated_at": "2020-12-25T09:08:46.701Z"
            }
        }, 
        {
            "id": "d21396b0-2375-4fd6-b25e-b5f724257ca0", 
            "created_at": "2020-12-25T09:08:46.701Z", 
            "updated_at": "2020-12-29T14:15:59.558Z", 
            "name": "Test.js", 
            "type": "text", 
            "content": "...", 
            "options": {
                "auto_save": true, 
                "word_wrap": false, 
                "font_family": "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace", 
                "font_size": 14, 
                "line_height": 22, 
                "updated_at": "2020-12-25T09:08:46.701Z"
            }
        }
    ]
}
```

### `POST` `/file`

新建文件。

Request: `POST` `/api/file`

Body: `JSON`

```json
{
    "created_at": "2021-01-03T06:26:42.134Z", 
    "updated_at": "2021-01-03T06:26:42.134Z", 
    "name": "", 
    "type": "", 
    "content": "", 
    "options": {
        "auto_save": true, 
        "word_wrap": false, 
        "font_family": "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace", 
        "font_size": 14, 
        "line_height": 22, 
        "updated_at": "2021-01-03T06:26:42.134Z"
    }
}
```

Response: `200` `JSON` 

```json
{
    "message": "Got it", 
    "data": {
        "id": "92bcbd08-3793-4cd4-b76e-9e09e7a5363e", 
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I"
    }
}
```

### `PUT` `/file/:id`

更新整个文件（按 Ctrl + S 时）。

Request: `PUT` `/api/file/:id` `需要身份验证`

Headers: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I
```

Body: `JSON`

```json
{
    "updated_at": "2021-01-03T06:37:03.863Z", 
    "content": "...", 
    "name": "123.txt", 
    "type": "Text", 
    "options": {
        "auto_save": true, 
        "word_wrap": false, 
        "font_family": "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace", 
        "font_size": 14, 
        "line_height": 22, 
        "updated_at": "2021-01-03T06:26:42.134Z"
    }
}
```

Response: `200` `JSON` 

```json
{
    "message": "Updated"
}
```

### `PATCH` `/file/:id/:key`

更新部分文件，根据 `key` 判断要更新哪一部分。

其中 `key` 有 3 种选择：

1. `name` 文件名称
2. `content` 文件内容
3. `options` 文件设置

Request: `PATCH` `/api/file/:id/:key` `需要身份验证`

Headers: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I
```

Body: `JSON`

```json
{
    "updated_at": "2021-01-03T06:37:03.863Z", 
    "content": "..."
}
```

Response: `200` `JSON` 

```json
{
    "message": "Updated"
}
```

### `DELETE` `/file/:id`

删除文件。

Request: `DELETE` `/api/file/:id` `需要身份验证`

Headers: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I
```

Response: `200` `JSON` 

```json
{
    "message": "Deleted"
}
```

### `GET` `/admin`

获取服务器上的所有文件。

Request: `GET` `/api/admin` `需要身份验证`

Headers: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I
```

Response: `200` `JSON` 

```json
{
    "message":"Got it",
    "data":[
        {
            "id":"3ed8320d-dd70-49a7-a125-d650d1e6d680",
            "created_at":"2020-12-24T03:23:33.347Z",
            "updated_at":"2020-12-24T03:26:03.439Z",
            "name":"README.md",
            "type":"markdown"
        },
        {
            "id":"dea62e9b-1aac-4c49-b957-e31975f4750a",
            "created_at":"2020-12-24T06:12:49.630Z",
            "updated_at":"2020-12-24T06:14:40.822Z",
            "name":"Test.go",
            "type":"text"
        }
    ]
}
```

### `POST` `/admin`

管理员页面登录。

Request: `POST` `/api/admin`

Body: `JSON`

```json
{
    "password":"1234"
}
```

Response: `200` `JSON` 

```json
{
    "message":"Welcome",
    "data":{
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2MDk2NTYzNTZ9.I0dWGnpqg3kKObH2QgQ4rPAk9AVoXCZ25ngnUSrdK0I"
    }
}
```

### `DELETE` `/admin/file/:id`

删除文件。

Request: `DELETE` `/api/admin/file/:id` `需要身份验证`

Headers: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I
```

Response: `200` `JSON` 

```json
{
    "message": "Deleted"
}
```

### `DELETE` `/admin/files`

删除多个文件。

Request: `DELETE` `/api/admin/files` `需要身份验证`

Headers: 

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkyYmNiZDA4LTM3OTMtNGNkNC1iNzZlLTllMDllN2E1MzYzZSIsIm5iZiI6MTYwOTY1NTIwMX0.M2OxCxgXK_BXjoEniCsA7-IXDTMnMgkuIphaNiG9o_I
```

Body: `JSON`

```json
{
    "files": [
        "d21396b0-2375-4fd6-b25e-b5f724257ca0", 
        "190b19d5-6e5f-4ca2-a2b9-bfe78027ed75", 
        "8d3bba18-db84-485a-8a35-8ac1384d043d"
    ]
}
```

Response: `200` `JSON` 

```json
{
    "message": "Deleted"
}
```

## `/websocket`

### `WS`  `/ping`

测试服务是否正常。

Request: `WS` `/websocket/ping`

Message: `TEXT`

```
pong
```

### `WS` `/file/:id`

在打开云端（非创建者）文件时，会自动建立 WebSocket 连接，文件未来的所有改动都会实时推送过来。

Request: `WS` `/websocket/file/:id`

Message: `JSON`

```json
{
    "id": "d21396b0-2375-4fd6-b25e-b5f724257ca0", 
    "created_at": "2020-12-25T09:08:46.701Z", 
    "updated_at": "2021-01-03T06:12:02.176Z", 
    "name": "Test.js", 
    "type": "text", 
    "content": "...", 
    "options": {
        "auto_save": true, 
        "word_wrap": false, 
        "font_family": "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono','Bitstream Vera Sans Mono', Courier, monospace", 
        "font_size": 14, 
        "line_height": 22, 
        "updated_at": "2020-12-25T09:08:46.701Z"
    }
}
```

## 异常

### Response 格式

异常返回的格式如下：

```json
{
    "message": "...", 
    "documentation": "https://lifeni.github.io/i-show-you/api"
}
```

`message` 中为异常的类型。

`documentation` 为帮助文档，也就是现在这个页面。

### HTTP Code 参考

| Code | Message               | 含义                                                   |
| ---- | --------------------- | ------------------------------------------------------ |
| 200  | OK                    | 成功获得数据或者执行操作                               |
| 400  | Bad Request           | 请求中包含多余的参数、请求体不匹配、功能或者服务未启用 |
| 401  | Unauthorized          | 没有权限                                               |
| 403  | Forbidden             | 权限验证失败                                           |
| 404  | Not Found             | 文件、历史记录不存在                                   |
| 500  | Internal Server Error | 服务端出错，多为数据库的问题                           |

