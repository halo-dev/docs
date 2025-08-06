---
title: 独立页面
description: 独立页面 - SinglePageFinder
---

import SinglePageVo from "../vo/_SinglePageVo.md"
import ListedSinglePageVo from "../vo/_ListedSinglePageVo.md"
import ContributorVo from "../vo/_ContributorVo.md"
import ContentVo from "../vo/_ContentVo.md"

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

[#ListResult\<ListedSinglePageVo\>](#listresultlistedsinglepagevo)

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

- [#ContributorVo](#contributorvo)
- [#ContentVo](#contentvo)

### ListedSinglePageVo

- [#ContributorVo](#contributorvo)

<ListedSinglePageVo />

### ListResult\<ListedSinglePageVo\>

```json title="ListResult<ListedSinglePageVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#ListedSinglePageVo>",        // 自定义页面列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0                              // 总页数
}
```

- [#ListedSinglePageVo](#listedsinglepagevo)

### ContentVo

<ContentVo />

### ContributorVo

<ContributorVo />
