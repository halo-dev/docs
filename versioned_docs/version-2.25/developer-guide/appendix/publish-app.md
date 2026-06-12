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

Halo 官方应用市场支持开发者自助创建应用并提交首次上架审核。具体流程请查阅[应用市场 / 发布应用](../app-store/publish-app.md)，提交前请对照[应用市场审核指南](../app-store/app-review-guidelines.md)完成自查。

## 版本控制 {#version-control}

为了保持 Halo 生态系统的健康、可靠和安全，每次你对自己拥有的应用进行重大更新时，我们建议在遵循 [semantic versioning spec](http://semver.org/) 的基础上发布新版本。遵循语义版本控制规范有助于其他依赖你代码的开发人员了解给定版本的更改程度，并在必要时调整自己的代码。
