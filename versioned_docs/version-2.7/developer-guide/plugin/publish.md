---
title: 发布插件
description: 了解如何与我们的社区分享你的插件
---
> 了解如何与我们的社区分享您的扩展。

## 创建你的 Release

当你完成了你的插件并进行充分测试后，切换到插件目录 Build 一次，当没有发生任何错误你就可以推送到 GitHub 并 `Create a new release`。

然后填写 `Release Tag` 和描述点击创建，项目目录下的 `.github/workflows/workflow.yaml` 文件会被 `GitHub Action` 触发并执行，脚本会自动根据你的 `Release Tag` 修改插件版本号然后在 `Release` 的 `Assets` 中包含打包产物--插件的 JAR 文件。

## 分享你的插件

用户可以在你的仓库 Release 下载使用，但为了方便让社区用户看到，你可以在我们的 [awesome-halo](https://github.com/halo-sigs/awesome-halo) 仓库发起一个 Pull Request，为此你需要先 Fork [awesome-halo](https://github.com/halo-sigs/awesome-halo) 并按照此仓库的要求添加一行记录是关于你的插件仓库地址和功能描述的，然后推送你的更改并通过 GitHub 向 [awesome-halo](https://github.com/halo-sigs/awesome-halo) 的 `main` 分支发起 Pull Request。

## 等待审核

在你发起 Pull Request 后，我们将审查的你的插件并在需要时请求更改。一旦被接受，Pull Request 将被合并。
