---
title: 获取插件配置
description: 了解如何获取插件定义的设置表单对应的配置数据，以及如何在插件中使用配置数据。
---

插件的 `plugin.yaml` 中允许配置 `settingName` 和 `configMapName` 字段，用于定义插件的个性化设置。
本文介绍如何获取插件定义的设置表单对应的配置数据，以及如何在插件中使用配置数据。

## 概述

Halo 提供了两个 Bean 用于获取插件配置数据：`SettingFetcher` 和 `ReactiveSettingFetcher`，分别用于同步和异步获取配置数据。

以 `ReactiveSettingFetcher` 为例，提供了以下方法：

```java
public interface ReactiveSettingFetcher {

    <T> Mono<T> fetch(String group, Class<T> clazz);

    @NonNull
    Mono<JsonNode> get(String group);

    @NonNull
    Mono<Map<String, JsonNode>> getValues();
}
```

- `fetch` 方法用于获取指定分组的配置数据，并将其转换为指定的 Java 类型。
- `get` 方法用于获取指定分组的配置数据，返回 `JsonNode` 类型。
- `getValues` 方法用于获取所有配置数据，返回 `Map<String, JsonNode>` 类型，其中键为分组名称，值为配置对象。

`ReactiveSettingFetcher` 和 `SettingFetcher` 底层都对配置数据进行了缓存，以提高性能，并且在配置变更时会自动刷新缓存，所以直接调用这些方法即可获取最新的配置数据。

## 监听配置变更

当用户修改插件配置时，可以通过监听 `PluginConfigUpdatedEvent` 事件，执行相应的操作。`PluginConfigUpdatedEvent` 包含了配置变更前后的数据，使插件能够对变化做出响应。

```java
public class PluginConfigUpdatedEvent extends ApplicationEvent {
    private final Map<String, JsonNode> oldConfig;
    private final Map<String, JsonNode> newConfig;

    // ...
}
```

## 使用示例

### 定义设置表单

假设插件定义了一个名为 `setting-seo` 的设置表单，其中包含了 `blockSpiders`、`keywords` 和 `description` 三个字段：

```yaml
apiVersion: v1alpha1
kind: Setting
metadata:
  name: setting-seo
spec:
  forms:
    - group: seo  
      label: SEO 设置  
      formSchema:  
        - $formkit: checkbox  
          name: blockSpiders  
          label: "屏蔽搜索引擎"  
          value: false  
        - $formkit: textarea  
          name: keywords  
          label: "站点关键词"  
        - $formkit: textarea  
          name: description  
          label: "站点描述"
```

### 配置 plugin.yaml

在 `plugin.yaml` 中配置 `settingName` 和 `configMapName` 字段：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: fake-plugin
spec:
  displayName: "Fake Plugin"
  # ...
  configMapName: setting-seo-configmap
  settingName: setting-seo
```

### 定义值类

为了方便使用，定义一个值类存储配置数据：

```java
public record SeoSetting(boolean blockSpiders, String keywords, String description) {
  public static final String GROUP = "seo";
}
```

### 获取配置数据

通过依赖注入 `ReactiveSettingFetcher` 并使用 `fetch(group, type)` 方法查询配置：

```java
@Service
@RequiredArgsConstructor
public class SeoService {
    private final ReactiveSettingFetcher settingFetcher;

    public Mono<Void> checkSeo() {
        return settingFetcher.fetch(SeoSetting.GROUP, SeoSetting.class)
                .doOnNext(seoSetting -> {
                    if (seoSetting.blockSpiders()) {
                        // do something
                    }
                })
                .then();
    }
}
```

### 监听配置变更

通过监听 `PluginConfigUpdatedEvent` 事件来处理配置变更：

```java
@Component
public class SeoConfigListener {
    @EventListener
    public void onConfigUpdated(PluginConfigUpdatedEvent event) {
        if (event.getNewConfig().containsKey(SeoSetting.GROUP)) {
            // do something
        }
    }
}
```

通过以上示例，可以看到如何使用 `ReactiveSettingFetcher` 获取配置数据，并通过监听 `PluginConfigUpdatedEvent` 来处理配置变更事件，确保系统能及时响应配置的变化。
