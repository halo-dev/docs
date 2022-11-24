---
title: 使用 Docker 部署
description: 使用 Docker 部署
---

:::info
暂时我们仅提供使用 Docker 运行的文档。在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

## 使用 Docker 镜像

可用的 Halo 2.0.0-rc.1 的 Docker 镜像：

- [halohub/halo-dev](https://hub.docker.com/r/halohub/halo-dev)
- [ghcr.io/halo-dev/halo-dev](https://github.com/halo-dev/halo/pkgs/container/halo-dev)

> 注意：以上两个镜像仅作为 Halo 2.0 测试期间的镜像，正式发布之后会更改为 `halohub/halo` 和 `ghcr.io/halo-dev/halo`。

1. 创建容器

    ```bash
    docker run \
      -it -d \
      --name halo-next \
      -p 8090:8090 \
      -v ~/.halo2:/root/.halo2 \
      -e HALO_EXTERNAL_URL=http://localhost:8090/ \
      -e HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd \
      halohub/halo-dev:2.0.0-rc.1
    ```

    :::info
    注意：此命令默认使用自带的 H2 Database 数据库。如需使用 PostgreSQL，请参考：[使用 Docker Compose 部署](./docker-compose)
    :::

    - **-it**：开启输入功能并连接伪终端
    - **-d**：后台运行容器
    - **--name**：为容器指定一个名称
    - **-p**：端口映射，格式为 `主机(宿主)端口:容器端口` ，可在 `application.yaml` 配置。
    - **-v**：工作目录映射。形式为：`-v 宿主机路径:/root/.halo2`，后者不能修改。
    - **-e**：环境变量
      - `HALO_EXTERNAL_URL`: 外部可访问的链接。例如：<https://域名/>
      - `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD`: 超级管理员用户（admin）的初始化密码。如果该环境变量没有设置，系统将会生成随机密码并打印在日志中。

1. 用浏览器访问 `$HALO_EXTERNAL_URL/console/`（外部访问链接）即可进入 Halo 管理端。管理员用户名为 `admin`，登录密码为上方设置的 `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD`。

    :::tip
    如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
    :::

## 使用

目前 RC 版本有以下几个使用注意事项：

1. 由于目前评论组件被插件化且暂不支持提供默认插件，所以如果要体验完整的评论功能，需要手动在后台安装 <https://github.com/halo-sigs/plugin-comment-widget> 评论组件插件。
2. 目前 2.0 已支持的主题和插件会同步到 <https://github.com/halo-sigs/awesome-halo>，你可以在对应仓库的 release 下载最新的主题或插件。

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。如果你对 Nginx 不熟悉，我们推荐使用 [OneinStack](./other/oneinstack) 来管理 Nginx。

### Nginx

```nginx
upstream halo {
  server 127.0.0.1:8090;
}
server {
  listen 80;
  listen [::]:80;
  server_name www.yourdomain.com;
  client_max_body_size 1024m;
  location / {
    proxy_pass http://halo;
    proxy_set_header HOST $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

### Caddy 1.x

```txt
https://www.yourdomain.com {
 gzip
 tls your@email.com
 proxy / localhost:8090 {
  transparent
 }
}
```

### Caddy 2.x

```txt
www.yourdomain.com

encode gzip

reverse_proxy 127.0.0.1:8090
```

以上配置都可以在 <https://github.com/halo-dev/halo-common> 找到。
