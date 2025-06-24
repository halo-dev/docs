---
title: 构建
description: UI 部分的构建说明
---

在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 工具中，我们已经配置好了 UI 的构建工具和流程，此文档主要说明一些构建细节以及其他可能的构建选项。

## 原理

Halo 插件的 UI 部分（Console / UC）的实现方式其实很简单，本质上就是构建一个结构固定的大对象，交给 Halo 去解析，其中包括全局注册的组件、路由定义、扩展点等。在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 工具创建的项目中，我们使用 `index.ts` 作为入口文件，并在构建之后将 `main.js` 和 `style.css` 放到插件项目的 `src/main/resources/console` 目录中，后续 Halo 在内部会自动合并所有插件的 `main.js` 和 `style.css` 文件，并生成最终的 `bundle.js` 和 `bundle.css` 文件，然后在 Console 和 UC 中加载这两个资源并解析。

所以本质上，我们只需要使用支持将 `index.ts` 编译为 `main.js` 和 `style.css` 的工具，然后输出到插件项目的 `src/main/resources/console` 目录中即可，在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 的模板中可以看到，我们提供了一个名为 `@halo-dev/ui-plugin-bundler-kit` 的库，这个库包含了 [Vite](https://vite.dev/) 和 [Rsbuild](https://rsbuild.dev/) 的预配置，插件项目只需要通过简单的配置即可使用。

## @halo-dev/ui-plugin-bundler-kit

在这个库中，我们提供了三个预配置，分别是：

1. `viteConfig`: Vite 的预配置
2. `rsbuildConfig`: Rsbuild 的预配置
3. `HaloUIPluginBundlerKit`：已过时，迁移方式可以参考下面的文档

### viteConfig

#### 使用

如果你在通过 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 创建项目时没有选择使用 Vite 作为 UI 的构建工具，那么可以通过以下方式改为使用 Vite。

安装依赖：

```bash
pnpm install @halo-dev/ui-plugin-bundler-kit@2.21.1 vite -D
```

创建 vite.config.ts:

```js
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit";

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
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit";

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
    import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit";
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
    import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit";
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

Rsbuild 是基于 Rspack 开发的上层构建工具，其优势在于兼容 Webpack 生态并且性能优异。我们为什么要选择 Rsbuild 可以查阅 [Vite vs Rsbuild](#vite-vs-rsbuild)。

#### 使用

如果你在通过 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 创建项目时没有选择使用 Rsbuild 作为 UI 的构建工具，那么可以通过以下方式改为使用 Rsbuild。

安装依赖：

```bash
pnpm install @halo-dev/ui-plugin-bundler-kit@2.21.1 @rsbuild/core -D
```

创建 rsbuild.config.ts:

```js
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";

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
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";

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
    import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";

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
    import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";
    import { pluginSass } from "@rsbuild/plugin-sass";

    export default rsbuildConfig({
      rsbuild: {
        plugins: [
          pluginSass(), // 添加 Sass 插件
        ],
      },
    });
    ```

### HaloUIPluginBundlerKit

旧版本 [plugin-starter](https://github.com/halo-dev/plugin-starter) 使用的方式，目前已经不再推荐。

## 构建输出

在 `viteConfig` 和 `rsbuildConfig` 中，已经配置好了开发环境和生产构建的输出目录，分别是：

- **开发环境**：`build/resources/main/console`，在开发 UI 的过程中，可以使用 `pnpm dev` 来实时查看效果
- **生产环境**：`ui/build/dist`

> 需要注意的是，生产构建的目录仅仅是临时目录，最终在使用 Gradle 构建插件时会自动构建 UI 并复制到 `src/main/resources/console` 目录中。

## Vite vs Rsbuild{#vite-vs-rsbuild}

Vite 和 Rsbuild 都是优秀的构建工具，但它们在不同的使用场景下有各自的优势：

### 何时使用 Rsbuild

- ✅ **代码分割支持** - Rsbuild 为代码分割和懒加载提供了优秀的支持
- ✅ **更好的性能** - 对于复杂应用，通常有更快的构建时间和更小的包体积
- ✅ **动态导入** - 非常适合有重度前端组件的插件

**动态导入示例：**

```typescript
import { definePlugin } from '@halo-dev/console-shared';
import { defineAsyncComponent } from 'vue';
import { VLoading } from '@halo-dev/components';

export default definePlugin({
  routes: [
    {
      parentName: 'Root',
      route: {
        path: 'demo',
        name: 'DemoPage',
        // 懒加载重型组件
        component: defineAsyncComponent({
          loader: () => import('./views/DemoPage.vue'),
          loadingComponent: VLoading,
        }),
      },
    },
  ],
  extensionPoints: {},
});
```

### 何时使用 Vite

- ✅ **Vue 生态友好** - 与 Vue 生态系统工具和插件有更好的集成
- ✅ **丰富的插件生态** - 有大量可用的 Vite 插件
- ✅ **简单配置** - 对于直接的使用场景更容易配置

### 总结

| 特性       | Vite   | Rsbuild  |
| ---------- | ------ | -------- |
| 代码分割   | ❌ 有限 | ✅ 优秀   |
| Vue 生态   | ✅ 优秀 | ✅ 良好   |
| 构建性能   | ✅ 良好 | ✅ 优秀   |
| 开发体验   | ✅ 优秀 | ✅ 优秀   |
| 插件生态   | ✅ 丰富 | ✅ 增长中 |
| 配置复杂度 | ✅ 简单 | ⚖️ 中等   |

**建议**：对于有大型前端代码库的复杂插件使用 **Rsbuild**，对于简单插件或需要广泛 Vue 生态系统集成时使用 **Vite**。

## 迁移{#migration}

如果你当前的插件使用的是旧版本的 [plugin-starter](https://github.com/halo-dev/plugin-starter)，并且想使用新的 `viteConfig` 和 `rsbuildConfig`，可以参考以下步骤：

1. 更新 `@halo-dev/ui-plugin-bundler-kit` 至 `2.21.1` 或更高版本

    ```bash
    pnpm install @halo-dev/ui-plugin-bundler-kit@2.21.1 -D
    ```

2. 更新 `vite.config.ts` 文件

    ```typescript
    import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit";

    export default viteConfig({
      vite: {
        // Vite 配置需要按照原有的配置进行修改，但需要移除 Vue 插件，因为已经内置
        plugins: [
        ],
      },
    });
    ```

3. 更新项目根目录的 `build.gradle` 文件

    ```gradle
    plugins {
        id 'java'
        id "io.freefair.lombok" version "8.13"
        id "run.halo.plugin.devtools" version "0.6.0"
    }

    group 'run.halo.starter'

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation platform('run.halo.tools.platform:plugin:2.21.0')
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
        into layout.buildDirectory.dir('resources/main/console')
        dependsOn project(':ui').tasks.named('assemble')
        shouldRunAfter tasks.named('processResources')
    }

    tasks.named('classes') {
        dependsOn tasks.named('processUiResources')
    }

    halo {
        version = '2.21'
    }
    ```

4. 在 ui 或者 console 目录新建 `build.gradle` 文件，内容如下：

    ```gradle
    plugins {
        id 'base'
        id "com.github.node-gradle.node" version "7.1.0"
    }

    group 'run.halo.starter.ui'

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

进行此变更的主要目的是保证 UI 构建的产物不直接输出到源码目录的 resources 目录中，而是通过 Gradle 构建插件时复制到 `src/main/resources/console` 目录中。

如果你不想使用新的 Gradle 构建配置，也可以修改 viteConfig 或 rsbuildConfig 的输出目录，和旧版本保持一致：

viteConfig:

```js
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit";

const OUT_DIR_PROD = "../src/main/resources/console";
const OUT_DIR_DEV = "../build/resources/main/console";

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
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";

const OUT_DIR_PROD = "../src/main/resources/console";
const OUT_DIR_DEV = "../build/resources/main/console";

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
