---
title: 扩展点
description: Halo 服务端为插件提供的扩展点接口
---

术语：

- 扩展点
  - 由 Halo 定义的用于添加特定功能的接口。
  - 扩展点应该在服务的核心功能和它所认为的集成之间的交叉点上。
  - 扩展点是对服务的扩充，但不是影响服务的核心功能：区别在于，如果没有其核心功能，服务就无法运行，而扩展点对于特定的配置可能至关重要该服务最终是可选的。
  - 扩展点应该小且可组合，并且在相互配合使用时，可为 Halo 提供比其各部分总和更大的价值。
- 扩展
  - 扩展点的一种具体实现。

使用 Halo 扩展点的必要步骤是：

1. 实现扩展点接口，然后标记上 `@Component` 注解。
2. 对该扩展点的实现类进行 `ExtensionDefinition` 自定义模型对象的声明。

例如： 实现一个通知器的扩展，首先 `implements` ReactiveNotifier 扩展点接口：

```java
@Component
public class EmailNotifier implements ReactiveNotifier {
   @Override
    public Mono<Void> notify(NotificationContext context) {
        // Send notification
    }
}
```

然后声明一个 `ExtensionDefinition` 自定义模型对象：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionDefinition
metadata:
  name: halo-email-notifier # 指定一个扩展定义的名称
spec:
  # 扩展的全限定类名
  className: run.halo.app.notification.EmailNotifier
  # 所实现的扩展点定义的自定义模型对象名称
  extensionPointName: reactive-notifier
  # 扩展名称用于展示给用户
  displayName: "EmailNotifier"
  # 扩展的简要描述，用于让用户了解该扩展的作用
  description: "Support sending notifications to users via email"
```

:::tip Note
每一个扩展点都会声明一个对应的 `ExtensionPointDefinition` 自定义模型对象被称之为扩展点定义，用于描述该扩展点的信息，例如：扩展点的名称、描述、扩展点的类型等。

而每一个扩展也必须声明一个对应的 `ExtensionDefinition` 自定义模型对象被称之为扩展定义，用于描述该扩展的信息，例如：扩展的名称、描述、对应扩展点的对象名称等。
:::

关于如何在插件中声明自定义模型对象请参考：[自定义模型](../../server/extension.md#declare-extension-object)

以下是目前已支持的扩展点列表：

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
