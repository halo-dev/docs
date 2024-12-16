---
title: 使用 JAR 文件部署
---

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare.md)，这可以快速帮助你了解 Halo。
:::

## 依赖检查

在开始之前，需要确保服务器已经满足以下条件：

1. [Java](https://openjdk.org) 环境，目前 Halo 最低需要 **JRE 17** 的环境。
2. 数据库（任一）
   - [MySQL 5.7+](https://www.mysql.com)
   - [MariaDB](https://mariadb.org)
   - [PostgreSQL](https://www.postgresql.org)

由于 Linux 发行版本的差异以及包管理器的不同，此文档不会涉及到如何安装 Java 环境以及数据库，建议查阅对应依赖的官方文档进行安装。

## 安装

1. 创建新的系统用户

   :::info
   我们不推荐直接使用系统 root 用户来运行 Halo。如果你需要直接使用 root 用户，请跳过这一步。
   :::

   创建一个名为 halo 的用户（名字可以随意）

   ```bash
   useradd -m halo
   ```

   为 halo 用户创建密码

   ```bash
   passwd halo
   ```

   登录到 halo 账户

   ```bash
   su - halo
   ```

2. 创建存放运行包的目录，这里以 `~/app` 为例

   ```bash
   mkdir ~/app && cd ~/app
   ```

3. 下载运行包

   ```bash
   wget https://dl.halo.run/release/halo-2.17.0.jar -O halo.jar
   ```

   :::info
   以下是官方维护的下载地址：
   1. [https://download.halo.run](https://download.halo.run)
   2. [https://github.com/halo-dev/halo/releases](https://github.com/halo-dev/halo/releases)
   :::

4. 创建 [工作目录](../prepare#工作目录)

   ```bash
   mkdir ~/.halo2 && cd ~/.halo2
   ```

5. 创建 Halo 配置文件

   ```bash
   vim application.yaml
   ```

   将以下内容复制到 `application.yaml` 中，根据下面的配置说明进行配置。

   ```yaml title="application.yaml"
   server:
     # 运行端口
     port: 8090
   spring:
     # 数据库配置，支持 MySQL、MariaDB、PostgreSQL、H2 Database，具体配置方式可以参考下面的数据库配置
     r2dbc:
       url: r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE
       username: admin
       password: 123456
     sql:
       init:
         mode: always
         # 需要配合 r2dbc 的配置进行改动
         platform: h2
   halo:
     # 工作目录位置
     work-dir: ${user.home}/.halo2
     # 外部访问地址
     external-url: http://localhost:8090
     # 附件映射配置，通常用于迁移场景
     attachment:
       resource-mappings:
         - pathPattern: /upload/**
           locations:
             - migrate-from-1.x
   ```

   数据库配置说明：

   | 参数名                     | 描述                                                    |
   |----------------------------|-------------------------------------------------------|
   | `spring.r2dbc.url`         | 数据库连接地址，详细可查阅下方的 `配置对应关系`          |
   | `spring.r2dbc.username`    | 数据库用户名                                            |
   | `spring.r2dbc.password`    | 数据库密码                                              |
   | `spring.sql.init.platform` | 数据库平台名称，支持 `postgresql`、`mysql`、`mariadb`、`h2` |

   配置对应关系：

   | 链接方式    | 链接地址格式                                                                       | `spring.sql.init.platform` |
   |-------------|------------------------------------------------------------------------------------|----------------------------|
   | PostgreSQL  | `r2dbc:pool:postgresql://{HOST}:{PORT}/{DATABASE}`                                 | postgresql                 |
   | MySQL       | `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`                                      | mysql                      |
   | MariaDB     | `r2dbc:pool:mariadb://{HOST}:{PORT}/{DATABASE}`                                    | mariadb                      |
   | H2 Database | `r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE` | h2                         |

   :::info
   - HOST：数据库服务地址，如 `localhost`
   - PORT：数据库服务端口，如 `3306`
   - DATABASE：数据库名称，如 `halo`，需要提前创建
   :::

   :::warning
   不推荐在生产环境使用默认的 H2 数据库，这可能因为操作不当导致数据文件损坏。如果因为某些原因（如内存不足以运行独立数据库）必须要使用，建议按时[备份数据](../../user-guide/backup.md)。
   :::

   配置完成之后，保存即可。

6. 测试运行 Halo

   ```bash
   cd ~/app && java -jar halo.jar --spring.config.additional-location=optional:file:$HOME/.halo2/
   ```

7. 如果没有观察到异常日志，即可尝试访问 Halo

   打开 `http://ip:端口号` 即可跳转到初始化页面。

   :::info
   如测试启动正常，请继续看[作为服务运行](#作为服务运行)部分，第 8 步仅仅作为测试。当你关闭 ssh 连接之后，服务会停止。你可使用 <kbd>CTRL</kbd>+<kbd>C</kbd> 停止运行测试进程。
   :::

   :::tip
   如果需要配置域名访问，建议先配置好反向代理以及域名解析再进行初始化。如果通过 `http://ip:端口号` 的形式无法访问，请到服务器厂商后台将运行的端口号添加到安全组，如果服务器使用了 Linux 面板，请检查此 Linux 面板是否有还有安全组配置，需要同样将端口号添加到安全组。
   :::

## 作为服务运行

下面将介绍如何将 Halo 作为服务运行，以实现在关闭 ssh 连接后，Halo 仍然可以正常运行。

此文档以 Systemd 为例，也可以参考：[Installing Spring Boot Applications](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html#deployment.installing)

1. 退出 halo 账户，登录到 root 账户

   > 如果当前就是 root 账户，请略过此步骤。

   ```bash
   exit
   ```

2. 创建 halo.service 文件

   ```bash
   vim /etc/systemd/system/halo.service
   ```

   将以下内容复制到 `halo.service` 中，根据下面的配置说明进行配置。

   ```ini {9,10} title="/etc/systemd/system/halo.service"
   [Unit]
   Description=Halo Service
   Documentation=https://docs.halo.run
   After=network-online.target
   Wants=network-online.target

   [Service]
   Type=simple
   User=USER
   ExecStart=/usr/bin/java -server -Xms256m -Xmx256m -jar JAR_PATH --spring.config.additional-location=optional:file:/home/halo/.halo2/
   ExecStop=/bin/kill -s QUIT $MAINPID
   Restart=always
   StandOutput=syslog

   StandError=inherit

   [Install]
   WantedBy=multi-user.target
   ```

   - **JAR_PATH**：Halo 运行包的绝对路径，例如 `/home/halo/app/halo.jar`，注意：此路径不支持 `~` 符号。
   - **USER**：运行 Halo 的系统用户，如果有按照上方教程创建新的用户来运行 Halo，修改为你创建的用户名称即可。反之请删除 `User=USER`。

   :::tip
   请确保 `/usr/bin/java` 是正确无误的。建议将 `ExecStart` 中的命令复制出来运行一下，保证命令有效。
   :::

   配置完成之后，保存即可。

3. 重新加载 systemd

   ```bash
   systemctl daemon-reload
   ```

4. 运行服务

   ```bash
   systemctl start halo
   ```

5. 在系统启动时启动服务

   ```bash
   systemctl enable halo
   ```

最后，你可以通过下面的命令查看服务日志：

```bash
journalctl -n 20 -u halo
```

## 版本升级

1. 备份数据，可以参考 [备份与恢复](../../user-guide/backup.md) 进行完整备份
2. 停止 Halo 服务

   ```bash
   service halo stop
   ```

3. 下载新版本的 Halo 运行包，覆盖原有的运行包

   ```bash
   wget https://dl.halo.run/release/halo-2.17.0.jar -O /home/halo/app/halo.jar
   ```

4. 启动 Halo 服务

   ```bash
   service halo start
   ```

## 反向代理

你可以在下面的反向代理软件中任选一项，我们假设你已经安装好了其中一项，并对其的基本操作有一定了解。 如果你对它们没有任何了解，可以参考我们更为详细的反向代理文档：

1. 使用 [Nginx Proxy Manager](../install/other/nginxproxymanager.md)

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
