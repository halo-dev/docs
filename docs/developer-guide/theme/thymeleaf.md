---
title: Thymeleaf 模板语法
description: 在 Halo 的 Spring WebFlux 环境中使用 Thymeleaf 3.1，掌握表达式、条件、遍历、片段、空值处理和安全的 JavaScript 内联方式
---

Halo 主题运行在 Spring WebFlux 和 Thymeleaf 响应式视图解析器上。开发主题前建议先阅读 Thymeleaf 官方教程：

- [Using Thymeleaf 3.1](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html)
- [Using Thymeleaf 3.1 Markdown 源文件](https://raw.githubusercontent.com/thymeleaf/thymeleaf-docs/refs/heads/master/docs/tutorials/3.1/usingthymeleaf.md)，适合下载、全文检索或提供给 AI Agent

官方教程介绍通用 Thymeleaf 能力，其中部分 Web 示例基于 Servlet 或 Spring MVC，不能直接用于 Halo 主题。Halo 提供的数据和 API 应继续以当前版本的[全局变量](./global-variables.md)、[页面模板变量](./template-variables/index.md)和 Finder API 文档为准。

## 确认运行环境

Halo 2.26 使用 Thymeleaf 3.1.3。其他 Halo 版本可能调整依赖，开发前应确认主题的 `spec.requires` 和目标 Halo 实际使用的 Thymeleaf 版本。

Thymeleaf 3.1 不再提供旧版的以下 Web API 表达式对象：

- `#request`
- `#response`
- `#session`
- `#servletContext`

因此，`#request.getRequestURI()` 等来自旧教程的写法无法在 Halo 2.26 主题中使用。Thymeleaf 3.1 虽然提供 `#ctx.exchange` Web 抽象，但它不是 Halo 主题承诺的页面变量接口；主题不应依赖它读取当前请求、请求头或会话。

同样，不要假定通用教程中的 `param`、`session`、`application` 等 Web 上下文变量一定可用。需要页面地址或内容数据时，应使用 Halo 文档明确提供的变量和对象的 `status.permalink`：

```html
<a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
<link rel="canonical" th:href="@{${site.url + post.status.permalink}}" />
```

主题自定义路由还应遵循[模板路由映射](./template-route-mapping.md)，不要把可配置地址写死在模板中。

## 认识常用表达式

Thymeleaf 主要使用以下五类标准表达式：

| 语法     | 用途                        | 示例                          |
| -------- | --------------------------- | ----------------------------- |
| `${...}` | 读取变量、属性或调用方法    | `${post.spec.title}`          |
| `*{...}` | 读取 `th:object` 选中的对象 | `*{spec.title}`               |
| `#{...}` | 读取国际化消息              | `#{pagination.next}`          |
| `@{...}` | 生成链接或主题资源地址      | `@{/assets/dist/style.css}`   |
| `~{...}` | 引用模板或片段              | `~{modules/header :: header}` |

例如，`th:object` 可以减少同一对象的重复前缀：

```html
<article th:object="${post}">
  <h1 th:text="*{spec.title}">文章标题</h1>
  <p th:text="*{status.excerpt}">文章摘要</p>
</article>
```

优先使用自然模板写法，为未经过 Thymeleaf 渲染的静态 HTML 保留可读内容：

```html
<h1 th:text="${site.title}">站点标题</h1>
```

## 输出文本和 HTML

普通文本使用 `th:text`。它会进行 HTML 转义，适合标题、摘要、设置值和用户输入：

```html
<h1 th:text="${post.spec.title}"></h1>
<p th:text="${post.status.excerpt}"></p>
```

`th:utext` 会输出未转义 HTML。只在值已经由 Halo 处理并且本来就是 HTML 时使用，例如文章正文：

```html
<div class="content" th:utext="${post.content.content}"></div>
```

不要用 `th:utext` 输出搜索词、主题设置、请求参数或其他访客可控文本，否则可能引入 XSS。

## 组合文本和处理空值

使用 `|...|` 字面量替换组合文本，比 `+` 拼接更容易阅读，也能减少引号错误：

```html
<title th:text="|${post.spec.title} - ${site.title}|">
  文章标题 - 站点标题
</title>
```

使用安全导航 `?.` 访问可能为空的属性，使用 Elvis 操作符 `?:` 提供默认值：

```html
<a th:target="${menuItem.spec.target?.value}"></a>
<img
  th:src="${theme.config.brand?.dark_logo ?: site.logo}"
  th:alt="${site.title}"
/>
```

检查集合或字符串是否为空时，优先使用对应工具对象：

```html
<p
  th:if="${not #strings.isEmpty(post.status.excerpt)}"
  th:text="${post.status.excerpt}"
></p>
<ul th:if="${not #lists.isEmpty(post.categories)}">
  <li
    th:each="category : ${post.categories}"
    th:text="${category.spec.displayName}"
  ></li>
</ul>
```

`?.` 只保护它左侧的那一次属性访问。链上可能为空的每一层都应明确处理，不要把安全导航当作所有模板错误的兜底。

## 遍历和条件渲染

`th:each` 的第二个变量记录当前遍历状态。常用属性包括 `index`、`count`、`first`、`last`、`odd` 和 `even`：

```html
<article
  th:each="post, status : ${posts.items}"
  th:classappend="${status.first} ? 'first'"
>
  <span th:text="${status.count}"></span>
  <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
</article>
```

简单条件使用 `th:if` 或 `th:unless`，互斥分支较多时使用 `th:switch` 和 `th:case`。仅用于承载 Thymeleaf 逻辑、不希望产生额外 DOM 时，使用 `th:block`：

```html
<th:block th:if="${not #lists.isEmpty(posts.items)}">
  <article th:each="post : ${posts.items}">
    <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
  </article>
</th:block>
<p th:unless="${not #lists.isEmpty(posts.items)}">暂无文章</p>
```

给已有 `class` 增加条件样式时使用 `th:classappend`，避免通过 `th:class` 重写所有静态类名：

```html
<article class="post-card" th:classappend="${post.pinned} ? 'pinned'">
  置顶文章
</article>
```

## 定义局部变量

使用 `th:with` 缓存重复表达式或限制变量作用域：

```html
<th:block th:with="primaryMenu = ${menuFinder.getPrimary()}">
  <nav th:if="${primaryMenu != null}">
    <!-- 渲染菜单 -->
  </nav>
</th:block>
```

`th:with` 创建的变量只在当前元素及其子元素中可用。不要依赖它在兄弟元素或父元素中继续存在。

同一元素上的 `th:*` 属性不按源码中的书写顺序执行，而是按 Thymeleaf 的固定优先级执行。例如 `th:each` 先于 `th:if`，`th:with` 先于 `th:text`。表达式变复杂时，拆成外层 `th:block` 通常更容易理解和排查。

## 复用模板片段

使用 `th:replace` 时，承载该属性的元素会被目标片段整体替换；`th:insert` 则会保留当前元素并把片段插入其中。Halo 主题布局通常使用显式的 `~{...}` 片段表达式：

```html
<header th:replace="~{modules/header :: header}"></header>
```

片段可以声明参数：

```html title="templates/modules/card.html"
<article th:fragment="card(post)">
  <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
</article>
```

```html
<li th:each="post : ${posts.items}">
  <article th:replace="~{modules/card :: card(post=${post})}"></article>
</li>
```

主题为插件页面提供公共布局时，应遵循 `templates/layout.html` 的 `html(head, content)` 契约，完整写法参考[页面布局契约](./page-layout.md)。

## 使用表达式工具

Thymeleaf 提供 `#strings`、`#lists`、`#sets`、`#maps`、`#numbers`、`#temporals` 和 `#messages` 等表达式工具；Halo 另外提供 `#theme`、`#annotations`、`#halo` 等对象。

Halo 内容时间通常使用 `java.time` 类型，应使用 `#temporals` 格式化：

```html
<time
  th:datetime="${post.spec.publishTime}"
  th:text="${#temporals.format(post.spec.publishTime, 'yyyy-MM-dd')}"
></time>
```

国际化消息使用 `#{...}`，不要把面向用户的固定文案直接写死在公共模板中：

```html
<a th:text="#{pagination.previous}">Previous</a>
```

完整用法参考[国际化](./i18n.md)。调用表达式工具的方法前，应在对应版本的 Thymeleaf 或 Halo 文档中确认签名，不要根据方法名猜测 API。例如 Thymeleaf 3.1 的 `#strings` 没有 `escapeJson()` 方法。

## 向 JavaScript 输出数据

需要把模板值写入 JavaScript 或 JSON-LD 时，使用 `th:inline="javascript"` 的转义内联，让 Thymeleaf 序列化字符串、数字、布尔值、数组、集合、Map 或对象。不要手工拼接引号，也不要调用不存在的 JSON 转义方法：

```html
<script th:inline="javascript">
  window.themeConfig = {
    title: /*[[${site.title}]]*/ "",
    logo: /*[[${site.logo}]]*/ "",
  };
</script>
```

`/*[[...]]*/` 后的值是模板以静态 HTML 打开时使用的占位值；运行时 Thymeleaf 会将表达式结果序列化为合法的 JavaScript 字面量。不要再给表达式额外添加引号：

```html
<!-- 正确：表达式结果本身包含所需的 JavaScript 引号和转义 -->
<script th:inline="javascript">
  const title = /*[[${site.title}]]*/ "Site title";
</script>

<!-- 错误：标题包含引号或换行时可能破坏脚本 -->
<script th:inline="javascript">
  const title = "[(${site.title})]";
</script>
```

文章结构化数据示例：

```html
<script type="application/ld+json" th:inline="javascript">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": /*[[${post.spec.title}]]*/ "",
    "url": /*[[${site.url + post.status.permalink}]]*/ ""
  }
</script>
```

只向前端输出实际需要的字段，不要为了方便序列化整个 VO。完整对象可能包含页面不需要的数据，也会增大 HTML 和脚本体积。

## 常见错误

| 错误做法                                     | 问题                              | 推荐做法                                            |
| -------------------------------------------- | --------------------------------- | --------------------------------------------------- |
| `${#request.getRequestURI()}`                | Thymeleaf 3.1 不再提供 `#request` | 使用 Halo 页面变量、`status.permalink` 和路由变量   |
| `${#ctx.exchange...}`                        | 依赖 Halo 未承诺的底层 Web 上下文 | 只使用 Halo 文档公开的主题变量和 API                |
| `${post.spec.title} + ' - ' + ${site.title}` | 重复表达式边界且容易写错引号      | `\|${post.spec.title} - ${site.title}\|`            |
| `th:href="${post.status.permalink}"`         | 绕过 Thymeleaf URL 表达式处理     | `th:href="@{${post.status.permalink}}"`             |
| `th:utext` 输出普通文本                      | 绕过 HTML 转义，可能产生 XSS      | 普通文本使用 `th:text`                              |
| `#strings.escapeJson(...)`                   | Thymeleaf 没有该方法              | 使用 `th:inline="javascript"` 序列化                |
| 在带引号的 JS 字符串中使用 `[(${...})]`      | 未转义内容可能破坏 JavaScript     | 使用 `/*[[${...}]]*/` 自然模板写法                  |
| 为可空链只加一次 `?.`                        | 后续属性仍可能访问空值            | 对照变量类型逐层判空或拆分表达式                    |
| 使用 `th:class` 添加一个状态类               | 容易覆盖已有类名                  | 使用 `th:classappend`                               |
| 重复输出 SEO meta 或代码注入                 | 与 Halo 或插件产生重复标签和脚本  | 参考[主题 SEO](./seo.md)和[设置选项](./settings.md) |

## 排查模板错误

模板页面返回 500 时，先检查 Halo 日志中的模板名、行号和根异常，再确认：

1. 没有使用已移除或 Halo 未公开的 Web 上下文对象。
2. 表达式对象和方法确实存在于目标版本。
3. 当前模板路由提供了所访问的页面变量。
4. 变量类型与文档一致，可空属性已使用安全导航或明确判空。
5. 动态链接使用 `@{...}`，主题资源使用文档提供的资源地址写法。
6. JavaScript 和 JSON-LD 使用了 `th:inline="javascript"` 序列化。
7. 片段路径、片段名和参数签名完全匹配。

开发期间可以关闭 Thymeleaf 缓存，让模板修改即时生效：

```yaml
spring:
  thymeleaf:
    cache: false
```

容器部署也可以设置 `SPRING_THYMELEAF_CACHE=false`。修改完成后应重新开启缓存，并在主题声明支持的最低 Halo 版本上检查首页、详情页、归档页、自定义模板和错误页。
