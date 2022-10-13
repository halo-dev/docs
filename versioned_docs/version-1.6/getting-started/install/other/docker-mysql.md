---
title: 使用 Docker 部署 Halo 和 MySQL
description: Halo 与 MySQL 在 Docker 中的部署方案
---

### 简介

该章节我们将分三种情况为您说明该如何同时使用 Docker + MySQL 来部署 Halo

前提条件： 我们默认您的机器上已经安装好 `Docker`

- 如果你想完全通过 `Docker` 运行 `MySQL` 和 `Halo` 请参考小节《统一使用 Docker 安装》
- 如果你已经有 `Docker`部署的 `MySQL`，想安装 `Halo` 请参考小节《MySQL 部署在 Docker 如何使用 Docker 安装 Halo》
- 如果你已有 `MySQL` 但部署在宿主机，想通过 `Docker` 安装 `Halo` 请参考小节《MySQL 在宿主机如何通过 Docker 安装 Halo》

### 统一使用 Docker 安装

如果你的机器上没有现成的 `MySQL` 可供使用，那么您可以选择使用 `Docker` 来运行 `MySQL` 和 `Halo`

1. 创建 Docker 自定义桥接网络

```shell
docker network create halo-net
```

:::tip
如果你之前有 Docker 使用经验，你可能已经习惯了使用 `--link` 参数来使容器互联。

但随着 Docker 网络的完善，强烈建议大家将容器加入自定义的 Docker 网络来连接多个容器，而不是使用 --link 参数。
Docker 官方文档中称：该--link 标志是 Docker 的遗留功能。它可能最终会被删除。除非您确定需要继续使用它，否则我们建议您使用用户定义的网络来促进两个容器之间的通信，而不是使用 --link。
:::

2. 拉取 `MySQL` 镜像

```shell
docker pull mysql:8.0.27
```

3. 创建 `MySQL` 数据目录

```shell
mkdir -p ~/.halo/mysql
```

3. 启动 `MySQL` 实例

```shell
docker run --name some-mysql -v ~/.halo/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw --net halo-net --restart=unless-stopped -d mysql:8.0.27
```

注意: 请将 `my-secret-pw` 修改为自己需要的密码后再执行，密码尽量包含小写字母、大写字母、数字和特殊字符且长度超过 8 位。

:::tip 释意

`-e MYSQL_ROOT_PASSWORD=my-secret-pw`: 指定`MySQL`的登录密码为 `my-secret-pw`

`-v ~/.halo/mysql:/var/lib/mysql` 命令: 将宿主机的目录 `~/.halo/mysql` 挂载到容器内部的目录 `/var/lib/mysql`，默认情况下 MySQL 将向 `~/.halo/mysql` 写入其数据文件。

`--net halo-net`: 将该容器加入到 `halo-net` 网络,连接到 `halo-net` 网络的任何其他容器都可以访问 `some-mysql`容器上的所有端口。

:::

4. 进入 MySQL 容器中登录 MySQL 并创建 Halo 需要的数据库

- (1) some-mysql 为 MySQL 实例的容器名称

  ```shell
  docker exec -it some-mysql /bin/bash
  ```

- (2) 登录 MySQL

  ```shell
  mysql -u root -p
  ```

- (3) 输入 MySQL 数据库密码

- (4) 创建数据库

  ```shell
  create database halodb character set utf8mb4 collate utf8mb4_bin;
  ```

- (5) 使用 `exit`退出`MySQL` 并退出容器

5. 创建 `Halo` 工作目录

```bash
mkdir ~/.halo && cd ~/.halo
```

6. 下载示例配置文件到[工作目录](https://docs.halo.run/getting-started/prepare#工作目录)

```shell
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

7. 编辑配置文件，配置数据库，其他配置请参考[参考配置](https://docs.halo.run/getting-started/config)

```shell
vim application.yaml
```

你需要做如下几个步骤：

- 注释 H2 database configuration.部分
- 启用 MySQL database configuration.部分
- 修改 datasource 下的 url 中的 ip 地址部分为容器名称并修改密码为您设定的 `MySQL` 密码

修改后的内容如下:

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://some-mysql:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: my-secret-pw
```

8. 创建 Halo 容器实例

```shell
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --net halo-net --restart=unless-stopped halohub/halo:1.6.0
```

9. 打开 `http://ip:端口号` 即可看到安装引导界面。

### MySQL 部署在 Docker 如何使用 Docker 安装 Halo

如果您已有 `Docker` 部署的 `MySQL` 实例，那么为了保证 `Halo` 和 `MySQL` 两个容器的网络可以互通，和上文同样的思路可以创建一个网络让 `MySQL` 和 `Halo` 都加入进来。

1. 使用 `docker ps` 来查看的你 `MySQL` 容器实例的名称或 `container id`， 例如 `some-mysql`
2. 创建一个桥接网络，让 `MySQL` 加入，首先使用 `docker network ls` 来查看一下都有哪些网络名称，起一个不会冲突的网络名称，例如 `halo-net`，其次让已经存在的 MySQL 容器实例加入到该网络中

```shell
docker network connect halo-net some-mysql
```

3. 同之前一样创建 `Halo` 工作目录

```bash
mkdir ~/.halo && cd ~/.halo
```

4. 下载示例配置文件到[工作目录](https://docs.halo.run/getting-started/prepare#工作目录)

```shell
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

5. 编辑配置文件，修改 `MySQL` 的数据库连接和密码

```shell
vim application.yaml
```

你需要做如下几个步骤：

- 注释 H2 database configuration.部分
- 启用 MySQL database configuration.部分
- 修改 datasource 下的 url 中的 ip 地址部分为容器名称并修改密码为您设定的 `MySQL` 密码

修改后的内容如下:

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://some-mysql:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: my-secret-pw
```

6. 创建 `Halo` 容器实例,并使用 `--net` 指定网络为刚才创建的`halo-net`

```shell
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --net halo-net --restart=unless-stopped halohub/halo:1.6.0
```

### MySQL 在宿主机如何通过 Docker 安装 Halo

如果你已有 `MySQL` 但安装在宿主机，你想使用 `Docker` 安装 `Halo` 那么此时为了保证 `MySQL` 和 `Halo` 能网络互通，可以使用 `host` 网络模式即 `--net host`。

1. 创建 `Halo` 的工作目录

```shell
mkdir ~/.halo && cd ~/.halo
```

2. 拉取配置

```shell
wget https://dl.halo.run/config/application-template.yaml -O ./application.yaml
```

3. 使用 `Docker` 启动 `Halo` 实例并指定网络模式为 `host`

```shell
docker run -it -d --name halo -p 8090:8090 -v ~/.halo:/root/.halo --net host --restart=unless-stopped halohub/halo:1.6.0
```
