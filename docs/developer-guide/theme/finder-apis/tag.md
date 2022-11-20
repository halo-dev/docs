---
title: 文章标签
description: 文章标签 - TagFinder
---

## getByName(name)

```js
tagFinder.getByName(name)
```

### 描述

根据 `metadata.name` 获取标签。

### 参数

1. `name:string` - 标签的唯一标识 `metadata.name`。

### 返回值

[#TagVo](#tagvo)

### 示例

```html
<div th:with="tag = ${tagFinder.getByName('tag-foo')}">
  <a th:href="@{${tag.status.permalink}}" th:text="${tag.spec.displayName}"></a>
</div>
```

## getByNames(names)

```js
tagFinder.getByNames(names)
```

### 描述

根据一组 `metadata.name` 获取标签。

### 参数

1. `names:List<string>` - 标签的唯一标识 `metadata.name` 的集合。

### 返回值

List<[#TagVo](#tagvo)>

### 示例

```html
<div th:with="tags = ${tagFinder.getByNames(['tag-foo', 'tag-bar'])}">
  <a th:each="tag : ${tags}" th:href="@{${tag.status.permalink}}" th:text="${tag.spec.displayName}"></a>
</div>
```

## list(page,size)

```js
tagFinder.list(page,size)
```

### 描述

根据分页参数获取标签列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数

### 返回值

[#ListResult<TagVo\>](#listresulttagvo)

### 示例

```html
<ul th:with="tags = ${tagFinder.list(1,10)}">
  <li th:each="tag : ${tags.items}">
    <a th:href="@{${tag.status.permalink}}" th:text="${tag.spec.displayName}"></a>
  </li>
</ul>
```

## listAll()

```js
tagFinder.listAll()
```

### 描述

获取所有文章标签。

### 参数

无

### 返回值

List<[#TagVo](#tagvo)>

### 示例

```html
<ul th:with="tags = ${tagFinder.listAll()}">
  <li th:each="tag : ${tags}">
    <a th:href="@{${tag.status.permalink}}" th:text="${tag.spec.displayName}"></a>
  </li>
</ul>
```

## 类型定义

### TagVo

```json title="TagVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T13:06:38.512Z",
  },
  "spec": {
    "displayName": "string",
    "slug": "string",
    "color": "#F9fEB1",
    "cover": "string"
  },
  "status": {
    "permalink": "string",
    "visiblePostCount": 0,
    "postCount": 0
  },
  "postCount": 0
}
```

### ListResult<TagVo\>

```json title="ListResult<TagVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#TagVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0
}
```

- [#TagVo](#tagvo)
