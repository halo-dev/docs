---
title: AI 辅助
description: 向 AI 提供 Halo 主题开发文档，或安装官方 Agent Skill，获取主题结构、Thymeleaf、Finder API、静态资源与设置表单开发上下文
---

为了帮助 AI 更全面地了解 Halo 主题的结构、开发流程与最佳实践，从而在主题开发和问题排查过程中提供更准确的帮助，可以向 AI 提供 Halo 开发文档，或安装面向主题开发的 Agent Skill。

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
https://docs.halo.run/developer-guide/theme/template-route-mapping.md
```

`/developer-guide/theme/index.md` 是主题文档的入口页，不是全部主题开发文档的聚合内容。

:::warning 以线上 .md 页面为准，勿读仓库中的 include 片段
如果 AI 工具克隆了文档仓库直接读取源文件，需要注意：主题文档中 `vo/` 目录下以 `_` 前缀命名的文件（如 `_PostVo.md`）是被其他页面内联引用的片段，没有 frontmatter，单独读取会得到不完整的上下文。应优先使用 docs.halo.run 的 `.md` 页面，其中的类型定义已经拼接完整。
:::

## 核对版本与源码

Halo 的模板变量和 Finder API 会随版本演进。使用 AI 生成或修改代码前，应依次确认：

1. 主题 `spec.requires` 所对应的目标 Halo 版本。
2. [主题 API 变更](./api-changelog.md)以及与任务直接相关的模板变量或 Finder API 页面。
3. 文档没有覆盖的签名和行为，以目标版本的 Halo 源码为准。

向 AI 描述重要契约时，应同时给出引入版本或最低 `spec.requires`、输入与返回值、失败和回退行为、生命周期影响及固定提交的源码链接。不要只复制类型名称或方法签名。

## 生成前检查清单

让 AI 编写主题前，至少要求它遵守以下规则：

1. 先阅读 [Thymeleaf 模板语法](./thymeleaf.md)、当前模板的[页面变量](./template-variables/index.md)和所用 Finder API，不从 Spring MVC 或旧版 Thymeleaf 示例猜测写法。
2. 不使用 `#request`、`#response`、`#session`、`#servletContext`，也不调用文档中未确认存在的表达式方法。
3. 站点 Logo、favicon、SEO 和代码注入优先使用 Halo 系统设置；主题设置只提供主题特有能力，具体边界参考[设置选项](./settings.md)。
4. 不重复输出 Halo 已注入的 description、keywords 等标签；canonical、Open Graph、Twitter Card 和结构化数据遵循[搜索引擎优化](./seo.md)并允许关闭。
5. 使用对象的 `status.permalink` 和 Halo 路由配置，不从请求对象获取当前地址，也不写死可配置路由。
6. 修改源码目录后运行现有构建命令，不手动修改生成模板、哈希资源、锁文件或构建目录。

:::warning 先确认主题的源码目录
不要让 AI 手动修改构建目录、锁文件或由构建工具生成的模板。对于 Vite、Astro 等工程化主题，应先确认 `src` 与 `templates` 的生成关系，修改源码后再运行项目已有的构建命令。
:::

## Agent Skill

Agent Skill 是可安装到 AI 开发工具中的领域知识包，能够让 AI 在特定场景下更准确地给出建议或执行操作。

[halo-dev/dev-skills](https://github.com/halo-dev/dev-skills) 仓库提供了 `halo-theme-dev` Skill，包含以下内容：

- 主题目录结构与 `theme.yaml`、`settings.yaml` 配置
- Thymeleaf 页面模板、布局片段与模板路由
- 模板变量与 Finder API
- 静态资源管理与 Vite 集成
- 主题设置表单与模型元数据
- 最小主题和 Vite 主题初始模板

### 安装

在 Cursor、Claude Code、Codex 等支持 Agent Skills 的 AI 开发工具中，可以通过 [Skills CLI](https://skills.sh/) 安装：

```bash
# 全局安装，可在所有项目中使用
npx skills add halo-dev/dev-skills@halo-theme-dev -g

# 或仅安装到当前项目
npx skills add halo-dev/dev-skills@halo-theme-dev
```

### 使用

安装完成后，通常在开发 Halo 主题时，Agent 会根据当前项目和任务自动识别并调用 `halo-theme-dev` Skill，无需在提示词中显式指定。如果 Agent 未自动调用，可以在提示词中明确要求使用该 Skill。

AI 生成的代码仍需经过代码审查，并通过主题构建、安装、启用及相关页面检查后再用于生产环境。
