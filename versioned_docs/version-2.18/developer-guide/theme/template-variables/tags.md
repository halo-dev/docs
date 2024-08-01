---
title: 文章标签集合
description: tags.html - /tags
---

import TagVo from '../vo/_TagVo.md'

## 路由信息

- 模板路径：`/templates/tags.html`
- 访问路径：`/tags`

## 变量

### tags

#### 变量类型

List<[#TagVo](#tagvo)>

#### 示例

```html title="/templates/tags.html"
<ul>
  <li th:each="tag : ${tags}" th:text="${tag.spec.displayName}" th:href="${tag.status.permalink}" />
</ul>
```

### _templateId

#### 变量值

`tags`

## 类型定义

### TagVo

<TagVo />
