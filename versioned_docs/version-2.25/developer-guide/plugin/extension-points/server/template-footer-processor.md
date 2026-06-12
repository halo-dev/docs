---
title: 主题端 Halo Footer 标签处理
description: 提供扩展主题端 HTML 页面中的 <halo:footer/> 标签内容处理的方法。
---

Halo 为主题端模板提供了自定义标签 `<halo:footer/>` 的处理扩展点，以便可以添加额外的页脚内容如版权信息、备案号等。

## 使用场景

- 添加备案号
- 添加版权信息
- 添加统计代码
- 添加自定义脚本
- 添加自定义链接

## 扩展点定义

扩展 `<halo:footer/>` 标签的扩展点定义为 `TemplateFooterProcessor`，对应的 `ExtensionPoint` 类型为 `MULTI_INSTANCE`，即可以有多个实现类。

```java
public interface TemplateFooterProcessor extends ExtensionPoint {

    Mono<Void> process(ITemplateContext context, IProcessableElementTag tag,
        IElementTagStructureHandler structureHandler, IModel model);
}
```

`TemplateFooterProcessor` 对应的 `ExtensionPointDefinition` 资源描述如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: template-footer-processor
spec:
  className: run.halo.app.theme.dialect.TemplateFooterProcessor
  displayName: 页脚标签内容处理器
  type: MULTI_INSTANCE
  description: "提供用于扩展 <halo:footer/> 标签内容的扩展方式。"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `template-footer-processor`。

## 示例实现

以下是一个简单的 TemplateFooterProcessor 插件实现示例：

```java
@Component
public class FakeFooterCodeInjection implements TemplateFooterProcessor {

  @Override
  public Mono<Void> process(ITemplateContext context, IProcessableElementTag tag,
    IElementTagStructureHandler structureHandler, IModel model) {
    var factory = context.getModelFactory();
    // regular footer text
    var copyRight = factory.createText("<div>© 2024 Halo</div>");
    model.add(copyRight);
    return Mono.empty();
  }
}
```

声明 ExtensionDefinition 自定义模型对象时对应的 extensionPointName 为 template-footer-processor。

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionDefinition
metadata:
  name: custom-footer-extension
spec:
  extensionPointName: template-footer-processor
  className: com.example.FakeFooterCodeInjection
  displayName: "Custom Footer Extension"
  description: "Adds custom footer content."
  icon: 'some-icon'
```
