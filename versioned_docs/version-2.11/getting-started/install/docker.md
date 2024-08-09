---
title: 使用 Docker 部署
description: 使用 Docker 部署
---

import DockerArgs from "./slots/_docker-args.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

:::warning
此文档仅提供使用默认 H2 数据库的 Docker 运行方式，主要用于体验和测试，在生产环境我们不推荐使用 H2 数据库，这可能因为操作不当导致数据文件损坏。如果因为某些原因（如内存不足以运行独立数据库）必须要使用，建议按时[备份数据](../../user-guide/backup.md)。

如果需要使用其他数据库部署，我们推荐使用 Docker Compose 部署：[使用 Docker Compose 部署](./docker-compose)
:::

## 环境搭建

- Docker 安装文档：[https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

:::tip
我们推荐按照 Docker 官方文档安装 Docker，因为部分 Linux 发行版软件仓库中的 Docker 版本可能过旧。
:::

## 使用 Docker 镜像

可用的 Halo 2.11 的 Docker 镜像：

- [halohub/halo](https://hub.docker.com/r/halohub/halo)
- [ghcr.io/halo-dev/halo](https://github.com/halo-dev/halo/pkgs/container/halo)

:::info 注意
目前 Halo 2 并未更新 Docker 的 latest 标签镜像，主要因为 Halo 2 不兼容 1.x 版本，防止使用者误操作。我们推荐使用固定版本的标签，比如 `halohub/halo:2.11` 或者 `halohub/halo:2.11.0`。

- `halohub/halo:2.11`：表示最新的 2.11.x 版本，即每次发布 patch 版本都会同时更新 `halohub/halo:2.11` 镜像。
- `halohub/halo:2.11.0`：表示一个具体的版本。

后续文档以 `halohub/halo:2.11` 为例。
:::

1. 创建容器

   ```bash
   docker run -it -d --name halo -p 8090:8090 -v ~/.halo2:/root/.halo2 halohub/halo:2.11
   ```

   :::info
   注意：此命令默认使用自带的 H2 Database 数据库。如需使用 PostgreSQL，请参考：[使用 Docker Compose 部署](./docker-compose)
   :::

   - **-it**：开启输入功能并连接伪终端
   - **-d**：后台运行容器
   - **--name**：为容器指定一个名称
   - **-p**：端口映射，格式为 `主机(宿主)端口:容器端口` ，可在 `application.yaml` 配置。
   - **-v**：工作目录映射。形式为：`-v 宿主机路径:/root/.halo2`，后者不能修改。

   运行参数详解：

   <DockerArgs />

2. 用浏览器访问 `/console` 即可进入 Halo 管理页面，首次启动会进入初始化页面。

   :::tip
   如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
   :::

## 升级版本

1. 备份数据，可以参考 [备份与恢复](../../user-guide/backup.md) 进行完整备份。
2. 拉取新版本镜像

   ```bash
   docker pull halohub/halo:2.11
   ```

3. 停止运行中的容器

   ```bash
   docker stop halo
   docker rm halo
   ```

4. 更新 Halo

   修改版本号后，按照最初安装的方式，重新创建容器即可。

   ```bash
   docker run -it -d --name halo -p 8090:8090 -v ~/.halo2:/root/.halo2 halohub/halo:2.11
   ```
