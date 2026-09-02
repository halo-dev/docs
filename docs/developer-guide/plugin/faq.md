---
title: 常见问题
description: 插件开发中常见问题的排查方法，包括插件启动失败、UI 扩展不加载、依赖冲突与热重载失效
---

本文汇总插件开发中高频问题的排查路径。按现象定位到对应条目，按步骤排查。

## 插件启动失败 {#startup-failure}

1. 在 Console 的「插件管理」页面查看插件状态和失败原因，插件详情中会展示启动异常信息。
2. 查看 Halo 服务端日志，定位第一个由插件包名开头的异常堆栈。
3. 常见原因：
   - `plugin.yaml` 的 `spec.requires` 与当前 Halo 版本不匹配，Halo 会拒绝启动；
   - 类缺失（`NoClassDefFoundError` 等）：第三方依赖没有被打进插件 JAR，或本应声明 `compileOnly` 的 Halo/Spring 类被错误打包，参考[类加载与依赖](#dependency-conflict)；
   - 插件间依赖未满足：`spec.pluginDependencies` 声明的依赖插件未安装或未启用。

## 类加载与依赖冲突 {#dependency-conflict}

每个插件运行在独立的类加载器中，与 Halo 主程序和其他插件隔离：

- Halo 提供的 API（`run.halo.app:api`）、Spring、Lombok 等由主程序提供的依赖必须声明为 `compileOnly`（参照 [create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 模板），打包进插件会导致类冲突或转换异常。
- 插件自己的第三方依赖（如 HTTP 客户端、工具库）需要正常声明为 `implementation` 并随插件 JAR 一起打包。
- 两个插件依赖了同一第三方库的不同版本不会互相影响（类加载器隔离）。插件不应直接依赖另一个插件的实现类；需要调用其公开 Java API 时，应通过 `spec.pluginDependencies` 声明运行时依赖，并以 `compileOnly` 引用对方的独立 API 模块，详见[插件依赖](./interaction/dependency.md)。不需要共享 Java 类型时，优先使用 [SharedEvent 或扩展点机制](./interaction/index.md) 交互。

## UI 扩展不加载 {#ui-not-loading}

1. 确认插件已启用，且 UI 构建产物作为完整目录打包（清单 `ui-plugin.json`、入口、样式和分块缺一不可），参考 [UI 构建](./basics/ui/build.mdx)。
2. 打开浏览器开发者工具查看 Console 页面是否有加载错误（404、语法错误、共享依赖版本不兼容等）。
3. 使用 `@halo-dev/ui-shared` 的 `stores.uiPlugins()` 查询插件 UI provider 是否被发现、是否注册成功及当前状态，参考[共享工具库](./api-reference/ui/shared.md)。
4. 确认扩展点名称拼写与文档一致（如 `plugin:self:tabs:create`），错误的键名不会产生任何报错。

## 权限配置不生效 {#permission-not-effective}

1. 角色模板的 `resources` 只填写 API 路径中的 resource 段，**不要**加插件名前缀，参考[API 权限控制](./security/role-template.md#resource-rules)。
2. 检查角色模板文件是否在 `src/main/resources/extensions` 目录下且带有 `halo.run/role-template: "true"` 标签。
3. UI 侧控制需通过 `rbac.authorization.halo.run/ui-permissions` 声明并在前端使用权限指令，参考[UI 权限控制](./security/ui-permission.md)。

## 开发期热重载不生效 {#hot-reload}

1. 确认使用 `./gradlew watch`（自动监听重载）或在修改后手动执行 `./gradlew reloadPlugin`。
2. UI 改动需要前端构建任务先产出新文件，再触发插件重载；确认 `watchDomains` 配置覆盖了 UI 产物目录，参考[DevTools](./basics/devtools.md)。
3. 浏览器端可能缓存了旧的 UI 资源，强制刷新页面后再验证。
