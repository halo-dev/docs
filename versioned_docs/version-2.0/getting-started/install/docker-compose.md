---
title: 使用 Docker Compose 部署
description: 使用 Docker Compose 部署
---

import DockerEnv from "./slots/docker-env.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare.md)，这可以快速帮助你了解 Halo。
:::

## 环境搭建

- Docker 安装文档：<https://docs.docker.com/get-docker/>
- Docker Compose 安装文档：<https://docs.docker.com/compose/install/>

:::tip
我们推荐按照 Docker 官方文档安装 Docker 和 Docker Compose，因为部分 Linux 发行版软件仓库中的 Docker 版本可能过旧。
:::

## 创建容器组

可用的 Halo 2.0.2 的 Docker 镜像：

- [halohub/halo](https://hub.docker.com/r/halohub/halo)
- [ghcr.io/halo-dev/halo](https://github.com/halo-dev/halo/pkgs/container/halo)

:::info 注意
目前 Halo 2.0 并未更新 Docker 的 latest 标签镜像，主要因为 2.0 不兼容 1.x 版本，防止使用者误操作。我们推荐使用固定版本的标签，比如 `halohub/halo:2.0.2`。
:::

1. 在系统任意位置创建一个文件夹，此文档以 `~/halo` 为例。

  ```bash
  mkdir ~/halo && cd ~/halo
  ```

  :::info
  注意：后续操作中，Halo 产生的所有数据都会保存在这个目录，请妥善保存。
  :::

2. 创建 `docker-compose.yaml`

  此文档提供两种场景的 Docker Compose 配置文件，请根据你的需要**选择一种**。

  :::info
  需要注意的是，此文档为了更加方便的管理配置，所有与 Halo 相关的配置都使用 Docker 环境变量代替，所以无需创建 application.yaml 文件。
  :::

    1. 创建 Halo + PostgreSQL 的实例：

    ```yaml {18-28,46} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: halohub/halo:2.0.2
        container_name: halo
        restart: on-failure:3
        depends_on:
          halodb:
            condition: service_healthy
        networks:
          halo_network:
        volumes:
          - ./:/root/.halo2
        ports:
          - "8090:8090"
        environment:
          - SPRING_R2DBC_URL=r2dbc:pool:postgresql://halodb/halo
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

      halodb:
        image: postgres:latest
        container_name: halodb
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

    2. 创建 Halo + MySQL 的实例：

    ```yaml
    version: "3"

    services:
      halo:
        image: halohub/halo:2.0.2
        container_name: halo
        restart: on-failure:3
        depends_on:
          halodb:
            condition: service_healthy
        networks:
          halo_network:
        volumes:
          - ./:/root/.halo2
        ports:
          - "8090:8090"
        environment:
          - SPRING_R2DBC_URL=r2dbc:pool:mysql://halodb:3306/halo
          - SPRING_R2DBC_USERNAME=root
          # MySQL 的密码，请保证与下方 MYSQL_ROOT_PASSWORD 的变量值一致。
          - SPRING_R2DBC_PASSWORD=o#DwN&JSa56
          - SPRING_SQL_INIT_PLATFORM=mysql
          # 外部访问地址，请根据实际需要修改
          - HALO_EXTERNAL_URL=http://localhost:8090/
          # 初始化的超级管理员用户名
          - HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME=admin
          # 初始化的超级管理员密码
          - HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd

      halodb:
        image: mysql:8.0.31
        container_name: halodb
        restart: on-failure:3
        networks:
          halo_network:
        command: --default-authentication-plugin=mysql_native_password
          --character-set-server=utf8mb4
          --collation-server=utf8mb4_general_ci
          --explicit_defaults_for_timestamp=true
        volumes:
          - ./mysql:/var/lib/mysql
          - ./mysqlBackup:/data/mysqlBackup
        ports:
          - "3306:3306"
        healthcheck:
          test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "--silent"]
          interval: 3s
          retries: 5
          start_period: 30s
        environment:
          # 请修改此密码，并对应修改上方 Halo 服务的 SPRING_R2DBC_PASSWORD 变量值
          - MYSQL_ROOT_PASSWORD=o#DwN&JSa56
          - MYSQL_DATABASE=halo

    networks:
      halo_network:
    ```

    3. 仅创建 Halo 实例（使用默认的 H2 数据库，**不推荐用于生产环境，建议体验和测试的时候使用**）：

    ```yaml {13-20} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: halohub/halo:2.0.2
        container_name: halo
        restart: on-failure:3
        volumes:
          - ./:/root/.halo2
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

  环境变量详解：

  <DockerEnv />

3. 启动 Halo 服务

  ```bash
  docker-compose up -d
  ```

  实时查看日志：

  ```bash
  docker-compose logs -f
  ```

4. 用浏览器访问 `$HALO_EXTERNAL_URL/console/`（外部访问链接）即可进入 Halo 管理端。管理员用户名为 `admin`，登录密码为上方设置的 `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD`。

  :::tip
  如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
  :::

## 更新容器组

1. 停止运行中的容器组

  ```bash
  cd ~/halo && docker-compose down
  ```

2. 备份数据（重要）

  ```bash
  cp -r ~/halo ~/halo.archive
  ```

  > 需要注意的是，`halo.archive` 文件名不一定要根据此文档命名，这里仅仅是个示例。

3. 更新 Halo 服务

  修改 `docker-compose.yaml` 中配置的镜像版本。

  ```yaml {3}
  services:
    halo:
      image: halohub/halo:2.0.2
      container_name: halo
  ```

  ```bash
  docker-compose pull
  ```

  ```bash
  docker-compose up -d
  ```

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。如果你对 Nginx 不熟悉，我们推荐使用 [OneinStack](../install/other/oneinstack.md) 来管理 Nginx。

### Nginx

```nginx {2,7,10}
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

### Caddy 2

```txt {1,5}
www.yourdomain.com

encode gzip

reverse_proxy 127.0.0.1:8090
```
