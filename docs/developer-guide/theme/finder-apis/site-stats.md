---
title: 站点统计
description: 使用 SiteStatsFinder 获取站点访问、点赞、评论、文章和分类数量，并在 Thymeleaf 模板中通过 SiteStatsVo 渲染统计信息。
---

## getStats()

```js
siteStatsFinder.getStats();
```

### 描述

获取站点的统计信息。

### 参数

无

### 返回值

[#SiteStatsVo](#sitestatsvo)

### 示例

```html
<ul th:with="stats = ${siteStatsFinder.getStats()}">
  <li th:text="${stats.visit}"></li>
  <li th:text="${stats.post}"></li>
</ul>
```

## 类型定义

### SiteStatsVo

```jsonc title="SiteStatsVo"
{
  "visit": 0, // 访问数量
  "upvote": 0, // 点赞数量
  "comment": 0, // 评论数量
  "post": 0, // 文章数量
  "category": 0 // 分类数量
}
```
