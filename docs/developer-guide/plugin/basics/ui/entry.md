---
title: 入口文件
description: 使用 definePlugin 编写 Halo 插件唯一的 UI 源码入口，通过 PluginModule 注册 FormKit 输入、全局组件、Console 与 UC 路由和扩展点
---

入口文件用于定义 Halo 核心需要加载的 `PluginModule`，每个插件有且只有一个源码入口。使用 `@halo-dev/ui-plugin-bundler-kit` 构建时，IIFE 和 ESM 都会生成一个主入口；ESM 还可以包含异步 JavaScript、CSS 和其他静态资源分块。构建和打包方式请参考 [构建](./build.md)。

为了方便开发者，我们已经在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 配置好了基础项目结构，包括构建配置，后续文档也会以此为准。

## 定义入口文件

```ts title="ui/src/index.ts"
import { definePlugin } from "@halo-dev/ui-shared";

export default definePlugin({
  formkit: {},
  components: {},
  routes: [],
  ucRoutes: [],
  extensionPoints: {}
});
```

## PluginModule 字段

`definePlugin` 接收并返回一个 `PluginModule`。请直接使用 `@halo-dev/ui-shared` 提供的类型和 IDE 提示，不要把包内的完整类型定义复制到插件项目中；扩展点会随 Halo 版本演进，当前列表和参数类型请参考[扩展点和定制化](../../extension-points/ui/index.md)。

- `formkit`：FormKit 相关扩展定义。
  - `inputs`：自定义 FormKit 输入组件定义，key 为在 FormKit Schema 中使用的 `$formkit` 类型名称，value 为 FormKit input definition。详细文档可参考 [FormKit 扩展](../../api-reference/ui/formkit.md)。
- `components`：组件列表，key 为组件名称，value 为组件对象，在此定义之后，加载插件时会自动注册到 Vue App 全局。
- `routes`：Console 控制台路由定义，详细文档可参考 [路由定义](../../api-reference/ui/route.md)
- `ucRoutes`：UC 个人中心路由定义，详细文档可参考 [路由定义](../../api-reference/ui/route.md)
- `extensionPoints`：扩展点定义，详细文档可参考 [扩展点](../../extension-points/ui/index.md)
