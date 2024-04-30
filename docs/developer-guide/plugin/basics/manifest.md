---
title: 插件注册和配置
description: 了解插件定义文件 plugin.yaml 如何配置
---

一个典型的插件描述文件 plugin.yaml 如下所示：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: Plugin
metadata:
  name: hello-world
spec:
  enabled: true
  requires: ">=2.0.0"
  author:
    name: Halo
    website: https://www.halo.run
  logo: https://www.halo.run/logo
  # settingName: hello-world-settings
  # configMapName: hello-world-configmap
  homepage: https://github.com/halo-dev/plugin-starter#readme
  repo: https://github.com/halo-dev/plugin-starter
  issues: https://github.com/halo-dev/plugin-starter/issues
  displayName: "插件 Hello world"
  description: "插件开发的 hello world，用于学习如何开发一个简单的 Halo 插件"
  license:
    - name: "GPL-3.0"
      url: "https://github.com/halo-dev/plugin-starter/blob/main/LICENSE"
```

- `apiVersion` 和 `kind`：为固定写法，每个插件写法都是一样的不可变更。
- `metadata.name`：它是插件的唯一标识名，包含不超过 253 个字符，仅包含小写字母、数字或`-`，以字母或数字开头，以字母或数字结尾。
- `spec.enabled`：表示是否要在安装时自动启用插件，出于安全性考虑，仅在插件开发模式下有效，生产模式需要由用户手动启用。
- `spec.requires`：插件受支持的 Halo 版本，遵循 [Semantic Range Expressions](https://github.com/zafarkhaja/jsemver#range-expressions)，以下是支持的符号及其解释的列表：
  - 常规符号：`>`、`>=`、`<`、`<=`、`=`、`!=`
  - 通配符范围 ( `*` | `X`| `x`)：`1.*` 解释为 `>=1.0.0 && <2.0.0`
  - 波形符范围 ( `~` )：`~2.5`解释为 `>=1.5.0 && <1.6.0`
  - 连字符范围 ( `-` )：`0.0-2.0`解释为 `>=1.0.0 && <=2.0.0`
  - 插入符范围 ( `^` )：`^0.2.3`解释为 `>=0.2.3 && <0.3.0`
  - 部分版本范围：`1` 解释为 `1.x` 或 `>=1.0.0 && <2.0.0`
  - 否定运算符：`!(1.x)` 解释为 `<1.0.0 && >=2.0.0`
  - 带括号的表达式：`~1.3 || (1.4.* && !=1.4.5) || ~2`

- `spec.author`：插件作者的名称和可获得支持的网站地址。
- `spec.logo`：插件 logo，可以是域名或相对于项目 `src/main/resources` 目录的文件路径，如将 logo 放在 `src/main/resources/logo.png` 则配置为 `logo.png` 即可。
- `spec.settingName`：插件配置表单名称，对应一个 `Setting` 自定义模型资源文件，可为用户提供可视化的配置表单，参考：[表单定义](../../form-schema.md)。如果插件没有配置提供给用户则不需要配置此项，名称推荐为 "插件名-settings"，命名规同 `metadata.name`。
- `spec.configMapName`：表单定义对应的值标识名，它声明了插件的配置值将存储在哪个 ConfigMap 中，通常我们推荐命名为 "插件名-configmap"，没有配置 `settingName` 则不需要配置此项，命名规同 `metadata.name`。

  :::tip
  如果你在 plugin.yaml 中配置了 `settingName` 但确没有对应的 `Setting` 自定义模型资源文件，会导致插件无法启动，原因是 `Setting` 模型 `metadata.name` 为你配置的 `settingName` 的资源无法找到。
  :::

- `spec.homepage`：通常设置为插件官网或帮助中心链接等。
- `spec.repo`：插件源码地址。
- `spec.issues`：插件问题反馈地址，如果你的插件是开源在 GitHub 上，可以直接配置为 GitHub Issues 地址。
- `spec.displayName`：插件的显示名称，它通常是以少数几个字来概括插件的用途。
- `spec.description`：插件描述，用一段简短的说明来介绍插件的用途。
- `spec.license`：插件使用的软件协议，参考：<https://en.wikipedia.org/wiki/Software_license>。

Halo 的插件可以在两种模式下运行：`development` 和 `deployment`。
`deployment`（默认）模式是插件创建的标准工作流程：为每个插件创建一个新的 Gradle 项目，编码插件（声明新的扩展点和/或添加新的扩展），将插件打包成一个 JAR 文件，部署 JAR 文件到 Halo。
这些操作非常耗时，因此引入了 `development` 开发模式。

对于插件开发人员来说，`development` 运行模式的主要优点是不必打包和部署插件。在开发模式下，您可以以简单快速的流程快速开发插件。

### 配置

如果你想以 `deployment` 运行插件则参考 [传统方式运行](../hello-world.md#run-with-traditional-way) 做如下配置:

```yaml
halo:
  plugin:
    runtime-mode: deployment
```

`deployment` 是默认的运行模式，因此你可以不配置 `runtime-mode`。

如果你想以 `development` 运行并开发插件则将 `runtime-mode` 修改为 `development`，同时配置 `fixed-plugin-path` 为插件项目绝对路径，可以配置多个。

```yaml
# macOS / Linux
plugin:
  runtime-mode: development
  fixed-plugin-path:
    # 配置为插件绝对路径
    - /path/to/halo-plugin-hello-world

# Windows
halo:
  plugin:
    runtime-mode: development
    fixed-plugin-path:
      # 配置为插件绝对路径
      - C:\path\to\halo-plugin-hello-world
```

:::tip Note

1. `development` 开发模式下，既可以运行 `fixed-plugin-path` 下的插件，也可以运行通过 `Console` 管理端安装的 JAR 格式的插件。
2. 如果使用 [DevTools 运行方式](../hello-world.md#run-with-devtools) 来开发插件，则不需要配置 `runtime-mode` 和 `fixed-plugin-path`。
:::
