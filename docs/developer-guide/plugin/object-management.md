---
title: 插件中的对象管理
description: 了解如何在创建中创建对象和管理对象依赖
---

在插件中你可以使用 [Spring](https://spring.io) 提供的常用 Bean 注解来标注一个类，然后就能使用依赖注入功能注入其他类的对象。这省去了使用工厂创建类和维护的过程。

通过模板插件创建的项目中你都可以看到 `StarterPlugin` 标注了 `@Component` 注解：

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

- ReactiveExtensionClient
- ExtensionClient
- SchemeManager
- ExternalUrlSupplier

即其他不在上述列表中的类的对象都是不可依赖注入的。
