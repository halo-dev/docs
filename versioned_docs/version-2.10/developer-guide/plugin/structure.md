---
title: 项目结构
description: 了解插件的文件结构
---

新创建的插件项目典型的目录结构如下所示：

```text
.
├── LICENSE
├── README.md
├── gradle
│   └── .
├── lib
│   └── halo-2.0.0-SNAPSHOT-plain.jar
├── src
│   ├── main
│   │   ├── java
│   │   │   └── run
│   │   │       └── halo
│   │   │           └── starter
│   │   │               └── StarterPlugin.java
│   │   └── resources
│   │       ├── console
│   │       │   ├── main.js
│   │       │   └── style.css
│   │       └── plugin.yaml
├── gradlew
├── gradlew.bat
├── gradle.properties
├── settings.gradle
├── build.gradle
├── console
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── src
│   │   ├── assets
│   │   │   └── logo.svg
│   │   ├── components
│   │   │   └── HelloWorld.vue
│   │   ├── index.ts
│   │   ├── styles
│   │   │   └── index.css
│   │   └── views
│   │       └── DefaultView.vue
│   ├── tsconfig.app.json
│   ├── tsconfig.config.json
│   ├── tsconfig.json
│   ├── tsconfig.vitest.json
│   └── vite.config.ts
```

该目录包含了前端和后端两个部分，让我们依次看一下它们中的每一个。

### 后端部分

所有的后端代码都放在 `src` 目录下，它是一个常规的 `Java` 项目目录结构。

- `StarterPlugin.java` 为插件的后端入口文件。

- `resources` 下的 `plugin.yaml` 为插件的资源描述文件，它是必须的。

- `resources/console` 下的两个文件 `main.js` 和 `style.css` 是前端插件部分打包时输出的产物。一个插件可以没有前端部分，因此 `resources/console` 同样可以不存在。

`lib/halo-2.0.0-SNAPSHOT-plain.jar` 它是 Halo 的类型依赖，目前使用 `JAR` 文件的方式引入依赖只是暂时的，后续将会改进它，它只作为编译时依赖使用。

### 前端部分

`console` 目录下为插件的前端部分的工程目录，包括了源码、配置文件和静态资源文件。
同样的，将所有前端项目源码放到 `src` 中。我们建议使用 `TypeScript` 作为编程语言，它可以帮助你在编译时而非运行时捕获错误。

- `src/index.ts` 作为前端部分的插件的入口文件。
- `views` 中存放视图文件。
- `styles` 中存放样式。
- `components` 中放一些公共组件。
- `assets` 用于放静态资源文件。
