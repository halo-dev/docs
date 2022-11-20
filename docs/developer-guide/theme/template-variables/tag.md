---
title: 标签归档
description: tag.html - /tags/:slug
---

## 路由信息

- 模板路径：`/templates/tag.html`
- 访问路径：`/tags/:slug`

## 变量

### tag

#### 变量类型

[#TagVo](#tagvo)

### posts

#### 变量类型

[#UrlContextListResult<ListedPostVo\>](#urlcontextlistresultlistedpostvo)

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
