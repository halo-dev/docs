---
title: 发布应用
description: 了解如何准备、提交并维护 Halo 应用市场中的主题和插件
---

本页按发布前准备、首次上架、审核处理和发布后维护的顺序，说明如何将主题或插件发布到 Halo 应用市场。下文以应用统称主题和插件。

Halo 官方应用市场支持开发者自助创建应用并提交首次上架审核。当前自助上架流程主要面向免费插件和主题；付费上架、平台代收、结算、分账等能力暂未开放。

## 发布流程概览

首次上架建议按以下顺序完成：

1. 准备应用仓库、版本号、构建产物、README、许可证、截图和支持入口。
2. 申请成为 Halo 应用市场开发者。
3. 创建应用，填写应用类型、名称、简介、Logo、截图、README、外部链接等上架信息。
4. 创建首个版本，填写版本号、Halo 兼容范围和版本说明，并上传版本制品。
5. 对照[应用市场审核指南](./app-review-guidelines.md)完成自查，然后提交首次审核。
6. 根据审核结果发布、整改或重新提交。

应用通过首次审核后，后续版本可以继续在应用管理页面维护，也可以接入 GitHub Actions 自动发布。

## 发布前准备

### 托管代码和收集反馈

如果你的应用是开源应用，推荐将代码托管在 GitHub 上。这样可以：

1. 使用 GitHub Actions 等 CI/CD 工具自动构建和发布版本。
2. 使用 GitHub Issues 跟踪用户反馈和缺陷报告。
3. 让更多用户和贡献者发现你的应用。

