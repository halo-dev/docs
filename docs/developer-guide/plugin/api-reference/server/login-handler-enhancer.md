---
title: 登录增强
description: 在插件的认证流程中调用 LoginHandlerEnhancer，将登录成功与失败事件交给 Halo 统一处理记住我、设备管理和登录日志等安全逻辑
---

## 背景

在 Halo 中，插件可以实现多种登录方式，例如 LDAP、第三方登录等。然而，灵活的登录方式也带来了以下问题：

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

如果插件自定义了认证过滤器或登录端点，可以先调用登录增强器，再委托给自己的成功或失败处理器：

```java
@RequiredArgsConstructor
public class PluginAuthenticationHandler implements ServerAuthenticationSuccessHandler,
    ServerAuthenticationFailureHandler {

    private final LoginHandlerEnhancer loginHandlerEnhancer;
    private final ServerAuthenticationSuccessHandler delegateSuccessHandler;
    private final ServerAuthenticationFailureHandler delegateFailureHandler;

    @Override
    public Mono<Void> onAuthenticationFailure(
        WebFilterExchange webFilterExchange,
        AuthenticationException exception
    ) {
        var exchange = webFilterExchange.getExchange();
        return loginHandlerEnhancer.onLoginFailure(exchange, exception)
            .then(delegateFailureHandler.onAuthenticationFailure(
                webFilterExchange,
                exception
            ));
    }

    @Override
    public Mono<Void> onAuthenticationSuccess(
        WebFilterExchange webFilterExchange,
        Authentication authentication
    ) {
        var exchange = webFilterExchange.getExchange();
        return loginHandlerEnhancer.onLoginSuccess(exchange, authentication)
            .then(delegateSuccessHandler.onAuthenticationSuccess(
                webFilterExchange,
                authentication
            ));
    }
}
```

设备管理、记住我等机制都依赖登录增强器。每次认证结果只应调用一次：仅实现 `UsernamePasswordAuthenticationManager` 时，Halo 内置的成功和失败处理器已经负责调用，无需在认证管理器中重复调用；自行处理完整登录流程时才需要显式调用。

源码参考：[登录成功处理器](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/security/authentication/LoginSuccessHandler.java)、[登录失败处理器](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/security/authentication/LoginFailureHandler.java)。
