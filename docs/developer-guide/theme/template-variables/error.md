---
title: 错误页面
description: error/error.html
---

## 路由信息

- 模板路径：`/templates/error/error.html`
- 访问路径：无固定访问路径，由异常决定

## 变量

### error

#### 变量类型

```json
{
  "detail": "string",                     // 异常详细信息
  "instance": "string",                   // 异常实例
  "status": "number",                     // 异常状态码
  "title": "string",                      // 异常标题
  "type": "string"                        // 异常类型
}
```

#### 示例

```html title="/templates/error/error.html"
<div>
  <h2 th:text="${error.status}"></h2>
  <p th:text="${#strings.defaultString(error.title, 'Internal server error')}"></p>
  <p th:if="${not #strings.isEmpty(error.detail)}" th:text="${error.detail}"></p>
</div>
```
