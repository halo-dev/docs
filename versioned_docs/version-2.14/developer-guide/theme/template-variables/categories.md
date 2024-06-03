---
title: 文章分类集合
description: categories.html - /categories
---

import CategoryTreeVo from "../vo/_CategoryTreeVo.md"

## 路由信息

- 模板路径：`/templates/categories.html`
- 访问路径：`/categories`

## 变量

### categories

#### 变量类型

List<[#CategoryTreeVo](#categorytreevo)>

#### 示例

```html title="/templates/categories.html"
<ul>
  <li th:replace="~{modules/category-tree :: single(categories=${categories})}" />
</ul>
```

```html title="/templates/category-tree.html"
<ul th:fragment="next (categories)">
  <li th:fragment="single (categories)" th:each="category : ${categories}">
    <a th:href="@{${category.status.permalink}}">
      <span th:text="${category.spec.displayName}"> </span>
    </a>
    <th:block th:if="${not #lists.isEmpty(category.children)}">
      <th:block th:replace="~{modules/category-tree :: next (categories=${category.children})}"></th:block>
    </th:block>
  </li>
</ul>
```

### _templateId

#### 变量值

`categories`

## 类型定义

### CategoryTreeVo

<CategoryTreeVo />

- [#CategoryTreeVo](#categorytreevo)
