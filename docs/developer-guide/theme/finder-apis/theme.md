---
title: 主题
description: 主题 - ThemeFinder
---

## activation()

```js
themeFinder.activation()
```

### 描述

获取当前激活的主题。

### 参数

无

### 返回值

[#ThemeVo](#themevo)

### 示例

```html
<div th:with="theme = ${themeFinder.activation()}">
  <h1 th:text="${theme.spec.displayName}"></h1>
  <p th:text="${theme.spec.version}"></p>
</div>
```

## getByName(themeName)

```js
themeFinder.getByName(themeName)
```

### 描述

根据主题的唯一标识 `metadata.name` 获取主题。

### 参数

- `themeName:string` - 主题名称

### 返回值

[#ThemeVo](#themevo)

### 示例

```html
<div th:with="theme = ${themeFinder.getByName('theme-foo')}">
  <h1 th:text="${theme.spec.displayName}"></h1>
  <p th:text="${theme.spec.version}"></p>
</div>
```

## 类型定义

### ThemeVo

```json title="ThemeVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T15:27:15.036Z",    // 创建时间
  },
  "spec": {
    "displayName": "string",                            // 显示名称
    "author": {
      "name": "string",                                 // 作者名称
      "website": "string"                               // 作者网站
    },
    "description": "string",                            // 描述
    "logo": "string",                                   // Logo
    "website": "string",                                // 网站
    "repo": "string",                                   // 仓库地址
    "version": "string",                                // 版本
    "require": "string",                                // 依赖 Halo 的版本
    "settingName": "string",                            // 表单定义的名称，即 Setting 资源的 metadata.name
    "configMapName": "string",                          // 设置项存储的名称，即 ConfigMap 资源的 metadata.name
    "customTemplates": {
      "post": [
        {
          "name": "string",
          "description": "string",
          "screenshot": "string",
          "file": "string"
        }
      ],
      "category": [
        {
          "name": "string",
          "description": "string",
          "screenshot": "string",
          "file": "string"
        }
      ],
      "page": [
        {
          "name": "string",
          "description": "string",
          "screenshot": "string",
          "file": "string"
        }
      ]
    }
  },
  "config": {}
}
```
