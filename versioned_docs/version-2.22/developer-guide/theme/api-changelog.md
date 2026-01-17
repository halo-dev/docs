---
title: API 变更日志
description: 记录每一个版本的主题 API 变更记录，方便开发者适配
---

## 2.22.8

### 表单定义 > 新增 `toggle` 表单类型

在 2.22.8 中，我们为 FormKit 表单新增了 `toggle` 组件，这是一个可以对一组图片、颜色或文字等进行选择切换的组件，详细文档可查阅：[表单定义#toggle](../../developer-guide/form-schema.md#toggle)

## 2.22.2

### 表单定义 > 新增 `switch` 表单类型

在 2.22.2 中，我们为 FormKit 表单新增了 `switch` 组件，用于定义一个功能的开关，详细文档可查阅：[表单定义#switch](../../developer-guide/form-schema.md#switch)

## 2.22.0

### 表单定义 > 新增 Iconify 图标选择器

在 2.22.0 中，我们为 FormKit 表单提供了通用的图标选择器，基于 [Iconify](https://icon-sets.iconify.design/)，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

### 表单定义 > 新增 `array` 表单类型

在 2.22.0 中，我们为 FormKit 表单新增了 `array` 组件，用于定义一组数据，并计划使用 `array` 组件替换原有的 `repeater` 组件。详细文档可查阅：[表单定义#array](../../developer-guide/form-schema.md#array)

### 表单定义 > 重构 `attachment` 表单类型

在 Halo 2.22 中，我们重构了原有的 attachment 表单类型，支持了预览和直接上传文件，并将旧版的表单类型更名为了 [attachmentInput](../form-schema.md#attachmentinput)

### 文章 Finder API > 修改 `cursor(postName)` 返回结构

我们修改了文章 Finder API 中 `cursor(postName)` 方法的返回体结构，移除了 `current` 字段，并修改了 `previous` 和 `next` 字段类型为 `ListedPostVo`，并明确了上一篇文章是指发布时间较当前文章更早的文章，下一篇文章是指发布时间较当前文章更新的文章。详细文档可查阅：[文章 Finder API#cursor](../../developer-guide/theme/finder-apis/post.md#cursorpostname)。
