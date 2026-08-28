---
title: 构建
description: 使用 ui-plugin-bundler-kit 的 Vite 或 Rsbuild 预配置构建 Halo 插件 UI，选择 ESM 或 IIFE 输出并正确打包共享依赖、清单和异步资源
---

在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 工具中，我们已经配置好了 UI 的构建工具和流程，此文档主要说明一些构建细节以及其他可能的构建选项。

## 原理

Halo 插件的 UI 部分（Console / UC）以 `index.ts` 为源码入口，默认导出一个包含组件、路由和扩展点等内容的 `PluginModule`。Halo 2.x 支持两种构建和加载格式：

- **ESM**：从 Halo 2.26.0 开始支持。每个插件独立加载入口、样式和异步分块，可以使用标准的动态 `import()` 和独立缓存。
- **IIFE**：旧版兼容格式。Halo 会将插件和当前主题的 `main.js`、`style.css` 汇总后加载，现有产物在 Halo 2.x 中无需重新构建。

在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 创建的项目中，`@halo-dev/ui-plugin-bundler-kit` 提供了 [Vite](https://vite.dev/) 和 [Rsbuild](https://rsbuild.dev/) 的预配置。它会根据插件清单选择输出格式、生成 Halo 所需的元数据，并将共享依赖和资源路径配置为与 Halo 运行时兼容的形式，因此不建议自行实现这部分构建协议。

## @halo-dev/ui-plugin-bundler-kit

在这个库中，我们提供了三个预配置，分别是：

1. `viteConfig`: Vite 的预配置
2. `rsbuildConfig`: Rsbuild 的预配置
3. `HaloUIPluginBundlerKit`：已过时，迁移方式可以参考下面的文档

从 2.26.0 开始，`viteConfig` 和 `rsbuildConfig` 分别通过构建工具专用入口导出。包根入口中的同名导出仅用于兼容已有项目，已标记为过时，并计划在 2.27.0 中移除。

### viteConfig

#### 使用

如果你在通过 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 创建项目时没有选择使用 Vite 作为 UI 的构建工具，那么可以通过以下方式改为使用 Vite。

安装依赖：

```bash
pnpm install @halo-dev/ui-plugin-bundler-kit@2.26.0 vite @vitejs/plugin-vue -D
```

创建 vite.config.ts:

```js
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";

export default viteConfig()
```

更新 package.json:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite build --watch --mode=development",
    "build": "vite build"
  }
}
```

#### 配置

```js
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";

export default viteConfig({
  vite: {
    // 自定义 Vite 配置
    plugins: [
      // 额外的插件（Vue 插件已预配置）
    ],
    // 其他配置...
  },
});
```

示例：

1. 添加路径别名

    ```js
    import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";
    import path from "path";

    export default viteConfig({
      vite: {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "src"),
            "@components": path.resolve(__dirname, "src/components"),
          },
        },
      },
    });
    ```

2. 添加额外的 Vite 插件

    ```js
    import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";
    import { defineConfig } from "vite";
    import UnoCSS from "unocss/vite";

    export default viteConfig({
      vite: {
        plugins: [
          UnoCSS(), // 添加 UnoCSS 插件
        ],
      },
    });
    ```

### rsbuildConfig

Rsbuild 是基于 Rspack 开发的上层构建工具，其优势在于兼容 Webpack 生态并且性能优异。

#### 使用

如果你在通过 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 创建项目时没有选择使用 Rsbuild 作为 UI 的构建工具，那么可以通过以下方式改为使用 Rsbuild。

安装依赖：

```bash
pnpm install @halo-dev/ui-plugin-bundler-kit@2.26.0 @rsbuild/core @rsbuild/plugin-vue -D
```

创建 rsbuild.config.ts:

```js
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit/rsbuild";

export default rsbuildConfig()
```

更新 package.json:

```json
{
  "type": "module",
  "scripts": {
    "dev": "rsbuild build --env-mode development --watch",
    "build": "rsbuild build"
  }
}
```

#### 配置

```js
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit/rsbuild";

