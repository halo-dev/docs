---
title: 插件中的对象管理
description: 了解如何在创建中创建对象和管理对象依赖
---

在插件中你可以使用 [Spring Framework](https://spring.io/projects/spring-framework/) 提供的常用 Bean 注解来标注一个类，然后就能使用依赖注入功能注入其他类的对象。这省去了使用工厂创建类和维护的过程，你可以像开发一个常规的 Spring 项目一样来开发插件，目前支持以下 Spring Framework 的特性：

1. [Core Technologies](https://docs.spring.io/spring-framework/reference/core.html)
2. [Web on Reactive](https://docs.spring.io/spring-framework/reference/web-reactive.html)
3. [Testing](https://docs.spring.io/spring-framework/reference/testing.html)

通过模板插件创建的项目中你会看到 `StarterPlugin` 标注了 `@Component` 注解：

```java
@Component
public class StarterPlugin extends BasePlugin {
}
```

假设项目中有一个 `FruitService`，并将其声明了为了 Bean：

```java
@Service
public class FruitService {

}
```

你可以在任何同样声明为 Bean 的类中使用[依赖注入](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)来使用它：

```java
@Component
public class Demo {
  private final FruitService fruitService;

  public Demo(FruitService fruitService) {
    this.fruitService = fruitService;
  }
  // use it...
}
```

### 依赖注入 Halo 提供的 Bean

目前 Halo 只提供了少数几个 Bean 可以供插件依赖注入：

- run.halo.app.extension.ReactiveExtensionClient：用于管理自定义模型对象的增删改查，它是反应式的。
- run.halo.app.extension.ExtensionClient：用于管理自定义模型对象的增删改查，它是阻塞的，只能用在非 NIO 线程中，如后台任务。
- run.halo.app.extension.SchemeManager：用于管理自定义模型定义的注册和销毁。
- run.halo.app.infra.ExternalUrlSupplier：用于获取用户配置的 Halo 外部访问地址。
- run.halo.app.core.extension.service.AttachmentService：用于操作附件。
- run.halo.app.notification.NotificationReasonEmitter：用于发送通知。
- run.halo.app.notification.NotificationCenter：用于管理通知的订阅和取消订阅。
- run.halo.app.infra.ExternalLinkProcessor：用于处理将一个相对地址转换为外部访问地址。
- org.springframework.security.web.server.context.ServerSecurityContextRepository：用于获取操作用户的认证上下文信息，如自动登录场景。

即其他不在上述列表中的类的对象都是不可依赖注入的。
