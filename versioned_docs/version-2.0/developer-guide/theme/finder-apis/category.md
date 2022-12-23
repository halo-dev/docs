---
title: 文章分类
description: 文章分类 - CategoryFinder
---

import CategoryVo from "../vo/CategoryVo.md"
import CategoryTreeVo from "../vo/CategoryTreeVo.md"

## getByName(name)

```js
categoryFinder.getByName(name)
```

### 描述

根据 `metadata.name` 获取文章分类。

### 参数

1. `name:string` - 分类的唯一标识 `metadata.name`。

### 返回值

[#CategoryVo](#categoryvo)

### 示例

```html
<div th:with="category = ${categoryFinder.getByName('category-foo')}">
  <a th:href="@{${category.status.permalink}}" th:text="${category.spec.displayName}"></a>
</div>
```

## getByNames(names)

```js
categoryFinder.getByNames(names)
```

### 描述

根据一组 `metadata.name` 获取文章分类。

### 参数

1. `names:List<string>` - 分类的唯一标识 `metadata.name` 的集合。

### 返回值

List<[#CategoryVo](#categoryvo)>

### 示例

```html
<div th:with="categories = ${categoryFinder.getByNames(['category-foo', 'category-bar'])}">
  <a th:each="category : ${categories}" th:href="@{${category.status.permalink}}" th:text="${category.spec.displayName}"></a>
</div>
```

## list(page,size)

```js
categoryFinder.list(page,size)
```

### 描述

根据分页参数获取分类列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数

### 返回值

[#ListResult<CategoryVo\>](#listresultcategoryvo)

### 示例

```html
<ul th:with="categories = ${categoryFinder.list(1,10)}">
  <li th:each="category : ${categories.items}">
    <a th:href="@{${category.status.permalink}}" th:text="${category.spec.displayName}"></a>
  </li>
</ul>
```

## listAll()

```js
categoryFinder.listAll()
```

### 描述

获取所有文章分类。

### 参数

无

### 返回值

List<[#CategoryVo](#categoryvo)>

### 示例

```html
<ul th:with="categories = ${categoryFinder.listAll()}">
  <li th:each="category : ${categories}">
    <a th:href="@{${category.status.permalink}}" th:text="${category.spec.displayName}"></a>
  </li>
</ul>
```

## listAsTree()

```js
categoryFinder.listAsTree()
```

### 描述

获取所有文章分类的多层级结构。

### 参数

无

### 返回值

List<[#CategoryTreeVo](#categorytreevo)>

### 示例

```html
<div th:with="categories = ${categoryFinder.listAsTree()}">
  <ul>
    <li th:replace="~{modules/category-tree :: single(categories=${categories})}" />
  </ul>
</div>
```

```html title="/templates/category-tree.html"
<ul th:fragment="next (categories)">
  <li th:fragment="single (categories)" th:each="category : ${categories}">
    <a th:href="@{${category.status.permalink}}">
      <span th:text="${category.spec.displayName}"> </span>
    </a>
    <th:block th:if="${not #lists.isEmpty(category.children)}">
      <th:block th:replace="~{modules/category-tree :: next (categories=${category.children})}"></th:block>
    </th:block>
  </li>
</ul>
```

## 类型定义

### CategoryVo

<CategoryVo />

### ListResult<CategoryVo\>

```json title="ListResult<CategoryVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#CategoryVo>",                // 分类列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0                              // 总页数
}
```

- [#CategoryVo](#categoryvo)

### CategoryTreeVo

<CategoryTreeVo />

- [#CategoryTreeVo](#categorytreevo)
