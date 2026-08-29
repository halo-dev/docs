---
title: 依赖其他插件
description: 在 plugin.yaml 中声明 Halo 插件的必需、可选和版本依赖，并了解依赖检查与加载边界
---

只有插件必须直接调用另一个插件提供的 Java API 时，才需要声明运行时依赖。不共享 Java 类型时，优先考虑 [SharedEvent](./shared-events.md) 或[扩展点](./making-plugin-extensible.md)，减少插件间耦合。

## 依赖声明方式

依赖关系通过 `plugin.yaml` 的 `spec.pluginDependencies` 声明。键是依赖插件的 `metadata.name`，值是版本或版本范围：

```yaml
spec:
  pluginDependencies:
    PluginRequired: 1.2.0
    PluginRange: ">=1.0.0 & <2.0.0"
    PluginOptional?: ">=1.0.0"
```

- `PluginRequired` 必须存在且版本匹配，否则当前插件无法正常加载。
- `PluginRange` 使用版本范围约束当前已安装的插件版本。
- 名称以 `?` 结尾表示可选依赖；该能力从 Halo 2.20.11 开始提供。

插件名称必须使用依赖插件 `plugin.yaml` 中的 `metadata.name`，不能使用显示名称、Java 包名或 Maven artifactId。

## 依赖检查和加载

Halo 在安装或升级插件时检查：

1. 必需依赖是否存在。
2. 已解析依赖的版本是否满足约束。
3. 依赖关系中是否存在循环。

同一插件标识在一个 Halo 实例中只有一个已解析版本。Halo 不会在多个候选版本中选择“最合适”的版本；当前安装版本不满足约束时，依赖检查会失败。

可选依赖不存在时不会阻止插件加载，但插件代码仍需处理对应能力不可用的情况。不要仅因为声明了可选依赖，就在启动阶段无条件访问其 Bean 或类型。

:::tip 保持依赖范围可验证
优先声明已经测试过的最小版本和上限。过宽的范围会把未验证版本描述为兼容，精确版本则会增加两个插件必须同步发布的频率。
:::

## 提供依赖的插件项目结构

### 推荐项目结构 {#project-structure}

需要向其他插件公开 Java 类型时，将稳定接口放入独立 API 模块，插件实现模块依赖该模块；不要让使用方直接依赖插件实现 JAR。

项目拆分、Gradle 最小配置和发布边界见[发布共享 Java API](./shared-java-api.md)。

## 版本管理

运行时插件版本与共享 API artifact 版本应建立清晰对应关系。破坏接口二进制兼容性的变更需要提高主版本，并同步收紧 `pluginDependencies` 范围。

版本号应遵循[应用市场版本规范](../../app-store/publish-app.md#version-control)。

## 源码参考

- [插件描述符转换](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/plugin/YamlPluginDescriptorFinder.java)
- [安装和升级依赖检查](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/plugin/PluginServiceImpl.java)
