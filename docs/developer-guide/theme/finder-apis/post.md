---
title: 文章
description: 文章 - PostFinder
---

## getByName(postName)

```js
postFinder.getByName(postName)
```

### 描述

根据 `metadata.name` 获取文章。

### 参数

1. `postName:string` - 文章的唯一标识 `metadata.name`。

### 返回值

[#PostVo](#postvo)

### 示例

```html
<div th:with="post = ${postFinder.getByName('post-foo')}">
  <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
</div>
```

## content(postName)

```js
postFinder.content(postName)
```

### 描述

根据文章的 `metadata.name` 单独获取文章内容。

### 参数

1. `postName:string` - 文章的唯一标识 `metadata.name`。

### 返回值

[#ContentVo](#contentvo)

### 示例

```html
<div th:with="content = ${postFinder.content('post-foo')}">
  <div th:utext="${content.content}"></div>
</div>
```

## cursor(postName)

```js
postFinder.cursor(postName)
```

### 描述

根据文章的 `metadata.name` 获取相邻的文章（上一篇 / 下一篇）。

### 参数

1. `postName:string` - 文章的唯一标识 `metadata.name`。

### 返回值

[#NavigationPostVo](#navigationpostvo)

### 示例

```html title="/templates/post.html"
<div
  th:with="postCursor = ${postFinder.cursor(post.metadata.name)}"
>
  <a
    th:if="${postCursor.hasPrevious()}"
    th:href="@{${postCursor.previous.status.permalink}}"
  >
    <span th:text="${postCursor.previous.spec.title}"></span>
  </a>
  <a
    th:if="${postCursor.hasNext()}"
    th:href="@{${postCursor.next.status.permalink}}"
  >
    <span th:text="${postCursor.next.spec.title}"></span>
  </a>
</div>
```

## listAll()

```js
postFinder.listAll()
```

### 描述

获取所有文章。

### 参数

无

### 返回值

List<[#ListedPostVo](#listedpostvo)>

### 示例

```html
<ul th:with="posts = ${postFinder.listAll()}">
  <li th:each="post : ${posts}">
    <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
  </li>
</ul>
```

## list(page,size)

```js
postFinder.list(page,size)
```

### 描述

根据分页参数获取文章列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数

### 返回值

[#ListResult<ListedPostVo\>](#listresultlistedpostvo)

### 示例

```html
<ul th:with="posts = ${postFinder.list(1,10)}">
  <li th:each="post : ${posts.items}">
    <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
  </li>
</ul>
```

## listByCategory(page,size,categoryName)

```js
postFinder.listByCategory(page,size,categoryName)
```

### 描述

根据分类标识和分页参数获取文章列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数
3. `categoryName:string` - 文章分类唯一标识 `metadata.name`

### 返回值

[#ListResult<ListedPostVo\>](#listresultlistedpostvo)

### 示例

```html
<ul th:with="posts = ${postFinder.listByCategory(1,10,'category-foo')}">
  <li th:each="post : ${posts.items}">
    <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
  </li>
</ul>
```

## listByTag(page,size,tag)

```js
postFinder.listByTag(page,size,tag)
```

### 描述

根据标签标识和分页参数获取文章列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数
3. `tag:string` - 文章分类唯一标识 `metadata.name`

### 返回值

[#ListResult<ListedPostVo\>](#listresultlistedpostvo)

### 示例

```html
<ul th:with="posts = ${postFinder.listByTag(1,10,'tag-foo')}">
  <li th:each="post : ${posts.items}">
    <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
  </li>
</ul>
```

## archives(page,size)

```js
postFinder.archives(page,size)
```

### 描述

根据分页参数获取文章归档列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数

### 返回值

[#ListResult<PostArchiveVo\>](#listresultpostarchivevo)

### 示例

```html
<th:block th:with="archives = ${postFinder.archives(1,10)}">
  <th:block th:each="archive : ${archives.items}">
    <h1 th:text="${archive.year}"></h1>
    <ul>
      <th:block th:each="month : ${archive.months}">
        <li th:each="post : ${month.posts}">
          <a
            th:href="@{${post.status.permalink}}"
            th:text="${post.spec.title}">
          </a>
        </li>
      </th:block>
    </ul>
  </th:block>
</th:block>
```

## archives(page,size,year)

```js
postFinder.archives(page,size,year)
```

### 描述

根据年份和分页参数获取文章归档列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数
2. `year:string` - 年份

### 返回值

[#ListResult<PostArchiveVo\>](#listresultpostarchivevo)

### 示例

```html
<th:block th:with="archives = ${postFinder.archives(1,10,'2022')}">
  <th:block th:each="archive : ${archives.items}">
    <h1 th:text="${archive.year}"></h1>
    <ul>
      <th:block th:each="month : ${archive.months}">
        <li th:each="post : ${month.posts}">
          <a
            th:href="@{${post.status.permalink}}"
            th:text="${post.spec.title}">
          </a>
        </li>
      </th:block>
    </ul>
  </th:block>
</th:block>
```

## archives(page,size,year,month)

```js
postFinder.archives(page,size,year,month)
```

### 描述

根据年月和分页参数获取文章归档列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数
2. `year:string` - 年份
2. `month:string` - 月份

### 返回值

[#ListResult<PostArchiveVo\>](#listresultpostarchivevo)

### 示例

```html
<th:block th:with="archives = ${postFinder.archives(1,10,'2022','11')}">
  <th:block th:each="archive : ${archives.items}">
    <h1 th:text="${archive.year}"></h1>
    <ul>
      <th:block th:each="month : ${archive.months}">
        <li th:each="post : ${month.posts}">
          <a
            th:href="@{${post.status.permalink}}"
            th:text="${post.spec.title}">
          </a>
        </li>
      </th:block>
    </ul>
  </th:block>
</th:block>
```

## 类型定义

### CategoryVo

```json title="CategoryVo"
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
    "description": "string",
    "cover": "string",
    "template": "string",
    "priority": 0,
    "children": [
      "string"
    ]
  },
  "status": {
    "permalink": "string",
    "postCount": 0,
    "visiblePostCount": 0
  },
  "postCount": 0
}
```

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

### PostVo

```json title="PostVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T12:45:43.888Z",
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
    "publishTime": "2022-11-20T12:45:43.888Z",
    "pinned": false,
    "allowComment": true,
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,
      "raw": "string"
    },
    "categories": [
      "string"
    ],
    "tags": [
      "string"
    ],
    "htmlMetas": [
      {
        "additionalProp1": "string"
      }
    ]
  },
  "status": {
    "permalink": "string",
    "excerpt": "string",
    "commentsCount": 0,
    "contributors": [
      "string"
    ]
  },
  "categories": "List<#CategoryVo>",
  "tags": "List<#TagVo>",
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
  "stats": {
    "visit": 0,
    "upvote": 0,
    "comment": 0
  },
  "content": {
    "raw": "string",
    "content": "string"
  }
}
```

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)

### ContentVo

```json title="ContentVo"
{
  "raw": "string",
  "content": "string"
}
```

### NavigationPostVo

```json title="NavigationPostVo"
{
  "previous": "#PostVo",
  "current": "#PostVo",
  "next": "#PostVo"
}
```

- [#PostVo](#postvo)

### ListedPostVo

```json title="ListedPostVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T13:06:38.505Z",
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
    "publishTime": "2022-11-20T13:06:38.505Z",
    "pinned": false,
    "allowComment": true,
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,
      "raw": "string"
    },
    "categories": [
      "string"
    ],
    "tags": [
      "string"
    ],
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
  "categories": "List<#CategoryVo>",
  "tags": "List<#TagVo>",
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
  "stats": {
    "visit": 0,
    "upvote": 0,
    "comment": 0
  }
}
```

### ListResult<ListedPostVo\>

```json title="ListResult<ListedPostVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#ListedPostVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0
}
```

- [#ListedPostVo](#listedpostvo)

### PostArchiveVo

```json title="PostArchiveVo"
{
  "year": "string",
  "months": [
    {
      "month": "string",
      "posts": "#ListedPostVo"
    }
  ]
}
```

- [#ListedPostVo](#listedpostvo)

### ListResult<PostArchiveVo\>

```json title="ListResult<PostArchiveVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#PostArchiveVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0
}
```

- [#PostArchiveVo](#postarchivevo)
