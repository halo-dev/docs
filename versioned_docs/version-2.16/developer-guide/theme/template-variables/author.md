---
title: 作者归档
description: author.html - /authors/:name
---

import UserVo from "../vo/_UserVo.md"
import CategoryVo from "../vo/_CategoryVo.md"
import TagVo from "../vo/_TagVo.md"
import ContributorVo from "../vo/_ContributorVo.md"
import ListedPostVo from "../vo/_ListedPostVo.md"

## 路由信息

- 模板路径：`/templates/author.html`
- 访问路径：`/authors/:name`

## 变量

### author

#### 变量类型

[#UserVo](#uservo)

### posts

#### 变量类型

[#UrlContextListResult\<ListedPostVo\>](#urlcontextlistresultlistedpostvo)

#### 示例

```html title="/templates/author.html"
<div>
  <h1 th:text="${author.spec.displayName}"></h1>
  <ul>
    <li th:each="post : ${posts.items}">
      <a
        th:text="${post.spec.title}"
        th:href="${post.status.permalink}"
      ></a>
    </li>
  </ul>
  <div th:if="${posts.hasPrevious() || posts.hasNext()}">
    <a
      th:href="@{${posts.prevUrl}}"
    >
      <span>上一页</span>
    </a>
    <span th:text="${posts.page} +' / '+ ${posts.total}"></span>
    <a
      th:href="@{${posts.nextUrl}}"
    >
      <span>下一页</span>
    </a>
  </div>
</div>
```

## 类型定义

### UserVo

<UserVo />

### CategoryVo

<CategoryVo />

### TagVo

<TagVo />

### ContributorVo

<ContributorVo />

### ListedPostVo

<ListedPostVo />

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)
- [#ContributorVo](#contributorvo)

### UrlContextListResult\<ListedPostVo\>

```json title="UrlContextListResult<ListedPostVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#ListedPostVo>",              // 文章列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0,                             // 总页数
  "nextUrl": "string",                         // 下一页链接
  "prevUrl": "string"                          // 上一页链接
}
```

- [#ListedPostVo](#listedpostvo)
