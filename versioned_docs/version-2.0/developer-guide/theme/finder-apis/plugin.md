---
title: 插件
description: 插件 - PluginFinder
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
