---
title: 评论
description: 评论 - CommentFinder
---

## getByName(name)

```js
commentFinder.getByName(name)
```

### 描述

根据 `metadata.name` 获取评论。

### 参数

1. `name:string` - 评论的唯一标识 `metadata.name`。

### 返回值

[#CommentVo](#commentvo)

### 示例

```html
<div th:with="comment = ${commentFinder.getByName('comment-foo')}">
  <span th:text="${comment.spec.owner.displayName}"></span>
  <div th:text="${comment.spec.content}"></div>
</div>
```

## list(ref,page,size)

```js
commentFinder.list(ref,page,size)
```

### 描述

根据评论的 `metadata.name` 和分页参数获取回复列表。

### 参数

1. `ref:#Ref` - 评论的唯一标识 `metadata.name`。
2. `page:int` - 分页页码，从 1 开始
3. `size:int` - 分页条数

- [#Ref](#ref)

### 返回值

[#ListResult<CommentVo\>](#listresultcommentvo)

### 示例

```html
<ul th:with="comments = ${commentFinder.list({ group: 'content.halo.run', version: 'v1alpha1', kind: 'Post', name: 'post-foo' },1,10)}">
  <li th:each="comment : ${comments.items}">
    <span th:text="${comment.spec.owner.displayName}"></span>
    <div th:text="${comment.spec.content}"></div>
  </li>
</ul>
```

## listReply(commentName,page,size)

```js
commentFinder.listReply(commentName,page,size)
```

### 描述

根据评论的 `metadata.name` 和分页参数获取回复列表。

### 参数

1. `commentName:string` - 评论的唯一标识 `metadata.name`。
1. `page:int` - 分页页码，从 1 开始
2. `size:int` - 分页条数

### 返回值

[#ListResult<ReplyVo\>](#listresultreplyvo)

### 示例

```html
<ul th:with="replies = ${commentFinder.listReply('comment-foo',1,10)}">
  <li th:each="reply : ${replies.items}">
    <span th:text="${reply.spec.owner.displayName}"></span>
    <div th:text="${reply.spec.content}"></div>
  </li>
</ul>
```

## 类型定义

### CommentVo

```json title="CommentVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T12:16:19.788Z"
  },
  "spec": {
    "raw": "string",
    "content": "string",
    "owner": {
      "kind": "string",
      "name": "string",
      "displayName": "string",
      "annotations": {
        "additionalProp1": "string"
      }
    },
    "userAgent": "string",
    "ipAddress": "string",
    "priority": 0,
    "top": false,
    "allowNotification": true,
    "approved": false,
    "hidden": false,
    "subjectRef": {
      "group": "string",
      "version": "string",
      "kind": "string",
      "name": "string"
    },
    "lastReadTime": "2022-11-20T12:16:19.788Z"
  },
  "status": {
    "lastReplyTime": "2022-11-20T12:16:19.788Z",
    "replyCount": 0,
    "unreadReplyCount": 0,
    "hasNewReply": true
  },
  "owner": {
    "kind": "string",
    "name": "string",
    "displayName": "string",
    "avatar": "string",
    "email": "string"
  }
}
```

### ListResult<CommentVo\>

```json title="ListResult<CommentVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#CommentVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0
}
```

- [#CommentVo](#commentvo)

### ReplyVo

```json title="ReplyVo"
{
  "metadata": {
    "name": "string",
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T12:25:32.357Z"
  },
  "spec": {
    "raw": "string",
    "content": "string",
    "owner": {
      "kind": "string",
      "name": "string",
      "displayName": "string",
      "annotations": {
        "additionalProp1": "string"
      }
    },
    "userAgent": "string",
    "ipAddress": "string",
    "priority": 0,
    "top": false,
    "allowNotification": true,
    "approved": false,
    "hidden": false,
    "commentName": "string",
    "quoteReply": "string"
  },
  "owner": {
    "kind": "string",
    "name": "string",
    "displayName": "string",
    "avatar": "string",
    "email": "string"
  }
}
```

### ListResult<ReplyVo\>

```json title="ListResult<ReplyVo>"
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": "List<#ReplyVo>",
  "first": true,
  "last": true,
  "hasNext": true,
  "hasPrevious": true,
  "totalPages": 0
}
```

- [#ReplyVo](#replyvo)

### Ref

```json title="Ref"
{
  "group": "string",
  "kind": "string",
  "version": "string",
  "name": "string"
}
```
