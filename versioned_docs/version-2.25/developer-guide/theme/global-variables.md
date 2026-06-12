---
title: 全局变量
description: 本文档介绍 Halo 为模板引擎提供的专有全局变量。
---

import SiteSettingVo from "./vo/_SiteSettingVo.md"
import ThemeVo from "./vo/_ThemeVo.md"

Halo 目前为模板引擎在全局提供了一些变量，本文档将列出已提供的变量以及介绍这些变量的使用方法。

## site

### 描述

提供了部分可公开的系统相关的设置项，其中所有参数均来自于 Console 的系统设置。

### 类型

<SiteSettingVo />

### 示例

显示站点标题：

```html
<h1 th:text="${site.title}"></h1>
```

显示站点 Logo：

```html
<img th:src="${site.logo}" alt="Logo" />
```

显示当前 Halo 版本：

```html
<span th:text="${site.version}"></span>
```

## #halo.matchVersion(constraint)

### 描述

用于判断当前运行的 Halo 版本是否满足指定的语义化版本范围，适合在主题模板中为依赖新版 Halo 能力的片段添加兼容判断。

版本范围格式遵循 [Semantic Range Expressions](https://github.com/zafarkhaja/jsemver#range-expressions)，例如 `>=2.25.0`、`>2.0.0 & <3.0.0` 等。

:::tip
开发版本 `0.0.0` 会始终返回 `true`，以便在本地开发环境中调试主题模板。
:::

### 示例

仅在 Halo 版本满足要求时渲染模板片段：

```html
<div th:if="${#halo.matchVersion('>=2.25.0')}">
  <!-- 这里可以使用仅在 Halo 2.25.0 及以上版本可用的能力 -->
</div>
```

判断一个版本范围：

```html
<div th:if="${#halo.matchVersion('>=2.25.0 & <3.0.0')}">
  <!-- 仅在 Halo 2.x 的指定版本范围内渲染 -->
</div>
```

## theme

### 描述

关于当前激活主题的信息。

### 类型

<ThemeVo />

### 示例

显示主题名称：

```html
<h1 th:text="${theme.spec.displayName}"></h1>
```

在静态资源加入版本号参数，以防止升级之后的缓存问题：

```html
<link rel="stylesheet" th:href="@{/assets/dist/style.css?v={version}(version=${theme.spec.version})}" />
<script th:src="@{/assets/dist/main.iife.js?v={version}(version=${theme.spec.version})}"></script>
```
