---
title: 准备工作
description: 主题开发的环境搭建
---

:::info
Halo 的模板引擎为 FreeMarker，建议在开发 Halo 的主题之前，先阅读一遍 FreeMarker 的相关文档：<https://freemarker.apache.org>。
:::

## 搭建开发环境

> 假设你已经在本地电脑配置好了 Java 开发环境。

Halo 的运行可参考上述 [系统开发](/developer-guide/core/prepare)，或者直接下载打包好的程序启动，如下步骤：

1. 从 [GitHub release](https://github.com/halo-dev/halo/releases) 或者 [https://dl.halo.run](https://dl.halo.run) 下载最新的运行包。
2. 在终端中执行 `java -jar halo.jar --spring.profiles.active=dev`

启动完成之后，在电脑的用户目录即可看到 `halo-dev` 文件夹。

## 新建主题

1. 在 `~/halo-dev/templates/themes` 下新建一个文件夹，该文件夹就是你所新建的主题目录。
2. 使用你熟悉的编辑器打开你所新建的主题目录，这里我们推荐使用 [Visual Studio Code](https://code.visualstudio.com)，并安装 [FreeMarker](https://marketplace.visualstudio.com/items?itemName=dcortes92.FreeMarker) 扩展。

:::info
我们同样为 Halo 主题开发了一个 `Visual Studio Code` Snippets 扩展，以简化一些操作，但目前处于 beta 状态，有需要的可以试试 [Halo theme develop Snippets](https://marketplace.visualstudio.com/items?itemName=halo-dev.halo-theme-dev-snippets-for-vs-code)。
:::

## 开发约定

- 主题目录下必须存在 `theme.yaml（主题描述文件）`，`settings.yaml（主题配置文件）`，相关格式在后面会详细讲解。
- 如果要开源到 GitHub 我们建议将仓库名设置为 `halo-theme-主题名`，并设置仓库的 `topic` 为 `halo` 和 `halo-theme`，这样可以方便使用者搜索。
- 所有模板文件的后缀为 `.ftl`。
- 主题目录需要以 `screenshot.png` 命名的预览图片，以供后台展示。

## 开发样板

> 为了让开发者更快速的上手主题的开发，我们提供了一个简单的开发样板以供参考。

仓库地址：<https://github.com/halo-dev/halo-theme-quick-starter>

## 目录结构

> 为了让开发更加规范，我们推荐使用以下的目录结构。

```txt
├── module                      // 公共模板目录
│   ├── comment.ftl             // 比如：评论模板
│   ├── layout.ftl              // 比如：布局模板
├── source                      // 静态资源目录
│   ├── css                     // 样式目录
│   ├── images                  // 图片目录
│   ├── js                      // JS 脚本目录
│   └── plugins                 // 前端库目录
├── index.ftl                   // 首页
├── post.ftl                    // 文章页
├── post_xxx.ftl                    // 自定义文章模板，如：post_diary.ftl。可在后台发布文章时选择。
├── sheet.ftl                   // 自定义页面
├── sheet_xxx.ftl               // 自定义模板，如：sheet_search.ftl、sheet_author.ftl。可在后台发布页面时选择。
├── archives.ftl                // 归档页
├── categories.ftl              // 分类目录页
├── category.ftl                // 单个分类的所属文章页
├── tags.ftl                    // 标签页面
├── tag.ftl                     // 单个标签的所属文章页
├── search.ftl                  // 搜索结果页
├── links.ftl                   // 内置页面：友情链接
├── photos.ftl                  // 内置页面：图库
├── journals.ftl                // 内置页面：日志
├── 404.ftl                     // 404 页
├── 500.ftl                     // 500 页
├── README.md                   // README，一般用于主题介绍或说明
├── screenshot.png              // 主题预览图
├── settings.yaml               // 主题选项配置文件
└── theme.yaml                  // 主题描述文件
```
