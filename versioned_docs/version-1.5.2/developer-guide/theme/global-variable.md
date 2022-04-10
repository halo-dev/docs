---
title: 全局变量
description: 系统提供的一些全局变量
---

## 博客地址

```html
${blog_url!}
```

此变量与后台博客设置中的 `博客地址` 相对应。

## 网站根路径

```html
${context!}
```

需要注意的是，此变量和 `blog_url` 不同的是，这个变量有两种值，一种为相对路径形式，一种为绝对路径形式。

那么，当在后台博客设置中将 `全局绝对路径` 的选项打开时，`context` 变量值为 `${blog_url}/`，关闭时，`context` 的变量值为 `/`。

假设，我设置的 `博客地址` 为 `https://halo.run`，那么：

- 全局绝对路径为开启的状态下：<https://halo.run/>
- 全局绝对路径为关闭的状态下：/

## 主题资源根路径

```html
${theme_base!}
```

假设你的主题在 `~/halo-dev/templates/themes/anatole` 这个目录，那么 `theme_base` 为 `https://yourdomain/themes/anatole`

举个例子，你当前开发的主题为 `anatole`，当你要获取主题下 `css/style.css` 这个文件的路径，那么：

```html
${theme_base!}/css/style.css
```

## 主题信息

主题名称：

```html
${theme.name!}
```

主题 git 仓库地址：

```html
${theme.repo!}
```

主题版本号：

```html
${theme.version!}
```

## 博客标题

```html
${blog_title!}
```

此变量与后台博客设置中的 `博客标题` 相对应。

## 博客 Logo

```html
${blog_logo!}
```

此变量与后台博客设置中的 `Logo` 相对应。

## Halo 版本

```html
${version!}
```

当前 Halo 的版本，如：1.3.0

## 博主信息

昵称：

```html
${user.nickname!}
```

邮箱地址：

```html
${user.email!}
```

描述：

```html
${user.description!}
```

头像地址：

```html
${user.avatar!}
```

上次登录时间：

```html
${user.expireTime!}
```

## SEO 关键词

```html
${meta_keywords!}
```

需要注意的是，虽然这个变量在任何页面都可以使用，但是其值可能在不同的页面是不一样的。会根据用户的设置，生成对应的值。

假设在文章页面：

- 如果用户为文章设置了标签，而没有设置 `自定义关键词`，系统会自动将标签设置为页面关键词。
- 如果用户设置了 `自定义关键词`，那么则会取用户设置的值。

## SEO 描述

```html
${meta_description!}
```

需要注意的是，虽然这个变量在任何页面都可以使用，但是其值可能在不同的页面是不一样的。会根据用户的设置，生成对应的值。

## RSS 2.0 订阅地址

```html
${rss_url!}
```

如：`https://yourdomain/rss.xml`

## Atom 格式的订阅地址

```html
${atom_url!}
```

如：`https://yourdomain/atom.xml`

## XML 格式的网站地图地址

```html
${sitemap_xml_url!}
```

如：`https://yourdomain/sitemap.xml`

## HTML 格式的网站地图地址

```html
${sitemap_html_url!}
```

如：`https://yourdomain/sitemap.html`

## 友情链接页面地址

```html
${links_url!}
```

- **全局绝对路径为开启的状态下**：`https://yourdomain.com/{links_prefix}`
- **全局绝对路径为关闭的状态下**：`/{links_prefix}`

`{links_prefix}` 是用户可设定的值，用户可以在后台修改 `友情链接` 的前缀，默认为 `links`。

## 图库页面地址

```html
${photos_url!}
```

- **全局绝对路径为开启的状态下**：`https://yourdomain.com/{photos_prefix}`
- **全局绝对路径为关闭的状态下**：`/{photos_prefix}`

`{photos_prefix}` 是用户可设定的值，用户可以在后台修改 `图库页面` 的前缀，默认为 `photos`。

## 日志页面地址

```html
${journals_url!}
```

- **全局绝对路径为开启的状态下**：`https://yourdomain.com/{journals_prefix}`
- **全局绝对路径为关闭的状态下**：`/{journals_prefix}`

`{journals_prefix}` 是用户可设定的值，用户可以在后台修改 `日志页面` 的前缀，默认为 `journals`。

## 文章归档页面地址

```html
${archives_url!}
```

- **全局绝对路径为开启的状态下**：`https://yourdomain.com/{archives_prefix}`
- **全局绝对路径为关闭的状态下**：`/{archives_prefix}`

`{archives_prefix}` 是用户可设定的值，用户可以在后台修改 `归档` 的前缀，默认为 `archives`。

## 分类列表页面地址

```html
${categories_url!}
```

- **全局绝对路径为开启的状态下**：`https://yourdomain.com/{categories_prefix}`
- **全局绝对路径为关闭的状态下**：`/{categories_prefix}`

`{categories_prefix}` 是用户可设定的值，用户可以在后台修改 `分类` 的前缀，默认为 `categories`。

## 标签列表页面地址

```html
${tags_url!}
```

- **全局绝对路径为开启的状态下**：`https://yourdomain.com/{tags_prefix}`
- **全局绝对路径为关闭的状态下**：`/{tags_prefix}`

`{tags_prefix}` 是用户可设定的值，用户可以在后台修改 `标签` 的前缀，默认为 `tags`。

## 页面判断

判断当前页面是否是特定的页面。

- **is_index**：首页
- **is_post**：文章页
- **is_sheet**：自定义页面
- **is_archives**：归档页面
- **is_categories**：分类列表页面
- **is_category**：单个分类页面
- **is_tags**：标签列表页面
- **is_tag**：单个标签页面
- **is_search**：搜索结果页面
- **is_journals**：日志页面
- **is_photos**：图库页面
- **is_links**：友情链接页面

用法：

```html
<#if is_index??>
    当前页面是首页
</#if>
```
