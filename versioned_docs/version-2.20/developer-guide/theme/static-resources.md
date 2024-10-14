---
title: 静态资源
description: 本文档介绍主题的静态资源的引用方法。
---

通过 [目录结构](./structure.md) 的讲解我们可以知道，目前主题的静态资源统一托管在 `/templates/assets/` 目录下，下面讲解一下如何在模板中使用，大致会分为两种引入方式。

## 模板标签引用

```html
<link rel="stylesheet" th:href="@{/assets/dist/style.css}" />
<script th:src="@{/assets/dist/main.iife.js}"></script>

<img th:src="@{/assets/images/logo.png}" />
```

其中 `@{/assets/dist/style.css}` 表示引用 `/templates/assets/dist/style.css` 文件。最终会被渲染为：

```html
<link rel="stylesheet" href="/themes/my-theme/assets/dist/style.css" />
```

## API 引用

以上方式仅支持在 HTML 标签中使用，且必须使用 `@{}` 包裹才能渲染为正确的路径。如果需要在非 HTML 标签中得到正确的路径，我们提供了 `#theme.assets()` API。

:::info 注意
需要注意的是，调用 `#theme.assets()` 的时候，资源地址不需要添加 `/assets/`。
:::

比如我们需要在 JavaScript 中异步获取一些资源：

```html {3}
<script th:inline="javascript">

loadScript('[(${#theme.assets("/dist/main.iife.js")})]');

// loadScript('/themes/my-theme/assets/dist/main.iife.js');

function loadScript(url) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}
</script>
```

:::info 提示
关于在 JavaScript 中使用 Thymeleaf 语法可以参考 Thymeleaf 官方文档：[JavaScript inlining](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#javascript-inlining)
:::
