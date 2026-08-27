---
title: AI 辅助
description: 安装并使用 Halo 官方 Agent Skill，让 AI 工具获得主题结构、Thymeleaf、Finder API、静态资源与设置表单开发上下文
---

为了帮助 AI 更全面地了解 Halo 主题的结构、开发流程与最佳实践，从而在主题开发和问题排查过程中提供更准确的帮助，Halo 提供了面向主题开发的 Agent Skill。

## Agent Skill

Agent Skill 是可安装到 AI 开发工具中的领域知识包，能够让 AI 在特定场景下更准确地给出建议或执行操作。

[halo-dev/dev-skills](https://github.com/halo-dev/dev-skills) 仓库提供了 `halo-theme-dev` Skill，包含以下内容：

- 主题目录结构与 `theme.yaml`、`settings.yaml` 配置
- Thymeleaf 页面模板、布局片段与模板路由
- 模板变量与 Finder API
- 静态资源管理与 Vite 集成
- 主题设置表单与模型元数据
- 最小主题和 Vite 主题初始模板

## 安装

在 Cursor、Claude Code、Codex 等支持 Agent Skills 的 AI 开发工具中，可以通过 [Skills CLI](https://skills.sh/) 安装：

```bash
# 全局安装，可在所有项目中使用
npx skills add halo-dev/dev-skills@halo-theme-dev -g

# 或仅安装到当前项目
npx skills add halo-dev/dev-skills@halo-theme-dev
```

## 使用

安装完成后，通常在开发 Halo 主题时，Agent 会根据当前项目和任务自动识别并调用 `halo-theme-dev` Skill，无需在提示词中显式指定。如果 Agent 未自动调用，可以在提示词中明确要求使用该 Skill。

AI 生成的代码仍需经过代码审查和功能验证后再用于生产环境。
