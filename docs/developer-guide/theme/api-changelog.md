---
title: API 变更日志
description: 记录每一个版本的主题 API 变更记录，方便开发者适配
---

## 2.25.0

### 模板表达式对象 > 新增 `#halo.matchVersion(constraint)` 方法

在 2.25.0 中，我们为主题模板新增了 `#halo.matchVersion(constraint)` 方法，用于判断当前运行的 Halo 版本是否满足指定的语义化版本范围。主题开发者可以用它为依赖新版 Halo 能力的模板片段添加条件渲染，从而避免仅为局部功能提高整个主题的 `spec.requires` 版本要求。详细文档可查阅：[全局变量#halo.matchVersion](../../developer-guide/theme/global-variables.md#halomatchversionconstraint)。

### 文章 Finder API > 新增 `cursorByCategory(postName)` 方法

我们为文章 Finder API 新增了 `cursorByCategory(postName)` 方法，用于获取当前文章主分类下的上一篇 / 下一篇文章。主分类为文章 `spec.categories` 中的第一个分类，且只匹配同一分类，不会包含子分类中的文章。

同时，Public API `GET /apis/api.content.halo.run/v1alpha1/posts/{name}/navigation` 新增了可选的 `scope=category` 查询参数，用于获取同一主分类下的文章导航。详细文档可查阅：[文章 Finder API#cursorByCategory](../../developer-guide/theme/finder-apis/post.md#cursorbycategorypostname)。

## 2.24.1

### 文章 Finder API > 新增 `random(maxSize)` 方法

在 2.24.1 中，我们为文章 Finder API 新增了 `random(maxSize)` 方法，用于随机获取文章列表。详细文档可查阅：[文章 Finder API#random](../../developer-guide/theme/finder-apis/post.md#randommaxsize)。

## 2.23.0

### 表单定义 > Iconify 表单类型新增 `sizing` 参数

在 2.23.0 中，Iconify 表单类型默认不再显示图标大小选项，如果需要让用户设置图标大小，可以配置 `sizing` 参数，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

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
