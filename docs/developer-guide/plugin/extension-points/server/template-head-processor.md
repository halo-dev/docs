---
title: 主题端 HTML Head 标签处理
description: 提供扩展主题端 HTML 页面中的 Head 标签内容处理的方法，干预 HTML 页面的 Head 标签内容。
---

主题端 HTML Head 标签处理扩展点的作用是干预 HTML 页面中的 Head 标签内容，可以添加自定义的 CSS、JS 及 meta 标签等，以满足特定的定制化需求。

## 使用场景

- **添加自定义样式或脚本**：在 HTML Head 中插入额外的 CSS 文件或 JavaScript 脚本文件，以增强页面的交互性或样式。
- **定制 Meta 标签**：为特定页面添加或修改 meta 标签，如描述、作者、关键词等，以提高 SEO 和页面信息的完整性。
- **引入第三方库**：引入第三方库（如 Google Fonts、Font Awesome 等），以满足页面的特殊功能或风格需求。
- **定制 Open Graph 等社交媒体标签**：为社交媒体分享优化页面标签内容。

## 扩展点定义

主题端 HTML Head 标签处理的扩展点定义为 `TemplateHeadProcessor`，对应的 `ExtensionPoint` 类型为 `MULTI_INSTANCE`，即可以有多个实现类。

```java
@FunctionalInterface
public interface TemplateHeadProcessor extends ExtensionPoint {

    Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler);
}
```

`TemplateHeadProcessor` 对应的 `ExtensionPointDefinition` 资源描述如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: template-head-processor
spec:
  className: run.halo.app.theme.dialect.TemplateHeadProcessor
  displayName: TemplateHeadProcessor
  type: MULTI_INSTANCE
  description: "Provides a way to extend the head tag content in the theme-side HTML page."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `template-head-processor`。

## 示例实现

以下是一个简单的 TemplateHeadProcessor 插件实现示例：

```java
@Component
public class CustomHeadProcessor implements TemplateHeadProcessor {

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        // 添加自定义 CSS 文件
        model.add(context.createStandaloneElementTag("link",
                "rel", "stylesheet",
                "href", "/custom/styles.css"));
        
        // 添加自定义 Meta 标签
        model.add(context.createStandaloneElementTag("meta",
                "name", "author",
                "content", "Your Name"));
        return Mono.empty();
    }
}
```

声明 ExtensionDefinition 自定义模型对象时对应的 extensionPointName 为 template-head-processor。

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionDefinition
metadata:
  name: custom-head-extension
spec:
  extensionPointName: template-head-processor
  className: com.example.CustomHeadProcessor
  displayName: "Custom Head Extension"
  description: "Adds custom CSS and meta tags to the head section."
```

## 使用此扩展点的插件

- [集成 highlight.js 为文章提供代码块高亮渲染](https://github.com/halo-sigs/plugin-highlightjs)
- [集成 lightgallery.js，支持在内容页面放大显示图片](https://github.com/halo-sigs/plugin-lightgallery)
- [Halo 2.0 对 Umami 的集成](https://github.com/halo-sigs/plugin-umami)
