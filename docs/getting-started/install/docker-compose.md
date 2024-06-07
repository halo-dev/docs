---
title: 使用 Docker Compose 部署
description: 使用 Docker Compose 部署
---

import DockerArgs from "./slots/_docker-args.md"
import DockerRegistryList from "./slots/_docker-registry-list.md"

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

<DockerRegistryList />

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

    ```yaml {23-29,43} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: registry.fit2cloud.com/halo/halo:2.16
        restart: on-failure:3
        depends_on:
          halodb:
            condition: service_healthy
        networks:
          halo_network:
        volumes:
          - ./halo2:/root/.halo2
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
      halodb:
        image: postgres:15.4
        restart: on-failure:3
        networks:
          halo_network:
        volumes:
          - ./db:/var/lib/postgresql/data
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

    :::info
    此示例的 PostgreSQL 数据库容器默认没有设置端口映射，如果需要在容器外部访问数据库，可以自行在 `halodb` 服务中添加端口映射，PostgreSQL 的端口为 `5432`。
    :::

    2. 创建 Halo + MySQL 的实例：

    ```yaml {23-29,51} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: registry.fit2cloud.com/halo/halo:2.16
        restart: on-failure:3
        depends_on:
          halodb:
            condition: service_healthy
        networks:
          halo_network:
        volumes:
          - ./halo2:/root/.halo2
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

      halodb:
        image: mysql:8.1.0
        restart: on-failure:3
        networks:
          halo_network:
        command: 
          - --default-authentication-plugin=caching_sha2_password
          - --character-set-server=utf8mb4
          - --collation-server=utf8mb4_general_ci
          - --explicit_defaults_for_timestamp=true
        volumes:
          - ./mysql:/var/lib/mysql
          - ./mysqlBackup:/data/mysqlBackup
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

    :::info
    此示例的 MySQL 数据库容器默认没有设置端口映射，如果需要在容器外部访问数据库，可以自行在 `halodb` 服务中添加端口映射，MySQL 的端口为 `3306`。
    :::

    3. 仅创建 Halo 实例（使用默认的 H2 数据库）：

    :::caution
    不推荐在生产环境使用默认的 H2 数据库，这可能因为操作不当导致数据文件损坏。如果因为某些原因（如内存不足以运行独立数据库）必须要使用，建议按时[备份数据](../../user-guide/backup.md)。
    :::

    ```yaml {19-24} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: registry.fit2cloud.com/halo/halo:2.16
        restart: on-failure:3
        volumes:
          - ./halo2:/root/.halo2
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
    ```

    4. 仅创建 Halo 实例（使用已有外部数据库，MySQL 为例）：
    
    ```yaml {7,12-20} title="~/halo/docker-compose.yaml"
    version: "3"

    services:
      halo:
        image: registry.fit2cloud.com/halo/halo:2.16
        restart: on-failure:3
        network_mode: "host"
        volumes:
          - ./halo2:/root/.halo2
        command:
          # 修改为自己已有的 MySQL 配置
          - --spring.r2dbc.url=r2dbc:pool:mysql://localhost:3306/halo
          - --spring.r2dbc.username=root
          - --spring.r2dbc.password=
          - --spring.sql.init.platform=mysql
          # 外部访问地址，请根据实际需要修改
          - --halo.external-url=http://localhost:8090/
          # 端口号 默认8090
          - --server.port=8090
    ```

  运行参数详解：

  <DockerArgs />

3. 启动 Halo 服务

  ```bash
  docker-compose up -d
  ```

  实时查看日志：

  ```bash
  docker-compose logs -f
  ```

4. 用浏览器访问 /console 即可进入 Halo 管理页面，首次启动会进入初始化页面。

  :::tip
  如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
  :::

## 更新容器组

1. 备份数据，可以参考 [备份与恢复](../../user-guide/backup.md) 进行完整备份。
2. 更新 Halo 服务

  修改 `docker-compose.yaml` 中配置的镜像版本。

  ```yaml {3}
  services:
    halo:
      image: registry.fit2cloud.com/halo/halo:2.16
  ```

  ```bash
  docker-compose up -d
  ```

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。 如果你对它们没有任何了解，可以参考我们更为详细的反向代理文档：

1. 使用 [Nginx Proxy Manager](../install/other/nginxproxymanager.md)
2. 使用 [Traefik](../install/other/traefik.md)

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

### Traefik

更新 halo 容器组的配置

1. `networks` 中引入已存在的网络 `traefik`（此网络需要 [提前创建](../install/other/traefik.md#创建-traefik)）
2. `services.halo.networks` 中添加网络 `traefik`
3. 修改外部地址为你的域名
4. 声明路由规则、开启 TLS

```yaml {4-5,16,20,25-31}
version: "3.8"

networks:
  traefik:
    external: true
  halo:

services:
  halo:
    image: registry.fit2cloud.com/halo/halo:2.16
    restart: on-failure:3
    volumes:
      - ./halo2:/root/.halo2
    networks:
      - traefik
      - halo
    command:
      # 外部访问地址，请根据实际需要修改
      - --halo.external-url=https://yourdomain.com
    labels:
      traefik.enable: "true"
      traefik.docker.network: traefik
      traefik.http.routers.halo.rule: Host(`yourdomain.com`)
      traefik.http.routers.halo.tls: "true"
      traefik.http.routers.halo.tls.certresolver: myresolver
      traefik.http.services.halo.loadbalancer.server.port: 8090
```
