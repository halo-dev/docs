---
title: Web 过滤器
description: 为 Web 请求提供过滤器扩展点，可用于对请求进行拦截、修改等操作。
---

在现代的 Web 应用开发中，过滤器（Filter）是一个非常重要的概念。你可以使用 `run.halo.app.security.AdditionalWebFilter` 在服务器处理请求之前或之后执行特定的任务。

通过实现这个接口，开发者可以自定义过滤逻辑，用于处理进入和离开应用程序的 HTTP 请求和响应。

AdditionalWebFilter 能做什么？

1. 认证与授权：AdditionalWebFilter 可以用来检查用户是否登录，或者是否有权限访问某个资源。
2. 日志记录与审计：在请求处理之前或之后记录日志，帮助了解应用程序的使用情况。
3. 请求重构：修改请求数据，例如添加、删除或修改请求头或请求参数。
4. 响应处理：修改响应，例如设置通用的响应头。
5. 性能监控：记录处理请求所需的时间，用于性能分析。
6. 异常处理：统一处理请求过程中抛出的异常。
7. ......

## 使用示例

以下示例将旧的 RSS 地址永久重定向到新地址：

```java
@Component
public class OldRssRouteRedirectionFilter implements AdditionalWebFilter {
    private final DefaultServerRedirectStrategy redirectStrategy =
        new DefaultServerRedirectStrategy();
    private final ServerWebExchangeMatcher requestMatcher =
        ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET, "/moments/rss.xml");

    @Override
    @NonNull
    public Mono<Void> filter(
        @NonNull ServerWebExchange exchange,
        @NonNull WebFilterChain chain
    ) {
        return requestMatcher.matches(exchange)
            .flatMap(matchResult -> {
                if (matchResult.isMatch()) {
                    redirectStrategy.setHttpStatus(HttpStatus.PERMANENT_REDIRECT);
                    return redirectStrategy.sendRedirect(
                        exchange,
                        URI.create("/feed/moments/rss.xml")
                    );
                }
                return chain.filter(exchange);
            });
    }
}
```

1. `chain.filter(exchange)` 表示继续执行后续过滤器；不调用时，请求不会继续交给后续过滤器或目标处理程序。
2. `getOrder` 只决定多个已启用 `AdditionalWebFilter` 之间的执行顺序，默认值为 `Ordered.LOWEST_PRECEDENCE`。数值越小越先执行。

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
- [瞬间插件旧 RSS 地址重定向](https://github.com/halo-sigs/plugin-moments/blob/d376174fd1cd9f9a1cb03d4685ad60630f7bb3c2/src/main/java/run/halo/moments/rss/OldRssRouteRedirectionFilter.java)
- [Halo 对附加过滤器的排序和调用](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/infra/webfilter/AdditionalWebFilterChainProxy.java)
