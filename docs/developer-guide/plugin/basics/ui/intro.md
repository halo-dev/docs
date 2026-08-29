---
title: 介绍
description: 认识 Halo 插件 UI 的用途与开发基础，使用 Vue 3、TypeScript、Node.js 和 pnpm 为 Console 控制台及 UC 个人中心添加页面和功能扩展
---

Halo 插件体系的 UI 部分可以让开发者在 Console 控制台和 UC 个人中心添加新的页面或者扩展已有的功能。

## Console 与 UC

Halo 有两个可扩展的前端入口，两者的定位和可用扩展点不同：

- **Console（控制台）**：面向站点管理员和贡献者的管理后台（`/console`），承担内容和系统管理工作。大多数插件 UI 属于这里，例如文章管理、插件自身的管理页面、仪表盘小部件等。
- **UC（个人中心）**：面向普通登录用户的自助空间（`/uc`），承载与用户本人相关的功能，例如个人资料、通知、以及内容投稿类插件的用户侧页面。

选择依据是功能的受众：管理性功能放 Console，与当前登录用户相关的自助功能放 UC。在入口文件中，`routes` 注册 Console 路由，`ucRoutes` 注册 UC 路由（详见[入口文件](./entry.md)）；扩展点同理，名称中通常可以区分归属（如 `user:detail:tabs:create` 属于 Console，`uc:user:profile:tabs:create` 属于 UC）。

开始前应熟悉 Vue 3，并按照[准备工作](../../prepare.md)安装 Node.js 和 pnpm。具体版本以当前插件 `ui/package.json` 的 `engines` 和 `packageManager` 为准，不要在多个页面分别维护版本号。
