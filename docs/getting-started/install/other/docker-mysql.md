---
title: 使用 Docker 部署 Halo 和 Mysql
description: Halo 使用 docker 安装 的 mysql
---

### 简介

该章节我们将分三种情况为您说明该如何同时使用 docker+mysql 来部署 Halo

前提条件： 我们默认您的机器上已经安装好 docker

### 统一使用 docker 部署

如果你的机器上没有现成的`mysql`可供使用，那么您可以选择使用 docker 来运行 mysql 和 halo

1. 创建 docker 自定义桥接网络

```shell
docker network create halo-net
```

2. 拉取 mysql 镜像

```shell
docker pull mysql:8.0.27
```

3. 创建`mysql`数据目录

```shell
mkdir -p /data/mysql
```

3. 启动 mysql 实例

```shell
docker run --name some-mysql -v /data/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw --net halo-net --restart=unless-stopped -d mysql:8.0.27
```

注意: 请将`my-secret-pw` 修改为自己需要的密码后再执行

:::tip 释意

`-e MYSQL_ROOT_PASSWORD=my-secret-pw`: 指定`mysql`的登录密码为 `my-secret-pw`

`-v /data/mysql:/var/lib/mysql` 命令: 将宿主机的目录 `/data/mysql` 挂载到容器内部的目录 `/var/lib/mysql`，默认情况下 MySQL 将向 `/data/mysql` 写入其数据文件。

`--net halo-net`: 将该容器加入到 `halo-net` 网络,连接到 `halo-net` 网络的任何其他容器都可以访问 `some-mysql`容器上的所有端口。

:::

4. 创建`Halo`工作目录

```
mkdir ~/.halo && cd ~/.halo
```

5. 下载示例配置文件到[工作目录](https://docs.halo.run/getting-started/prepare#工作目录)

```shell
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

6. 编辑配置文件，配置数据库，其他配置请参考[参考配置](https://docs.halo.run/getting-started/config)

```shell
vim application.yaml

#修改如下datasource配置为mysql
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    # 修改此处密码为mysql密码
    password: my-secret-pw
```

7. 创建 Halo 容器实例

```shell
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --net halo-net --restart=unless-stopped halohub/halo:1.4.15
```

8. 打开 `http://ip:端口号` 即可看到安装引导界面。

如果您已有`docker`部署的`mysql`实例那么你需要使用`docker`部署`halo`并加入到`mysql`的网络中

首先需要查看 `mysql` 的网络，以此来决定 `halo` 的 `docker` 实例该使用什么样的网络
