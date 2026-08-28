---
title: 用户名密码认证管理器
description: 实现 UsernamePasswordAuthenticationManager 单实例扩展点，用 LDAP 等第三方身份验证服务替换 Halo 默认的用户名密码认证逻辑
---

用户名密码认证管理器扩展点用于替换 Halo 默认的用户名密码认证管理器实现，例如：使用第三方的身份验证服务，一个例子是 LDAP。

```java
public interface UsernamePasswordAuthenticationManager
    extends ReactiveAuthenticationManager, ExtensionPoint {}
```

实现类通过继承的 `authenticate` 方法完成认证：返回认证结果表示认证成功；返回 `Mono.empty()` 或抛出非 `AuthenticationException` 异常时，Halo 会回退到内置用户名密码认证；抛出 `AuthenticationException` 时则直接按认证失败处理。

`UsernamePasswordAuthenticationManager` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: username-password-authentication-manager
spec:
  className: run.halo.app.security.authentication.login.UsernamePasswordAuthenticationManager
  displayName: Username password authentication manager
  type: SINGLETON
  description: "Provides a way to extend the username password authentication."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `username-password-authentication-manager`。

源码参考：[扩展点接口](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/security/authentication/login/UsernamePasswordAuthenticationManager.java)、[认证管理器委托与回退逻辑](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/security/authentication/login/UsernamePasswordDelegatingAuthenticationManager.java)。
