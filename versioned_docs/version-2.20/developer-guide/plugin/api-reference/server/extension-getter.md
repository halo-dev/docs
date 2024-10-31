---
title: 获取扩展
description: 了解如何在插件中使用 `ExtensionGetter` 获取扩展
---

`ExtensionGetter` 用于获取和管理 Halo 或其他插件提供的扩展。它提供了多种方法来根据扩展点获取扩展，确保插件能够灵活地集成和使用各种扩展功能。

`ExtensionGetter` 接口的定义如下：

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

包含以下方法：

1. `getEnabledExtension(Class<T> extensionPoint)`: 获取一个在扩展设置中已启用的扩展。如果没有找到对应配置，将使用 Halo 中的默认扩展，如果 Halo 没有提供默认实现则找到一个由**已启用插件**提供的可用扩展。
2. `getEnabledExtensions(Class<T> extensionPoint)`: 根据传入的扩展点类获取所有已启用扩展。如果没有在扩展设置页面配置过则会返回所有可用的扩展。
3. `getExtensions(Class<T> extensionPointClass)`: 获取所有与扩展点类相关的扩展，无论是否在扩展设置中启用它。

:::tip Note
使用 `getEnabledExtension` 方法或者 `getEnabledExtensions` 方法取决于扩展点声明的 `type` 是 `SINGLETON` 还是 `MULTI_INSTANCE`。

通过使用 `ExtensionGetter`，开发者可以轻松地在插件中访问和管理各种扩展点，提升插件的功能和灵活性。

如果想了解 Halo 提供的扩展点请参考：[扩展点](../../extension-points/server/index.md)。
:::

### 示例

如果你想在插件中获取已启用的搜索引擎扩展，可以使用 `ExtensionGetter` 来获取：

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
