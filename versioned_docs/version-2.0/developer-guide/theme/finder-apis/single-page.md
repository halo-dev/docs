---
title: 独立页面
description: 独立页面 - SinglePageFinder
---

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

```json title="SinglePageVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:29:44.601Z",
  },
  "spec": {
    "title": "string",
    "slug": "string",
    "releaseSnapshot": "string",
    "headSnapshot": "string",
    "baseSnapshot": "string",
    "owner": "string",
    "template": "string",
    "cover": "string",
    "deleted": false,
    "publish": false,
    "publishTime": "2022-11-20T14:29:44.601Z",
    "pinned": false,
    "allowComment": true,
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,
      "raw": "string"
    },
    "htmlMetas": [
      {
        "additionalProp1": "string"
      }
    ]
  },
  "status": {
    "permalink": "string",
    "excerpt": "string",
    "inProgress": true,
    "commentsCount": 0,
    "contributors": [
      "string"
    ]
  },
  "stats": {
    "visit": 0,
    "upvote": 0,
    "comment": 0
  },
  "contributors": [
    {
      "name": "string",
      "displayName": "string",
      "avatar": "string",
      "bio": "string"
    }
  ],
  "owner": {
    "name": "string",
    "displayName": "string",
    "avatar": "string",
    "bio": "string"
  },
  "content": {
    "raw": "string",
    "content": "string"
  }
}
```

### ListedSinglePageVo

```json title="ListedSinglePageVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:31:00.876Z"
  },
  "spec": {
    "title": "string",
    "slug": "string",
    "releaseSnapshot": "string",
    "headSnapshot": "string",
    "baseSnapshot": "string",
    "owner": "string",
    "template": "string",
    "cover": "string",
    "deleted": false,
    "publish": false,
    "publishTime": "2022-11-20T14:31:00.876Z",
    "pinned": false,
    "allowComment": true,
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,
      "raw": "string"
    },
    "htmlMetas": [
      {
        "additionalProp1": "string"
      }
    ]
  },
  "status": {
    "permalink": "string",
    "excerpt": "string",
    "inProgress": true,
    "commentsCount": 0,
    "contributors": [
      "string"
    ]
  },
  "stats": {
    "visit": 0,
    "upvote": 0,
    "comment": 0
  },
  "contributors": [
    {
      "name": "string",
      "displayName": "string",
      "avatar": "string",
      "bio": "string"
    }
  ],
  "owner": {
    "name": "string",
    "displayName": "string",
    "avatar": "string",
    "bio": "string"
  }
}
```

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

```json title="ContentVo"
{
  "raw": "string",
  "content": "string"
}
```
