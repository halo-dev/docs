---
title: 分类归档
description: category.html - /categories/:slug
---

import CategoryVo from "../vo/_CategoryVo.md"
import TagVo from "../vo/_TagVo.md"
import ContributorVo from "../vo/_ContributorVo.md";
import ListedPostVo from "../vo/_ListedPostVo.md"

用于根据分类列出所有文章的页面。

## 路由信息

- 模板路径：`/templates/category.html`
- 访问路径：`/categories/:slug`

### 自定义模板

除了上面提到的 `category.html`，主题作者还可以添加多种形式的额外渲染模板，提供给用户选择，可以通过这个功能实现将网站上的文章内容进行领域划分，比如网站上同时存在新闻、文档、博客等分区，那么就可以利用这个功能提供多个模板，同时 Halo 还支持为分类设置文章渲染模板，详情可见[新建文章分类](../../../user-guide/posts.md#新建文章分类)。

定义方式为：

```yaml title="theme.yaml"
customTemplates:
  category:
    - name: {name}
      description: {description}
      screenshot: {screenshot}
      file: {file}.html
```

- `name`：模板名称
- `description`：模板描述
- `screenshot`：模板预览图
- `file`：模板文件名，需要在 `/templates/` 目录下创建

示例：

```yaml title="theme.yaml"
customTemplates:
  category:
    - name: 新闻
      description: 用于展示新闻分类下的文章
      screenshot: 
      file: category_news.html
    - name: 博客
      description: 用于展示博客分类下的文章
      screenshot: 
      file: category_blog.html
```

:::info
需要注意，修改 theme.yaml 需要[重载主题配置](../../../user-guide/themes.md#重载主题配置)。
:::

## 变量

### category

#### 变量类型

[#CategoryVo](#categoryvo)

### posts

#### 变量类型

[#UrlContextListResult\<ListedPostVo\>](#urlcontextlistresultlistedpostvo)

#### 示例

```html title="/templates/category.html"
<div>
  <h1 th:text="${category.spec.displayName}"></h1>
  <ul>
    <li th:each="post : ${posts.items}">
      <a
        th:text="${post.spec.title}"
        th:href="${post.status.permalink}"
      ></a>
    </li>
  </ul>
  <div th:if="${posts.hasPrevious() || posts.hasNext()}">
    <a
      th:href="@{${posts.prevUrl}}"
    >
      <span>上一页</span>
    </a>
    <span th:text="${posts.page} +' / '+ ${posts.total}"></span>
    <a
      th:href="@{${posts.nextUrl}}"
    >
      <span>下一页</span>
    </a>
  </div>
</div>
```

### _templateId

#### 变量值

`category`

## 类型定义

### CategoryVo

<CategoryVo />

### TagVo

<TagVo />

### ContributorVo

<ContributorVo />

### ListedPostVo

<ListedPostVo />

- [#CategoryVo](#categoryvo)
- [#TagVo](#tagvo)
- [#ContributorVo](#contributorvo)

### UrlContextListResult\<ListedPostVo\>

```json title="UrlContextListResult<ListedPostVo>"
{
  "page": 0,                                   // 当前页码
  "size": 0,                                   // 每页条数
  "total": 0,                                  // 总条数
  "items": "List<#ListedPostVo>",              // 文章列表数据
  "first": true,                               // 是否为第一页
  "last": true,                                // 是否为最后一页
  "hasNext": true,                             // 是否有下一页
  "hasPrevious": true,                         // 是否有上一页
  "totalPages": 0,                             // 总页数
  "nextUrl": "string",                         // 下一页链接
  "prevUrl": "string"                          // 上一页链接
}
```

- [#ListedPostVo](#listedpostvo)
