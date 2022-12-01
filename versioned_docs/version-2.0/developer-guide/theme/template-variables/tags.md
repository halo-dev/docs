---
title: 文章标签集合
description: tags.html - /tags
---
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
