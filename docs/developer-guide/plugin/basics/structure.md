---
title: 插件项目结构
description: 了解插件项目的文件结构
---

当你创建一个新的插件项目时，典型的目录结构如下所示：

```tree
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
│       │   └── com
│       │       └── example
│       │           └── starter
│       │               └── StarterPlugin.java
│       └── resources
│           └── plugin.yaml
├── LICENSE
├── README.md
├── build.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

此目录结构划分为前端和后端两部分，下面我们将分别进行详细说明。

### 后端部分

`src` 目录中存放的是后端代码，这部分遵循标准的 Java 项目结构。以下是各个文件和文件夹的说明：

- `StarterPlugin.java`：插件后端的入口文件，位于 `src/main/java/com/example/starter` 路径下。你可以根据需要修改包名和类名，但需要确保该类继承 `run.halo.app.plugin.BasePlugin`，以指定其为插件的入口。
- `plugin.yaml`：这是插件的描述文件，位于 `src/main/resources` 目录下。该文件是必须的，包含插件的基本信息，如插件名称、版本、作者、描述以及依赖等内容。
- `resources/ui`：插件 JAR 中的推荐 UI 资源目录。Gradle 会将 `ui/build/dist` 的完整构建产物复制到 `build/resources/main/ui` 后打包，其中可能包含 `ui-plugin.json`、入口、样式、异步分块和其他静态资源。如果插件不包含 UI 部分，此目录可以忽略。

:::warning 优先使用 resources/ui
从 2.11 开始，Halo 支持了 UC 个人中心，且个人中心和 Console 的插件机制共享，因此推荐使用 `resources/ui`。Halo 2.x 仍兼容旧项目使用的 `resources/console`，并优先读取 `ui`。
:::

### 前端部分

`ui` 目录下存放插件的前端代码和相关资源，前端部分通常采用 Vue 作为开发框架，并推荐使用 TypeScript 作为主要语言，这有助于在编译阶段捕获潜在错误。

以下是前端部分各文件夹和文件的说明：

- `src/index.ts`：作为前端部分的插件的入口文件。
- `views`：用于存放 Vue 组件的页面视图文件。
- `styles`：用于存放全局样式和自定义 CSS 文件。
- `components`：推荐创建该目录以放置可复用的公共组件，便于插件项目的模块化和维护。
- `assets`：存放静态资源文件，如图片、图标等。