export default rsbuildConfig({
  rsbuild: {
    // 自定义 Rsbuild 配置
    plugins: [
      // 额外的插件（Vue 插件已预配置）
    ],
    // 其他配置...
  },
});
```

示例：

1. 添加路径别名

    ```js
    import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit/rsbuild";

    export default rsbuildConfig({
      rsbuild: {
        source: {
          alias: {
            "@": "./src",
            "@components": "./src/components",
          },
        },
      },
    });
    ```

2. 添加额外的 Rsbuild 插件

    ```js
    import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit/rsbuild";
    import { pluginSass } from "@rsbuild/plugin-sass";

    export default rsbuildConfig({
      rsbuild: {
        plugins: [
          pluginSass(), // 添加 Sass 插件
        ],
      },
    });
    ```

### 配置内置的 Vue 编译器

`viteConfig` 和 `rsbuildConfig` 已经分别创建了一个 Vue 插件实例。需要修改 Vue 模板编译选项时，应使用顶层的 `vue` 字段，不要在内部的 `plugins` 数组中再次添加 `@vitejs/plugin-vue` 或 `@rsbuild/plugin-vue`。

Vite：

```ts
export default viteConfig({
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === "halo-app-card",
      },
    },
  },
  vite: {},
});
```

Rsbuild：

```ts
export default rsbuildConfig({
  vue: {
    vueLoaderOptions: {
      compilerOptions: {
        isCustomElement: (tag) => tag === "halo-app-card",
      },
    },
  },
  rsbuild: {},
});
```

## 输出格式与 Halo 目标{#output-format}

`viteConfig` 和 `rsbuildConfig` 使用相同的格式选项：

```ts
export default viteConfig({
  format: "auto", // "auto" | "iife" | "esm"
  vite: {},
});
```

`auto` 是默认值。构建工具只会从以下两种 `spec.requires` 写法推导 ESM 目标：

- 稳定版本，例如 `2.26.0`。
- 简单的最低版本，例如 `>=2.26.0`。

推导出的最低版本为 2.26.0 或更高版本时输出 ESM，低于 2.26.0 时输出 IIFE。通配符、组合范围或其他无法直接推导最低稳定版本的写法会产生警告并回退到 IIFE，例如 `^2.26.0`、`>=2.26.0 <3.0.0`。这些写法仍可能是有效的 Halo 版本范围，只是不能用于自动选择 ESM。

如果需要暂时保留旧格式，可以显式设置：

```ts
export default viteConfig({
  format: "iife",
  vite: {},
});
```

只有在无法从 `spec.requires` 推导目标且确实需要 ESM 时，才设置 `targetHaloVersion`：

```ts
export default viteConfig({
  format: "esm",
  targetHaloVersion: "2.26.0",
  vite: {},
});
```

`targetHaloVersion` 只用于选择构建时的 Halo 共享运行时快照，不会改变插件的安装兼容范围。发布 ESM 产物时，仍应确保 `plugin.yaml` 的 `spec.requires` 不允许安装到不支持 ESM 的 Halo 版本。

### ESM 构建产物

成功的 ESM 构建会额外生成保留文件 `ui-plugin.json`，并可能包含异步 JavaScript、CSS 和其他静态资源。以下目录仅作示意，实际入口和启动样式路径以 `ui-plugin.json` 为准：

```tree
build/dist/
├── ui-plugin.json
├── main.<hash>.js          # 默认 ESM 入口
├── style.<hash>.css        # 可选，路径由构建工具决定
├── chunks/                 # 可选的异步 JavaScript / CSS 分块
└── assets/                 # 可选的图片、字体等资源
```

`ui-plugin.json` 由 bundler kit 生成，请勿手动创建、复制或覆盖。打包插件时需要保留完整输出目录，不能只复制清单中记录的入口和启动样式。没有该文件的产物会继续按旧版 IIFE 格式加载，即使 `spec.requires` 已经包含 Halo 2.26.0。

默认的 ESM preset 会配置模块输出、共享依赖、相对资源路径，并为入口、启动样式和异步资源使用内容哈希文件名。原生 Vite / Rsbuild 配置会在这些默认值之后合并，bundler kit 不会检查、拒绝或重写冲突的覆盖项。如果自定义配置修改了输出格式、入口、资源路径、externals 或文件名，开发者需要自行保证清单一致性、Import Map 兼容性、共享依赖身份、资源迁移和缓存安全。旧项目暂时无法满足这些要求时，可以显式选择 `format: "iife"`。

## 共享运行时依赖{#shared-runtime-dependencies}

ESM 插件可以从 Halo 运行时导入以下包根路径：

- `vue`
- `vue-router`
- `pinia`
- `axios`
- `@formkit/vue`
- `@formkit/core`
- `@halo-dev/ui-shared`
- `@halo-dev/components`
- `@halo-dev/api-client`
- `@halo-dev/richtext-editor`

bundler kit 会发现对共享包根路径的导入，并在能够读取包元数据时，对比插件安装的版本与目标 Halo 快照中的版本。插件版本更新或主版本不同时会产生尽力而为的兼容性提示，但版本差异不会导致构建失败。bundler kit 不检查静态导出、别名、fork 或构建工具最终解析到的包；从共享包进行深层导入仍会失败，因为 Halo 的 Import Map 只公开上述包根路径。默认 preset 会将未列出的依赖打入插件产物；如果通过自定义配置修改 externals 或依赖解析，开发者需要自行保证浏览器能够解析最终产物。

`axios` 是 Halo 提供的标准共享模块，请勿修改它的全局 defaults 或 interceptors；需要隔离配置时使用 `axios.create()`。`@halo-dev/api-client` 导出的 `axiosInstance` 是另一个带 Halo 认证和错误处理的实例，详细说明请参考 [API 请求](../../api-reference/ui/api-request.md)。

## 加载和生命周期

ESM 入口仍需默认导出已有的 `PluginModule`，不应通过顶层副作用自行注册路由或组件。Halo 会并行加载各 provider 的启动样式、ESM 入口和旧版 IIFE bundle，再按照稳定的 provider 顺序注册成功加载的模块。插件不能依赖其他 provider 的求值或注册顺序，也不支持直接导入其他 provider 的实现。

单个 provider 的入口、样式或注册失败时，Halo 会跳过该 provider，并继续启动核心 UI 和其他 provider。入口求值产生的定时器、事件监听器等任意副作用无法保证回滚，因此插件安装、升级、启用、禁用或重新加载后，完整刷新 Console 或 UC 页面是受支持的模块替换和恢复边界。

## HaloUIPluginBundlerKit（已过时）

旧版本 [plugin-starter](https://github.com/halo-dev/plugin-starter) 使用的方式，目前已经不再推荐，也不支持 ESM 或主题 UI provider。`HaloUIPluginBundlerKit` 计划在 2.27.0 中移除，请改用构建工具专用入口中的 `viteConfig` 或 `rsbuildConfig`。

## 构建输出

在 `viteConfig` 和 `rsbuildConfig` 中，已经配置好了开发环境和生产构建的输出目录，分别是：

- **开发环境**：目标 Halo 为 2.25.0 或更高版本时输出到 `build/resources/main/ui`；旧目标继续输出到 `build/resources/main/console`。在开发 UI 的过程中，可以使用 `pnpm dev` 实时构建
- **生产环境**：`ui/build/dist`

> 生产目录是临时构建产物。使用 Gradle 构建插件时，应将完整目录复制到 `build/resources/main/ui`，并随插件 JAR 一起打包。`console` 目录仍作为旧项目的兼容回退。发布前应按[插件发布验收清单](../../release-checklist.md#检查-jar-内容)检查最终 JAR。

## 迁移{#migration}

如果你当前的插件使用的是旧版本的 [plugin-starter](https://github.com/halo-dev/plugin-starter)，并且想使用新的 `viteConfig` 和 `rsbuildConfig`，可以参考以下步骤：

1. 更新 `@halo-dev/ui-plugin-bundler-kit` 至 `2.26.0` 或更高版本

    ```bash
    pnpm install @halo-dev/ui-plugin-bundler-kit@2.26.0 vite @vitejs/plugin-vue -D
    ```

2. 更新 `vite.config.ts` 文件

    ```typescript
    import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";

    export default viteConfig({
      vite: {
        // Vite 配置需要按照原有的配置进行修改，但需要移除 Vue 插件，因为已经内置
        plugins: [
        ],
      },
    });
    ```

3. 更新项目根目录的 `build.gradle` 文件

    ```groovy
    plugins {
        id 'java'
        id "io.freefair.lombok" version "8.13"
        id "run.halo.plugin.devtools" version "0.6.0"
    }

    group 'com.example.starter'

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation platform('run.halo.tools.platform:plugin:2.26.0')
        compileOnly 'run.halo.app:api'

        testImplementation 'run.halo.app:api'
        testImplementation 'org.springframework.boot:spring-boot-starter-test'
        testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    }

    test {
        useJUnitPlatform()
    }

    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }

    tasks.withType(JavaCompile).configureEach {
        options.encoding = "UTF-8"
        options.release = 21
    }

    tasks.register('processUiResources', Copy) {
        from project(':ui').layout.buildDirectory.dir('dist')
        into layout.buildDirectory.dir('resources/main/ui')
        dependsOn project(':ui').tasks.named('assemble')
        shouldRunAfter tasks.named('processResources')
    }

    tasks.named('classes') {
        dependsOn tasks.named('processUiResources')
    }

    halo {
        version = '2.26'
    }
    ```

4. 在 ui 或者 console 目录新建 `build.gradle` 文件，内容如下：

    ```groovy
    plugins {
        id 'base'
        id "com.github.node-gradle.node" version "7.1.0"
    }

    group 'com.example.starter.ui'

    tasks.register('buildFrontend', PnpmTask) {
        group = 'build'
        description = 'Builds the UI project using pnpm.'
        args = ['build']
        dependsOn tasks.named('pnpmInstall')
        inputs.dir(layout.projectDirectory.dir('src'))
        inputs.files(fileTree(
                dir: layout.projectDirectory,
                includes: ['*.cjs', '*.ts', '*.js', '*.json', '*.yaml']))
        outputs.dir(layout.buildDirectory.dir('dist'))
    }

    tasks.register('pnpmCheck', PnpmTask) {
        group = 'verification'
        description = 'Runs unit tests using pnpm.'
        args = ['test:unit']
        dependsOn tasks.named('pnpmInstall')
    }

    tasks.named('check') {
        dependsOn tasks.named('pnpmCheck')
    }

    tasks.named('assemble') {
        dependsOn tasks.named('buildFrontend')
    }
    ```

进行此变更的主要目的是保证 UI 构建产物不直接输出到源码目录，而是通过 Gradle 复制到 `build/resources/main/ui` 并打包到插件 JAR 中。

如果你不想使用新的 Gradle 构建配置，也可以让 viteConfig 或 rsbuildConfig 直接输出到源码资源目录：

viteConfig:

```js
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";

const OUT_DIR_PROD = "../src/main/resources/ui";
const OUT_DIR_DEV = "../build/resources/main/ui";

export default viteConfig({
  vite: ({ mode }) => {
    const isProduction = mode === "production";
    const outDir = isProduction ? OUT_DIR_PROD : OUT_DIR_DEV;

    return {
      build: {
        outDir,
      },
    };
  },
});
```

rsbuildConfig:

```js
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit/rsbuild";

const OUT_DIR_PROD = "../src/main/resources/ui";
const OUT_DIR_DEV = "../build/resources/main/ui";

export default rsbuildConfig({
  rsbuild: ({ envMode }) => {
    const isProduction = envMode === "production";
    const outDir = isProduction ? OUT_DIR_PROD : OUT_DIR_DEV;

    return {
      output: {
        distPath: {
          root: outDir,
        },
      },
    };
  },
});
```
