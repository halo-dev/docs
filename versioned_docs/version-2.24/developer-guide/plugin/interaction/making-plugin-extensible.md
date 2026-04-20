---
title: 插件如何被扩展
description: 了解如何在 Halo 中定义扩展点接口、声明扩展点，并在插件中实现这些扩展点。
---
在 Halo 插件开发中，扩展点（Extension Point）是一种灵活的机制，允许插件在定义的接口上进行功能扩展，使其他插件可以基于该接口实现自定义逻辑。

本章节将详细介绍如何在 Halo 中定义和声明扩展点，为插件提供可扩展的接口，支持插件间的扩展与集成。

## 定义扩展点

在 Halo 中，扩展点由接口和相关的 YAML 文件定义。

以下是定义扩展点的详细步骤：

### 创建扩展点接口

在 Halo 核心代码中，扩展点接口表示了该插件可扩展的功能模块。开发者需要定义一个接口，并继承 ExtensionPoint 接口，以此作为扩展点的标志。

接口中定义的方法将成为插件实现时需扩展的具体方法。

**示例：** 定义文件处理扩展点接口

```java
import org.pf4j.ExtensionPoint;
import reactor.core.publisher.Mono;

public interface ReactiveNotifier extends ExtensionPoint {

  Mono<Void> notify(NotificationContext context);
}
```

在以上示例中，`ReactiveNotifier` 接口定义了发送通知的方法，该方法将允许其他插件用于扩展通知方式如邮件、短信或 Webhook。

### 声明扩展点

定义了扩展点接口之后，需要声明扩展点用于在用户界面展示和查找扩展点的具体实现，参考 [声明自定义模型](../api-reference/server/extension.md#declare-extension-object)

**示例：** 在 YAML 文件中定义文件处理扩展点

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: reactive-notifier
spec:
  className: run.halo.app.notification.ReactiveNotifier
  displayName: "消息通知器"
  description: "用于扩展消息通知方式，以向用户发送通知"
  type: MULTI_INSTANCE
  icon: "notifier.svg"
```

在此 YAML 配置中：

- name：reactive-notifier 是该扩展点的唯一标识，建议加上插件名称作为前缀以避免冲突，参考 [metadata.name 命名规范](../api-reference/server/extension.md#naming-spec-for-metadata-name)
- className：指定扩展点接口的完整类路径，用于通过类加载器加载实现类。
- displayName：扩展点的显示名称，用于描述其功能。
- description：简要描述扩展点的功能。
- type：标明扩展点的类型，可选择 `SINGLE_INSTANCE`（单实例）或 `MULTI_INSTANCE`（多实例），单实例就是只能有一个启用的扩展如评论组件扩展，多示例则是可以同时启用多个如过滤器。
- icon: 扩展点的图标，非必填，用于在用户界面中展示，它应该是一个可访问的链接，参考 [ReverseProxy](../api-reference/server/reverseproxy.md)。

至此，扩展点已在 Halo 中定义并注册，可供其他插件进行实现。

然后需要将包含此扩展点类型的包发布到 Maven 供其他插件引用来实现扩展，参考 [插件 API 模块项目结构](dependency.md#提供依赖的插件项目结构)。

## 查找扩展

插件定义了扩展点之后就可以在需要的地方查找扩展并调用对应方法来对功能进行扩展和增强。

`ExtensionGetter` 用于获取和管理 Halo 或其他插件提供的扩展。

**示例：** 查找通知器扩展

```java
@Component
@RequiredArgsConstructor
public class NotificationSender {
  private final ExtensionGetter extensionGetter;

  @Override
  public Mono<Void> sendNotification(NotificationContext context) {
    return extensionGetter.getEnabledExtensions(ReactiveNotifier.class)
      .flatMap(notifier -> notifier.notify(context))
      .then();
  }
}
```

参考 [获取扩展](../api-reference/server/extension-getter.md) 了解更多关于 `ExtensionGetter` 的使用。
