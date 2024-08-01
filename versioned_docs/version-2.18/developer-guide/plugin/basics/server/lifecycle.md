---
title: 生命周期
description: 了解插件从启动到卸载的过程
---

根据[插件项目文件结构](../../basics/structure.md)所展示的 `StarterPlugin.java` 中，具有如下方法：

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

:::tip Note
如果一个类继承了 `BasePlugin` 类但没有标记为 Bean，那么它将不会被 Halo 识别到，其中的生命周期方法也不会被调用。
:::

### 插件启动

插件被安装后，只加载了插件的 `plugin.yaml`，类及其他资源文件的加载均在启动时进行。
当插件加载完类文件并准备好启动插件后就会调用插件的 `start()` 方法，这有助于插件在启动时做一些事情，例如初始化。

### 插件停止

插件停止时，会删除在启动时创建的自定义资源，例如插件设置等通过 `yaml` 创建的自定义模型资源。
插件定义的自定义模型也需要在此时清理掉。

### 插件删除

插件被卸载时被调用。
