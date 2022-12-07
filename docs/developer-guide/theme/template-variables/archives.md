---
title: 文章归档
description: archives.html - /archives
---

import CategoryVo from "../vo/CategoryVo.md";
import TagVo from "../vo/TagVo.md";
import Contributor from "../vo/Contributor.md";
import ListedPostVo from "../vo/ListedPostVo.md";

## 路由信息

- 模板路径：`/templates/archives.html`
- 访问路径
  - `/archives`
  - `/archives/:year`
  - `/archives/:year/:month`

## 变量

### archives

#### 变量类型

[#UrlContextListResult<PostArchiveVo\>](#urlcontextlistresultpostarchivevo)

#### 示例

```html title="/templates/archives.html"
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
<div th:if="${archives.hasPrevious() || archives.hasNext()}">
  <a th:href="@{${archives.prevUrl}}">
    <span>上一页</span>
  </a>
  <span th:text="${archives.page} +' / '+ ${archives.total}"></span>
  <a th:href="@{${archives.nextUrl}}">
    <span>下一页</span>
  </a>
</div>
```

## 类型定义

### CategoryVo

<CategoryVo />

### TagVo

<TagVo />

### Contributor

<Contributor />

### ListedPostVo

<ListedPostVo />

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)
- [#Contributor](#contributor)

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

### UrlContextListResult<PostArchiveVo\>

```json title="UrlContextListResult<PostArchiveVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#PostArchiveVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0,
  "nextUrl": "string",
  "prevUrl": "string"
}
```

- [#PostArchiveVo](#postarchivevo)
