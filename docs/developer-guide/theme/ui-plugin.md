---
title: UI 扩展
description: 从 Halo 2.26.0 起复用 PluginModule 契约为主题添加 Console 和 UC 界面扩展，使用 Vite 或 Rsbuild 构建 ESM/IIFE 产物并正确打包共享依赖与静态资源
---

除了提供站点前台模板，主题还可以复用插件的 `PluginModule` 契约，为 Console 控制台和 UC 个人中心提供页面、组件和扩展点。只有当前激活且版本要求与 Halo 兼容的主题 UI provider 会被加载。

从 Halo 2.26.0 开始，主题 UI provider 可以使用 ESM 构建，并支持异步 JavaScript、CSS 和其他静态资源分块。Halo 2.x 仍兼容已有的 IIFE 主题 UI 产物。

## 目录结构

将 UI 项目放在主题根目录的 `ui-plugin` 目录中：

```tree
theme-root/
├── templates/
├── theme.yaml
└── ui-plugin/
    ├── package.json
    ├── src/
    │   └── index.ts
    ├── vite.config.ts
    └── dist/               # 构建产物
        ├── ui-plugin.json  # ESM 构建生成
        ├── main.<hash>.js  # 默认 ESM 入口
        ├── style.<hash>.css # 可选，路径由构建工具决定
        ├── chunks/         # 可选
        └── assets/         # 可选
```

Halo 只会从主题包的 `ui-plugin/dist` 目录读取 UI provider 资源。发布主题时必须保留完整的 `dist`，不能只复制入口和主样式。

## 入口文件

入口文件与插件 UI 使用相同的 `PluginModule` 类型，并默认导出 `definePlugin` 的结果：

```ts title="ui-plugin/src/index.ts"
import { definePlugin } from "@halo-dev/ui-shared"

export default definePlugin({
  components: {},
  routes: [],
  ucRoutes: [],
  extensionPoints: {},
})
```

可用字段、路由和扩展点请参考 [插件 UI 入口文件](../plugin/basics/ui/entry.md)。

## 使用 Vite 构建

安装依赖：

```bash
pnpm install @halo-dev/ui-plugin-bundler-kit@2.26.0 vite @vitejs/plugin-vue -D
```

创建构建配置：

```ts title="ui-plugin/vite.config.ts"
import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite"

export default viteConfig({
  provider: "theme",
  vite: {},
})
```

## 使用 Rsbuild 构建

安装依赖：

```bash
pnpm install @halo-dev/ui-plugin-bundler-kit@2.26.0 @rsbuild/core @rsbuild/plugin-vue -D
```

创建构建配置：

```ts title="ui-plugin/rsbuild.config.ts"
import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit/rsbuild"

export default rsbuildConfig({
  provider: "theme",
  rsbuild: {},
})
```

主题 provider 默认读取上一级目录的 `theme.yaml`，输出到当前 UI 项目的 `dist`，并使用 `/themes/{metadata.name}/ui-plugin/assets/` 作为资源路径。需要使用其他清单路径时，可以通过顶层的 `manifestPath` 配置。

## 输出格式和共享依赖

`format` 默认为 `auto`。当 `theme.yaml` 使用简单的稳定版本或最低版本要求，并且目标为 Halo 2.26.0 或更高版本时，构建工具会输出 ESM：

```yaml title="theme.yaml"
spec:
  requires: ">=2.26.0"
```

如果需要暂时保留 IIFE，可以在 Vite 或 Rsbuild 配置的顶层设置 `format: "iife"`。自动格式选择、`targetHaloVersion`、`ui-plugin.json` 和共享依赖的完整规则与插件相同，请参考 [插件 UI 构建](../plugin/basics/ui/build.md#output-format)。这些默认保证不适用于覆盖输出格式、资源路径、externals 或文件名的原生 Vite / Rsbuild 配置；自定义最终产物的兼容性和缓存安全由主题开发者负责。

Halo 会把主题 provider 注册为 `theme:{metadata.name}`。例如主题名称为 `theme-earth` 时，可以通过 `stores.uiPlugins().get("theme:theme-earth")` 查询其状态。主题安装、升级、重载或切换后，需要完整刷新 Console 或 UC 页面以加载新的模块图。
