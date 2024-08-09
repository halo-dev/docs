---
title: 插件项目结构
description: 了解插件项目的文件结构
---

新创建的插件项目典型的目录结构如下所示：

```text
├── ui
│   ├── src
│   │   ├── assets
│   │   │   └── logo.svg
│   │   ├── views
│   │   │   └── HomeView.vue
│   │   └── index.ts
│   ├── env.d.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.app.json
│   ├── tsconfig.config.json
│   ├── tsconfig.json
│   ├── tsconfig.vitest.json
│   └── vite.config.ts
├── gradle
├── src
│   └── main
│       ├── java
│       │   └── run
│       │       └── halo
│       │           └── starter
│       │               └── StarterPlugin.java
│       └── resources
│           ├── console
│           │   ├── main.js
│           │   └── style.css
│           └── plugin.yaml
├── LICENSE
├── README.md
├── build.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

该目录包含了前端和后端两个部分，让我们依次看一下它们中的每一个。

### 后端部分

所有的后端代码都放在 `src` 目录下，它是一个常规的 `Java` 项目目录结构。

- `StarterPlugin.java` 为插件的后端入口示例文件，类名可以任意但它必须继承 `run.halo.app.plugin.BasePlugin` 类来标记它作为插件入口。
- `resources` 下的 `plugin.yaml` 为插件的资源描述文件，它是必须的，它描述了插件的基本信息，包括插件的名称、版本、作者、描述、依赖等。
- `resources/console` 下的两个文件 `main.js` 和 `style.css` 是前端插件部分打包时输出的产物。一个插件可以没有前端部分，因此 `resources/console` 同样可以不存在。

:::warning 注意
从 2.11 开始，Halo 支持了 UC 个人中心，且个人中心和 Console 的插件机制共享，所以为了避免歧义，`resources/console` 在后续版本会被重命名为 `resources/ui`，但同时也会兼容 `resources/console`。
:::

### 前端部分

`ui` 目录下为插件的前端部分的工程目录，包括了源码、配置文件和静态资源文件。
同样的，将所有前端项目源码放到 `src` 中。我们建议使用 `TypeScript` 作为编程语言，它可以帮助你在编译时而非运行时捕获错误。

- `src/index.ts` 作为前端部分的插件的入口文件。
- `views` 中存放视图文件。
- `styles` 中存放样式。
- `components` 中放一些公共组件。
- `assets` 用于放静态资源文件。
