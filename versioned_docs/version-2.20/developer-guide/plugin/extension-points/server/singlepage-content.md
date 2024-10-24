---
title: 主题端自定义页面内容处理
description: 提供扩展主题端自定义页面内容处理的方法，干预自定义页面内容的渲染。
---

主题端自定义页面内容处理扩展点，作用同 [主题端文章内容处理](./post-content.md) 扩展点，只是作用于自定义页面。

```java
public interface ReactiveSinglePageContentHandler extends ExtensionPoint {
   
    Mono<SinglePageContentContext> handle(@NonNull SinglePageContentContext singlePageContent);

    @Data
    @Builder
    class SinglePageContentContext {
        private SinglePage singlePage;
        private String content;
        private String raw;
        private String rawType;
    }
}
```

`ReactiveSinglePageContentHandler` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: reactive-singlepage-content-handler
spec:
  className: run.halo.app.theme.ReactiveSinglePageContentHandler
  displayName: ReactiveSinglePageContentHandler
  type: MULTI_INSTANCE
  description: "Provides a way to extend the single page content to be displayed on the theme-side."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `reactive-singlepage-content-handler`。
