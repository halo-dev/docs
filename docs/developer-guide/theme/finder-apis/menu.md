---
title: 导航菜单
description: 导航菜单 - MenuFinder
---

## getByName(name)

```js
menuFinder.getByName(name)
```

### 描述

根据 `metadata.name` 获取菜单。

### 参数

1. `name:string` - 菜单的唯一标识 `metadata.name`。

### 返回值

[#MenuVo](#menuvo)

### 示例

```html
<div th:with="menu = ${menuFinder.getByName('menu-foo')}">
  <ul th:with="menuItems = ${menu.menuItems}">
    <li th:each="menuItem : ${menuItems}">
      <a th:href="@{${menuItem.status.href}}" th:text="${menuItem.spec.displayName}"></a>
    </li>
   </ul>
</div>
```

## getPrimary()

```js
menuFinder.getPrimary()
```

### 描述

获取主菜单。

### 参数

无

### 返回值

[#MenuVo](#menuvo)

### 示例

```html
<div th:with="menu = ${menuFinder.getPrimary()}">
  <ul th:with="menuItems = ${menu.menuItems}">
    <li th:each="menuItem : ${menuItems}">
      <a th:href="@{${menuItem.status.href}}" th:text="${menuItem.spec.displayName}"></a>
    </li>
   </ul>
</div>
```

## 类型定义

### MenuVo

```json title="MenuVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:44:58.984Z",
  },
  "spec": {
    "displayName": "string",
    "menuItems": [
      "string"
    ]
  },
  "menuItems": "List<#MenuItemVo>"
}
```

### MenuItemVo

```json title="MenuItemVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:44:58.984Z",
  },
  "spec": {
    "displayName": "string",
    "href": "string",
    "priority": 0,
    "children": [
      "string"
    ],
    "categoryRef": {
      "group": "string",
      "version": "string",
      "kind": "string",
      "name": "string"
    },
    "tagRef": {
      "group": "string",
      "version": "string",
      "kind": "string",
      "name": "string"
    },
    "postRef": {
      "group": "string",
      "version": "string",
      "kind": "string",
      "name": "string"
    },
    "singlePageRef": {
      "group": "string",
      "version": "string",
      "kind": "string",
      "name": "string"
    }
  },
  "status": {
    "displayName": "string",
    "href": "string"
  },
  "children": "List<#MenuItemVo>",
  "parentName": "string",
}
```
