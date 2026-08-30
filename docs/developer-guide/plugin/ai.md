---
title: AI 辅助
description: 向 AI 提供 Halo 插件开发文档，或安装官方 Agent Skill，获取插件结构、后端、前端、权限、DevTools 与 OpenAPI 开发上下文
---

为了帮助 AI 更全面地了解 Halo 插件的结构、开发流程与最佳实践，从而在插件开发和问题排查过程中提供更准确的帮助，可以向 AI 提供 Halo 开发文档，或安装面向插件开发的 Agent Skill。

## 提供文档上下文

如果 AI 工具支持读取网页，应根据所需上下文范围选择地址：

```text title='文档索引：先查找与任务相关的页面'
https://docs.halo.run/llms.txt
```

```text title='完整文档：仅在需要全站上下文时使用'
https://docs.halo.run/llms-full.txt
```

`llms.txt` 只包含页面标题、描述和链接，不包含每一页的正文。根据索引找到所需页面后，可以把页面地址的后缀改为 `.md`，向 AI 提供该页面的 Markdown 内容，例如：

```text
https://docs.halo.run/developer-guide/plugin/basics/manifest.md
```

`/developer-guide/plugin/index.md` 是插件文档的入口页，不是全部插件开发文档的聚合内容。

:::tip 以线上页面为准
如果让 AI 直接阅读文档仓库源码，需要注意仓库中 `_` 前缀的 Markdown 文件（如 `vo/_ThemeVo.md`、`interface/_OperationItem.md`）是被其他页面引用的片段，单独阅读会缺少上下文。应以上述线上 `.md` 页面为准，它们已包含拼接后的完整内容。
:::

## 核对版本与源码

Halo 插件 API 会随版本演进。使用 AI 生成或修改代码前，应依次确认：

1. 插件 `spec.requires`、Halo BOM 或现有依赖所对应的目标版本。
2. [插件 API 变更](./api-changelog.md)以及与任务直接相关的文档页面。
3. 文档没有覆盖的签名和行为，以目标版本的 Halo 源码及插件实际依赖类型为准。

向 AI 描述重要契约时，应同时给出引入版本或最低 `spec.requires`、权限、输入与返回值、阻塞或响应式要求、失败语义、生命周期行为及固定提交的源码链接。不要只复制类型名称或方法签名。

## 生成前检查清单

让 AI 编写插件前，至少要求它遵守以下规则：

1. 新插件从官方 `pnpm create halo-plugin` 脚手架开始，现有插件保留自身包管理器、Gradle 和 UI 构建方式。
2. 自定义模型和使用 `SpringdocRouteBuilder` 描述的接口通过 `generateApiClient` 生成 TypeScript 类型与请求方法；不手写可生成的资源类型、参数和 API 路径，具体参考 [API 请求](./api-reference/ui/api-request.md)。
3. 普通插件设置使用 Setting YAML；页面和弹窗表单使用 Halo 已注册的 FormKit，列表与交互复用 `@halo-dev/components`，具体参考[表单与页面组件](./basics/ui/forms.md)。
4. 密码、Token、API Key 和私钥使用 Halo `Secret`，不存入 ConfigMap 或自定义模型；用户可配置的出站地址必须防范 SSRF 和凭据泄漏，具体参考[敏感数据与出站请求](./security/outbound-http.md)。
5. UI 路由、操作权限、RoleTemplate 和后端鉴权保持一致；公开 API 和安全开关在配置缺失或读取失败时采用 fail closed。
6. WebFlux 请求链路使用响应式 API，不调用阻塞客户端；修改 API 契约后运行生成任务，不手动修改生成结果。

:::warning 不要手动修改生成文件
不要让 AI 手动修改 OpenAPI 生成的 `api-client`、`api-docs`、构建目录或锁文件。应修改源文件，再运行项目已有的生成器、构建命令或包管理器更新这些文件。
:::

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

AI 生成的代码仍需经过代码审查，并按照[插件测试](./testing.md)和[插件发布验收清单](./release-checklist.md)完成自动化检查、构建及安装/启停验证后再用于生产环境。
