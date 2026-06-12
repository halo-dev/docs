---
title: 作者
description: 作者 - ContributorFinder
---

import ContributorVo from "../vo/_ContributorVo.md"

## getContributor(name)

```js
contributorFinder.getContributor(name)
```

### 描述

根据 `metadata.name` 获取作者。

### 参数

1. `name:string` - 作者的唯一标识 `metadata.name`。

### 返回值

[#ContributorVo](#contributorvo)

### 示例

```html
<div th:with="contributor = ${contributorFinder.getContributor('contributor-foo')}">
  <h1 th:text="${contributor.displayName}"></h1>
</div>
```

## getContributors(names)

```js
contributorFinder.getContributors(names)
```

### 描述

根据一组 `metadata.name` 获取作者。

### 参数

1. `names:List<string>` - 作者的唯一标识 `metadata.name` 的集合。

### 返回值

List\<[#ContributorVo](#contributorvo)\>

### 示例

```html
<div th:with="contributors = ${contributorFinder.getContributors({'contributor-foo, 'contributor-bar'})}">
  <span th:each="contributor : ${contributors}" th:text="${contributor.displayName}"></span>
</div>
```

## 类型定义

### ContributorVo

<ContributorVo />
