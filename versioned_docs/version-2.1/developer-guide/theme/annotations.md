---
title: 模型元数据
---

在 [元数据表单定义](../annotations-form.md) 我们介绍了如何为模型添加元数据表单，此文档将介绍如何在主题模板中使用元数据。

我们在模板中专门为获取 annotations 数据提供了三个方法，可以更加方便的设置默认值和判断元数据字段是否存在。

## #annotations.get(extension,key)

### 描述

根据对象和元数据的 key 获取元数据的值。

### 示例

```html {4}
<div th:with="menu = ${menuFinder.getPrimary()}">
  <ul th:with="menuItems = ${menu.menuItems}">
    <li th:each="menuItem : ${menuItems}">
      <i th:class="${#annotations.get(menuItem, 'icon')}"></i>
      <a th:href="@{${menuItem.status.href}}" th:text="${menuItem.spec.displayName}"></a>
    </li>
   </ul>
</div>
```

## #annotations.getOrDefault(extension,key,defaultValue)

### 描述

根据对象和元数据的 key 获取元数据的值，同时支持设置默认值。

### 示例

```html {4}
<div th:with="menu = ${menuFinder.getPrimary()}">
  <ul th:with="menuItems = ${menu.menuItems}">
    <li th:each="menuItem : ${menuItems}">
      <i th:class="${#annotations.getOrDefault(menuItem, 'icon', 'fa')}"></i>
      <a th:href="@{${menuItem.status.href}}" th:text="${menuItem.spec.displayName}"></a>
    </li>
   </ul>
</div>
```

## #annotations.contains(extension,key)

### 描述

根据对象和元数据的 key 判断元数据是否存在。

### 示例

```html {4}
<div th:with="menu = ${menuFinder.getPrimary()}">
  <ul th:with="menuItems = ${menu.menuItems}">
    <li th:each="menuItem : ${menuItems}">
      <i th:if="${#annotations.contains(menuItem, 'icon')}" th:class="${#annotations.get(menuItem, 'icon')}"></i>
      <a th:href="@{${menuItem.status.href}}" th:text="${menuItem.spec.displayName}"></a>
    </li>
   </ul>
</div>
```
