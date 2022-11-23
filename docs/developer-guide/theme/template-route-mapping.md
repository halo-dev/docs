---
title: 模板路由
description: 本文档介绍路由与模板的映射关系，以及自定义模板。
---

此文档讲解系统内部提供的路由与模板映射。

## 主要模板

### index.html

站点的首页模板，访问地址为 `/`。

### post.html

文章详情页面的模板，访问地址默认为 `/archives/:slug`。

### page.html

独立页面详情的模板，访问地址默认为 `/:slug`。

### archives.html

文章归档页面的模板，访问地址包括：

- `/archives`
- `/archives/:year`
- `/archives/:year/:month`

### tags.html

标签集合页面的模板，访问地址默认为 `/tags`。

### tag.html

标签归档页面的模板，访问地址默认为 `/tags/:slug`。

### categories.html

分类集合页面的模板，访问地址默认为 `/categories`。

### category.html

分类归档页面的模板，访问地址默认为 `/categories/:slug`。

## 自定义模板 {#custom-templates}

一般情况下，上文提到的模板已经能够满足大部分的需求，但如果需要针对某个特定的页面进行自定义，可以通过自定义模板来实现。目前系统支持为 **文章**、**独立页面**和**分类归档** 设置自定义模板：

在 `theme.yaml` 的 `spec` 节点下添加如下配置：

```yaml
customTemplates:
  {type}:
    - name: {name}
      description: {description}
      screenshot: {screenshot}
      file: {file}.html
```

示例：

```yaml
customTemplates:
  post:
    - name: 文档
      description: 文档类型的文章
      screenshot: 
      file: post_documentation.html
```

字段说明：

- `type`：模板类型，目前支持 `post` `page` `category`。
- `name`：模板名称
- `description`：模板描述
- `screenshot`：模板预览图
- `file`：模板文件名，需要在 `/templates/` 目录下创建

最终使用者即可在文章设置、独立页面设置、分类设置中选择自定义模板。

:::info 提示

1. 自定义模板与默认模板的功能相同，区别仅在于可以让使用者选择不同于默认模板风格的模板。
2. 自定义模板的文件名需要以 `.html` 结尾，且需要在 `/templates/` 目录下创建。

:::
