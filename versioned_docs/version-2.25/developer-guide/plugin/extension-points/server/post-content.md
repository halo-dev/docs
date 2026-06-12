---
title: 主题端文章内容处理
description: 提供扩展主题端文章内容处理的方法，干预文章内容的渲染。
---

主题端文章内容处理扩展点用于干预文章内容的渲染，例如：在文章内容中添加广告、添加版权信息等。

```java
public interface ReactivePostContentHandler extends ExtensionPoint {

    Mono<PostContentContext> handle(@NonNull PostContentContext postContent);

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

`handle` 方法用于处理文章内容，参数 `postContent` 为文章内容上下文，包含文章自定义模型对象、文章 html 内容、原始内容、原始内容类型等信息。

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

使用案例可以参考：[WebP Cloud 插件](https://github.com/webp-sh/halo-plugin-webp-cloud/blob/a6069dfa78931de0d5b5dfe98fdd18a0da75b09f/src/main/java/se/webp/plugin/WebpCloudPostContentHandler.java#L17)
它的作用是处理主题端文章内容中的所有图片的地址，将其替换为一个 WebP Cloud 的代理地址，从而实现文章内容中的图片都使用 WebP 格式。
