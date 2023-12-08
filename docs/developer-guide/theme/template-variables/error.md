---
title: 错误页面
description: 关于错误页面的模板变量
---

## 路由信息

- 模板路径：`/templates/error/{404,4xx,500,5xx,error}.html`
- 访问路径：无固定访问路径，由异常决定

:::info 提示
错误页面的可使用模板由状态码决定，例如 404 状态码对应的模板为 `/templates/error/404.html` 或者 `/templates/error/4xx.html`。也可以使用 `/templates/error/error.html` 作为默认模板。

识别顺序如下：

1. `/templates/error/404.html`
2. `/templates/error/4xx.html`
3. `/templates/error/error.html`
:::

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
