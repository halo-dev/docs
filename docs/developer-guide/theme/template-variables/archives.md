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
  "year": "string",                                   // 年份
  "months": [                                         // 按月的文章集合
    {
      "month": "string",                              // 月份
      "posts": "List<#ListedPostVo>"                  // 文章列表数据
    }
  ]
}
```

- [#ListedPostVo](#listedpostvo)

### UrlContextListResult<PostArchiveVo\>

```json title="UrlContextListResult<PostArchiveVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#PostArchiveVo>",             // 文章归档数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0,                             // 总页数
  "nextUrl": "string",                         // 下一页链接
  "prevUrl": "string"                          // 上一页链接
}
```

- [#PostArchiveVo](#postarchivevo)
