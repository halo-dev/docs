---
title: 首页
description: index.html - /
---

import CategoryVo from "../vo/CategoryVo.md"
import TagVo from "../vo/TagVo.md"
import Contributor from "../vo/Contributor.md";
import ListedPostVo from "../vo/ListedPostVo.md"

## 路由信息

- 模板路径：`/templates/index.html`
- 访问路径：`/`

## 变量

### posts

#### 变量类型

[#UrlContextListResult<ListedPostVo\>](#urlcontextlistresultlistedpostvo)

#### 示例

```html title="/templates/index.html"
<div>
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

`index`

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

### UrlContextListResult<ListedPostVo\>

```json title="UrlContextListResult<ListedPostVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#ListedPostVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0,
  "nextUrl": "string",
  "prevUrl": "string"
}
```

- [#ListedPostVo](#listedpostvo)
