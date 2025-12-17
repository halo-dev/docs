---
title: API 变更日志
description: 记录每一个版本的主题 API 变更记录，方便开发者适配
---

## 2.22.0

### 表单定义 > 新增 Iconify 图标选择器

在 2.22.0 中，我们为 FormKit 表单提供了通用的图标选择器，基于 [Iconify](https://icon-sets.iconify.design/)，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

### 表单定义 > 新增 `array` 组件

在 2.22.0 中，我们为 FormKit 表单新增了 `array` 组件，用于定义一组数据，并计划使用 `array` 组件替换原有的 `repeater` 组件。详细文档可查阅：[表单定义#array](../../developer-guide/form-schema.md#array)

### 文章 Finder API > 修改 `cursor(postName)` 返回结构

我们修改了文章 Finder API 中 `cursor(postName)` 方法的返回体结构，移除了 `current` 字段，并修改了 `previous` 和 `next` 字段类型为 `ListedPostVo`，并明确了上一篇文章是指发布时间较当前文章更早的文章，下一篇文章是指发布时间较当前文章更新的文章。详细文档可查阅：[文章 Finder API#cursor](../../developer-guide/theme/finder-apis/post.md#cursor)。
