---
title: 独立页面
description: page.html - /:slug
---

## 路由信息

- 模板路径：`/templates/page.html`
- 访问路径：`/:slug`

## 变量

### singlePage

#### 变量类型

[#SinglePageVo](#singlepagevo)

#### 示例

```html title="/templates/page.html"
<article>
  <h1 th:text="${singlePage.spec.title}"></h1>
  <div th:utext="${singlePage.content.content}"> </div>
</article>
```

### _templateId

#### 变量值

`page`

## 类型定义

### SinglePageVo

```json title="SinglePageVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:29:44.601Z",
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
    "publishTime": "2022-11-20T14:29:44.601Z",
    "pinned": false,
    "allowComment": true,
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,
      "raw": "string"
    },
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
  "stats": {
    "visit": 0,
    "upvote": 0,
    "comment": 0
  },
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
  "content": {
    "raw": "string",
    "content": "string"
  }
}
```
