---
title: 生命周期
description: 理解 Halo 插件的启动、停止和删除生命周期，区分运行时资源、预置资源与持久化业务数据的清理边界
---

插件入口类继承的 `BasePlugin` 提供以下生命周期方法。脚手架默认重写 `start()` 和 `stop()`；只有需要处理卸载行为时才重写 `delete()`：

```java
@Override
public void start() {
    System.out.println("插件启动成功！");
}

@Override
public void stop() {
    System.out.println("插件停止！");
}

@Override
public void delete() {
    System.out.println("插件被删除！");
}
```

它们就是插件的生命周期方法，分别对应插件的启动、停止和删除。

1. 继承 `run.halo.app.plugin.BasePlugin` 类后，你可以重写这些方法来干预插件的生命周期，例如在插件启动时初始化一些资源，在插件停止时清理掉这些资源。
2. 一个插件项目只允许有一个类继承 `BasePlugin` 类且标记为 Bean，此时这个类将被作为插件的后端入口，如果有多个类继承了 `BasePlugin` 会导致插件无法启动或生命周期方法无法被调用。

:::tip 将 BasePlugin 注册为 Bean
如果一个类继承了 `BasePlugin` 类但没有标记为 Bean，那么它将不会被 Halo 识别到，其中的生命周期方法也不会被调用。
:::

## 生命周期与数据边界

| 方法       | 调用时机       | 适合执行的操作                                                  |
| ---------- | -------------- | --------------------------------------------------------------- |
| `start()`  | 插件启动时     | 注册自定义模型 Scheme、初始化缓存、注册监听器等运行时资源       |
| `stop()`   | 插件停止或禁用 | 注销 Scheme、关闭监听器和连接、释放缓存等可重新创建的运行时资源 |
| `delete()` | 插件被卸载时   | 按插件的卸载约定清理外部资源或持久化数据                        |

:::warning 不要在 stop() 中删除持久化业务数据
`stop()` 也会在插件禁用、重载等场景中调用。插件重新启动后仍需使用的自定义模型数据不应在此删除。

只有在插件的卸载约定明确要求删除数据时，才应在 `delete()` 中执行持久化数据清理，并提前考虑数据备份和不可恢复风险。
:::

存储方式参考[数据存储](./data-storage.md)。

## 插件启动

插件被安装后，只加载了插件的 `plugin.yaml`，类及其他资源文件的加载均在启动时进行。
当插件加载完类文件并准备好启动插件后就会调用插件的 `start()` 方法。自定义模型需要在此注册 Scheme，并在 `stop()` 中对称地注销：

```java
@Override
public void start() {
    schemeManager.register(MyExtension.class);
}

@Override
public void stop() {
    schemeManager.unregister(Scheme.buildFromType(MyExtension.class));
}
```

## 插件停止

插件停止时，应释放由 `start()` 创建且能够在下次启动时重建的运行时资源，例如 Scheme、监听器、连接和缓存。

Halo 还会清理由插件 `src/main/resources/extensions/*.yaml` 加载并记录的预置资源，但以下资源不属于这项停止清理：

- `spec.settingName` 指向的 `Setting`，它由 Halo 单独管理。
- 带有 `halo.run/do-not-overwrite` 标签的预置资源。
- 插件在运行期间创建的持久化业务数据。

因此，不要把“注销自定义模型的 Scheme”和“删除该模型的所有数据”混为一谈。

## 插件删除

`delete()` 在插件被卸载时调用，适合执行仅在卸载时需要的最终清理。Halo 会在插件清理流程中移除插件文件、反向代理以及 `spec.settingName` 指向的 `Setting`；插件自行管理的外部资源或业务数据是否删除，应由插件的卸载约定决定。
