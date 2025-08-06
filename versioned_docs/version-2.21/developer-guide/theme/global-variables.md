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
