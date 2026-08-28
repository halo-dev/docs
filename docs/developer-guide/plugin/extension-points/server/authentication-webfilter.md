---
title: 认证安全过滤器
description: 提供 Security WebFilter 扩展点，插件可实现自定义认证逻辑，例如：用户名密码认证，JWT 认证，匿名认证。
---

此前，Halo 提供了 AdditionalWebFilter 作为扩展点供插件扩展认证相关的功能。但是近期我们明确了 AdditionalWebFilter 的使用用途，故不再作为认证的扩展点。

目前，Halo 提供了以下认证相关的扩展点：

- 表单登录认证
- HTTP Basic 认证
- OAuth2 授权码认证
- 普通认证
- 匿名认证
- Security 前置过滤器
- Security 后置过滤器

实现接口并注册为 Spring Bean 后，还需要声明 `ExtensionDefinition`。接口、所在位置与 `extensionPointName` 的对应关系如下：

| 位置 | 接口 | `extensionPointName` |
| --- | --- | --- |
| Security 最前 | `BeforeSecurityWebFilter` | `before-security-webfilter` |
| HTTP Basic | `HttpBasicSecurityWebFilter` | `http-basic-security-webfilter` |
| 表单登录 | `FormLoginSecurityWebFilter` | `form-login-security-webfilter` |
| 普通认证 | `AuthenticationSecurityWebFilter` | `authentication-security-webfilter` |
| 匿名认证 | `AnonymousAuthenticationSecurityWebFilter` | `anonymous-authentication-security-webfilter` |
| OAuth2 授权码 | `OAuth2AuthorizationCodeSecurityWebFilter` | `oauth2-authorization-code-security-webfilter` |
| Security 最后 | `AfterSecurityWebFilter` | `after-security-webfilter` |

同一位置存在多个实现时，可通过实现 `Ordered` 或添加 `@Order` 控制先后顺序。源码参考：[SecurityWebFiltersConfigurer](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/security/SecurityWebFiltersConfigurer.java)。

我们在实现扩展点的时候需要注意：如果当前请求不满足认证条件，请一定要调用 `chain.filter(exchange)`，给其他 filter 留下机会。

## 表单登录（FormLogin）

示例如下：

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.FormLoginSecurityWebFilter;

@Component
public class MyFormLoginSecurityWebFilter implements FormLoginSecurityWebFilter {

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    // Do your logic here
    return chain.filter(exchange);
  }

}
```

## HTTP Basic 认证

示例如下：

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.HttpBasicSecurityWebFilter;

@Component
public class MyHttpBasicSecurityWebFilter implements HttpBasicSecurityWebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Do your logic here
        return chain.filter(exchange);
    }
}
```

## OAuth2 授权码认证

示例如下：

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.OAuth2AuthorizationCodeSecurityWebFilter;

@Component
public class MyOAuth2SecurityWebFilter implements OAuth2AuthorizationCodeSecurityWebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Do your logic here
        return chain.filter(exchange);
    }
}
```

## 普通认证（Authentication）

示例如下：

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.AuthenticationSecurityWebFilter;

@Component
public class MyAuthenticationSecurityWebFilter implements AuthenticationSecurityWebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Do your logic here
        return chain.filter(exchange);
    }
}
```

## 匿名认证（Anonymous Authentication）

示例如下：

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.AnonymousAuthenticationSecurityWebFilter;

@Component
public class MyAnonymousAuthenticationSecurityWebFilter
    implements AnonymousAuthenticationSecurityWebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Do your logic here
        return chain.filter(exchange);
    }
}
```

## Security 前置过滤器（Before Security）

在 Security 过滤器链最前面执行的过滤器，可用于在认证之前处理请求。

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.BeforeSecurityWebFilter;

@Component
public class MyBeforeSecurityWebFilter implements BeforeSecurityWebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Do your logic here
        return chain.filter(exchange);
    }
}
```

## Security 后置过滤器（After Security）

在 Security 过滤器链最后面执行的过滤器，可用于在认证之后处理请求。

```java
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import run.halo.app.security.AfterSecurityWebFilter;

@Component
public class MyAfterSecurityWebFilter implements AfterSecurityWebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Do your logic here
        return chain.filter(exchange);
    }
}
```
