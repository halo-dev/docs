---
title: 单页面
description: page.html - /:slug
---

import SinglePageVo from "../vo/_SinglePageVo.md"
import ContributorVo from "../vo/_ContributorVo.md"
import ContentVo from "../vo/_ContentVo.md"

页面与文章类似，同样包含页面标题和富文本形式的页面内容。与文章不同的是页面无法设置所属分类和标签信息，一般用于站点中单一展示功能的页面，例如常见的站点关于页面、联系我们页面等。

## 路由信息

- 模板路径：`/templates/page.html`
- 访问路径：`/:slug`

### 自定义模板

除了上面提到的 `page.html`，主题作者还可以添加多种形式的额外渲染模板，提供给用户选择，此举可以丰富网站的使用类型。

定义方式为：

```yaml title="theme.yaml"
customTemplates:
  page:
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
  page:
    - name: 关于公司
      description: 用于展示公司的一些信息
      screenshot: 
      file: page_about.html
```

:::info
需要注意，修改 theme.yaml 需要[重载主题配置](../../../user-guide/themes.md#重载主题配置)。
:::

## 变量

### singlePage

#### 变量类型

[#SinglePageVo](#singlepagevo)

#### 示例

```html title="/templates/page.html"
<article>
  <h1 th:text="${singlePage.spec.title}"></h1>
  <div th:utext="${singlePage.content.content}"> </div>
</article>
```

### _templateId

#### 变量值

`page`

## 类型定义

### SinglePageVo

<SinglePageVo />

- [#ContentVo](#contentvo)
- [#ContributorVo](#contributorvo)

### ContentVo

<ContentVo />

### ContributorVo

<ContributorVo />