除此之外，可以为 GitHub 仓库添加与 Halo 相关的 [Topics](https://github.com/topics)，以便让更多用户找到你的应用。主题可以添加 [#halo-theme](https://github.com/topics/halo-theme)，插件可以添加 [#halo-plugin](https://github.com/topics/halo-plugin)。

### 准备上架资料

创建应用前，建议先准备以下资料：

1. 应用名称、简介、Logo、截图和 README。
2. 许可证、开源仓库、问题反馈地址、支持地址或主页地址。
3. 安装、配置、使用、升级、卸载和故障排查说明。
4. 涉及第三方服务、用户数据、商业限制、外部授权或付费能力时，对应的说明文档。
5. 至少一个可安装的版本制品。插件通常应提供 JAR 包，主题通常应提供 ZIP 包。

这些资料会直接影响审核和用户理解成本。提交前请确认内容真实准确，并与应用实际功能保持一致。

### 使用语义化版本号 {#version-control}

版本号应遵循 [Semantic Versioning](https://semver.org/) 规范，使用 `MAJOR.MINOR.PATCH` 的形式：

1. 不兼容变更增加 `MAJOR`。
2. 向后兼容的新功能增加 `MINOR`。
3. 向后兼容的问题修复增加 `PATCH`。

已经发布的版本不应再修改对应制品。如需修复问题，请发布新版本。预发布版本可以使用 `1.0.0-alpha.1`、`1.0.0-beta.1`、`1.0.0-rc.1` 这样的格式。

Halo 兼容范围也应填写合法的 Semantic Versioning range，例如 `>=2.20.0`。不要在版本号或兼容范围前后保留空白字符。

### 创建 GitHub Release

当应用完成开发并经过充分测试后，可以在 GitHub 上创建新的 Release。GitHub Release 基于 Git tag，用于发布可供用户下载的软件版本，也可以附加编译后的二进制文件。

如果你暂时不接入自动发布，可以在 GitHub Release 中手动上传构建好的 JAR 或 ZIP 文件；如果使用下文的 CI/CD 工作流，Release 发布时会自动构建并上传制品。

## 申请成为开发者

上架应用前，你需要使用已完成邮箱验证的 Halo 官网账号，在[开发者入驻页面](https://www.halo.run/uc/developer/join)申请成为应用市场开发者。申请时需要填写开发者资料，并阅读和同意当前开发者协议。

申请通过后，可以在[应用管理页面](https://www.halo.run/uc/developer/apps)创建和管理自己的应用。如果申请被驳回，可以根据审核意见修改资料后重新提交。待审核的开发者申请可以取消，取消后也可以重新提交。

## 创建应用和首个版本

### 创建应用

在[应用管理页面](https://www.halo.run/uc/developer/apps)创建应用时，需要填写应用类型、名称、简介、Logo、截图、README、许可证、外部链接、开源仓库或支持地址等信息。

上架信息应准确反映应用的实际功能、限制和使用成本。涉及隐私、第三方服务、外部授权或商业限制时，应在 README 或相关字段中明确说明。

### 创建首个版本

创建应用后，需要继续创建首个版本：

1. 填写版本号。
2. 填写 Halo 兼容范围。
3. 填写版本说明。
4. 上传版本制品。

首次提交审核前，应用应仍处于草稿状态，并且仅保留一个初始草稿版本。该版本至少需要包含一个上传完成的制品。

## 提交首次审核

首次上架应用需要经过应用级审核。提交前请先对照[应用市场审核指南](./app-review-guidelines.md)完成自查，重点确认：

1. 应用可以在声明兼容的 Halo 版本中完成安装、启用、配置、使用、禁用和卸载。
2. 上架信息、截图、README、版本说明和外部链接真实准确。
3. 版本号和 Halo 兼容范围格式正确。
4. 插件 `plugin.yaml` 中的 logo 字段已正确设置，不能继续使用插件开发模板中的默认 Halo 图标。
5. 主题和插件的描述文件中已正确设置 `homepage`、`issues`、`license` 字段。
6. 许可证、第三方资源、商标、图片、字体、图标和模板授权清晰。
7. 应用不包含恶意代码、未披露数据收集、隐藏远程执行、高危安全漏洞或违法违规内容。

提交审核时需要阅读并同意应用上架协议。如应用需要测试账号、演示环境、特殊安装步骤或重新提交说明，可以在提交说明中补充。

## 审核期间和审核结果

提交审核后，平台会保存提交当时的应用信息、README、初始版本、版本说明、制品和协议确认信息作为审核快照。

审核期间如需修改应用、版本、说明或制品，应取消审核、等待驳回后重新提交，或按审核意见处理。

审核通过后，应用会发布到应用市场。审核被拒时，审核意见可能引用[应用市场审核指南](./app-review-guidelines.md)中的条款编号，你需要按对应条款整改后重新提交。

即使应用已经通过审核，后续版本、重大更新或出现风险、投诉时，仍可能被重新审核、暂停分发或下架。

## 发布后维护

### 手动发布后续版本

应用首次审核通过后，开发者可以在[应用管理页面](https://www.halo.run/uc/developer/apps)为自己拥有的应用发布后续版本。

后续版本仍应符合[应用市场审核指南](./app-review-guidelines.md)。当前流程不会为每个后续版本创建独立审核记录，但开发者仍应确保版本制品、版本说明、兼容范围和上架资料准确可靠。

### 分享应用

为了让更多 Halo 用户知道你的应用，可以在以下渠道分享：

1. [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo)：你可以向这个仓库发起 PR 提交应用信息。
2. [Halo 论坛](https://bbs.halo.run/t/plugins)：你可以在 Halo 官方社区的[插件](https://bbs.halo.run/t/plugins)和[主题](https://bbs.halo.run/t/themes)板块发布应用。

### 使用 GitHub Actions 自动构建和发布

Halo 的主题和插件可以使用 [halo-sigs/reusable-workflows](https://github.com/halo-sigs/reusable-workflows) 提供的 GitHub Actions 工作流自动构建，并在 GitHub Release 发布时上传制品。

首次审核前，建议先让 CD 工作流只上传 GitHub Release 资产，不自动同步到应用市场。应用首次审核通过后，再补充应用 ID 和个人令牌，用于自动同步后续版本。

插件 CI 示例：

```yaml title=".github/workflows/ci.yaml"
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  ci:
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-ci.yaml@v4
    with:
      ui-path: "ui"
```

插件 CD 示例，仅上传 GitHub Release 资产：

```yaml title=".github/workflows/cd.yaml"
name: CD

on:
  release:
    types:
      - published

jobs:
  cd:
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-cd.yaml@v4
    permissions:
      contents: write
    with:
      ui-path: "ui"
      skip-appstore-release: true
```

主题 CD 示例，仅上传 GitHub Release 资产：

```yaml title=".github/workflows/cd.yaml"
name: CD

on:
  release:
    types:
      - published

jobs:
  cd:
    uses: halo-sigs/reusable-workflows/.github/workflows/theme-cd.yaml@v4
    permissions:
      contents: write
    with:
      skip-appstore-release: true
```

使用 `theme-cd.yaml` 发布主题时，主题仓库需要使用 pnpm，并在 `package.json` 中提供 `build` 脚本。该脚本需要执行 `npx @halo-dev/theme-package-cli`；如果主题还有其他构建步骤，应先执行这些步骤，再执行主题打包命令。

```json title="package.json"
{
  "scripts": {
    "build": "vite build && npx @halo-dev/theme-package-cli"
  }
}
```

### 自动同步后续版本到应用市场

应用首次审核通过后，如果希望在 GitHub 发布 Release 时自动同步后续版本到应用市场，可以调整 CD 工作流：

1. 移除 `skip-appstore-release: true` 配置，或者设置为 `false`。
2. 在 `with` 中添加 `app-id` 配置，值为应用市场的应用 ID，可在[应用管理页面](https://www.halo.run/uc/developer/apps)查看。
3. 在 Halo 官网的个人中心创建新的[个人令牌](https://www.halo.run/uc/profile?tab=pat)，勾选 **应用市场开发者 > 版本管理**。
4. 在 GitHub 仓库的设置 -> `Secrets and variables` 中新建一个 Secret，名称为 `HALO_PAT`，值为你在 Halo 官网创建的个人令牌。
5. 在工作流中将 `HALO_PAT` 映射为 reusable workflow 需要的 `halo-pat`。

插件 CD 示例，自动同步到应用市场：

```yaml title=".github/workflows/cd.yaml"
name: CD

on:
  release:
    types:
      - published

jobs:
  cd:
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-cd.yaml@v4
    secrets:
      halo-pat: ${{ secrets.HALO_PAT }}
    permissions:
      contents: write
    with:
      app-id: app-xxxxxxxx
      ui-path: "ui"
```

主题 CD 示例，自动同步到应用市场：

```yaml title=".github/workflows/cd.yaml"
name: CD

on:
  release:
    types:
      - published

jobs:
  cd:
    uses: halo-sigs/reusable-workflows/.github/workflows/theme-cd.yaml@v4
    secrets:
      halo-pat: ${{ secrets.HALO_PAT }}
    permissions:
      contents: write
    with:
      app-id: app-xxxxxxxx
```

以上插件示例假设 UI 子项目路径为 `ui`；如果你的仓库使用默认的 `console` 路径，可以移除 `ui-path`，或按实际结构调整。若项目使用 Corepack 并且已在 `package.json` 中定义 `packageManager`，可以参考 `halo-sigs/reusable-workflows` 的说明调整 `pnpm-version`。
