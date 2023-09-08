---
title: 导航菜单
description: 导航菜单 - MenuFinder
---

import MenuItemVo from "../vo/MenuItemVo.md"
import MenuVo from "../vo/MenuVo.md"

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
      <a
        th:href="@{${menuItem.status.href}}"
        th:text="${menuItem.status.displayName}"
        th:target="${menuItem.spec.target?.value}"
      >
      </a>
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
      <a
        th:href="@{${menuItem.status.href}}"
        th:text="${menuItem.status.displayName}"
        th:target="${menuItem.spec.target?.value}"
      >
      </a>
    </li>
  </ul>
</div>
```

## 类型定义

### MenuVo

<MenuVo />

### MenuItemVo

<MenuItemVo />
