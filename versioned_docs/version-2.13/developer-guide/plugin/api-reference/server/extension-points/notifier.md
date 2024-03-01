---
title: 通知器
description: 为以何种方式向用户发送通知提供的扩展点。
---

通知器扩展点是用于扩展为 Halo 通知系统提供更多通知方式的扩展点，例如：邮件、短信、WebHook 等。

```java
public interface ReactiveNotifier extends ExtensionPoint {

    Mono<Void> notify(NotificationContext context);
}
```

`notify` 方法用于发送通知，参数：context 为通知上下文，包含通知的内容、接收者、通知配置等信息。

除了实现该扩展点并声明 `ExtensionDefinition` 自定义模型对象外，还需要声明一个 `NotifierDescriptor` 自定义模型对象用于描述通知器，例如：

```yaml
apiVersion: notification.halo.run/v1alpha1
kind: NotifierDescriptor
metadata:
  name: default-email-notifier
spec:
  displayName: '邮件通知'
  description: '通过邮件将通知发送给用户'
  notifierExtName: 'halo-email-notifier'
  senderSettingRef:
    name: 'notifier-setting-for-email'
    group: 'sender'
  #receiverSettingRef:
  #  name: ''
  #  group: ''
```

- `notifierExtName` 为通知器扩展的自定义模型对象名称
- `senderSettingRef` 用于声明通知器的发送者配置，例如：邮件通知器的发送者配置为：SMTP 服务器地址、端口、用户名、密码等，如果没有可以不配置，参考：[表单定义](../../../../form-schema.md)
  - `name` 为发送者配置的名称，它是一个 `Setting` 自定义模型对象的名称。
  - `group` 用于引用到一个具体的配置 Schema 组，它是一个 `Setting` 自定义模型对象中描述的 `formSchema` 的 `group`，由于 `Setting` 可以声明多个配置分组但通知器的发送者配置只能有在一个组，因此需要指定一个组。
- `receiverSettingRef` 用于声明通知器的接收者配置，例如：邮件通知器的接收者配置为：接收者邮箱地址，如果没有可以不配置，`name` 和 `group` 配置同 `senderSettingRef`。

当配置了 `senderSettingRef` 后，触发通知时 `notify` 方法的 `context` 参数中会包含 `senderConfig` 即为发送者配置的值，`receiverConfig` 同理。

`ReactiveNotifier` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: reactive-notifier
spec:
  className: run.halo.app.notification.ReactiveNotifier
  displayName: Notifier
  type: MULTI_INSTANCE
  description: "Provides a way to extend the notifier to send notifications to users."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `reactive-notifier`。

使用案例可以参考：[Halo 邮件通知器](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/notification/EmailNotifier.java)
