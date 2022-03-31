---
title: 系统结构
description: Halo 项目的构成
---

[Halo](https://github.com/halo-dev/halo) 博客系统分为以下四个部分：

| 项目名称                                                 | 简介                                                                                                                   |
| :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [halo](https://github.com/halo-dev/halo)                 | 提供整个系统的服务，采用 [Spring Boot](https://spring.io/) 开发                                                        |
| [halo-admin](https://github.com/halo-dev/halo-admin)     | 负责后台管理的渲染，采用 [Vue](https://vuejs.org/) 开发，已集成在 Halo 运行包内，无需独立部署。                                      |
| [halo-comment](https://github.com/halo-dev/halo-comment) | 评论插件，采用 [Vue](https://vuejs.org/) 开发，在主题中运行方式引入构建好的 `JavaScript` 文件即可                      |
| [halo-theme-\*](https://github.com/halo-dev)             | 主题项目集，采用 [FreeMarker](https://freemarker.apache.org/) 模板引擎编写，需要包含一些特殊的配置才能够被 halo 所使用 |

## 自定义配置

> 为什么要提前讲自定义配置呢？是因为在这里让大家了解到 `Halo` 的`配置方式`，以及`配置优先级`，不至于未来运行项目的时候不知道如何优雅地修改配置。

`Halo` 配置目录优先级如下（从上到下优先级越来越小，上层的配置将会覆盖下层）:

- `Halo` 自定义配置
  - file:~/.halo/
  - file:~/.halo-dev/
- `Spring Boot` 默认配置
  - file:./config/
  - file:./
  - classpath:/config/
  - classpath:/

> 参考: [Application Property Files](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html#boot-features-external-config-application-property-files)

在开发的时候，希望大家能够在 `~/halo-dev/application.yml` 中进行添加自定义配置。当然后面也会讲到如何用`运行参数` 和 `VM options` 进行控制配置，届时可根据具体情况进行选择。

:::warning
开发的时候，我们不建议直接更改`项目源码`中的所包含的`配置文件`，包括 `application.yml`、`application-dev.yml`、`application-test.yml` 和 `application-user.yml`。
:::
