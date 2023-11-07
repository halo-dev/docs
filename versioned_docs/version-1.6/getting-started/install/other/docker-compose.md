---
title: 使用 Docker Compose 部署 Halo
description: 使用 Docker Compose 部署 Halo
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../../prepare)，这可以快速帮助你了解 Halo。
:::

## 创建容器组

1. 在系统任意位置创建一个文件夹，此文档以 `~/halo-app` 为例。

  ```bash
  mkdir ~/halo-app && cd ~/halo-app
  ```

  :::info
  注意：后续操作中，Halo 的所有相关数据都会保存在这个目录，请妥善保存。
  :::

2. 创建 `docker-compose.yaml`

  此文档提供三种场景的 Docker Compose 配置文件，请根据你的需要选择一种。

  :::info
  需要注意的是，此文档为了更加方便的管理配置，所有与 Halo 相关的配置都使用 Docker 环境变量代替，所以无需创建 application.yaml 文件。
  :::

    1. 仅创建 Halo 实例（使用默认的 H2 数据库）：

    ```yaml {18-19}
    version: "3"

    services:
      halo:
        image: halohub/halo:1.6.0
        container_name: halo
        restart: on-failure:3
        volumes:
          - ./:/root/.halo
          - /etc/timezone:/etc/timezone:ro
          - /etc/localtime:/etc/localtime:ro
        ports:
          - "8090:8090"
        environment:
          - SERVER_PORT=8090
          - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.h2.Driver
          - SPRING_DATASOURCE_URL=jdbc:h2:file:~/.halo/db/halo
          - SPRING_DATASOURCE_USERNAME=admin
          - SPRING_DATASOURCE_PASSWORD=o#DwN&JSa56
          - HALO_ADMIN_PATH=admin
          - HALO_CACHE=memory
    ```

    :::info
    您可以前往 <https://hub.docker.com/r/halohub/halo> 查看最新版本镜像，我们推荐使用具体版本号的镜像，但也提供了 `latest` 标签的镜像，它始终是最新的。
    :::

    2. 创建 Halo + MySQL 的实例：

    ```yaml {22-23,45}
    version: "3"

    services:
      halo_server:
        image: halohub/halo:1.6.0
        container_name: halo_server
        restart: on-failure:3
        depends_on:
          - halo_mysql
        networks:
          halo_network:
        volumes:
          - ./:/root/.halo
          - /etc/timezone:/etc/timezone:ro
          - /etc/localtime:/etc/localtime:ro
        ports:
          - "8090:8090"
        environment:
          - SERVER_PORT=8090
          - SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
          - SPRING_DATASOURCE_URL=jdbc:mysql://halo_mysql:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
          - SPRING_DATASOURCE_USERNAME=root
          - SPRING_DATASOURCE_PASSWORD=o#DwN&JSa56
          - HALO_ADMIN_PATH=admin
          - HALO_CACHE=memory

      halo_mysql:
        image: mysql:8.0.27
        container_name: halo_mysql
        restart: on-failure:3
        networks:
          halo_network:
        command: --default-authentication-plugin=mysql_native_password
          --character-set-server=utf8mb4
          --collation-server=utf8mb4_general_ci
          --explicit_defaults_for_timestamp=true
        volumes:
          - /etc/localtime:/etc/localtime:ro
          - ./mysql:/var/lib/mysql
          - ./mysqlBackup:/data/mysqlBackup
        ports:
          - "3306:3306"
        environment:
          # 请修改此密码，并对应修改上方 Halo 服务的 SPRING_DATASOURCE_PASSWORD 变量值
          - MYSQL_ROOT_PASSWORD=o#DwN&JSa56
          - MYSQL_DATABASE=halodb

    networks:
      halo_network:
    ```

    3. 创建 Halo + MySQL + Redis 的实例：

    ```yaml {22-23,29,49,62}
    version: "3"

    services:
      halo_server:
        image: halohub/halo:1.6.0
        container_name: halo_server
        restart: on-failure:3
        depends_on:
          - halo_mysql
          - halo_redis
        networks:
          halo_network:
        volumes:
          - ./:/root/.halo
          - /etc/timezone:/etc/timezone:ro
          - /etc/localtime:/etc/localtime:ro
        ports:
          - "8090:8090"
        environment:
          - SERVER_PORT=8090
          - SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
          - SPRING_DATASOURCE_URL=jdbc:mysql://halo_mysql:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
          - SPRING_DATASOURCE_USERNAME=root
          - SPRING_DATASOURCE_PASSWORD=o#DwN&JSa56
          - HALO_ADMIN_PATH=admin
          - HALO_CACHE=redis
          - SPRING_REDIS_PORT=6379
          - SPRING_REDIS_DATABASE=0
          - SPRING_REDIS_HOST=halo_redis
          - SPRING_REDIS_PASSWORD=dm5fD%rvPtq

      halo_mysql:
        image: mysql:8.0.27
        container_name: halo_mysql
        restart: on-failure:3
        networks:
          halo_network:
        command: --default-authentication-plugin=mysql_native_password
          --character-set-server=utf8mb4
          --collation-server=utf8mb4_general_ci
          --explicit_defaults_for_timestamp=true
        volumes:
          - /etc/localtime:/etc/localtime:ro
          - ./mysql:/var/lib/mysql
          - ./mysqlBackup:/data/mysqlBackup
        ports:
          - "3306:3306"
        environment:
          # 请修改此密码，并对应修改上方 Halo 服务的 SPRING_DATASOURCE_PASSWORD 变量值
          - MYSQL_ROOT_PASSWORD=o#DwN&JSa56
          - MYSQL_DATABASE=halodb

      halo_redis:
        image: redis
        container_name: halo_redis
        restart: on-failure:3
        networks:
          halo_network:
        volumes:
          - ./redis/data:/data
          - ./redis/logs:/logs
        # 请修改此密码，并对应修改上方 Halo 服务的 SPRING_REDIS_PASSWORD 变量值
        command: redis-server --requirepass dm5fD%rvPtq
        ports:
          - "6379:6379"
    networks:
      halo_network:
    ```

3. 启动 Halo 服务

  ```bash
  docker-compose up -d
  ```

4. 打开 `http://ip:端口号` 即可看到安装引导界面。

  :::tip
  如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
  :::

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。

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
  cd ~/halo-app && docker-compose stop
  ```

2. 备份数据（重要）

  ```bash
  cp -r ~/halo-app ~/halo-app.archive
  ```

  > 需要注意的是，`halo-app.archive` 文件名不一定要根据此文档命名，这里仅仅是个示例。

3. 清空 [leveldb 或 Redis](../../config.md#缓存) 缓存（如果有使用 leveldb 或 Redis 作为缓存策略）

  ```bash
  rm -rf ~/halo-app/.leveldb

  rm -rf ~/halo-app/redis
  ```

4. 更新 Halo 服务

  针对使用 `latest` 标签镜像的更新：

  ```bash
  docker-compose pull && docker-compose up -d
  ```

  :::info
  注意，当您的 `Docker` 镜像源非官方源时，执行 `docker-compose pull` 命令时可能无法获取到最新的 `latest` 标签的镜像。
  :::

  针对使用具体版本标签镜像的更新：

  修改 `docker-compose.yaml` 中配置的镜像版本。

  ```yaml {3}
  services:
    halo_server:
      image: halohub/halo:1.6.0
      container_name: halo_server
  ```

5. 启动容器组：

  ```bash
  docker-compose up -d
  ```
