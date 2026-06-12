---
title: 为主题提供数据
description: 了解如何为主题提供更多获取和使用数据的方法。
---

当你在插件中创建了自己的自定义模型时，你可能需要在主题模板中使用这些数据。或者，你提供一些额外的数据，以便主题可以使用它们，你可以通过创建一个自定义的 `finder` 来实现这一点。

## 创建一个 Finder

首先，你需要创建一个 `interface`，并在其中定义你需要提供给主题获取数据的方法，方法的返回值可以是 `Mono` 或 `Flux` 类型，例如：

```java
public interface LinkFinder {
  Mono<LinkVo> get(String linkName);

  Flux<LinkVo> listAll();
}
```

然后写一个实现类，实现这个 `interface`，并在类上添加 `@Finder` 注解，例如：

```java
import run.halo.app.theme.finders.Finder;

@Finder("myPluginLinkFinder")
public class LinkFinderImpl implements LinkFinder {
  @Override
  public Mono<LinkVo> get(String linkName) {
    // ...
  }

  @Override
  public Flux<LinkVo> listAll() {
    // ...
  }
}
```

`@Finder` 注解的值是你在主题中使用的名称，例如，你可以在主题中使用 `myPluginLinkFinder.get('a-link-name')` 来获取数据，`myPluginLinkFinder` 就是你在 `@Finder` 注解中定义的名称。

## Finder 命名

为了避免与其他插件的 `finder` 名称冲突，建议在 `@Finder` 注解中添加一个你插件名称的前缀作为 `finder` 名称且名称需要是驼峰式的，不能包含除了 `_` 之外的其他特殊字符。

例如，你的插件名称是 `my_plugin`，你需要为主题提供一个获取链接的 `finder`，那么你可以这样定义 `@Finder` 注解：

```java
@Finder("myPluginLinkFinder")
```

## 使用 Finder

在主题中，你可以通过 `finder` 名称和方法名及对应的参数来获取数据，例如：

```html
<div th:text="${myPluginLinkFinder.listAll()}">
</div>
```

模板语法参考：[Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#standard-expression-syntax)。
