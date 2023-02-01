---
title: 使用 Docker 部署
description: 使用 Docker 部署
---

import DockerEnv from "./slots/docker-env.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

:::tip
此文档仅提供使用默认 H2 数据库的 Docker 运行方式，主要用于体验和测试，在生产环境我们不推荐使用 H2 数据库。

如果需要使用其他数据库部署，我们推荐使用 Docker Compose 部署：[使用 Docker Compose 部署](./docker-compose)
:::

## 环境搭建

- Docker 安装文档：<https://docs.docker.com/engine/install/>

:::tip
我们推荐按照 Docker 官方文档安装 Docker，因为部分 Linux 发行版软件仓库中的 Docker 版本可能过旧。
:::

## 使用 Docker 镜像

可用的 Halo 2.0.2 的 Docker 镜像：

- [halohub/halo](https://hub.docker.com/r/halohub/halo)
- [ghcr.io/halo-dev/halo](https://github.com/halo-dev/halo/pkgs/container/halo)

:::info 注意
目前 Halo 2.0 并未更新 Docker 的 latest 标签镜像，主要因为 2.0 不兼容 1.x 版本，防止使用者误操作。我们推荐使用固定版本的标签，比如 `halohub/halo:2.0.2`。
:::

1. 创建容器

    ```bash
    docker run \
      -it -d \
      --name halo \
      -p 8090:8090 \
      -v ~/.halo2:/root/.halo2 \
      -e HALO_EXTERNAL_URL=http://localhost:8090/ \
      -e HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME=admin \
      -e HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD=P@88w0rd \
      halohub/halo:2.0.2
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
      - `HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME`: 超级管理员用户名
      - `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD`: 超级管理员用户（admin）的初始化密码。如果该环境变量没有设置，系统将会生成随机密码并打印在日志中。

    环境变量详解：

    <DockerEnv />

1. 用浏览器访问 `$HALO_EXTERNAL_URL/console/`（外部访问链接）即可进入 Halo 管理端。管理员用户名为 `admin`，登录密码为上方设置的 `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD`。

    :::tip
    如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
    :::
