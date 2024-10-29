---
title: 文章
description: post.html - /archives/:slug
---

import CategoryVo from "../vo/_CategoryVo.md"
import TagVo from "../vo/_TagVo.md"
import ContentVo from "../vo/_ContentVo.md"
import ContributorVo from "../vo/_ContributorVo.md"
import PostVo from "../vo/_PostVo.md"

文章详情页面的模板。

## 路由信息

- 模板路径：`/templates/post.html`
- 访问路径：默认为 `/archives/:slug`，用户可手动更改为其他路由形式，可参考：[主题路由设置](../../../user-guide/settings.md#主题路由设置)

### 自定义模板

除了上面提到的 `post.html`，主题作者还可以添加多种形式的额外渲染模板，提供给用户选择，此举可以丰富网站的使用类型，用户设置方式可参考 [文章设置](../../../user-guide/posts.md#文章设置)。

定义方式为：

```yaml title="theme.yaml"
customTemplates:
  post:
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
  post:
    - name: 文档
      description: 文档类型的文章
      screenshot: 
      file: post_documentation.html
```

:::info
需要注意，修改 theme.yaml 需要[重载主题配置](../../../user-guide/themes.md#重载主题配置)。
:::

## 变量

### post

#### 变量类型

[#PostVo](#postvo)

#### 示例

```html title="/templates/post.html"
<article>
  <h1 th:text="${post.spec.title}"></h1>
  <div th:utext="${post.content.content}"> </div>
</article>
```

### _templateId

#### 变量值

`post`

## 类型定义

### CategoryVo

<CategoryVo />

### TagVo

<TagVo />

### ContributorVo

<ContributorVo />

### ContentVo

<ContentVo />

### PostVo

<PostVo />

- [路由信息](#路由信息)
  - [自定义模板](#自定义模板)
- [变量](#变量)
  - [post](#post)
    - [变量类型](#变量类型)
    - [示例](#示例)
  - [\_templateId](#_templateid)
    - [变量值](#变量值)
- [类型定义](#类型定义)
  - [CategoryVo](#categoryvo)
  - [TagVo](#tagvo)
  - [ContributorVo](#contributorvo)
  - [ContentVo](#contentvo)
  - [PostVo](#postvo)
