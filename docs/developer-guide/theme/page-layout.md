---
title: 页面布局契约
description: 了解如何通过主题提供页面布局，让插件前台页面复用当前主题的页面外壳。
---

从 Halo 2.26.0 开始，主题可以通过 `templates/layout.html` 提供一个标准页面布局契约。插件提供的前台页面调用这个契约后，可以复用当前主题的页头、页脚、样式和响应式布局；如果当前主题没有适配，Halo 会使用内置的 fallback 布局保证页面可以继续渲染。

这个能力是增量适配项，不会影响主题安装、升级、启用，也不会替代主题内部自用的普通模板片段。

## 适配主题布局

主题需要在 `templates/layout.html` 中声明 `html(head, content)` 片段：

```html title="templates/layout.html"
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org" th:lang="${#locale.toLanguageTag}" th:fragment="html (head, content)">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title th:text="${site.title}"></title>
    <link rel="stylesheet" th:href="@{/assets/dist/style.css}" />
    <th:block th:if="${head != null}">
      <th:block th:replace="${head}" />
    </th:block>
  </head>
  <body>
    <header>
      <!-- 主题页头 -->
    </header>
    <main>
      <th:block th:replace="${content}" />
    </main>
    <footer>
      <!-- 主题页脚 -->
    </footer>
    <halo:footer />
  </body>
</html>
```

其中：

- `head`：调用方提供的头部片段，通常用于插入页面标题、meta 信息或当前页面需要的资源。
- `content`：调用方提供的正文片段，应被插入到主题页面主体中。

主题可以自行决定外层容器、页头、页脚、暗黑模式、响应式布局等实现细节。建议保留 `<halo:footer />`，以便 Halo 和插件继续向页面底部注入必要内容。

如果你的主题已经使用 `templates/layout.html` 作为内部公共模板，只要它声明了 `html(head, content)` 片段，就可以同时作为页面布局契约使用。如果这只是主题内部私有模板，建议改用 `templates/modules/layout.html` 等其他路径，避免被识别为插件页面集成布局。

## 插件页面调用布局

插件模板可以通过 `layout :: html(...)` 调用当前主题的页面布局：

```html title="src/main/resources/templates/moment.html"
<!DOCTYPE html>
<html
  xmlns:th="https://www.thymeleaf.org"
  th:replace="~{layout :: html(head = ~{::head}, content = ~{::content})}"
>
  <th:block th:fragment="head">
    <title>瞬间 - [[${site.title}]]</title>
  </th:block>
  <th:block th:fragment="content">
    <section>
      <!-- 插件页面正文 -->
    </section>
  </th:block>
</html>
```

`layout` 是 Halo 为插件前台页面保留的集成模板名。这个特殊解析只对插件自身提供的模板生效，例如通过 `plugin:<plugin-name>:moment` 解析出的模板。即使插件包内存在 `templates/layout.html`，它也不会用于满足主题的页面布局契约。

插件内部私有布局应继续使用其他模板名，并通过 `plugin:<plugin-name>:` 前缀显式引用。详细方式可参考[在插件中提供主题模板](../plugin/api-reference/server/template-for-theme.md)。

## 兼容状态

主题安装、更新或重载后，Halo 会静态检查 `templates/layout.html`，并在 `Theme.status.pageLayout` 中记录兼容状态：

- `SUPPORTED`：主题提供了符合 `html(head, content)` 契约的布局。
- `MISSING`：主题未提供 `templates/layout.html`，使用布局契约的插件页面会使用 Halo 的 fallback 布局。
- `INVALID`：主题提供了 `templates/layout.html`，但片段签名不符合当前契约。

缺失或异常不会让主题进入失败状态。Console 会在主题详情和主题列表中展示页面布局状态，帮助用户和主题开发者判断是否需要适配。

## 版本演进

当前 v1 契约只包含 `head` 和 `content` 两个片段参数。主题开发者不应假设调用方一定提供更多片段；插件开发者也不应依赖主题私有变量来渲染核心内容。后续如果需要新增插槽，Halo 会优先考虑新的片段名或新的契约版本，避免破坏已适配的主题。
