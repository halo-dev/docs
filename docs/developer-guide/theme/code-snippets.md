---
title: 常用代码片段
description: 本文档介绍了常用的代码片段，以便于开发者快速上手。
---

## 布局模板

通常情况下，我们需要一个公共模板来定义页面的布局。

```html title="templates/layout.html"
<!DOCTYPE html>
<html lang="en" xmlns:th="https://www.thymeleaf.org" th:fragment="html (head,content)">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2" />
    <title th:text="${site.title}"></title>
    <link rel="stylesheet" th:href="@{/assets/dist/style.css}" />
    <script th:src="@{/assets/dist/main.iife.js}"></script>
    <th:block th:if="${head != null}">
      <th:block th:replace="${head}" />
    </th:block>
  </head>
  <body>
    <section>
      <th:block th:replace="${content}" />
    </section>
  </body>
</html>
```

```html title="templates/index.html"
<!DOCTYPE html>
<html
  xmlns:th="https://www.thymeleaf.org"
  th:replace="~{modules/layout :: html(head = null,content = ~{::content})}"
>
  <th:block th:fragment="content">
    <!-- 文章列表 -->
    <ul>
      <li th:each="post : ${posts.items}">
        <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
      </li>
    </ul>
  </th:block>
</html>
```
