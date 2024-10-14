---
title: 标签归档
description: tag.html - /tags/:slug
---

import CategoryVo from "../vo/_CategoryVo.md"
import TagVo from "../vo/_TagVo.md"
import ContributorVo from "../vo/_ContributorVo.md";
import ListedPostVo from "../vo/_ListedPostVo.md"

## 路由信息

- 模板路径：`/templates/tag.html`
- 访问路径：`/tags/:slug`

## 变量

### tag

#### 变量类型

[#TagVo](#tagvo)

### posts

#### 变量类型

[#UrlContextListResult\<ListedPostVo\>](#urlcontextlistresultlistedpostvo)

#### 示例

```html title="/templates/tag.html"
<div>
  <h1 th:text="${tag.spec.displayName}"></h1>
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

### _templateId

#### 变量值

`tag`

## 类型定义

### CategoryVo

<CategoryVo />

### TagVo

<TagVo />

### ContributorVo

<ContributorVo />

### ListedPostVo

\<ListedPostVo \/\>

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
