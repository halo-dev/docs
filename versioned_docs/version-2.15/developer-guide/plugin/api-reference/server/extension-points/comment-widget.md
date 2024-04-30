---
title: 评论组件
description: 用于自定义评论组件，可在主题端使用其他评论组件。
---
评论组件扩展点用于自定义主题端使用的评论组件，Halo 通过插件提供了一个默认的评论组件，如果你需要使用其他的评论组件，那么可以通过实现该扩展点来自定义评论组件。

```java
public interface CommentWidget extends ExtensionPoint {

    String ENABLE_COMMENT_ATTRIBUTE = CommentWidget.class.getName() + ".ENABLE";

    void render(ITemplateContext context, IProcessableElementTag tag,
        IElementTagStructureHandler structureHandler);
}
```

其中 `render` 方法用于在主题端模板中渲染评论组件，参数：

- `context` 为模板上下文，包含执行模板的上下文：变量、模板数据等。
- 参数 `tag` 为 `<halo:comment />` 标签它包含元素的名称及其属性
- `structureHandler` 是一个特殊的对象，它允许 `CommentWidget` 向引擎发出指令，指示模板引擎应根据处理器的执行而执行哪些操作。

`CommentWidget` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: comment-widget
spec:
  className: run.halo.app.theme.dialect.CommentWidget
  displayName: CommentWidget
  type: SINGLETON
  description: "Provides an extension point for the comment widget on the theme-side."
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `comment-widget`。

参考：[Thymeleaf IElementTagProcessor 文档](https://www.thymeleaf.org/doc/tutorials/3.1/extendingthymeleaf.html#element-tag-processors-ielementtagprocessor)。

参考：[Halo 默认评论组件的实现](https://github.com/halo-dev/plugin-comment-widget/blob/main/src/main/java/run/halo/comment/widget/DefaultCommentWidget.java)。
