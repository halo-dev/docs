---
title: 与插件集成
description: 在 Halo 主题中检查可用插件、保护插件专属调用，并为评论、页脚注入和插件页面保留兼容扩展点
---

主题与插件集成时，应把插件能力视为可选增强：插件未安装、未启用或版本不兼容时，主题的导航和主要内容仍应可用。

本页说明主题侧的适配方式；插件开发者如何选择 Finder、模板、公开 API 和渲染扩展点，请参考插件侧的[与主题集成](../plugin/theme-integration.md)。

## 检查插件是否可用

`pluginFinder.available` 只有在插件处于 `STARTED` 状态时才返回 `true`。已启用但尚未启动或启动失败的插件仍会返回 `false`。参数应使用插件 `plugin.yaml` 中的 `metadata.name`，而不是显示名称。

```html
<button
  th:if="${pluginFinder.available('PluginSearchWidget')}"
  type="button"
  onclick="SearchWidget.open()"
>
  搜索
</button>
```

上例只在搜索组件插件可用时调用它提供的 `SearchWidget` API。不要在条件块外提前调用插件提供的全局变量、Finder 或模板片段。

如果主题依赖插件某个版本才提供的能力，应同时检查版本范围：

```html
<th:block th:if="${pluginFinder.available('PluginSearchWidget', '>=1.0.0')}">
  <!-- 只在版本满足要求时使用对应能力 -->
</th:block>
```

版本范围遵循 Semantic Version 范围表达式。完整方法说明请参考 [PluginFinder](./finder-apis/plugin.md)。

## 保留主题扩展点

评论区域应使用 Halo 提供的组合条件 `haloCommentEnabled`，不要绑定到某一个评论插件：

```html
<div th:if="${haloCommentEnabled}">
  <halo:comment
    group="content.halo.run"
    kind="Post"
    th:attr="name=${post.metadata.name}"
  />
</div>
```

公共布局的页脚中应保留 `<halo:footer />`，让 Halo 设置和插件可以注入所需内容：

```html
<footer>
  <!-- 主题页脚内容 -->
  <halo:footer />
</footer>
```

参数和支持的评论主体请参考[自定义标签](./template-tag.md)。

## 兼容插件前台页面

从 Halo 2.26.0 开始，主题可以提供 `templates/layout.html` 的 `html(head, content)` 片段，让插件前台页面复用主题外壳。该能力是可选的，不应影响主题自身页面；具体契约和回退行为请参考[页面布局契约](./page-layout.md)。

## 适配插件组件配色

Halo 官方的搜索组件和评论组件支持一组公共配色标记。主题应将其中一种标记设置在 `<html>` 或 `<body>` 上，让组件继承与主题一致的明暗模式：

| 主题模式 | class                           | `data-color-scheme` |
| -------- | ------------------------------- | ------------------- |
| 跟随系统 | `color-scheme-auto`             | `auto`              |
| 深色     | `color-scheme-dark` 或 `dark`   | `dark`              |
| 浅色     | `color-scheme-light` 或 `light` | `light`             |

例如：

```html
<html class="color-scheme-auto"></html>
```

```html
<html data-color-scheme="dark"></html>
```

`auto` 模式会通过 `prefers-color-scheme` 跟随系统。主题切换模式时，应同步更新这个公共标记，并分别验证搜索、评论等插件组件；不要只修改主题自己的 CSS 变量。

## 覆盖插件前台模板

一些插件会提供前台页面（例如瞬间、链接、相册页面），插件在渲染这些页面时，Halo 会先检查当前主题的 `templates/` 目录下是否存在同名的模板文件，存在则使用主题的模板，不存在才回退到插件内置的模板。

因此主题可以通过提供同名模板来完全自定义插件前台页面的样式。例如某个插件的前台页面渲染 `moments` 模板，主题只需提供 `templates/moments.html` 即可接管该页面的渲染。

采用此方式时需要注意：

1. **确认插件支持的模板名称**：并非所有插件页面都可以被覆盖，请以插件文档或其内置模板（插件 JAR 中的 `templates/` 目录）为准。插件内置模板是了解模板名称和可用模型变量的最直接参考。
2. **保持模型契约一致**：主题模板能使用的变量与插件内置模板一致（例如插件渲染时传入的数据和 `_templateId`）。插件升级后模型可能变化，主题覆盖模板需要跟随验证。
3. **视为可选增强**：覆盖模板只对安装了对应插件的站点生效，主题的其余页面不应依赖它。

## 验证兼容性

发布前至少覆盖以下状态：

1. 未安装可选插件时，页面可渲染且不显示失效入口。
2. 插件已安装但停用时，不调用插件 API。
3. 插件版本不满足要求时，使用基础功能或隐藏增强功能。
4. 插件启用时，入口、暗色模式、移动端布局和键盘操作正常。
