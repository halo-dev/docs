---
title: 配置参考
description: Halo 配置文件的详细介绍及参考
---

Halo 的配置文件名为 `application.yaml`，其必须位于[工作目录](/getting-started/prepare#工作目录) `~/.halo` 下。 Halo 会读取该目录下的配置文件进行加载。

:::info
如果您是单独下载的官方配置文件，则必须将文件名 application-template.yaml 重命名为 application.yaml
:::

如下将详细列出配置文件 `application.yaml` 中所有的配置项。

## 基础配置

基础配置中的配置设置一般来说是**必要的**，且必须在 application.yaml 里进行定义。

### 端口

用于指定 HTTP 服务器监听的端口，Halo 默认设置为 `8090`。

```yaml
server:
  port: 8090
```

请注意，如果您选择设置端口为 `80`，则需要确保您的 80 端口未被占用，通常**不建议**直接设置为 80 端口。

### 数据库

Halo 目前支持 `H2` 及 `MySQL` 数据库。

:::tip
得益于我们使用的 ORM 框架，Halo 在首次启动的时候会自动根据实体类创建表结构，无需通过 SQL 脚本自行创建，也不会提供所谓的 SQL 脚本。所以，此步骤仅需配置好数据库连接地址和用户名密码即可。注意，H2 无需手动创建数据库，MySQL 需要。
:::

#### H2

:::info
推荐使用 **H2**，较其他数据库来说更为方便。
:::

```yaml
spring:
  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:file:~/.halo/db/halo
    username: admin
    password: 123456
  h2:
    console:
      settings:
        web-allow-others: false
      path: /h2-console
      enabled: false
```

**注意事项**：

- `url` 为默认的数据本地存储地址，请勿修改。
- 默认的数据库账户和密码为 `admin` 和 `123456`，建议将其修改，并妥善保存（此用户名和密码在 Halo 第一次启动的时候将自动创建。并且不支持首次启动后，通过修改配置文件中的账户或者密码，如果修改，再次启动将提示用户名或者密码错误。）。
- 线上环境中，`h2` 的配置使用默认即可。如果需要手动修改一些数据，可将 `web-allow-others` 和 `enabled` 设为 `true` 来开启 h2 控制台，访问路径为 `ip:端口/h2-console`。`JDBC URL`，`username`，`password` 使用配置文件中的即可。

:::warning
特别注意：在开启 `h2-console` 并完成所需操作之后，一定要再次关闭 `h2-console` 并重启，不要长时间将 `h2-console` 处于开启状态，这可能会有隐性的安全风险。
:::

#### MySQL

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 123456
```

**要求**：

1. 版本：5.7 +
2. 字符集（Character Set）：`utf8mb4`
3. 排序规则（Collate）：`utf8mb4_bin`
4. 存储引擎：`InnoDB`

综上，建议创建数据库采用下面的命令：

```bash
create database halodb character set utf8mb4 collate utf8mb4_bin;
```

**注意事项**：

- `username` 及 `password` 需要修改为您的 MySQL 数据库账号和密码。
- 默认时区为 `Asia/Shanghai`，如果与您所在时区不一致，则可以修改为您所在的时区。

## 高级配置

高级配置中的配置设置是可选的，如果不需要，可以略过。

### 后台路径

Halo 支持自定义后台管理的**根路径**。

```yaml
halo:
  # Your admin client path is https://your-domain/{admin-path}
  admin-path: admin
```

注意：仅为改动后台管理的根路径，因此前后不带 `/`。

### 缓存

某些情况下，需要用户根据需求来设置缓存数据的保存方式，例如将缓存数据持久化保存在本地。

```yaml
halo:
  # memory or level or redis
  cache: memory
```

目前支持三种策略：

- `memory` 将数据缓存至内存，重启服务缓存将清空。
- `level` 将数据缓存至本地，重启服务不会清空缓存。
- `redis` 将数据缓存至 Redis，重启服务不会清空缓存，如需分布式部署 Halo，请选用此种缓存方式。

**注意事项**：

- 如果选用 Redis 缓存方式，请在配置文件加入 Redis 相关配置，完整的配置示例如下：

```yaml
server:
  port: 8090
  
  # Response data gzip.
  compression:
    enabled: true
    
spring:
  datasource:
    # MySQL database configuration.
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 123456
  redis:
    # Redis cache configuration.
    port: 6379
    database: 0
    host: 127.0.0.1
    password: 123456

halo:
  # Your admin client path is https://your-domain/{admin-path}
  admin-path: admin

  # memory or level or redis
  cache: redis
```

### 压缩

启用压缩对于减少带宽和加快页面加载非常有用，在**未使用** `Nginx` 或 `Caddy` 等反向代理服务器时（反向代理服务器通常是默认开启 Gzip 的），可以考虑开启系统自带的 Gzip 功能。

```yaml
server:
  # Response data gzip.
  compression:
    enabled: true
```

## 示例配置文件

:::info
建议根据使用的数据库类型查看。
:::

### H2 Database

```yaml
server:
  port: 8090

  # Response data gzip.
  compression:
    enabled: true
spring:
  datasource:
    # H2 database configuration.
    driver-class-name: org.h2.Driver
    url: jdbc:h2:file:~/.halo/db/halo
    username: admin
    password: 123456

  # H2 database console configuration.
  h2:
    console:
      settings:
        web-allow-others: false
      path: /h2-console
      enabled: false

halo:
  # Your admin client path is https://your-domain/{admin-path}
  admin-path: admin

  # memory or level or redis
  cache: memory
```

### MySQL

```yaml
server:
  port: 8090

  # Response data gzip.
  compression:
    enabled: true
spring:
  datasource:
    # MySQL database configuration.
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/halodb?characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: 123456

halo:
  # Your admin client path is https://your-domain/{admin-path}
  admin-path: admin

  # memory or level or redis
  cache: memory
```

官方的完整示例配置文件可以在 [https://dl.halo.run/config/](https://dl.halo.run/config/) 下找到。
