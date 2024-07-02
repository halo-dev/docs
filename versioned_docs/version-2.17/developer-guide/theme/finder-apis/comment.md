---
title: 评论
description: 评论 - CommentFinder
---

import CommentVo from "../vo/_CommentVo.md"
import ReplyVo from "../vo/_ReplyVo.md"

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

<CommentVo />

### ListResult<CommentVo\>

```json title="ListResult<CommentVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#CommentVo>",                 // 评论列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0                              // 总页数
}
```

- [#CommentVo](#commentvo)

### ReplyVo

<ReplyVo />

### ListResult<ReplyVo\>

```json title="ListResult<ReplyVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#ReplyVo>",                   // 回复列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0                              // 总页数
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
