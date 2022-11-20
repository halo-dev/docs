---
title: 文章
description: post.html - /archives/:slug
---

## 路由信息

- 模板路径：`/templates/post.html`
- 访问路径：`/archives/:slug`

## 变量

### post

#### 变量类型

[#PostVo](#postvo)

#### 示例

```html title="/templates/post.html"
<article>
  <h1 th:text="${post.spec.title}"></h1>
  <div th:utext="${post.content.content}"> </div>
</article>
```

### _templateId

#### 变量值

`post`

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
