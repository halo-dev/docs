---
title: 发布应用
description: 了解如何与我们的社区分享你的主题和插件
---

了解如何与我们的社区分享你的主题和插件，下文以应用统称主题和插件。

## GitHub 托管

如果你的应用是一个开源应用，那么我们推荐将其托管在 GitHub 上，可以获得以下好处：

1. 可以利用 GitHub 的 CI/CD 功能，实现自动构建和版本发布。
2. 可以通过 GitHub 的 Issues 功能跟踪用户反馈。
3. 可以获得更多用户关注和贡献。

除此之外，我们推荐为 GitHub 仓库添加与 Halo 相关的 [Topics](https://github.com/topics)，以便让更多用户找到你的应用，比如主题可以添加 [#halo-theme](https://github.com/topics/halo-theme)，插件可以添加 [#halo-plugin](https://github.com/topics/halo-plugin)。

## 版本发布

当你完成了你的应用并进行充分测试后，就可以在 GitHub 上创建新的 Release，其中版本规范可以参考[版本控制](#version-control)。

### 集成 CI / CD

我们为 Halo 的主题和插件提供了适用于 GitHub Action 的 CI / CD [工作流](https://github.com/halo-sigs/reusable-workflows)，可以非常方便的集成到你的 GitHub 仓库中，以下是示例：

插件 CI：

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
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-ci.yaml@v3
    with:
      ui-path: "ui"
      pnpm-version: 9
      node-version: 22
      java-version: 21
```

插件 CD：

此工作流会在每次发布 Release 时自动执行，会自动构建插件并上传产物到 Release 的 Assets 中。

```yaml title=".github/workflows/cd.yaml"
name: CD

on:
  release:
    types:
      - published

jobs:
  cd:
    uses: halo-sigs/reusable-workflows/.github/workflows/plugin-cd.yaml@v3
    permissions:
      contents: write
    with:
      pnpm-version: 9
      node-version: 22
      java-version: 21
      skip-appstore-release: true
```

主题 CD：

此工作流会在每次发布 Release 时自动执行，会自动构建主题并上传产物到 Release 的 Assets 中。

```yaml title=".github/workflows/cd.yaml"
name: CD

on:
  release:
    types:
      - published

jobs:
  cd:
    uses: halo-sigs/reusable-workflows/.github/workflows/theme-cd.yaml@v3
    permissions:
      contents: write
    with:
      skip-appstore-release: true
      node-version: 22
      pnpm-version: 9
```

关于 CI / CD 的更多详细信息，可查阅：[halo-sigs/reusable-workflows](https://github.com/halo-sigs/reusable-workflows)

## 分享应用

为了方便让 Halo 的用户知道你的应用，可以在以下渠道分享：

1. [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo)：你可以向这个仓库发起一个 PR 提交你的应用信息。
2. [Halo 论坛](https://bbs.halo.run/t/plugins)：你可以在 Halo 官方社区的[插件](https://bbs.halo.run/t/plugins)和[主题](https://bbs.halo.run/t/themes)板块发布你的应用。

## 发布到应用市场

Halo 的官方应用市场接受新应用的提交，但由于应用市场仅支持作者自行管理应用以及版本，还不支持自助新建应用并发布，所以发布到应用市场需要按照以下流程：

1. 向 [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo) 发起一个 PR 提交应用的信息，并勾选 **上架到 Halo 应用市场**。
2. Halo 官方人员会审核你的应用信息，审核通过后会上架到应用市场。
3. 如果你需要自行管理应用以及版本，可以在 PR 描述信息中提供 [Halo 官网](https://www.halo.run/)的用户名，我们会在应用发布之后将管理权限授予你。

### 要求

在你决定上架到 Halo 应用市场前，请确保已经完成以下要求：

1. 插件必须正确设置 `plugin.yaml` 中的 logo 字段，不能是插件开发模板中默认的 Halo 图标。
2. 主题和插件的描述文件中必须正确设置 `homepage`、`issues`、`license` 字段，详细解释：
   1. `homepage`：应用的主页，可以填写为 GitHub 仓库地址或者 Halo 应用市场的应用详情页地址。
   2. `issues`：应用的反馈地址，可以填写为 GitHub 仓库的 issues 地址。
   3. `license`：应用的发行许可证。
3. 应用必须编写介绍和使用文档。
4. 应用如果是基于其他程序开发的，需要保证许可证兼容。

### 自动发布

当你有了应用的管理权限之后，你可以修改上述 CI / CD 工作流，以实现在 GitHub 发布 Release 之后自动同步到应用市场，以下是具体步骤：

1. 移除 `skip-appstore-release: true` 配置，或者设置为 `false`。
2. 在 `with` 中添加 `app-id` 配置，值为应用市场的应用 ID。
3. 在 Halo 官网的个人中心创建一个新的[个人令牌](https://www.halo.run/uc/profile?tab=pat)，勾选 **应用市场开发者 > 版本管理**。
4. 在 GitHub 仓库的设置 -> `Secrets and variables` 中新建一个 Secret，名称为 `HALO_PAT`，值为你在 Halo 官网创建的个人令牌。

## 版本控制 {#version-control}

为了保持 Halo 生态系统的健康、可靠和安全，每次你对自己拥有的应用进行重大更新时，我们建议在遵循 [semantic versioning spec](http://semver.org/) 的基础上发布新版本。遵循语义版本控制规范有助于其他依赖你代码的开发人员了解给定版本的更改程度，并在必要时调整自己的代码。
