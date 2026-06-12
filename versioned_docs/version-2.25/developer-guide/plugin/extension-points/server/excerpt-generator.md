---
title: 摘要生成器
description: 为文章和页面提供摘要生成逻辑的扩展点，可用于自定义摘要生成方式。
---

摘要生成器扩展点用于自定义 Halo 中文章和页面的摘要生成逻辑，例如：使用算法提取关键内容、接入 AI 生成摘要等。

```java
public interface ExcerptGenerator extends ExtensionPoint {

    Mono<String> generate(ExcerptGenerator.Context context);

    @Data
    @Accessors(chain = true)
    class Context {
        private String raw;
        private String content;
        private String rawType;
        private Set<String> keywords;
        private int maxLength;
    }
}
```

- `generate` 方法用于生成摘要，参数 `context` 为摘要生成上下文，返回 `Mono<String>` 即生成的摘要内容。

`Context` 包含以下字段：

- `raw`：原始内容。
- `content`：HTML 格式的内容。
- `rawType`：原始内容类型。
- `keywords`：内容中的关键词，用于辅助生成更准确的摘要。
- `maxLength`：生成摘要的最大长度限制。

Halo 在生成文章或页面摘要时，会查找启用的 `ExcerptGenerator` 扩展（单实例扩展点），如果未找到则使用默认实现。默认实现从 HTML 内容中提取纯文本并截取前 150 个字符。

`ExcerptGenerator` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: excerpt-generator
spec:
  className: run.halo.app.content.ExcerptGenerator
  displayName: "摘要生成器"
  type: SINGLETON
  description: "提供自动生成摘要的方式扩展，如使用算法提取或使用 AI 生成。"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `excerpt-generator`。

使用案例可以参考：[Halo 默认摘要生成器](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/core/reconciler/PostReconciler.java)
