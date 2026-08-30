---
title: 主题端文章内容处理
description: 实现 ReactivePostContentHandler 依次处理主题端文章的 HTML 与原始内容，并将更新后的 PostContentContext 传给后续处理器
---

主题端文章内容处理扩展点用于干预文章内容的渲染，例如：在文章内容中添加广告、添加版权信息等。

```java
public interface ReactivePostContentHandler extends ExtensionPoint {

    Mono<PostContentContext> handle(PostContentContext postContent);

    @Data
    @Builder
    class PostContentContext {
        private Post post;
        private String content;
        private String raw;
        private String rawType;
    }
}
```

`handle` 方法用于处理文章内容，参数 `postContent` 为文章内容上下文，包含文章自定义模型对象、文章 HTML 内容、原始内容、原始内容类型等信息。所有已启用的处理器会依次执行，前一个处理器返回的上下文会传给下一个处理器，因此必须返回处理后的 `PostContentContext`，不要返回 `Mono.empty()`。

`ReactivePostContentHandler` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: reactive-post-content-handler
spec:
  className: run.halo.app.theme.ReactivePostContentHandler
  displayName: ReactivePostContentHandler
  type: MULTI_INSTANCE
  description: "Provides a way to extend the post content to be displayed on the theme-side."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `reactive-post-content-handler`。

调用流程参考：[PostPublicQueryServiceImpl](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/theme/finders/impl/PostPublicQueryServiceImpl.java)。

使用案例可以参考：[WebP Cloud 插件](https://github.com/webp-sh/halo-plugin-webp-cloud/blob/a6069dfa78931de0d5b5dfe98fdd18a0da75b09f/src/main/java/se/webp/plugin/WebpCloudPostContentHandler.java#L17)
它的作用是处理主题端文章内容中的所有图片的地址，将其替换为一个 WebP Cloud 的代理地址，从而实现文章内容中的图片都使用 WebP 格式。
