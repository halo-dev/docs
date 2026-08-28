---
title: AI 辅助
description: 向 AI 提供 Halo 插件开发文档，或安装官方 Agent Skill，获取插件结构、后端、前端、权限、DevTools 与 OpenAPI 开发上下文
---

为了帮助 AI 更全面地了解 Halo 插件的结构、开发流程与最佳实践，从而在插件开发和问题排查过程中提供更准确的帮助，可以向 AI 提供 Halo 开发文档，或安装面向插件开发的 Agent Skill。

## 提供文档上下文

如果 AI 工具支持读取网页，可以在提示词中提供以下地址：

```text title='适合需要查阅多个文档时使用'
https://docs.halo.run/llms.txt
```

```text title='适合专注于插件开发时使用'
https://docs.halo.run/developer-guide/plugin/index.md
```

## Agent Skill

Agent Skill 是可安装到 AI 开发工具中的领域知识包，能够让 AI 在特定场景下更准确地给出建议或执行操作。

[halo-dev/dev-skills](https://github.com/halo-dev/dev-skills) 仓库提供了 `halo-plugin-dev` Skill，包含以下内容：

- 插件目录结构与 `plugin.yaml` 配置
- Java 后端、扩展点与自定义 API 开发
- RBAC 权限管理
- Vue 3 前端与 Console、用户中心路由开发
- DevTools 开发流程与 OpenAPI 客户端生成

### 安装

在 Cursor、Claude Code、Codex 等支持 Agent Skills 的 AI 开发工具中，可以通过 [Skills CLI](https://skills.sh/) 安装：

```bash
# 全局安装，可在所有项目中使用
npx skills add halo-dev/dev-skills@halo-plugin-dev -g

# 或仅安装到当前项目
npx skills add halo-dev/dev-skills@halo-plugin-dev
```

### 使用

安装完成后，通常在开发 Halo 插件时，Agent 会根据当前项目和任务自动识别并调用 `halo-plugin-dev` Skill，无需在提示词中显式指定。如果 Agent 未自动调用，可以在提示词中明确要求使用该 Skill。

AI 生成的代码仍需经过代码审查和功能验证后再用于生产环境。
