---
title: 插件中的对象管理
description: 了解如何在创建中创建对象和管理对象依赖
---

在插件中你可以使用 [Spring Framework](https://spring.io/projects/spring-framework/) 提供的常用 Bean 注解来标注一个类，然后就能使用依赖注入功能注入其他类的对象。这省去了使用工厂创建类和维护的过程，你可以像开发一个常规的 Spring 项目一样来开发插件，目前支持以下 Spring Framework 的特性：

1. [Core Technologies](https://docs.spring.io/spring-framework/reference/core.html)
2. [Web on Reactive](https://docs.spring.io/spring-framework/reference/web-reactive.html)
3. [Testing](https://docs.spring.io/spring-framework/reference/testing.html)

通过模板插件创建的项目中你会看到 `StarterPlugin` 标注了 `@Component` 注解：

```java
@Component
public class StarterPlugin extends BasePlugin {
}
```

假设项目中有一个 `FruitService`，并将其声明了为了 Bean：

```java
@Service
public class FruitService {

}
```

你可以在任何同样声明为 Bean 的类中使用[依赖注入](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)来使用它：

```java
@Component
public class Demo {
  private final FruitService fruitService;

  public Demo(FruitService fruitService) {
    this.fruitService = fruitService;
  }
  // use it...
}
```

## 依赖注入 Halo 共享的 Bean

Halo 提供了一些共享的 Bean，任何插件都可以直接依赖注入这些 Bean。

### ReactiveExtensionClient

`ReactiveExtensionClient` 是一个用于管理自定义模型对象的增删改查的 Bean，它是反应式的。

参考 [与自定义模型交互](../../api-reference/server/extension-client.md) 了解更多。

### ExtensionClient

`ExtensionClient` 作用和方法与 ReactiveExtensionClient 一样，但它是阻塞的，只能用在非 NIO 线程中，如后台任务。

### SchemeManager

`SchemeManager` 是一个用于管理自定义模型定义的注册和销毁的 Bean。

API 参考：[SchemeManager](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/extension/SchemeManager.java)

### UserService

用于操作 Halo 用户的 Bean，包括获取用户信息、更新密码、创建用户等函数。

API 参考 [UserService](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/core/user/service/UserService.java)

### ReactiveUserDetailsService

用于获取用户信息的 Bean，它只有一个方法 `Mono<UserDetails> findByUsername(String username)`。

### RoleService

用于操作 Halo 角色的 Bean，包括查询角色绑定、角色及依赖等函数。

API 参考 [RoleService](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/core/user/service/RoleService.java)

### AttachmentService

用于操作 Halo 附件的 Bean，包括上传、删除附件以及获取附件访问链接等函数。

API 参考 [AttachmentService](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/core/extension/service/AttachmentService.java)。

### PostContentService

在 Halo 中，文章内容具有版本管理的概念。第一个版本是完整的文章内容，称为 `baseSnapshot`。从第二个版本开始，每个版本都是基于 `baseSnapshot` 的增量内容。因此，要查询完整的文章内容，需要获取 `baseSnapshot` 以及对应的版本增量内容并合并。

![文章内容版本模型](/img/developer-guide/plugin/basic/server/post-content-version-generation.png)

为了方便插件开发者获取文章内容，Halo 提供了 `PostContentService`，以简化这一过程的复杂性。

- getHeadContent：获取文章的最新版本内容（包括正在编辑的草稿）。
- getReleaseContent：获取最新发布的文章内容。
- getSpecifiedContent：获取指定 snapshotName 对应的文章内容。
- listSnapshots：获取指定文章的所有版本的 Snapshot 对象的名称列表。

API 参考：[PostContentService](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/content/PostContentService.java)
文章自定义模型定义参考 [Post](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/core/extension/content/Post.java)

### NotificationReasonEmitter

用于发送通知事件的 Bean。

使用示例参考 [通知事件触发示例](../../api-reference/server/notification.md#reason-emitter-example)

API 参考：[NotificationReasonEmitter](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/notification/NotificationReasonEmitter.java)

### NotificationCenter

用于管理通知的订阅和取消订阅。

使用示例参考 [通知订阅示例](../../api-reference/server/notification.md#subscribe-example)

API 参考：[NotificationCenter](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/notification/NotificationCenter.java)

### ExternalLinkProcessor

用于将一个站内相对链接转换为绝对链接。

如配置了外部访问地址为 `https://example.com`，那么将 `/post/1` 转换为 `https://example.com/post/1`。

API 参考：[ExternalLinkProcessor](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/infra/ExternalLinkProcessor.java);

### LoginHandlerEnhancer

Halo 提供了登录增强机制，插件可以在登录成功或失败时调用登录增强器，使 Halo 可以执行额外的处理逻辑。

参考 [登录增强器](../../api-reference/server/login-handler-enhancer.md) 了解更多。

使用示例参考 [用户名密码登陆成功和失败的增强切入示例](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/application/src/main/java/run/halo/app/security/authentication/login/UsernamePasswordHandler.java#L106)

### BackupRootGetter

用于获取 Halo 备份文件的根目录。它是 `Supplier<Path>` 的子类。

### PluginsRootGetter

用于获取 Halo 插件的根目录。它是 `Supplier<Path>` 的子类。

### ExtensionGetter

用于获取扩展点实例（扩展）的 Bean。

例如，Halo 定义了 `AttachmentHandler` 这个扩展点，你可以通过 `ExtensionGetter` 获取到所有实现了 `AttachmentHandler` 接口的扩展。

有了它，插件中便可以定义自己的扩展点，然后由其他插件实现以达到插件扩展插件的目的。

API 参考 [ExtensionGetter](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/plugin/extensionpoint/ExtensionGetter.java)

### ServerSecurityContextRepository

用于获取操作用户的认证上下文信息，如登录成功后保存认证信息。

ServerSecurityContextRepository 被 [ReactorContextWebFilter](https://github.com/spring-projects/spring-security/blob/9d2ca3da6a285f31ebd2da5f019127e1527e5042/web/src/main/java/org/springframework/security/web/server/context/ReactorContextWebFilter.java) 使用来获取操作用户的认证上下文信息并填充到 ReactiveSecurityContextHolder 中。
此过滤器的执行顺序在 [SecurityWebFiltersOrder](https://github.com/spring-projects/spring-security/blob/9d2ca3da6a285f31ebd2da5f019127e1527e5042/config/src/main/java/org/springframework/security/config/web/server/SecurityWebFiltersOrder.java#L47) 中定义。因此如果你的过滤器在此过滤器之前执行，那么你将无法从 ReactiveSecurityContextHolder 中获取到操作用户的认证上下文信息只能通过注入 ServerSecurityContextRepository 来获取。

API 参考：[ServerSecurityContextRepository](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/web/server/context/ServerSecurityContextRepository.html)

### CryptoService

Halo 根据用户名密码登录时，会先使用 CryptoService 的 `readPublicKey` 方法读取公钥，然后使用公钥加密密码，再发送给服务器。

当插件需要添加一些拦截器处理登录请求时可能需要获取原始密码，此时可以使用 CryptoService 的 `decrypt` 方法解密密码。

也可以复用它的公钥来作为一些加密算法的密钥。

API 参考 [CryptoService](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/security/authentication/CryptoService.java)

### ExternalUrlSupplier

`ExternalUrlSupplier` 是一个用于获取用户配置的 Halo 外部访问地址的 Bean。

API 参考：[ExternalUrlSupplier](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/api/src/main/java/run/halo/app/infra/ExternalUrlSupplier.java)

### RateLimiterRegistry

`RateLimiterRegistry` 是一个用于管理限流器的 Bean。

如果插件定义的某些 API 需要限流，可以使用 `RateLimiterRegistry` 来创建一个限流器，但是需要注意的是，**必须要在插件停止的生命周期方法里销毁你所创建的限流器**，否则会导致内存泄漏。

#### 使用示例

以下示例展示了如何使用 `RateLimiterRegistry` 创建一个限流器：

```java
final Set<String> limiterNames = new HashSet<>();

Mono<Void> sendEmailVerificationCode(String username, String email) {
  return buildSendEmailRateLimiter(username, email) // step 1: 构建一个限流器
      .transformDeferred(rateLimiter -> rateLimiter.map(RateLimiterOperator::of)) // step 2: 返回一个经过变换的新 Mono
      // step 3: 从这里开始的操作符都会受到限流的影响
      .flatMap(rateLimiter -> emailVerificationService.sendVerificationCode(username, email))
      // 转换 RequestNotPermitted 为 RateLimitExceededException 以使全局异常处理器能够处理
      .onErrorMap(RequestNotPermitted.class, RateLimitExceededException::new);
}

RateLimiter buildSendEmailRateLimiter(String username, String email) {
  var rateLimiterKey = "send-email-verification-code-" + username + ":" + email;
  var rateLimiter = rateLimiterRegistry.rateLimiter(rateLimiterKey, new RateLimiterConfig.Builder()
    // 频次限制为 1 次
    .limitForPeriod(1)
    // 限制刷新周期为 60 秒, 即 60 秒内只能执行 1 次
    .limitRefreshPeriod(Duration.ofSeconds(60))
    .build());
  // 添加 limiter 到自己实现的 Registry 中保存起来以便在插件停止时清理
  limiters.add(rateLimiterKey);
  return limiter;
}
```

在插件停止的生命周期方法里销毁你所创建的限流器：

```java
@Override
public void stop() {
  limiters.forEach(rateLimiterRegistry::remove);
}
```

`transformDeferred` 的作用是将 Mono 传入你提供的变换器中，返回一个经过变换的新 Mono。由于 RateLimiterOperator 是基于 Publisher 的装饰器（decorator），它会监视这个 Mono 的订阅和执行情况，从而对整个 Mono 的操作链进行限流。

换句话说，因为 `RateLimiterOperator` 装饰了这个 Mono，所以任何接在 `transformDeferred()` 之后的操作符都会受到限流的影响，直到整个流结束。

### SystemInfoGetter

用于获取站点基本信息的 Bean，它是 `Supplier<Mono<SystemInfo>>` 的子类，仅有一个 `get` 方法。

> 此为 `2.20.11` 版本新增的 Bean 因此需要 Halo 2.20.11 及以上版本才可使用。

可以获取到的数据示例如下：

```json
{
  "title" : "guqing's blog",
  "subtitle" : "副标题",
  "logo" : "/upload/myavatar.png",
  "favicon" : "/upload/myavatar.png",
  "url" : "http://localhost:8090",
  "version" : {
    "majorVersion" : 2,
    "minorVersion" : 20,
    "normalVersion" : "2.20.10",
    "preRelease" : true,
    "publicApiStable" : true,
    "patchVersion" : 10,
    "preReleaseVersion" : "SNAPSHOT",
    "buildMetadata" : "",
    "stable" : false
  },
  "seo" : {
    "blockSpiders" : false,
    "keywords" : "keyword1,keyword2",
    "description" : "站点描述"
  },
  "locale" : "zh_CN_#Hans",
  "timeZone" : "Asia/Shanghai",
  "activatedThemeName" : "theme-earth"
}
```
