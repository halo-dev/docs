---
title: 文章归档
description: archives.html - /archives
---

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
        <a
          th:href="@{${post.status.permalink}}"
          th:text="${post.spec.title}">
        </a>
      </li>
    </th:block>
  </ul>
</th:block>
<div th:if="${archives.hasPrevious() || archives.hasNext()}">
  <a
    th:href="@{${archives.prevUrl}}"
  >
    <span>上一页</span>
  </a>
  <span th:text="${archives.page} +' / '+ ${archives.total}"></span>
  <a
    th:href="@{${archives.nextUrl}}"
  >
    <span>下一页</span>
  </a>
</div>
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

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)

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
