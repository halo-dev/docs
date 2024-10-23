---
title: 配置说明
description: Halo 的运行配置说明文档
---

在前面的部署文档中，为了保证部署流程的简洁，只说明了运行所必须的配置，但除了运行之外，Halo 还提供了不少其他的配置以及我们所使用的 Web 框架的配置，这个文档我们将详细介绍 Halo 的完整配置。

## 配置方式

Halo 支持通过多种方式进行配置，目前 [Docker Compose 部署文档](./docker-compose.md) 的示例是通过运行参数配置，[JAR 文件部署方式](./jar-file.md) 是通过配置文件进行配置。

### 通过运行参数

通常我们在使用 Docker Compose 部署的时候推荐使用这种方式进行配置，配置方式为在 Docker Compose 配置文件的 `command` 添加对应的配置条目即可，比如：

```yaml {5-10}
services:
  halo:
    image: registry.fit2cloud.com/halo/halo:2.20
    ...
    command:
      - --spring.r2dbc.url=r2dbc:pool:postgresql://halodb/halo
      - --spring.r2dbc.username=halo
      - --spring.r2dbc.password=openpostgresql
      - --spring.sql.init.platform=postgresql
      - --halo.external-url=http://localhost:8090/
```

### 通过配置文件

通常我们在使用 JAR 文件部署的时候更推荐使用这种方式进行配置，配置文件名称为 `application.yaml`，并且需要在运行的时候通过 `--spring.config.additional-location` 参数指定配置文件存放的目录，运行示例：

```bash
java -jar halo.jar --spring.config.additional-location=optional:file:$HOME/.halo2/
```

配置示例：

```yaml title="~/.halo2/application.yaml"
spring:
  r2dbc:
    url: r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE
    username: admin
    password: 123456
  sql:
    init:
      mode: always
      platform: h2
```

:::info
完整的 JAR 文件部署文档可查阅：[使用 JAR 文件部署](./jar-file.md)
:::

当然，使用 Docker Compose 部署同样支持通过这种方式配置，只需要将 `application.yaml` 放在工作目录的挂载目录即可，示例：

```bash
❯ tree
.
├── docker-compose.yaml
└── halo2
    └── application.yaml

2 directories, 2 files
```

其中，`docker-compose.yaml` 的 Halo 服务的 `volumes` 应该包含 `./halo2:/root/.halo2`。

## 配置列表

### Halo 独有配置

通常用于生产环境的配置：

| 配置路径                                           | 说明                                                                                                                                                                                                                                                           | 生产环境默认值                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `halo.work-dir`                                    | Halo [工作目录](../prepare.md#工作目录)，通常不建议修改                                                                                                                                                                                                        | `${user.home}/.halo2`             |
| `halo.external-url`                                | 网站的实际访问地址，如：`https://www.halo.run`                                                                                                                                                                                                                 | `http://localhost:8090`           |
| `halo.use-absolute-permalink`                      | 永久链接是否生成为绝对地址，设置为 `true` 时，请确保正确配置了 `halo.external-url`                                                                                                                                                                             | `false`                           |
| `halo.security.frame-options.disabled`             | 是否禁止网站通过 iframe 嵌入                                                                                                                                                                                                                                   | `false`                           |
| `halo.security.frame-options.mode`                 | iframe 嵌入模式，默认为同源，可设置的值为 `DENY`、`SAMEORIGIN`                                                                                                                                                                                                 | `SAMEORIGIN`                      |
| `halo.security.referrer-options.policy`            | Referrer-Policy 是一个 HTTP 头部字段，用于控制浏览器在发送请求时如何处理 Referer 信息，可设置的值请参考 [https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy) | `strict-origin-when-cross-origin` |
| `halo.security.remember-me.token-validity`         | 保持登录会话的有效期，默认为 14 天（14d）                                                                                                                                                                                                                      | `14d`                             |
| `halo.security.basic-auth.disabled`                | 是否禁用 API 的 Basic Auth 认证                                                                                                                                                                                                                                | `true`                            |
| `halo.security.two-factor-auth.disabled`           | 是否禁用系统全局的两步验证                                                                                                                                                                                                                                     | `false`                           |
| `halo.attachment.resource-mappings[0].pathPattern` | 附件资源代理匹配规则，这个设置通常适用于从其他平台迁移的场景                                                                                                                                                                                                   | `/upload/**`                      |
| `halo.attachment.resource-mappings[0].locations`   | 附件资源代理目录，只能放置在[工作目录](../prepare.md#工作目录)的 `attachments` 目录                                                                                                                                                                            | `migrate-from-1.x`                |

通常用于开发环境的配置：

| 配置路径                      | 说明                        | 默认值 |
| ----------------------------- | --------------------------- | ------ |
| `halo.console.proxy.endpoint` | 开发环境的 Console 代理地址 | --     |
| `halo.console.proxy.enabled`  | 是否启用 Console 代理地址   | --     |
| `halo.uc.proxy.endpoint`      | 开发环境的 UC 代理地址      | --     |
| `halo.uc.proxy.enabled`       | 是否启用 UC 代理地址        | --     |
| `halo.plugin.runtime-mode`    | 插件的运行模式              | --     |

### Web 框架本身的配置

Halo 使用了 [Spring Boot](https://docs.spring.io/spring-boot/) 和 [Spring WebFlux](https://docs.spring.io/spring-framework/reference/web/webflux.html)，完整的配置可查阅：[Common Application Properties](https://docs.spring.io/spring-boot/appendix/application-properties/index.html#appendix.application-properties.core)，以下将列出关于 Halo 常用的配置：

Web 服务相关：

| 配置路径                                                    | 说明                                                                                                                                            | 默认值  |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `server.port`                                               | Web 服务端口                                                                                                                                    | `8090`  |
| `server.compression.enabled`                                | 是否开启 gzip 压缩                                                                                                                              | `true`  |
| `spring.web.resources.cache.cachecontrol.max-age`           | 设置静态资源的缓存存储的最大周期，超过这个时间缓存被认为过期                                                                                    | `365d`  |
| `spring.web.resources.cache.cachecontrol.no-cache`          | 设置静态资源响应头的 `Cache-Control` 为 `no-cache`，在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证（协商缓存验证）              | `false` |
| `spring.web.resources.cache.cachecontrol.use-last-modified` | 是否为静态资源添加 Last-Modified 响应头，Last-Modified 表示服务器上资源的最后修改时间。当浏览器第一次请求资源时，服务器会在响应头中包含这个字段 | `true`  |
| `spring.thymeleaf.cache`                                    | 是否开启模版引擎缓存                                                                                                                            | `true`  |

数据库相关：

| 配置路径                   | 说明                                                        | 默认值 |
| -------------------------- | ----------------------------------------------------------- | ------ |
| `spring.r2dbc.url`         | 数据库连接地址，详细可查阅下方的 `数据库配置`               | --     |
| `spring.r2dbc.username`    | 数据库用户名                                                | --     |
| `spring.r2dbc.password`    | 数据库密码                                                  | --     |
| `spring.sql.init.platform` | 数据库平台名称，支持 `postgresql`、`mysql`、`mariadb`、`h2` | --     |

数据库配置：

| 链接方式    | 链接地址格式                                                                       | `spring.sql.init.platform` |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------- |
| PostgreSQL  | `r2dbc:pool:postgresql://{HOST}:{PORT}/{DATABASE}`                                 | postgresql                 |
| MySQL       | `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`                                      | mysql                      |
| MariaDB     | `r2dbc:pool:mariadb://{HOST}:{PORT}/{DATABASE}`                                    | mariadb                    |
| H2 Database | `r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE` | h2                         |
