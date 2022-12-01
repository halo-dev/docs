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
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T15:27:15.036Z",
  },
  "spec": {
    "displayName": "string",
    "author": {
      "name": "string",
      "website": "string"
    },
    "description": "string",
    "logo": "string",
    "website": "string",
    "repo": "string",
    "version": "string",
    "require": "string",
    "settingName": "string",
    "configMapName": "string",
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
