---
title: 使用 Docker Compose 部署
description: 使用 Docker Compose 部署
---

import DockerArgs from "./slots/docker-args.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare.md)，这可以快速帮助你了解 Halo。
:::

## 环境搭建

- Docker 安装文档：<https://docs.docker.com/engine/install/>
- Docker Compose 安装文档：<https://docs.docker.com/compose/install/>

:::tip
我们推荐按照 Docker 官方文档安装 Docker 和 Docker Compose，因为部分 Linux 发行版软件仓库中的 Docker 版本可能过旧。
:::

## 创建容器组

可用的 Halo 2.4 的 Docker 镜像：

- [halohub/halo](https://hub.docker.com/r/halohub/halo)
- [ghcr.io/halo-dev/halo](https://github.com/halo-dev/halo/pkgs/container/halo)

:::info 注意
目前 Halo 2 并未更新 Docker 的 latest 标签镜像，主要因为 Halo 2 不兼容 1.x 版本，防止使用者误操作。我们推荐使用固定版本的标签，比如 `halohub/halo:2.4` 或者 `halohub/halo:2.4.0`。

- `halohub/halo:2.4`：表示最新的 2.4.x 版本，即每次发布 patch 版本都会同时更新 `halohub/halo:2.4` 镜像。
- `halohub/halo:2.4.0`：表示一个具体的版本。

后续文档以 `halohub/halo:2.4` 为例。
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
  需要注意的是，此文档为了更加方便的管理配置，所有与 Halo 相关的配置都使用 Docker 容器启动参数代替，所以无需创建 application.yaml 文件。
  :::

    1. 创建 Halo + PostgreSQL 的实例：

    ```yaml {24-34,51} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: halohub/halo:2.4
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
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:8090/actuator/health/readiness"]
          interval: 30s
          timeout: 5s
          retries: 5
          start_period: 30s          
        command:
          - --spring.r2dbc.url=r2dbc:pool:postgresql://halodb/halo
          - --spring.r2dbc.username=halo
          # PostgreSQL 的密码，请保证与下方 POSTGRES_PASSWORD 的变量值一致。
          - --spring.r2dbc.password=openpostgresql
          - --spring.sql.init.platform=postgresql
          # 外部访问地址，请根据实际需要修改
          - --halo.external-url=http://localhost:8090/
          # 初始化的超级管理员用户名
          - --halo.security.initializer.superadminusername=admin
          # 初始化的超级管理员密码
          - --halo.security.initializer.superadminpassword=P@88w0rd
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
          - PGUSER=halo

    networks:
      halo_network:
    ```

    2. 创建 Halo + MySQL 的实例：

    ```yaml {24-34,59} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: halohub/halo:2.4
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
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:8090/actuator/health/readiness"]
          interval: 30s
          timeout: 5s
          retries: 5
          start_period: 30s
        command:
          - --spring.r2dbc.url=r2dbc:pool:mysql://halodb:3306/halo
          - --spring.r2dbc.username=root
          # MySQL 的密码，请保证与下方 MYSQL_ROOT_PASSWORD 的变量值一致。
          - --spring.r2dbc.password=o#DwN&JSa56
          - --spring.sql.init.platform=mysql
          # 外部访问地址，请根据实际需要修改
          - --halo.external-url=http://localhost:8090/
          # 初始化的超级管理员用户名
          - --halo.security.initializer.superadminusername=admin
          # 初始化的超级管理员密码
          - --halo.security.initializer.superadminpassword=P@88w0rd

      halodb:
        image: mysql:8.0.31
        container_name: halodb
        restart: on-failure:3
        networks:
          halo_network:
        command: 
          - --default-authentication-plugin=mysql_native_password
          - --character-set-server=utf8mb4
          - --collation-server=utf8mb4_general_ci
          - --explicit_defaults_for_timestamp=true
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

    ```yaml {19-24} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: halohub/halo:2.4
        container_name: halo
        restart: on-failure:3
        volumes:
          - ./:/root/.halo2
        ports:
          - "8090:8090"
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost:8090/actuator/health/readiness"]
          interval: 30s
          timeout: 5s
          retries: 5
          start_period: 30s          
        command:
          # 外部访问地址，请根据实际需要修改
          - --halo.external-url=http://localhost:8090/
          # 初始化的超级管理员用户名
          - --halo.security.initializer.superadminusername=admin
          # 初始化的超级管理员密码
          - --halo.security.initializer.superadminpassword=P@88w0rd
    ```
    4. 仅创建 Halo 实例（使用已有外部数据库，MySQL 为例）：
    
    ```yaml {8,21-24} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: halohub/halo:2.4
        container_name: halo
        restart: on-failure:3
        network_mode: "host"
        volumes:
          - ./:/root/.halo2
        command:
          # 修改为自己已有的 MySQL 配置
          - --spring.r2dbc.url=r2dbc:pool:mysql://localhost:3306/halo
          - --spring.r2dbc.username=root
          - --spring.r2dbc.password=
          - --spring.sql.init.platform=mysql
          # 外部访问地址，请根据实际需要修改
          - --halo.external-url=http://localhost:8090/
          # 初始化的超级管理员用户名
          - --halo.security.initializer.superadminusername=admin
          # 初始化的超级管理员密码
          - --halo.security.initializer.superadminpassword=P@88w0rd
          # 端口号 默认8090
          - --server.port=8090

    ```

  参数详解：

  <DockerArgs />

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
      image: halohub/halo:2.4
      container_name: halo
  ```

  ```bash
  docker-compose pull halo
  ```

  ```bash
  docker-compose up -d
  ```

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。 如果你对它们没有任何了解，可以参考我们更为详细的反向代理文档：

1. 使用 [OneinStack](../install/other/oneinstack.md)
2. 使用 [Nginx Proxy Manager](../install/other/nginxproxymanager.md)
3. 使用 [Traefik](../install/other/traefik.md)

### Traefik

更新 halo 容器组的配置

1. `networks` 中引入已存在的网络 `traefik`（此网络需要 [提前创建](../install/other/traefik.md#创建-traefik)）
2. `services.halo.networks` 中添加网络 `traefik`
3. 修改外部地址为你的域名
4. 声明路由规则、开启 TLS

```yaml {4-5,16,20,25-31} showLineNumbers
version: "3.8"

networks:
  traefik:
    external: true
  halo:

services:
  halo:
    image: halohub/halo:2.4
    container_name: halo
    restart: on-failure:3
    volumes:
      - ./:/root/.halo2
    networks:
      - traefik
      - halo
    command:
      # 外部访问地址，请根据实际需要修改
      - --halo.external-url=https://yourdomain.com
      # 初始化的超级管理员用户名
      - --halo.security.initializer.superadminusername=admin
      # 初始化的超级管理员密码
      - --halo.security.initializer.superadminpassword=P@88w0rd
    labels:
      traefik.enable: "true"
      traefik.docker.network: traefik
      traefik.http.routers.halo.rule: Host(`yourdomain.com`)
      traefik.http.routers.halo.tls: "true"
      traefik.http.routers.halo.tls.certresolver: myresolver
      traefik.http.services.halo.loadbalancer.server.port: 8090
```

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
