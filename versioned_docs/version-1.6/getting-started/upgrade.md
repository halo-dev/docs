---
title: 版本升级
description: 版本升级指南
---

当前最新版本为：1.6.0。在更新之前建议先查阅变更日志：<https://github.com/halo-dev/halo/releases/tag/v1.6.0>

## Linux

:::info
我们假设你存放运行包的路径为 `~/app`，运行包的文件名为 `halo.jar`，且使用了 systemd 进行进程管理，如有不同，下列命令请按需修改。
:::

1. 停止正在运行的服务

```bash
service halo stop
```

2. 备份数据以及旧的运行包（**重要**）

```bash
cp -r ~/.halo ~/.halo.archive
```

```bash
mv ~/app/halo.jar ~/app/halo.jar.archive
```

> 需要注意的是，`.halo.archive` 和 `halo.jar.archive` 文件名不一定要根据此文档命名，这里仅仅是个示例。

3. 清空 [leveldb](./config.md#缓存) 缓存（如果有使用 leveldb 作为缓存策略）

```bash
rm -rf ~/.halo/.leveldb
```

4. 下载最新版本的运行包

```bash
cd ~/app && wget https://dl.halo.run/release/halo-1.6.0.jar -O halo.jar
```

:::info
如果下载速度不理想，可以[在这里](/getting-started/downloads)选择其他下载地址。
:::

5. 启动测试

```bash
java -jar halo.jar
```

:::info
如测试启动正常，请继续下一步。使用 <kbd>CTRL</kbd>+<kbd>C</kbd> 停止运行测试进程。
:::

6. 重启服务

```bash
service halo start
```

## Docker

:::info
我们假设您的容器是按照 [使用 Docker 部署 Halo](/getting-started/install/docker) 中的命令构建的。如有不同，请根据实际情况修改。
:::

1. 停止并删除当前运行中的容器

```bash
docker stop halo
```

```bash
docker rm -f halo
```

:::info
你的容器名称不一定为 `halo`，在执行前可以先执行 `docker ps -a` 查看一下。
:::

2. 备份数据（重要）

```bash
cp -r ~/.halo ~/.halo.archive
```

> 需要注意的是，`.halo.archive` 文件名不一定要根据此文档命名，这里仅仅是个示例。

3. 清空 [leveldb](./config.md#缓存) 缓存（如果有使用 leveldb 作为缓存策略）

```bash
rm -rf ~/.halo/.leveldb
```

4. 拉取最新的 Halo 镜像

```bash
docker pull halohub/halo:1.6.0
```

:::info
查看最新版本镜像：<https://hub.docker.com/r/halohub/halo> ，我们推荐使用具体版本号的镜像，但也提供了 `latest` 标签的镜像，它始终是最新的。
:::

5. 创建容器

```bash
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --restart=unless-stopped halohub/halo:1.6.0
```

- **-it：** 开启输入功能并连接伪终端
- **-d：** 后台运行容器
- **--name：** 为容器指定一个名称
- **-p：** 端口映射，格式为 `主机(宿主)端口:容器端口` ，可在 `application.yaml` 配置。
- **-v：** 工作目录映射。形式为：-v 宿主机路径:/root/.halo，后者不能修改。
- **--restart：** 建议设置为 `unless-stopped`，在 Docker 启动的时候自动启动 Halo 容器。
