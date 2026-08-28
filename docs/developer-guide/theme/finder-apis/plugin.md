---
title: 插件
description: 使用 PluginFinder 检查指定 Halo 插件是否已安装并启用，或进一步按 Semantic Version 版本范围判断插件是否可用
---

## available(pluginName)

```js
pluginFinder.available(pluginName)
```

### 描述

判断一个插件是否可用，会同时判断插件是否安装和启用。

### 参数

1. `pluginName:string` - 插件的唯一标识 `metadata.name`。

### 返回值

`boolean` - 插件是否可用

### 示例

```html
<!-- https://github.com/halo-sigs/plugin-search-widget -->
<li th:if="${pluginFinder.available('PluginSearchWidget')}">
  <a href="javascript:SearchWidget.open()" title="搜索">
    搜索
  </a>
</li>
```

## available(pluginName, requiresVersion)

```js
pluginFinder.available('fake-plugin', '>=2.3.0')
```

### 描述

判断一个插件是否可用，会同时判断插件是否安装和启用且插件的版本符合 `requiresVersion` 要求，

### 参数

1. `pluginName:string` - 插件的唯一标识 `metadata.name`，不能为空。
2. `requiresVersion:string` - 插件的版本要求，不能为空，例如：`>1.2.0`，`requiresVersion` 的格式遵循 [Semantic Range Expressions](https://github.com/zafarkhaja/jsemver#range-expressions)。

### 返回值

`boolean` - 插件是否可用

### 示例

```html
<!-- https://github.com/halo-sigs/plugin-search-widget -->
<li th:if="${pluginFinder.available('PluginSearchWidget', '>=2.3.0')}">
  <a href="javascript:SearchWidget.open()" title="搜索">
    搜索
  </a>
</li>
```
