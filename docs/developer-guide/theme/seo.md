---
title: 主题 SEO
description: 了解 Halo 自动注入的 SEO 元数据，并为主题页面设置标题、规范链接和社交分享信息
---

主题主要负责提供准确的页面标题、语义化正文，以及 Halo 未统一生成的规范链接和社交分享信息。站点管理员配置的 SEO 信息和内容摘要由 Halo 注入，不应在主题中重复实现。

## 设置页面标题

每个可索引页面都应有一个描述当前内容的 `<title>`。详情页和归档页通常将当前内容放在前面，站点名称放在后面：

```html
<!-- index.html -->
<title th:text="${site.title}">站点标题</title>

<!-- post.html -->
<title th:text="|${post.spec.title} - ${site.title}|">文章标题 - 站点标题</title>

<!-- page.html -->
<title th:text="|${singlePage.spec.title} - ${site.title}|">页面标题 - 站点标题</title>

<!-- category.html -->
<title th:text="|${category.spec.displayName} - ${site.title}|">分类名称 - 站点标题</title>

<!-- tag.html -->
<title th:text="|${tag.spec.displayName} - ${site.title}|">标签名称 - 站点标题</title>
```

作者归档页可以使用 `author.spec.displayName`。文章归档、分类列表和标签列表等固定页面应使用主题的国际化消息生成标题，不要把一种语言直接写入公共布局。

公共布局可以提供站点标题作为默认值，但具体模板应覆盖它。最终 HTML 中只能有一个 `<title>`，页面主标题也应与它表达相同的内容。

## 使用 Halo 注入的元数据

Halo 会在模板渲染期间向 `<head>` 注入以下信息：

| 页面或设置 | Halo 注入的内容 |
| --- | --- |
| 首页 | Console SEO 设置中的 `keywords` 和 `description` |
| 文章、单页面 | 最终摘要作为 `description` |
| 分类、标签归档 | 分类或标签的描述作为 `description` |
| Console 中开启“屏蔽搜索引擎” | `robots` 值为 `noindex` |

因此，不要在主题中再次使用 `site.seo.description` 或 `site.seo.keywords` 生成同名 `<meta>`。插件和 Console 的代码注入也可以修改 `<head>`，排查问题时应检查最终响应，而不是只看主题源码。

Halo 仍会按设置输出 `keywords`，但主流搜索引擎通常不再使用该字段，主题无需额外处理。

## 通过主题设置控制扩展标签

Halo 不会为所有页面统一生成 canonical、Open Graph、Twitter Card 或结构化数据。这些标签也可能由插件提供，因此主题不应在无法关闭的情况下固定输出。主题提供这些能力时，建议在 `settings.yaml` 中至少分别提供“页面元数据”和“结构化数据”开关：

```yaml title="settings.yaml"
- group: seo
  label: SEO
  formSchema:
    - $formkit: checkbox
      name: enable_metadata
      label: 输出 canonical 和社交分享标签
      value: true
    - $formkit: checkbox
      name: enable_structured_data
      label: 输出文章结构化数据
      value: true
```

如果站点已经通过插件提供对应标签，用户可以关闭主题中的选项。新增或修改设置项后，需要在 Console 的主题详情中重载主题配置，完整定义方式参考[设置选项](./settings.md)。

将 canonical、Open Graph 和 Twitter Card 集中在一个公共 head 片段中，并使用设置项保护。以下是文章页的最小示例：

```html
<th:block th:if="${theme.config.seo.enable_metadata}">
  <link rel="canonical" th:href="@{${site.url + post.status.permalink}}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" th:content="${post.spec.title}" />
  <meta property="og:url" th:content="${site.url + post.status.permalink}" />
  <meta property="og:description" th:content="${post.status.excerpt}" />
  <meta
    th:if="${post.spec.cover ?: site.logo}"
    property="og:image"
    th:content="${post.spec.cover ?: site.logo}"
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" th:content="${post.spec.title}" />
  <meta name="twitter:description" th:content="${post.status.excerpt}" />
  <meta
    th:if="${post.spec.cover ?: site.logo}"
    name="twitter:image"
    th:content="${post.spec.cover ?: site.logo}"
  />
</th:block>
```

`site.url` 必须是站点真实的外部访问地址。分页归档不能直接复用第一页的 canonical；应为当前分页生成正确地址，或者暂不输出该标签。Open Graph 的基本字段和取值可参考 [The Open Graph protocol](https://ogp.me/)。

## 可选的结构化数据

文章主题可以在 `theme.config.seo.enable_structured_data` 为 `true` 时提供 `BlogPosting` JSON-LD，包括标题、规范地址、作者、发布时间、修改时间和图片。结构化数据必须与页面可见内容一致，且输出必须是有效 JSON；由插件提供时应关闭主题中的对应选项。

添加后使用 [Google 富媒体搜索结果测试](https://search.google.com/test/rich-results) 和 [Schema.org Validator](https://validator.schema.org/) 验证；完整字段参考 [Google Article 文档](https://developers.google.com/search/docs/appearance/structured-data/article) 和 [Schema.org BlogPosting](https://schema.org/BlogPosting)。

## 验证最终结果

在已安装并启用主题的 Halo 上检查实际响应：

```bash
curl -fsSL https://example.com/archives/example \
  | rg '<title|name="description"|name="robots"|rel="canonical"|property="og:|name="twitter:|application/ld\+json'
```

至少确认：

1. 首页、文章、单页面和各归档页只有一个准确且不重复的标题。
2. 文章、单页面、分类和标签的描述来自对应内容，未意外退回站点通用文案。
3. 未开启禁止抓取时没有意外的 `noindex`。
4. 分别开关主题的 SEO 设置，关闭后不再输出对应标签，开启后也没有与插件产生重复标签。
5. canonical 是当前页面的绝对公开地址；社交图片也能从公网访问。
6. 自定义模板、分页页和插件页面没有继承错误的标题或规范地址。

搜索引擎可能根据页面内容改写标题或摘要，正确的标签也不保证展示富媒体结果。标题和摘要的编写原则可参考 [Google 标题链接](https://developers.google.com/search/docs/appearance/title-link)和[摘要文档](https://developers.google.com/search/docs/appearance/snippet)。
