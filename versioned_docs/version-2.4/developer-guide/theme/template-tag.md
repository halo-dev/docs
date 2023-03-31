---
title: 自定义标签
description: 本文档介绍 Halo 为模板引擎提供的专有标签。
---

Halo 为满足部分代码注入和模板扩展点的需求，提供了一些专有标签，本文档将列出已支持的标签以及介绍这些标签的使用方法。

## halo:comment

### 描述

此标签用作评论组件的扩展点，如果有插件实现了这个扩展点，那么将在编写了此标签的模板中显示插件提供的内容。

### 使用示例

```html title="/templates/post.html"
<div th:if="${pluginFinder.available('PluginCommentWidget')}">
    <halo:comment
        group="content.halo.run"
        kind="Post"
        th:attr="name=${post.metadata.name}"
        colorScheme="window.main.currentColorScheme"
    />
</div>
```

参数详解：

1. `group` - 自定义模型的分组，目前已支持的模型请参考下面表格。
2. `kind` - 自定义模型的类型，目前已支持的模型请参考下面表格。
3. `name` - 自定义模型数据的唯一标识。
4. `colorScheme` - 评论组件的颜色方案，支持 light 和 dark 两种，支持固定或者 JavaScript 变量。需要注意的是，如果需要固定一个值，那么需要添加单引号，如 'dark'。使用 JavaScript 变量时不需要。

已支持的模型列表：

| 对应模型   | group            | kind       |
| ---------- | ---------------- | ---------- |
| 文章       | content.halo.run | Post       |
| 自定义页面 | content.halo.run | SinglePage |

## halo:footer

### 描述

支持将系统设置中的页脚代码注入内容插入到此标签。

### 使用示例

```html
<footer>
    <halo:footer />
</footer>
```

:::info 注意
为了保证 Halo 的功能完整性，建议主题开发者尽可能在主题中实现此标签。
:::
