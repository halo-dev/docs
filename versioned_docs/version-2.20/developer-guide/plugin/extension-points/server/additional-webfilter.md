---
title: Web 过滤器
description: 为 Web 请求提供过滤器扩展点，可用于对请求进行拦截、修改等操作。
---

在现代的 Web 应用开发中，过滤器（Filter）是一个非常重要的概念。你可以使用 `run.halo.app.security.AdditionalWebFilter` 在服务器处理请求之前或之后执行特定的任务。

通过实现这个接口，开发者可以自定义过滤逻辑，用于处理进入和离开应用程序的 HTTP 请求和响应。

AdditionalWebFilter 能做什么？

1. 认证与授权： AdditionalWebFilter 可以用来检查用户是否登录，或者是否有权限访问某个资源。
2. 日志记录与审计： 在请求处理之前或之后记录日志，帮助了解应用程序的使用情况。
3. 请求重构： 修改请求数据，例如添加、删除或修改请求头或请求参数。
4. 响应处理： 修改响应，例如设置通用的响应头。
5. 性能监控： 记录处理请求所需的时间，用于性能分析。
6. 异常处理： 统一处理请求过程中抛出的异常。
7. ......

## 使用示例

以下是一个使用 `AdditionalWebFilter` 来拦截 `/login` 请求实现用户名密码登录的示例：

```java
@Component
public class UsernamePasswordAuthenticator implements AdditionalWebFilter {
    final ServerWebExchangeMatcher requiresMatcher = ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, "/login");

    @Override
    @NonNull
    public Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
         return this.requiresAuthenticationMatcher.matches(exchange)
         .filter((matchResult) -> {
            return matchResult.isMatch();
        }).flatMap((matchResult) -> {
            return this.authenticationConverter.convert(exchange);
        }).switchIfEmpty(chain.filter(exchange)
          .then(Mono.empty()))
          .flatMap((token) -> {
            return this.authenticate(exchange, chain, token);
        }).onErrorResume(AuthenticationException.class, (ex) -> {
            return this.authenticationFailureHandler.onAuthenticationFailure(new WebFilterExchange(exchange, chain), ex);
        });
    }

    @Override
    public int getOrder() {
        return SecurityWebFiltersOrder.FORM_LOGIN.getOrder();
    }
}
```

1. `filter` 方法中的 `chain.filter(exchange)` 表示继续执行后续的过滤器，如果不调用这个方法，请求将不会继续执行后续的过滤器或目标处理程序。
2. `getOrder` 方法用于指定过滤器的执行顺序，比如 `SecurityWebFiltersOrder.FORM_LOGIN.getOrder()` 表示在 Spring Security 的表单登录过滤器之前执行，参考：[SecurityWebFiltersOrder](https://github.com/spring-projects/spring-security/blob/main/config/src/main/java/org/springframework/security/config/web/server/SecurityWebFiltersOrder.java)。

`AdditionalWebFilter` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: additional-webfilter
spec:
  className: run.halo.app.security.AdditionalWebFilter
  displayName: AdditionalWebFilter
  type: MULTI_INSTANCE
  description: "Contract for interception-style, chained processing of Web requests that may be used to 
    implement cross-cutting, application-agnostic requirements such as security, timeouts, and others."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `additional-webfilter`。

以下是一些可以参考的项目示例：

- [OAuth2 第三方登录插件](https://github.com/halo-sigs/plugin-oauth2)
- [Halo 用户名密码登录](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/security/authentication/login/UsernamePasswordAuthenticator.java)
