---
title: 准备工作
description: 准备 Halo 插件开发所需的 Java、Spring Boot、Vue、TypeScript、Node.js、包管理器与 Git 环境
---

在 Halo 中，插件是使用 Java 和 JavaScript / TypeScript 编写的，UI 使用 [Vuejs](https://vuejs.org) 编写。

在创建你的第一个插件之前，请确保你具备以下条件：

- 你能通过 [Docker 运行 Halo](../../guide/install/docker.mdx) 或在[开发环境运行 Halo](../core/run.md)。
- 你需要安装 Java 21 或更高版本。
- 你熟悉 Java Web 开发并掌握 [Spring Boot](https://spring.io/projects/spring-boot/) 框架。
- 如果插件包含 UI，你需要安装 Node.js `^20.19.0` 或 `>=22.12.0`。可以从 [Node.js 官网](https://nodejs.org/)下载安装。
- 你熟悉 Vue 和 TypeScript。
- 你应该熟悉使用 pnpm，并以脚手架生成的 `ui/package.json` 中 `packageManager` 声明的版本为准。
- Git 是一个版本控制系统，用于跟踪代码的更改，您需要 Git 来下载示例插件并发布插件。

同时需要先阅读 [Halo 架构概览](../core/framework.md) 以了解 Halo 的核心概念和技术栈。
