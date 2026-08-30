---
title: 主题端自定义页面内容处理
description: 实现 ReactiveSinglePageContentHandler 依次处理主题端独立页面内容，并将更新后的 SinglePageContentContext 传给后续处理器
---

主题端自定义页面内容处理扩展点，作用同 [主题端文章内容处理](./post-content.md) 扩展点，只是作用于自定义页面。

```java
public interface ReactiveSinglePageContentHandler extends ExtensionPoint {
   
    Mono<SinglePageContentContext> handle(SinglePageContentContext singlePageContent);

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

所有已启用的处理器会依次执行，前一个处理器返回的上下文会传给下一个处理器，因此必须返回处理后的 `SinglePageContentContext`，不要返回 `Mono.empty()`。

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

调用流程参考：[SinglePageConversionServiceImpl](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/application/src/main/java/run/halo/app/theme/finders/impl/SinglePageConversionServiceImpl.java)。
