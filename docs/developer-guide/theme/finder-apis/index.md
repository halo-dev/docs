---
title: Finder API
description: 汇总 Halo 主题可用的 Finder API，帮助在任意 Thymeleaf 模板位置查询文章、分类、标签、菜单、评论、主题与站点统计等数据。
overview: true
---

目前在主题模板中获取数据可以使用对应路由提供的 [模板变量](../template-variables/index.md)，但为了满足在任意位置获取数据的需求，我们提供了 Finder API。除各页面另行注明的方法外，核心 Finder API 自 Halo 2.0.0 起可用。

用于生成附件图片缩略图地址的 `thumbnail` Finder 单独收录在[图片优化](../image-optimization.md#finder-api)中。
