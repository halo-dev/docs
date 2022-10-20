---
title: 准备工作
description: 主题开发的环境搭建
---

此文档将讲解 Halo 2.0 主题开发的基本流程，从创建主题项目到最终预览主题效果。

## 搭建开发环境

Halo 在本地开发环境的运行可参考[开发环境运行](../core/run.md)，或者使用 [Docker](../../getting-started/install/docker.md) 运行。

## 新建一个主题

Halo 的主题存放于工作目录的 `themes` 目录下，即 `~/halo-next/themes`，在该目录下新建一个文件夹，例如 `theme-foo`。当前一个最小可被系统加载的主题必须在主题根目录下包含 `theme.yaml` 配置文件。

以 [theme-default](https://github.com/halo-sigs/theme-default) 为例：

```yaml title="theme.yaml"
apiVersion: theme.halo.run/v1alpha1
kind: Theme
metadata:
  name: theme-default
spec:
  displayName: Default
  author:
    name: halo-dev
    website: https://halo.run
  description: Default theme for Halo 2.0
  logo: https://halo.run/logo
  website: https://github.com/halo-sigs/theme-default
  repo: https://github.com/halo-sigs/theme-default.git
  settingName: "theme-default-setting"
  configMapName: "theme-default-configMap"
  version: 1.0.0
  require: 2.0.0
```

| 字段                  | 描述                                                        | 是否必填 |
| --------------------- | ----------------------------------------------------------- | -------- |
| `metadata.name`       | 主题的唯一标识                                              | 是       |
| `spec.displayName`    | 显示名称                                                    | 是       |
| `spec.author.name`    | 作者名称                                                    | 否       |
| `spec.author.website` | 作者网站                                                    | 否       |
| `spec.description`    | 主题描述                                                    | 否       |
| `spec.logo`           | 主题 Logo                                                   | 否       |
| `spec.website`        | 主题网站                                                    | 否       |
| `spec.repo`           | 主题托管地址                                                | 否       |
| `spec.settingName`    | 设置表单定义的名称，需要同时创建对应的 `settings.yaml` 文件 | 否       |
| `spec.configMapName`  | 设置持久化的 ConfigMap 名称                                 | 否       |
| `spec.version`        | 主题版本                                                    | 是       |
| `spec.require`        | 所需 Halo 的运行版本                                        | 是       |

:::info 提示
关于主题项目的目录结构请参考主题目录结构。
:::

## 通过模板创建

目前 Halo 为了让开发者能够尽快搭建主题项目，提供了一些初始模板，开发者可以根据实际需要选择使用。

- <https://github.com/halo-sigs/theme-starter>
- <https://github.com/halo-sigs/theme-astro-starter>

:::info 提示
以上 GitHub 都被设置为了模板仓库（Template repository），点击仓库主页的 `Use this template` 按钮即可通过此模板创建一个新的仓库。
:::

## 创建第一个页面模板

Halo 使用 [Thymeleaf](https://www.thymeleaf.org/) 作为后端模板引擎，后缀为 `.html`，与单纯编写 HTMl 一致。在 Halo 的主题中，主题的模板文件存放于 `templates` 目录下，例如 `~/halo-next/themes/theme-foo/templates`。为了此文档方便演示，我们先在 `templates` 创建一个首页的模板文件 `index.html`：

```html title="templates/index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Halo</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

## 安装主题

目前我们已经创建好了主题的项目，但并不会直接被 Halo 识别和加载，请按照以下的步骤安装和启用主题：

1. 访问 Console 管理界面，进入主题管理页面。
2. 点击右上角 `切换主题` 按钮，在选择主题弹窗中切换到 `未安装` 页面。
3. 找到我们刚刚创建的主题，点击安装即可。
4. 选择刚刚安装的主题，点击右上角的 `启用` 按钮。

此时 Halo 就已经成功加载并使用了该主题。然后我们访问首页 [http://localhost:8090](http://localhost:8090) 就可以看到我们刚刚编写的 `index.html` 模板渲染后的页面了。
