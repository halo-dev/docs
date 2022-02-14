---
title: 公共宏模板
description: 系统提供的一些宏模板
---

> 为了减少重复代码，我们将某些常见的全局变量封装成了一个公共模板，我们只需要引入该模板，然后调用其中的宏模板即可。

## 公共 head 模板

> 需要注意的是，为了保证系统功能的完整性，我们强制要求在每个页面的 `<head>` 标签下必须包含此模板。

```html
<@global.head />
```

等同于：

```html
<#if options.seo_spider_disabled!false>
    <meta name="robots" content="none">
</#if>
<meta name="generator" content="Halo ${version!}"/>
<@global.favicon />
<@global.custom_head />
<@global.custom_content_head />
```

## 公共底部

> 需要注意的是，为了保证系统功能的完整性，我们强制要求在每个页面的尾部必须包含此模板。

```html
<@global.footer />
```

等同于：

```html
<@global.statistics />
<@global.footer_info />
````

## 相对时间

```html
<@global.timeline datetime="时间" />

// 输出
x 年前/x 个月前/x 天前/昨天/x 小时前/x 分钟前/x 秒前/刚刚
```

## 评论模块

```html
<@global.comment target= type="" />
```

等同于：

```html
<#if !post.disallowComment!false>
    <script src="//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
    <script src="${options.comment_internal_plugin_js!'//cdn.jsdelivr.net/npm/halo-comment@latest/dist/halo-comment.min.js'"></script>
    <halo-comment id="${post.id}" type="${type}"/>
</#if>
```

参数说明：

- target：post / sheet / journal 对象
- type：评论类型，可为：post / sheet / journal

例子：

在文章页面（post.ftl or post_xxx.ftl）：

```html
<@global.comment target=post type="post" />
```

在自定义页面（sheet.ftl or post_sheet.ftl）：

```html
<@global.comment target=sheet type="sheet" />
```

在日志页面（journals.ftl）：

```html
<@global.comment target=journal type="journal" />
```
