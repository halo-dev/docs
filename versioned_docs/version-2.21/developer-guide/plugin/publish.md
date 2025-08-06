---
title: 发布插件
description: 了解如何与我们的社区分享你的插件
---

了解如何与我们的社区分享你的插件。

## 创建 Release

当你完成了你的插件并进行充分测试后，就可以在 GitHub 上创建新的 Release，其中版本规范可以参考[版本控制](#version-control)。

## 自动构建

如果你是使用 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 创建的插件项目，那么已经包含了适用于 GitHub Action 的 `ci.yaml` 和 `cd.yaml` 文件，里面包含了构建插件和发布插件资源到 Release 的步骤，可以根据自己的实际需要进行修改，以下是示例：

```yaml
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

```yaml
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

关于 CI / CD 的更多详细信息，可查阅：[halo-sigs/reusable-workflows](https://github.com/halo-sigs/reusable-workflows)

## 发布你的插件

用户可以在你的仓库 Release 下载使用，但为了方便让 Halo 的用户知道你的插件，可以在以下渠道发布：

1. [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo)：你可以向这个仓库发起一个 PR 提交的插件的信息即可。
2. [Halo 应用市场](https://www.halo.run/store/apps)：Halo 官方的应用市场，但目前还不支持开发者注册和发布，如果你想发布到应用市场，可以在 PR 上说明一下，我们会暂时帮你发布。
3. [Halo 论坛](https://bbs.halo.run/t/plugins)：你可以在 Halo 官方社区的插件板块发布你的插件。

## 支持

Halo 不提供对第三方应用程序的支持。作为插件的开发者，你有责任帮助插件的用户解决技术问题（issues）。
当提交插件到 [awesome-halo](https://github.com/halo-sigs/awesome-halo) 时，
你需要添加服务支持联系人（Support contact）。这可以是用户可以联系的电子邮件地址，也可以是网站或帮助中心的链接。

## 版本控制 {#version-control}

为了保持 Halo 生态系统的健康、可靠和安全，每次你对自己拥有的插件进行重大更新时，我们建议在遵循 [semantic versioning spec](http://semver.org/) 的基础上，
发布新版本。遵循语义版本控制规范有助于其他依赖你代码的开发人员了解给定版本的更改程度，并在必要时调整自己的代码。

我们建议你的包版本从 1.0.0 开始并递增，如下：

| Code status                               | Stage         | Rule                                         | Example version |
| ----------------------------------------- | ------------- | -------------------------------------------- | --------------- |
| First release                             | New product   | 从 1.0.0 开始                                | 1.0.0           |
| Backward compatible bug fixes             | Patch release | 增加第三位数字                               | 1.0.1           |
| Backward compatible new features          | Minor release | 增加中间数字并将最后一位重置为零             | 1.1.0           |
| Changes that break backward compatibility | Major release | 增加第一位数字并将中间和最后一位数字重置为零 | 2.0.0           |
