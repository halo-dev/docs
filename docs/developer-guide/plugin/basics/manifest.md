---
title: 插件注册和配置
description: 了解插件定义文件 plugin.yaml 如何配置
---

在 Halo 插件开发中，`plugin.yaml` 是用于定义插件基本信息和配置的核心文件。

一个典型的 `plugin.yaml` 文件如下所示：

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

## 字段详解

| 字段                         | 说明                                                                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiVersion` 和 `kind`       | 固定写法，定义插件的 API 版本和类型，不可更改。                                                                                                                                 |
| `metadata.name`              | 插件的唯一标识名，长度不超过 253 个字符，仅包含小写字母、数字或 `-`，以字母或数字开头和结尾。                                                                                   |
| `spec.enabled`               | 表示插件是否在安装时自动启用。为了安全性，生产环境需要用户手动启用。                                                                                                            |
| `spec.requires`              | 插件支持的 Halo 版本范围，遵循 [SemVer Range Expressions](https://github.com/zafarkhaja/jsemver#range-expressions)。参考：[常用 SemVer Range Expressions](#common-range-expressions) |
| `spec.author`                | 插件作者的信息，包括名称和支持网址。                                                                                                                                            |
| `spec.logo`                  | 插件的 logo，支持 URL 链接或相对于项目 `src/main/resources` 目录的文件路径。                                                                                                    |
| `spec.settingName`（可选）   | 插件配置表单的名称，用于提供用户可视化配置的表单，名称建议为 "插件名-settings"。 参考：[表单定义](../../form-schema.md)。                                                       |
| `spec.configMapName`（可选） | 插件配置存储的 ConfigMap 名称，通常建议命名为 "插件名-configmap"。 没有配置 `settingName` 则不需要配置此项。                                                                    |
| `spec.homepage`              | 插件的主页链接，通常指向插件的官方文档或帮助页面。                                                                                                                              |
| `spec.repo`                  | 插件源码的仓库地址。                                                                                                                                                            |
| `spec.issues`                | 插件的反馈问题地址，可以是 GitHub Issues。                                                                                                                                      |
| `spec.displayName`           | 插件的显示名称，它通常是以少数几个字来概括插件的用途。                                                                                                                          |
| `spec.description`           | 插件的简短描述，用于说明插件的用途。                                                                                                                                            |
| `spec.license`               | 插件的许可协议，包含协议名称和链接。参考：[Software License](https://en.wikipedia.org/wiki/Software_license)。                                                                  |

:::tip
如果你在 plugin.yaml 中配置了 `settingName` 但确没有对应的 `Setting` 自定义模型资源文件，会导致插件无法启动，原因是 `Setting` 模型 `metadata.name` 为你配置的 `settingName` 的资源无法找到。
:::

## 插件运行模式

Halo 插件可以在两种模式下运行：`deployment`（默认）模式和 `development` 开发模式。

- `deployment` **模式**：标准的插件发布流程，插件打包成 JAR 文件后部署到 Halo。这是插件的生产运行模式。
- `development` **模式**：适用于插件开发阶段，开发者可以在无需打包和部署的情况下直接运行和调试插件，极大地提升了开发效率。

### 配置运行模式

要配置插件的运行模式，可以在 Halo 的配置文件中进行以下设置：

#### 以 `deployment` 模式运行插件

默认情况下，Halo 以 `deployment` 模式运行插件，无需特别配置。如果需要明确指定，可以参考以下配置：

```yaml
halo:
  plugin:
    runtime-mode: deployment
```

参考 [传统方式运行](../hello-world.md#run-with-traditional-way)

#### 以 `development` 模式运行插件

在开发过程中，可以将 `runtime-mode` 修改为 `development`，并通过 `fixed-plugin-path` 指定插件的绝对路径，支持多个路径配置：

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

### 常用的 SemVer Range Expressions {#common-range-expressions}

- 常规符号：`>`、`>=`、`<`、`<=`、`=`、`!=`
- 通配符范围 ( `*` | `X`| `x`)：`1.*` 解释为 `>=1.0.0 && <2.0.0`
- 波形符范围 ( `~` )：`~2.5`解释为 `>=1.5.0 && <1.6.0`
- 连字符范围 ( `-` )：`0.0-2.0`解释为 `>=1.0.0 && <=2.0.0`
- 插入符范围 ( `^` )：`^0.2.3`解释为 `>=0.2.3 && <0.3.0`
- 部分版本范围：`1` 解释为 `1.x` 或 `>=1.0.0 && <2.0.0`
- 否定运算符：`!(1.x)` 解释为 `<1.0.0 && >=2.0.0`
- 带括号的表达式：`~1.3 || (1.4.* && !=1.4.5) || ~2`

更多详细信息请参考[SemVer Range Expressions](https://github.com/zafarkhaja/jsemver#range-expressions)
