---
title: 元素标签后置处理器
description: 提供对 Thymeleaf 元素标签进行后置处理的扩展点。
---

元素标签后置处理器扩展点用于在 Thymeleaf 模板渲染过程中对元素标签进行后置处理，例如：为图片标签添加缩略图属性、修改链接标签等。

```java
public interface ElementTagPostProcessor extends ExtensionPoint {

    Mono<IProcessableElementTag> process(
        ITemplateContext context,
        final IProcessableElementTag tag
    );
}
```

- `process` 方法用于处理元素标签，参数 `context` 为模板上下文，`tag` 为当前处理的元素标签。
- 返回值为 `Mono<IProcessableElementTag>`，即处理后的新标签。如果不需要处理，返回 `Mono.empty()`。
- 注意：`IProcessableElementTag` 是不可变的，所有修改需要通过 `context.getModelFactory()` 创建新标签。

`ElementTagPostProcessor` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: element-tag-post-processor
spec:
  className: run.halo.app.theme.dialect.ElementTagPostProcessor
  displayName: "元素标签后置处理器"
  type: MULTI_INSTANCE
  description: "提供用于对 Thymeleaf 元素标签进行后置处理的扩展方式"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `element-tag-post-processor`。

使用案例可以参考：[缩略图图片标签处理器](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/core/attachment/thumbnail/ThumbnailImgTagPostProcessor.java)
