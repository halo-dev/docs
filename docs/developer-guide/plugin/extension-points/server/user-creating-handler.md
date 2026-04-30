---
title: 用户创建处理器
description: 提供在用户创建前后执行自定义逻辑的扩展点。
---

用户创建处理器扩展点用于在用户创建前后执行自定义逻辑，例如：初始化用户配置、发送欢迎通知、同步到第三方系统等。

## 用户创建前处理器

```java
public interface UserPreCreatingHandler extends ExtensionPoint {

    Mono<Void> preCreating(User user);
}
```

- `preCreating` 方法在用户创建之前执行，参数 `user` 为即将创建的用户对象，可在此方法中修改用户属性。
- 返回 `Mono.empty()` 表示处理成功。

## 用户创建后处理器

```java
public interface UserPostCreatingHandler extends ExtensionPoint {

    Mono<Void> postCreating(User user);
}
```

- `postCreating` 方法在用户创建成功之后执行，参数 `user` 为已创建的用户对象。
- 返回 `Mono.empty()` 表示处理成功。

## 扩展点定义

`UserPreCreatingHandler` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: user-pre-creating-handler
spec:
  className: run.halo.app.core.user.service.UserPreCreatingHandler
  displayName: "用户创建前处理器"
  type: MULTI_INSTANCE
  description: "提供在用户创建之前执行自定义逻辑的扩展方式"
```

`UserPostCreatingHandler` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: user-post-creating-handler
spec:
  className: run.halo.app.core.user.service.UserPostCreatingHandler
  displayName: "用户创建后处理器"
  type: MULTI_INSTANCE
  description: "提供在用户创建之后执行自定义逻辑的扩展方式"
```

使用案例可以参考 Halo 核心代码中相关实现。
