---
title: 用户名密码认证管理器
description: 提供扩展用户名密码的身份验证的方法
---

用户名密码认证管理器扩展点用于替换 Halo 默认的用户名密码认证管理器实现，例如：使用第三方的身份验证服务，一个例子是 LDAP。

```java
public interface UsernamePasswordAuthenticationManager extends ExtensionPoint {
  Mono<Authentication> authenticate(Authentication authentication);
}
```

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

可以参考的实现示例 [TOTP 认证](https://github.com/halo-dev/halo/blob/86e688a15d05c084021b6ba5e75d56a8813c3813/application/src/main/java/run/halo/app/security/authentication/twofactor/totp/TotpAuthenticationFilter.java#L84)
