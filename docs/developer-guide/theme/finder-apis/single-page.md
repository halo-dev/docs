---
title: 独立页面
description: 独立页面 - SinglePageFinder
---

import SinglePageVo from "../vo/SinglePageVo.md"
import ListedSinglePageVo from "../vo/ListedSinglePageVo.md"
import Contributor from "../vo/Contributor.md"
import ContentVo from "../vo/ContentVo.md"

## getByName(pageName)

```js
singlePageFinder.getByName(pageName)
```

### 描述

根据 `metadata.name` 获取独立页面。

### 参数

1. `pageName:string` - 独立页面的唯一标识 `metadata.name`。

### 返回值

[#SinglePageVo](#singlepagevo)

### 示例

```html
<div th:with="singlePage = ${singlePageFinder.getByName('page-foo')}">
  <a th:href="@{${singlePage.status.permalink}}" th:text="${singlePage.spec.title}"></a>
</div>
```

## content(pageName)

```js
singlePageFinder.content(pageName)
```

### 描述

根据独立页面的 `metadata.name` 单独获取独立页面内容。

### 参数

1. `pageName:string` - 独立页面的唯一标识 `metadata.name`。

### 返回值

[#ContentVo](#contentvo)

### 示例

```html
<div th:with="content = ${singlePageFinder.content('page-foo')}">
  <div th:utext="${content.content}"></div>
</div>
```

## list(page,size)

```js
singlePageFinder.list(page,size)
```

### 描述

根据分页参数获取独立页面列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数

### 返回值

[#ListResult<ListedSinglePageVo\>](#listresultlistedsinglepagevo)

### 示例

```html
<ul th:with="singlePages = ${singlePageFinder.list(1,10)}">
  <li th:each="singlePage : ${singlePages.items}">
    <a th:href="@{${singlePage.status.permalink}}" th:text="${singlePage.spec.title}"></a>
  </li>
</ul>
```

## 类型定义

### SinglePageVo

<SinglePageVo />

- [#Contributor](#contributor)
- [#ContentVo](#contentvo)

### ListedSinglePageVo

- [#Contributor](#contributor)

<ListedSinglePageVo />

### ListResult<ListedSinglePageVo\>

```json title="ListResult<ListedSinglePageVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#ListedSinglePageVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0
}
```

- [#ListedSinglePageVo](#listedsinglepagevo)

### ContentVo

<ContentVo />

### Contributor

<Contributor />
