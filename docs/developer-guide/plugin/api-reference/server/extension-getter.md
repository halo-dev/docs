---
title: 获取扩展
description: 了解如何在插件中获取扩展
---

Halo 提供了丰富的扩展点，而插件不仅可以实现扩展点，也可以通过使用 `ExtensionGetter` 来获取 Halo 或其他插件所提供的扩展。

关于插件如何实现扩展点的详细信息，请参考：[扩展点](./extension-points/index.md)。

```java
public interface ExtensionGetter {

    /**
     * Get only one enabled extension from system configuration.
     *
     * @param extensionPoint is extension point class.
     * @return implementation of the corresponding extension point. If no configuration is found,
     * we will use the default implementation from application context instead.
     */
    <T extends ExtensionPoint> Mono<T> getEnabledExtension(Class<T> extensionPoint);

    /**
     * Get the extension(s) according to the {@link ExtensionPointDefinition} queried
     * by incoming extension point class.
     *
     * @param extensionPoint extension point class
     * @return implementations of the corresponding extension point.
     * @throws IllegalArgumentException if the incoming extension point class does not have
     *                                  the {@link ExtensionPointDefinition}.
     */
    <T extends ExtensionPoint> Flux<T> getEnabledExtensions(Class<T> extensionPoint);

    /**
     * Get all extensions according to extension point class.
     *
     * @param extensionPointClass extension point class
     * @param <T> type of extension point
     * @return a bunch of extension points.
     */
    <T extends ExtensionPoint> Flux<T> getExtensions(Class<T> extensionPointClass);
}
```

### 示例

#### 单实例扩展点

对于单实例扩展点，例如 `SearchEngine` 扩展点，同一时间只能有一个实例被启用。要在插件中获取启用的搜索引擎扩展，可以使用以下代码：

```java
@Service
@RequiredArgsConstructor
public class SearchService {
    private final ExtensionGetter extensionGetter;

    Mono<SearchEngine> getSearchEngine() {
        return extensionGetter.getEnabledExtension(SearchEngine.class)
    }
}
```

#### 多实例扩展点

对于多实例扩展点，例如 `ReactiveNotifier` 扩展点，可以同时启用多个实例。要在插件中获取所有启用的通知器扩展，可以使用以下代码：

```java
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final ExtensionGetter extensionGetter;

    Flux<ReactiveNotifier> getNotifiers() {
        return extensionGetter.getEnabledExtensions(ReactiveNotifier.class)
    }
}
```

### 进阶使用

拥有 `ExtensionGetter` 后，我们便可以实现插件与插件之间的相互扩展了。

例如，我们在 A 插件中提供了一个扩展点，并且 A 插件基于此扩展点实现了一个默认扩展。此时我们便可以通过 `ExtensionGetter` 在 B 插件中获取 A 插件所提供的扩展了。

下面是一个简单的示例：

1. Plugin A 提供一个扩展点

```java
public interface MonitorExtension extends ExtensionPoint {

    Mono<Void> Send(String message);
}
```

2. 声明一个 `ExtensionPointDefinition` 自定义模型对象，描述 `MonitorExtension` 扩展点的信息。

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: monitor
spec:
  className: run.halo.plugin.extension.MonitorExtension
  displayName: Monitor
  type: SINGLETON
  description: "It provides an extension point for listening to messages"
```

2. Plugin A 实现了一个默认扩展

```java

```
