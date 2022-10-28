---
title: 使用 Docker Compose 部署
description: 使用 Docker Compose 部署
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare.md)，这可以快速帮助你了解 Halo。
:::

## 创建容器组

可用的 Halo 2.0.0-alpha.3 的 Docker 镜像：

- [halohub/halo-dev](https://hub.docker.com/r/halohub/halo-dev)
- [ghcr.io/halo-dev/halo-dev](https://github.com/halo-dev/halo/pkgs/container/halo-dev)

:::info 注意
以上两个镜像仅作为 Halo 2.0 测试期间的镜像，正式发布之后会更改为 `halohub/halo` 和 `ghcr.io/halo-dev/halo`。
:::

1. 在系统任意位置创建一个文件夹，此文档以 `~/halo-next` 为例。

  ```bash
  mkdir ~/halo-next && cd ~/halo-next
  ```

  :::info
  注意：后续操作中，Halo 的所有相关数据都会保存在这个目录，请妥善保存。
  :::

2. 创建 `docker-compose.yaml`

  此文档提供两种场景的 Docker Compose 配置文件，请根据你的需要选择一种。

  :::info
  需要注意的是，此文档为了更加方便的管理配置，所有与 Halo 相关的配置都使用 Docker 环境变量代替，所以无需创建 application.yaml 文件。
  :::

    1. 仅创建 Halo 实例（使用默认的 H2 数据库）：

    ```yaml {13-20}
    version: "3"

    services:
      halo_next:
        image: halohub/halo-dev:2.0.0-alpha.3
        container_name: halo_next
        restart: on-failure:3
        volumes:
          - ./:/root/halo-next
        ports:
          - "8090:8090"
        environment:
          # 外部访问地址，请根据实际需要修改
          - HALO_EXTERNAL_URL=http://localhost:8090/
          # 初始化的超级管理员用户名
          - HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME=admin
          # 初始化的超级管理员密码
          - HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd
    ```

    2. 创建 Halo + PostgreSQL 的实例：

    ```yaml {18-28,46}
    version: "3"

    services:
      halo_next:
        image: halohub/halo-dev:2.0.0-alpha.3
        container_name: halo_next
        restart: on-failure:3
        depends_on:
          halo_db:
            condition: service_healthy
        networks:
          halo_network:
        volumes:
          - ./:/root/halo-next
        ports:
          - "8090:8090"
        environment:
          - SPRING_R2DBC_URL=r2dbc:pool:postgresql://halo_db/halo
          - SPRING_R2DBC_USERNAME=halo
          # PostgreSQL 的密码，请保证与下方 POSTGRES_PASSWORD 的变量值一致。
          - SPRING_R2DBC_PASSWORD=openpostgresql
          - SPRING_SQL_INIT_PLATFORM=postgresql
          # 外部访问地址，请根据实际需要修改
          - HALO_EXTERNAL_URL=http://localhost:8090/
          # 初始化的超级管理员用户名
          - HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME=admin
          # 初始化的超级管理员密码
          - HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd

      halo_db:
        image: postgres:latest
        container_name: halo_db
        restart: on-failure:3
        networks:
          halo_network:
        volumes:
          - ./db:/var/lib/postgresql/data
        ports:
          - "5432:5432"
        healthcheck:
          test: [ "CMD", "pg_isready" ]
          interval: 10s
          timeout: 5s
          retries: 5
        environment:
          - POSTGRES_PASSWORD=openpostgresql
          - POSTGRES_USER=halo
          - POSTGRES_DB=halo

    networks:
      halo_network:
    ```

3. 启动 Halo 服务

  ```bash
  docker-compose up -d
  ```

4. 用浏览器访问 `$HALO_EXTERNAL_URL/console/`（外部访问链接）即可进入 Halo 管理端。管理员用户名为 `admin`，登录密码为上方设置的 `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD`。

  :::tip
  如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
  :::

## 使用

目前 Alpha 版本有以下几个使用注意事项：

1. 由于目前尚未完成初始化程序，所以安装完成之后没有默认主题，你可以访问 <https://github.com/halo-sigs/awesome-halo> 查阅所有支持 2.0 的主题，并在后台主题管理页面手动安装。
2. 同上，由于目前评论组件也被插件化，所以如果要体验完整的评论功能，需要手动在后台安装 <https://github.com/halo-sigs/plugin-comment-widget> 评论组件插件。
3. 目前 2.0 已支持的主题和插件会同步到 <https://github.com/halo-sigs/awesome-halo>，你可以在对应仓库的 release 下载最新的主题或插件。

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。如果你对 Nginx 不熟悉，我们推荐使用 [OneinStack](../install/other/oneinstack.md) 来管理 Nginx。

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

## 更新容器组

:::info
我们假设您的 Halo 服务容器是按照 [使用 Docker Compose 部署 Halo](docker-compose.md) 中的方式启动的。如有不同，请根据实际情况修改。
:::

1. 停止运行中的容器组

  ```bash
  cd ~/halo-next && docker-compose stop
  ```

2. 备份数据（重要）

  ```bash
  cp -r ~/halo-next ~/halo-next.archive
  ```

  > 需要注意的是，`halo-next.archive` 文件名不一定要根据此文档命名，这里仅仅是个示例。

3. 更新 Halo 服务

  修改 `docker-compose.yaml` 中配置的镜像版本。

  ```yaml {3}
  services:
    halo_next:
      image: halohub/halo-dev:2.0.0-alpha.3
      container_name: halo_next
  ```

  ```bash
  docker-compose pull && docker-compose up -d
  ```
