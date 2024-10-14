---
title: 登录增强
description: 了解如何在登录时如何允许 Halo 做登录逻辑的增强切入。
---

## 背景

在 Halo 中，插件可以实现多种登录方式，例如LDAP、第三方登录等。然而，灵活的登录方式也带来了以下问题：

1. 登录逻辑难以统一：例如登录成功后需要进行额外处理，这需要插件自行实现。
2. Halo 或其他插件无法知晓登录状态：无法记录登录日志等额外处理。
3. 新增安全特性适配：Halo 增加了新安全特性，插件需要适配才能使用，如在记住我机制中需要在登录成功后设置 remember-me cookie。

为了解决这些问题，Halo 提供了登录增强机制，插件可以在登录成功或失败时调用登录增强器，使 Halo 可以执行额外的处理逻辑。随着 Halo 的版本更新，这些逻辑也会更新，而插件无需做任何修改。

### 登录增强器

Halo 提供了一个 LoginHandlerEnhancer 的 Bean，插件可以通过依赖注入的方式在合适的位置调用该 Bean 的方法，以便 Halo 可以在登录成功或失败后执行逻辑切入。

```java
public interface LoginHandlerEnhancer {

    /**
     * Invoked when login success.
     *
     * @param exchange The exchange.
     * @param successfulAuthentication The successful authentication.
     */
    Mono<Void> onLoginSuccess(ServerWebExchange exchange, Authentication successfulAuthentication);

    /**
     * Invoked when login fails.
     *
     * @param exchange The exchange.
     * @param exception the reason authentication failed
     */
    Mono<Void> onLoginFailure(ServerWebExchange exchange, AuthenticationException exception);
}
```

例如在用户密码登录的处理器中，可以这样调用登录增强器：

```java
public class UsernamePasswordHandler implements ServerAuthenticationSuccessHandler,
    ServerAuthenticationFailureHandler {
    @Override
    public Mono<Void> onAuthenticationFailure(WebFilterExchange webFilterExchange,
        AuthenticationException exception) {
        var exchange = webFilterExchange.getExchange();
        return loginHandlerEnhancer.onLoginFailure(exchange, exception)
            .then(handleFailure(exchange, exception));
    }

    @Override
    public Mono<Void> onAuthenticationSuccess(WebFilterExchange webFilterExchange,
        Authentication authentication) {
      return loginHandlerEnhancer.onLoginSuccess(webFilterExchange.getExchange(), authentication)
          .then(handleSuccess(webFilterExchange.getExchange(), authentication);
    }
}
```

设备管理、记住我等机制都依赖于登录增强器。插件开发者可以通过在合适的时机调用登录增强器来实现这些功能，确保插件与 Halo 的安全特性无缝集成。
