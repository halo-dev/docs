---
title: 响应式服务端开发
description: 在 Halo 插件的 WebFlux 调用链中使用 Mono、Flux 和 WebClient，并安全隔离必须调用的阻塞 API
---

Halo 服务端基于 Spring WebFlux。请求通常由少量事件循环线程处理，因此插件的 Controller、WebFilter、Finder 和其他响应式扩展不应阻塞当前线程。

## 保持调用链非阻塞

在响应式入口中直接返回 `Mono` 或 `Flux`，并使用 `ReactiveExtensionClient`、`ReactiveSettingFetcher`、`WebClient` 等响应式 API：

```java
public Mono<Profile> getProfile(String name) {
    return client.fetch(Profile.class, name)
        .switchIfEmpty(Mono.error(new NotFoundException("Profile not found")));
}
```

不要在 WebFlux Controller、WebFilter 或响应式扩展点中调用 `.block()`，也不要直接调用 `ExtensionClient`、JDBC、阻塞式 HTTP 客户端或文件 I/O。WebFlux 默认假设请求线程不会阻塞，具体线程模型参考 [Spring WebFlux 并发模型](https://docs.spring.io/spring-framework/reference/web/webflux/new-framework.html#webflux-concurrency-model)。

返回 Publisher 后由 Halo 负责订阅。不要为了“让代码执行”而在请求处理方法内部调用 `.subscribe()`，否则错误、取消和请求上下文会脱离原调用链。

## 隔离无法替换的阻塞调用

只有依赖库没有响应式 API 时，才把单个阻塞操作包装到 `boundedElastic`：

```java
public Mono<Result> execute() {
    return Mono.fromCallable(blockingClient::execute)
        .subscribeOn(Schedulers.boundedElastic())
        .timeout(Duration.ofSeconds(5));
}
```

- 使用 `Mono.fromCallable` 延迟执行阻塞操作。
- 将 `subscribeOn(Schedulers.boundedElastic())` 紧邻阻塞源放置，使订阅和调用在受限的工作线程池执行。
- `timeout` 只限制响应式调用链等待时间，不保证底层阻塞库立即中断；仍应配置 HTTP、数据库或文件库自身的连接和读取超时。
- 不要把整条响应式链无差别切换到 `boundedElastic`，只隔离无法替换的阻塞边界。

该模式参考 [Reactor：包装同步阻塞调用](https://projectreactor.io/docs/core/release/reference/faq.html#faq.wrap-blocking)。

## 处理外部请求和错误

使用 `WebClient` 时返回响应式结果，并为外部依赖设置明确的超时和错误语义：

```java
public Mono<RemoteResult> fetchRemote() {
    return webClient.get()
        .uri("/results")
        .retrieve()
        .bodyToMono(RemoteResult.class)
        .timeout(Duration.ofSeconds(5))
        .onErrorMap(WebClientResponseException.class,
            error -> new RemoteServiceException("Remote request failed", error));
}
```

不要用 `onErrorResume` 静默吞掉所有异常。只有业务允许降级时才返回缓存或默认值，并保留足够的日志和状态让使用者识别依赖失败。

## 管理后台任务

定时任务、异步事件或插件启动时创建的长期订阅不属于 HTTP 请求生命周期。插件需要保存它创建的 `Disposable`、线程池、连接或客户端，并在 [`stop()`](./lifecycle.md#插件停止) 中释放；重载后必须能够重新创建。

## 测试响应式行为

- 使用 `StepVerifier` 验证正常结果、空结果和错误类型，并为验证设置超时，避免测试无限等待。
- 对阻塞边界验证调用确实在工作线程执行，同时验证超时和依赖不可用时的结果。
- 对外部服务验证非 2xx、慢响应、连接失败和取消场景。
- 使用 `haloServer` 联调时同时检查 Halo 日志，确认没有阻塞线程警告和未处理错误。

完整验证流程参考[测试插件](../../testing.md)。
