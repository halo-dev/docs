---
title: 使用 Podman 部署
description: 使用 Podman 部署
---

import DockerArgs from "./slots/docker-args.md"

## 前言

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

:::info
什么是 Podman ?

Podman（全称 POD 管理器）是一款用于在 Linux® 系统上开发、管理和运行容器的开源工具。Podman 最初由红帽® 工程师联合开源社区一同开发，它可利用 lipod 库来管理整个容器生态系统。
Podman 采用无守护进程的包容性架构，因此可以更安全、更简单地进行容器管理，再加上 Buildah 和 Skopeo 等与之配套的工具和功能，开发人员能够按照自身需求来量身定制容器环境。

为什么选择 Podman 而不是 Docker ?

这个需要视情况而定, 如果您的主机配置不是很高, 您使用 Docker 时, 因为 Docker 自带的守护进程可能会雪上加霜, 它会大量占用您的资源。
而 Podman 采用无守护进程架构，而且容器是无根模式，您可以在占用资源极小的情况下运行镜像，并且获得很高的安全性。
而且 Podman 与 Docker 高度兼容，您不需要做特别配置即可将 Docker 容器运行在Podman 上。

[什么是 Podman?](https://www.redhat.com/zh/topics/containers/what-is-podman)

[Podman ArchWiki](https://wiki.archlinux.org/title/Podman)

[Podman 官网](https://podman.io/)
:::

:::tip
此文档提供使用默认 H2 数据库和 Postgresql 数据库的 Podman 运行示例，在生产环境我们不推荐使用 H2 数据库。
:::

## 环境搭建

- Podman 安装文档：<https://podman.io/docs/installation>

:::tip
我们推荐您先阅读 Podman 官方文档对 Podman 有了相关了解后，再考虑通过Linux包管理系统安装 Podman 或者使用文档中指定的方式安装 。
:::

## 使用 Docker 镜像

:::tip
为什么是 Docker 镜像?

通过[前言](#前言)我们已经了解了 Podman ，其中提到 ***Podman 与 Docker 高度兼容*** ，正是因为 Podman 完全是为了替代 Docker 而诞生，所以原本的 Docker 生态中的镜像我们可以无需更改直接使用。
:::

可用的 Halo 2.16 的 Docker 镜像：

- [halohub/halo](https://hub.docker.com/r/halohub/halo)
- [ghcr.io/halo-dev/halo](https://github.com/halo-dev/halo/pkgs/container/halo)

:::info 注意
目前 Halo 2 并未更新 Docker 的 latest 标签镜像，主要因为 Halo 2 不兼容 1.x 版本，防止使用者误操作。我们推荐使用固定版本的标签，比如 `halohub/halo:2.16` 或者 `halohub/halo:2.16.0`。

- `halohub/halo:2.16`：表示最新的 2.16.x 版本，即每次发布 patch 版本都会同时更新 `halohub/halo:2.16` 镜像。
- `halohub/halo:2.16.0`：表示一个具体的版本。

后续文档以 `halohub/halo:2.16` 为例。
:::

1. 创建容器

    ```bash
    mkdir -p ~/.halo2
    podman run -it -d --name halo -p 8090:8090 -v ~/.halo2:/root/.halo2 halohub/halo:2.16
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

1. 用浏览器访问 `/console` 即可进入 Halo 管理页面，首次启动会进入初始化页面。

    :::tip
    如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
    :::

## 升级版本

1. 备份数据，可以参考 [备份与恢复](../../user-guide/backup.md) 进行完整备份。
2. 拉取新版本镜像

  ```bash
  podman pull halohub/halo:2.16
  ```

3. 停止运行中的容器

  ```bash
  podman stop halo
  podman rm halo
  ```

4. 更新 Halo

  修改版本号后，按照最初安装的方式，重新创建容器即可。

   ```bash
   podman run -it -d --name halo -p 8090:8090 -v ~/.halo2:/root/.halo2 halohub/halo:2.16
   ```

## 使用 [Podman Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)

:::tip
Podman 没有和 Docker 类似的管理进程，在低配置的主机上更友好。
但是使用 Podman 想要开机后自动启动，官方推荐一种和 systemd 服务类似的语法文件，即 Podman Quadlet。
:::

下面是一个使用 Podstgresql 数据库的示例:

  ```bash
  mkdir -p /opt/podman-data/halo
  mkdir -p /etc/containers/systemd
  vim /etc/containers/systemd/halo.container
  ```

  ```conf
  [Unit]
  Description=The halo container
  Wants=network-online.target
  After=network-online.target

  [Container]
  AutoUpdate=registry
  ContainerName=halo
  User=60000
  Group=60000
  UserNS=keep-id:uid=60000,gid=60000
  Environment=JVM_OPTS="-Xmx512m -Xms256m"
  Environment=HALO_WORK_DIR="/.halo"
  Environment=SPRING_CONFIG_LOCATION="optional:classpath:/;optional:file:/.halo/"
  Environment=TZ=Asia/Shanghai
  Volume=/opt/podman-data/halo:/.halo
  PublishPort=127.0.0.1:8090:8090
  Image=ghcr.io/halo-dev/halo:2.16
  Exec=--halo.external-url=https://localhost:8090 --spring.sql.init.platform=postgresql --spring.r2dbc.url=r2dbc:pool:postgresql://127.0.0.1:5432/my-db --spring.r2dbc.username=my-user --spring.r2dbc.password=my-password --halo.cache.page.disabled=false

  [Service]
  Restart=always
  RestartSec=30s
  StartLimitInterval=30
  TimeoutStartSec=900
  TimeoutStopSec=70

  [Install]
  WantedBy=multi-user.target default.target
  ```

  ```bash
  systemctl daemon-reload
  systemctl start halo
  # 只需要systemctl start halo.
  # 之后重启会自动启动不需要enable服务.
  ```

Podman Quadlet 解析:

`[Unit]` 部分:

- Wants和After字段指定了Halo在什么服务后启动。

`[Container]` 部分:

- `AutoUpdate=registry`指定了自动拉取容器。假设后续Halo镜像支持了`latest`标签，你需要`systemctl enable --now podman-auto-update.timer`以启用容器自动更新。本文示例`ghcr.io/halo-dev/halo:2.16`，将会自动更新适用与`2.16`版本的patch，例如您创建容器时是`2.16.1`，在官方发布`2.16.2`版本时，容器会自动更新到`2.16.2`。
- `ContainerName=`指定了 systemd 将生成的服务名称。
- `User=60000 Group=60000 UserNS=keep-id:uid=60000,gid=60000` 限制容器以 id 60000 的用户运行，提高安全性。注意这个id 60000请根据你实际想要运行的用户名来修改，可通过`id user`获得你的用户的id.
- `Environment=`字段指定了容器的环境变量，其中你需要注意的是`Environment=HALO_WORK_DIR="/.halo"` `Environment=SPRING_CONFIG_LOCATION="optional:classpath:/;optional:file:/.halo/"`这两个变量中的`/.halo`路径。
- `Volume=`字段指定挂载到容器储存Halo配置文件的路径，请仔细观察`/opt/podman-data/halo:/.halo`其中的`/.halo`要与上面需要注意的环境变量路径要一致。
- `PublishPort=`和docker -p命令一致，即需要映射的端口。
- `Image=ghcr.io/halo-dev/halo` 即Docker镜像的地址，注意要完整的。比如`ghcr.io`这个路径就不能少，如果你没有配置 Podman 的 registries 文件，此路径就必不可少，建议写全。
- `Exec=` 即附加到Halo容器的 Command ，具体变量参考上方的 DockerArgs 。多个变量以空格分开。

`[Service]` 部分:
即原生systemd语法

- `Restart` 指定遇到错误后总是重启容器
- `RestartSec` 重启的间隔时间
- `StartLimitInterval` 重启的次数，超过这个次数将不再重启。
- `TimeoutStartSec` 启动容器的超时时间，建议不要修改，因为每次开机后 Podman 将自动拉取容器，这时也许耗时会很长，这些时间是算在启动时间中的。如果定义太小的时间，可能将导致 Podman 无法拉取容器镜像。
- `TimeoutStopSec` 停止容器时的超时时间，`systemctl stop halo` 假设使用这个命令，如果停止时间超过了`TimeoutStopSec`定义的时间，将会被系统Kill.

`[Install]` 部分:

此部分请查看systemd文档，不建议修改。

使用默认的 root 用户运行时无需定义 `User=60000 Group=60000 UserNS=keep-id:uid=60000,gid=60000` 与 `Environment=HALO_WORK_DIR="/.halo"` `Environment=SPRING_CONFIG_LOCATION="optional:classpath:/;optional:file:/.halo/"`，
示例:

  ```bash
  mkdir -p /opt/podman-data/halo
  mkdir -p /etc/containers/systemd
  vim /etc/containers/systemd/halo.container
  ```

  ```conf
  # /etc/containers/systemd/halo.container
  [Unit]
  Description=The halo container
  Wants=network-online.target
  After=network-online.target

  [Container]
  AutoUpdate=registry
  ContainerName=halo
  Volume=/opt/podman-data/halo:/root/.halo
  PublishPort=127.0.0.1:8090:8090
  Image=ghcr.io/halo-dev/halo:2.16
  Exec=--halo.external-url=https://localhost:8090 --spring.sql.init.platform=postgresql --spring.r2dbc.url=r2dbc:pool:postgresql://127.0.0.1:5432/my-db --spring.r2dbc.username=my-user --spring.r2dbc.password=my-password --halo.cache.page.disabled=false

  [Service]
  Restart=always
  RestartSec=30s
  StartLimitInterval=30
  TimeoutStartSec=900
  TimeoutStopSec=70

  [Install]
  WantedBy=multi-user.target default.target
  ```
