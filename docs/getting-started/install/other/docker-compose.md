---
title: 使用 Docker-Compose 部署 Halo
description: 使用 Docker-Compose 部署 Halo
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../../prepare)，这可以快速帮助你了解 Halo。
:::

## 使用 Docker-Compose 部署

1. 创建[工作目录](../../prepare#工作目录)

```bash
mkdir ~/.halo && cd ~/.halo
```

2. 下载示例配置文件到[工作目录](../../prepare#工作目录)

```bash
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

3. 编辑配置文件，配置数据库或者端口等，如需配置请参考[配置参考](../../config)

```bash
vim application.yaml
```

4. 创建 `docker-compose.yaml`

** Halo 基础版本**

```yaml
version: "3"

services:
  server:
    image: halohub/halo:1.5.0
    container_name: halo
    restart: unless-stopped
    volumes:
      - ./:/root/.halo
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "8090:8090"
```

:::info
您可以前往 <https://hub.docker.com/r/halohub/halo> 查看最新版本镜像，我们推荐使用具体版本号的镜像，但也提供了 `latest` 标签的镜像，它始终是最新的。
:::

** Halo + MySQL + Redis **

如果您需要使用自部署的 `MySQL` 和 `Redis`，可参考如下的 `docker-compose.yaml`：

```yaml
version: "3"

services:
  halo_server:
    depends_on:
      - mysql_db
      - redis_db
    image: halohub/halo:latest
    container_name: halo-self
    restart: unless-stopped
    networks:
      halo_net:
        ipv4_address: 172.19.0.4
    volumes:
      - $PWD/:/root/.halo
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "8090:8090"

  mysql_db:
    image: mysql:8.0.27
    restart: always
    networks:
      halo_net:
        ipv4_address: 172.19.0.2
    container_name: halo-mysql
    command: --default_authentication_plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --explicit_defaults_for_timestamp=true
    ports:
      - "3306:3306"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - $PWD/mysql/var/lib/mysql:/var/lib/mysql
      - $PWD/mysql/mysqlBackup:/data/mysqlBackup
    environment:
      ## 此处需要输入自定义 MySQL 密码
      - MYSQL_ROOT_PASSWORD = mysqlpass

  redis_db:
    image: redis
    restart: always
    networks:
      halo_net:
        ipv4_address: 172.19.0.3
    container_name: halo-redis
    volumes:
      - $PWD/redis/data:/data
      - $PWD/redis/logs:/logs
    ## 此处需要输入自定义 Redis 密码
    command: redis-server --requirepass redispass
    ports:
      - "6379:6379"

networks:
  halo_net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.19.0.0/16
```

注意，如果您使用了自部署的 MySQL 和 Redis，启动前您应该同步更改 application.yaml 中的数据源地址和 cache 选项。

```yaml
spring:
  datasource:
    # MySQL database configuration.
    driver-class-name: com.mysql.cj.jdbc.Driver
    # 此处的地址应该使用docker-compose.yaml中配置的MySQL地址和密码
    url: jdbc:mysql://172.19.0.2:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: mysqlpass
  redis:
    # Redis cache configuration.
    port: 6379
    database: 0
    # 此处的地址应该使用docker-compose.yaml中配置的Redis地址和密码
    host: 172.19.0.3
    password: redispass

halo:
  # Your admin client path is https://your-domain/{admin-path}
  admin-path: admin

  # memory or level or redis
  cache: redis
```
6. 启动 Halo 服务

```bash
docker-compose up -d
```

:::info
注意：如果您未在 application.yaml 中修改数据源配置，使用此命令启动则会默认使用自带的 `H2 Database` 数据库。如需使用 `MySQL`，请参考：[使用 Docker 部署 Halo 和 MySQL](./docker-mysql) 的内容将 `datasource` 配置更改为 `MySQL` 的配置。
:::

- **image：** 容器镜像版本，默认为 `halohub/halo:1.5.0`。如果需要使用最新版本请使用 `halohub/halo:latest`。
- **container_name：** 为容器指定一个名称。
- **ports：** 端口映射，格式为 `主机(宿主)端口:容器端口` ，可在 `application.yaml` 配置。
- **volumes：** 工作目录映射。形式为：`宿主机路径:/root/.halo`，后者不能修改。
- **restart：** 建议设置为 `unless-stopped`，在 Docker 启动的时候自动启动 Halo 容器。

1. 打开 `http://ip:端口号` 即可看到安装引导界面。

:::tip
如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
:::

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。如果你对 Nginx 不熟悉，我们推荐使用 [OneinStack](./oneinstack) 来管理 Nginx。

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
