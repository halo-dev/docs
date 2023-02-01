---
title: 独立页面
description: page.html - /:slug
---

import SinglePageVo from "../vo/SinglePageVo.md"
import ContributorVo from "../vo/ContributorVo.md"
import ContentVo from "../vo/ContentVo.md"

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

<SinglePageVo />

- [#ContentVo](#contentvo)
- [#ContributorVo](#contributorvo)

### ContentVo

<ContentVo />

### ContributorVo

<ContributorVo />
