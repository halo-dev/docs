---
title: 准备工作
description: 主题开发所需的准备工作和基本的项目搭建
---

此文档将讲解 Halo 2.0 主题开发的基本流程，从创建主题项目到最终预览主题效果。

## 搭建开发环境

Halo 在本地开发环境的运行可参考[开发环境运行](../core/run.md)，或者使用 [Docker](../../getting-started/install/docker.md) 运行。

:::tip
为了保证在开发时，主题代码可以实时生效，需要注意以下事项：

- 使用 Halo 源码运行时，需要在配置文件中包含如下配置：

  ```yaml
  spring:
    thymeleaf:
      cache: false
  ```

- 使用 Docker 运行时，需要添加 `SPRING_THYMELEAF_CACHE=false` 的环境变量。
:::

## 新建一个主题

Halo 的主题存放于工作目录的 `themes` 目录下，即 `~/halo2-dev/themes`，在该目录下新建一个文件夹，例如 `theme-foo`。当前一个最小可被系统加载的主题必须在主题根目录下包含 `theme.yaml` 配置文件。

```yaml title="theme.yaml"
apiVersion: theme.halo.run/v1alpha1
kind: Theme
metadata:
  name: theme-foo
spec:
  displayName: 示例主题
  author:
    name: halo-dev
    website: https://halo.run
  description: 一个示例主题
  logo: https://halo.run/logo
  website: https://github.com/halo-sigs/theme-foo
  repo: https://github.com/halo-sigs/theme-foo.git
  settingName: "theme-foo-setting"
  configMapName: "theme-foo-configMap"
  version: 1.0.0
  require: 2.0.0
```

:::info 提示
主题的配置文件详细文档请参考 [配置文件](./config.md)。
:::

:::info 提示
主题项目的目录结构请参考 [主题目录结构](./structure.md)。
:::

## 通过模板创建

目前 Halo 为了让开发者能够尽快搭建主题项目，提供了一些初始模板，开发者可以根据实际需要选择使用。

- [halo-sigs/theme-starter](https://github.com/halo-dev/theme-starter) - 最基础的主题模板，包含了主题的基本目录结构。
- [halo-sigs/theme-vite-starter](https://github.com/halo-dev/theme-vite-starter) - 与 Vite 集成的主题模板，由 Vite 负责资源构建。
- [halo-sigs/theme-modern-starter](https://github.com/halo-dev/theme-modern-starter) - 集成了现代前端技术栈的 Halo 2.0 的主题开发模板。

:::info 提示
以上 GitHub 都被设置为了模板仓库（Template repository），点击仓库主页的 `Use this template` 按钮即可通过此模板创建一个新的仓库。
:::

## 创建第一个页面模板

Halo 使用 [Thymeleaf](https://www.thymeleaf.org/) 作为后端模板引擎，后缀为 `.html`，与单纯编写 HTML 一致。在 Halo 的主题中，主题的模板文件存放于 `templates` 目录下，例如 `~/halo2-dev/themes/theme-foo/templates`。为了此文档方便演示，我们先在 `templates` 创建一个首页的模板文件 `index.html`：

```html title="templates/index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title th:text="${site.title}"></title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <ul>
      <li th:each="post : ${posts.items}">
        <a th:href="@{${post.status.permalink}}" th:text="${post.spec.title}"></a>
      </li>
    </ul>
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
