---
title: 生命周期
description: 了解插件从启动到卸载的过程
---

根据[插件项目文件结构](./structure.md)所展示的 `StarterPlugin.java` 中，具有如下方法：

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

### 插件启动

插件被安装后，只加载了插件的 `plugin.yaml`，类及其他资源文件的加载均在启动时进行。
当插件加载完类文件并准备好启动插件后就会调用插件的 `start()` 方法，这有助于插件在启动时做一些事情，例如初始化。

### 插件停止

插件停止时，会删除在启动时创建的自定义资源，例如插件设置等通过 `yaml` 创建的自定义模型资源。
插件定义的自定义模型也需要在此时清理掉。

### 插件删除

插件被卸载时被调用。
