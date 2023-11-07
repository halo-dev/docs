---
title: 使用 Docker 部署 Halo
description: 使用 Docker 部署
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

## 使用 Docker 镜像

Halo 在 Docker Hub 上发布的镜像为 [halohub/halo](https://hub.docker.com/r/halohub/halo)

1. 创建 [工作目录](../prepare#工作目录)

```bash
mkdir ~/.halo && cd ~/.halo
```

2. 下载示例配置文件到 [工作目录](../prepare#工作目录)

```bash
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

3. 编辑配置文件，配置数据库或者端口等，如需配置请参考 [配置参考](../config)

```bash
vim application.yaml
```

4. 拉取最新的 Halo 镜像

```bash
docker pull halohub/halo:1.5.5
```

:::info
查看最新版本镜像：<https://hub.docker.com/r/halohub/halo> ，我们推荐使用具体版本号的镜像，但也提供了 `latest` 标签的镜像，它始终是最新的。
:::

5. 创建容器

```bash
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --restart=unless-stopped halohub/halo:1.5.5
```

:::info
注意：此命令默认使用自带的 H2 Database 数据库。如需使用 MySQL，请参考：[使用 Docker 部署 Halo 和 MySQL](./other/docker-mysql)
:::

- **-it：** 开启输入功能并连接伪终端
- **-d：** 后台运行容器
- **--name：** 为容器指定一个名称
- **-p：** 端口映射，格式为 `主机(宿主)端口:容器端口` ，可在 `application.yaml` 配置。
- **-v：** 工作目录映射。形式为：-v 宿主机路径:/root/.halo，后者不能修改。
- **--restart：** 建议设置为 `unless-stopped`，在 Docker 启动的时候自动启动 Halo 容器。

6. 打开 `http://ip:端口号` 即可看到安装引导界面。

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
