---
title: 文章
description: 文章 - PostFinder
---

import CategoryVo from "../vo/_CategoryVo.md";
import TagVo from "../vo/_TagVo.md";
import PostVo from "../vo/_PostVo.md";
import ContentVo from "../vo/_ContentVo.md"
import ContributorVo from "../vo/_ContributorVo.md"
import ListedPostVo from "../vo/_ListedPostVo.md"

## getByName(postName)

```js
postFinder.getByName(postName);
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
postFinder.content(postName);
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
postFinder.cursor(postName);
```

### 描述

根据文章的 `metadata.name` 获取相邻的文章（上一篇 / 下一篇）。

### 参数

1. `postName:string` - 文章的唯一标识 `metadata.name`。

### 返回值

[#NavigationPostVo](#navigationpostvo)

### 示例

```html title="/templates/post.html"
<div th:with="postCursor = ${postFinder.cursor(post.metadata.name)}">
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
postFinder.listAll();
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
postFinder.list(page, size);
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
postFinder.listByCategory(page, size, categoryName);
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
postFinder.listByTag(page, size, tag);
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
postFinder.archives(page, size);
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
          <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}">
          </a>
        </li>
      </th:block>
    </ul>
  </th:block>
</th:block>
```

## archives(page,size,year)

```js
postFinder.archives(page, size, year);
```

### 描述

根据年份和分页参数获取文章归档列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数
3. `year:string` - 年份

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
          <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}">
          </a>
        </li>
      </th:block>
    </ul>
  </th:block>
</th:block>
```

## archives(page,size,year,month)

```js
postFinder.archives(page, size, year, month);
```

### 描述

根据年月和分页参数获取文章归档列表。

### 参数

1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数
3. `year:string` - 年份
4. `month:string` - 月份

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
          <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}">
          </a>
        </li>
      </th:block>
    </ul>
  </th:block>
</th:block>
```

## 类型定义

### CategoryVo

<CategoryVo />

### TagVo

<TagVo />

### ContributorVo

<ContributorVo />

### PostVo

<PostVo />

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)
- [#ContributorVo](#contributorvo)
- [#ContentVo](#contentvo)

### ContentVo

<ContentVo />

### NavigationPostVo

```json title="NavigationPostVo"
{
  "previous": "#PostVo",                                   // 上一篇文章
  "current": "#PostVo",                                    // 当前文章
  "next": "#PostVo"                                        // 下一篇文章
}
```

- [#PostVo](#postvo)

### ListedPostVo

<ListedPostVo />

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)
- [#ContributorVo](#contributorvo)

### ListResult<ListedPostVo\>

```json title="ListResult<ListedPostVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#ListedPostVo>",              // 文章列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0                              // 总页数
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
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#PostArchiveVo>",             // 文章归档数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0                              // 总页数
}
```

- [#PostArchiveVo](#postarchivevo)
