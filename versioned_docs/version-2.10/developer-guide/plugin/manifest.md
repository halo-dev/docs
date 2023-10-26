---
title: 插件资源文件
description: 了解插件资源文件 plugin.yaml 如何配置
---

一个典型的插件资源文件 plugin.yaml 如下所示：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: hello-world
spec:
  enabled: true
  requires: ">=2.0.0"
  author:
    name: halo-dev
    website: https://halo.run
  logo: https://halo.run/logo
  # settingName: hello-world-settings
  # configMapName: hello-world-configmap
  homepage: https://github.com/guqing/halo-plugin-hello-world
  displayName: "插件 Hello world"
  description: "插件开发的 hello world，用于学习如何开发一个简单的 Halo 插件"
  license:
    - name: "MIT"
```

- `apiVersion` 和 `kind`：为固定写法，每个插件写法都是一样的不可变更。
- `metadata.name`：它是插件的唯一标识名，包含不超过 253 个字符，仅包含小写字母、数字或`-`，以字母或数字开头，以字母或数字结尾。
- `spec.enabled`：表示是否要在安装时自动启用插件，仅在插件开发模式下有效。
- `spec.requires`：支持的 Halo 版本，遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 规范。
- `spec.author`：插件作者的名称和可获得支持的网站地址。
- `spec.logo`：插件 logo，可以是域名或相对于项目 `src/main/resources` 目录的相对文件路径。
- `spec.settingName`：插件配置表单名称，参考表单定义，不需要表单设置则可删除。
- `spec.configMapName`：表单定义对应的值标识名, 推荐命名为 "插件名-configmap"，没有配置 `settingName` 则不需要配置此项。

  :::tip
  如果你在 plugin.yaml 中配置了 `settingName` 但确没有对应的 `Setting` 自定义模型资源文件，会导致插件无法启动，原因是 `Setting` 模型 `metadata.name` 为你配置的 `settingName` 的资源无法找到。
  :::

- `spec.homepage`：通常为插件的 GitHub 仓库链接，或可联系到插件作者或插件官网或帮助中心链接等。
- `spec.displayName`：插件的显示名称，它通常是以少数几个字来概括插件的用途。
- `spec.description`：插件描述，用一段话来介绍插件的用途。
- `spec.license`：插件使用的软件协议，参考：<https://en.wikipedia.org/wiki/Software_license>。
