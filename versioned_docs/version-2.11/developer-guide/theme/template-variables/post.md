---
title: 文章
description: post.html - /archives/:slug
---

import CategoryVo from "../vo/_CategoryVo.md"
import TagVo from "../vo/_TagVo.md"
import ContentVo from "../vo/_ContentVo.md"
import ContributorVo from "../vo/_ContributorVo.md"
import PostVo from "../vo/_PostVo.md"

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

<CategoryVo />

### TagVo

<TagVo />

### ContributorVo

<ContributorVo />

### ContentVo

<ContentVo />

### PostVo

<PostVo />

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)
- [#ContributorVo](#contributorvo)
- [#ContentVo](#contentvo)
