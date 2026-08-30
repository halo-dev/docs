---
title: 获取插件配置
description: 了解如何获取插件定义的设置表单对应的配置数据，以及如何在插件中使用配置数据。
---

插件的 `plugin.yaml` 中允许配置 `settingName` 和 `configMapName` 字段，用于定义插件的个性化设置。
本文介绍如何获取插件定义的设置表单对应的配置数据，以及如何在插件中使用配置数据。

如何关联 `plugin.yaml` 与 Setting、选择 FormKit 输入组件，请先参考[插件设置与表单组件](../../basics/ui/forms.md)和[表单定义与组件速查](../../../form-schema.md)。

## 概述

Halo 提供了两个 Bean 用于获取插件配置数据：`SettingFetcher` 和 `ReactiveSettingFetcher`，分别用于同步和异步获取配置数据。

以 `ReactiveSettingFetcher` 为例，提供了以下方法：

```java
public interface ReactiveSettingFetcher {

    <T> Mono<T> fetch(String group, Class<T> clazz);

    @NonNull
    Mono<JsonNode> getSettingValue(String group);

    @NonNull
    Mono<Map<String, JsonNode>> getSettingValues();
}
```

- `fetch` 方法用于获取指定分组的配置数据，并将其转换为指定的 Java 类型。
- `getSettingValue` 方法用于获取指定分组的配置数据，返回 `JsonNode` 类型。
- `getSettingValues` 方法用于获取所有配置数据，返回 `Map<String, JsonNode>` 类型，其中键为分组名称，值为配置对象。

:::warning 已废弃的方法
`get(group)` 和 `getValues()` 自 Halo 2.23.0 起被标记为 `@Deprecated(forRemoval = true)`，将在后续版本移除，请迁移到 `getSettingValue(group)` 和 `getSettingValues()`。注意新方法的返回类型为 Jackson 3 的 `tools.jackson.databind.JsonNode`，而废弃方法返回 Jackson 2 的 `com.fasterxml.jackson.databind.JsonNode`，迁移时需要同步调整 import。
:::

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

假设项目同步插件定义了一个名为 `project-sync-settings` 的设置表单，其中包含自动同步开关和同步间隔：

```yaml title="src/main/resources/extensions/settings.yaml"
apiVersion: v1alpha1
kind: Setting
metadata:
  name: project-sync-settings
spec:
  forms:
    - group: sync
      label: 同步设置
      formSchema:
        - $formkit: switch
          name: enabled
          label: 启用自动同步
          value: false
        - $formkit: number
          name: interval
          label: 同步间隔（分钟）
          value: 30
          validation: required|min:5
```

### 配置 plugin.yaml

在 `plugin.yaml` 中配置 `settingName` 和 `configMapName` 字段：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: project-sync
spec:
  displayName: 项目同步
  # ...
  configMapName: project-sync-config
  settingName: project-sync-settings
```

### 定义值类

为了方便使用，定义一个值类存储配置数据：

```java
public record SyncSetting(boolean enabled, int interval) {
    public static final String GROUP = "sync";
}
```

### 获取配置数据

通过依赖注入 `ReactiveSettingFetcher` 并使用 `fetch(group, type)` 方法查询配置：

```java
@Service
@RequiredArgsConstructor
public class SyncService {
    private final ReactiveSettingFetcher settingFetcher;

    public Mono<Void> syncProjects() {
        return settingFetcher.fetch(SyncSetting.GROUP, SyncSetting.class)
                .doOnNext(syncSetting -> {
                    if (syncSetting.enabled()) {
                        // 使用 syncSetting.interval() 安排下一次同步
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
public class SyncConfigListener {
    @EventListener
    public void onConfigUpdated(PluginConfigUpdatedEvent event) {
        if (event.getNewConfig().containsKey(SyncSetting.GROUP)) {
            // 重新安排同步任务
        }
    }
}
```

通过以上示例，可以看到如何使用 `ReactiveSettingFetcher` 获取配置数据，并通过监听 `PluginConfigUpdatedEvent` 来处理配置变更事件，确保系统能及时响应配置的变化。
