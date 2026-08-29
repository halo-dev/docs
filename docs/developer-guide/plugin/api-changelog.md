---
title: API 变更日志
description: 记录每一个版本的插件 API 变更记录，方便开发者适配
---

## 2.26.0

### UI 构建工具新增独立入口

`@halo-dev/ui-plugin-bundler-kit@2.26.0` 新增 Vite 和 Rsbuild 专用入口。Vite 项目应从 `@halo-dev/ui-plugin-bundler-kit/vite` 导入 `viteConfig`，Rsbuild 项目应从 `@halo-dev/ui-plugin-bundler-kit/rsbuild` 导入 `rsbuildConfig`。包根入口中的同名导出仍可在 2.26.0 中使用，但已标记为过时，并计划在 2.27.0 中移除。迁移示例请参考 [UI 构建](./basics/ui/build.md)。

### UI 扩展支持 ESM 和异步分块

从 Halo 2.26.0 开始，插件和已激活主题的 Console / UC UI 扩展可以使用 ESM 构建和加载，并支持异步 JavaScript、CSS 和其他静态资源分块。Halo 2.x 会继续兼容已有的 IIFE 产物，无需为兼容新版本而重新构建旧插件。

将 `@halo-dev/ui-plugin-bundler-kit` 升级到 2.26.0 后，`viteConfig` 和 `rsbuildConfig` 默认根据 `plugin.yaml` 的 `spec.requires` 自动选择格式。简单的 `requires: ">=2.26.0"` 会选择 ESM；暂时无法迁移的项目可以显式设置 `format: "iife"`。默认 ESM preset 会为入口、启动样式和异步资源使用内容哈希文件名，`ui-plugin.json` 会记录实际启动资源路径；清单、入口、样式、分块和静态资源必须作为一个完整目录打包。详细文档请参考 [UI 构建](./basics/ui/build.md#output-format)。

ESM 插件可以从 Halo 共享运行时导入 Vue、Vue Router、Pinia、Axios、FormKit 和公开的 Halo UI 包，其他依赖默认保留在插件自己的构建产物中。共享包的完整列表、兼容性诊断和自定义配置边界请参考 [共享运行时依赖](./basics/ui/build.md#shared-runtime-dependencies)。

### 查询 UI provider 的注册状态

`@halo-dev/ui-shared@2.26.0` 新增 `stores.uiPlugins()`，用于查询插件或已激活主题的 UI provider 是否被发现、是否已经成功注册以及当前状态。它替代了 `window.PluginName` 和 `window.enabledUiPlugins` 等依赖 IIFE 全局变量的检测方式。详细文档请参考 [共享工具库 > uiPlugins](./api-reference/ui/shared.md#uiplugins)。

### 编辑器扩展支持注册快捷键描述

`@halo-dev/richtext-editor@2.26.0` 新增 `defineHaloKeyboardShortcuts()`，插件可以在 Tiptap 的 `addKeyboardShortcuts` 中同时注册快捷键命令和用户可见的描述，并通过 `shortcutId` 将同一条描述关联到工具栏、Slash Command 或悬浮菜单。详细文档请参考 [默认编辑器 > 快捷键扩展](./extension-points/ui/default-editor-extension-create.md#6-快捷键扩展)。

### 编辑器扩展支持声明运行期元数据

`@halo-dev/richtext-editor@2.26.0` 新增 `addHaloEditorMetadata()` 和 `createHaloEditorManifest()`。插件可以为 Tiptap Node、Mark 和 Extension 声明组件用法、属性、结构关系及 HTML 示例，并从最终 Editor 实例生成稳定的运行期 Manifest。详细文档请参考 [默认编辑器 > 编辑器扩展运行期元数据](./extension-points/ui/default-editor-extension-create.md#7-编辑器扩展运行期元数据)。

## 2.25.0

### 表单定义 > `select` 选项支持图标和描述

在 2.25.0 中，`select` 表单类型的选项对象新增了 `icon` 与 `description` 字段，可在下拉选项中展示图标和辅助说明；使用远程动态数据源时，也可以通过 `requestOption.iconField` 与 `requestOption.descriptionField` 映射响应字段。详细文档可查阅：[表单定义#select](../../developer-guide/form-schema.md#select)。

### 支持插件注册自定义 FormKit 输入组件

在 2.25.0 中，插件可以通过 UI 入口文件的 `formkit.inputs` 注册自定义 FormKit 输入组件，并在插件提供的 FormKit Schema 中通过 `$formkit` 使用。详细文档可查阅：[FormKit 扩展](./api-reference/ui/formkit.md)。

如果插件使用 `@formkit/vue` 创建 input definition，需要将 `@halo-dev/ui-plugin-bundler-kit` 升级到 2.25.0 或更高版本，并将 `plugin.yaml` 中的 `spec.requires` 提升到 `>=2.25.0`。

### 表单定义 > `secret` 表单类型新增 `descriptionPreset` 参数

在 2.25.0 中，`secret` 表单类型新增了 `descriptionPreset` 参数，用于在创建密钥时预填备注。详细文档可查阅：[表单定义#secret](../../developer-guide/form-schema.md#secret)。

## 2.23.0

### Spring Boot 依赖升级可能导致插件无法正常启动

在 2.23.0 中，我们升级了 Spring Boot 版本至 4.x，该版本包含一些破坏性更新，可能会导致插件无法正常启动，因此建议插件开发者尽快升级 Halo 依赖，`build.gradle` 修改示例如下：

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation platform('run.halo.tools.platform:plugin:2.23.0')
}

halo {
    version = '2.23.0'
}
```

`plugin.yaml` 中的 `spec.requires` 字段也需要提升至 `>=2.23.0`，示例如下：

```yaml
spec:
  requires: ">=2.23.0"
```

尝试构建并解决编译错误即可。如果使用了 Spring 相关的组件或者 API，请参考 [Spring Boot 4.x 的升级指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)进行适配。

### 表单定义 > Iconify 表单类型新增 `sizing` 参数

在 2.23.0 中，Iconify 表单类型默认不再显示图标大小选项，如果需要让用户设置图标大小，可以配置 `sizing` 参数，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

## 2.22.8

### 表单定义 > 新增 `toggle` 组件

在 2.22.8 中，我们为 FormKit 表单新增了 `toggle` 组件，这是一个可以对一组图片、颜色或文字等进行选择切换的组件，详细文档可查阅：[表单定义#toggle](../../developer-guide/form-schema.md#toggle)

## 2.22.5

### SpringDoc 依赖更新可能导致插件无法启动

在 2.22.5 中，我们更新了 SpringDoc 依赖至 [2.8.15](https://github.com/springdoc/springdoc-openapi/releases/tag/v2.8.15) 版本，该版本[修复](https://github.com/springdoc/springdoc-openapi/pull/3183)了 OpenAPI 文档生成中的一些问题（例如嵌套路由无须定义文档），且为破坏性更新，这可能会导致插件无法正常启动。

因此，建议插件开发者尽快升级 Halo 依赖，`build.gradle` 修改示例如下：

```groovy
dependencies {
    implementation platform('run.halo.tools.platform:plugin:2.22.5')

    ...
}
```

`plugin.yaml` 中的 `spec.requires` 字段也需要提升至 `>=2.22.5`，示例如下：

```yaml
spec:
  requires: ">=2.22.5"
```

尝试构建并解决编译错误即可。

## 2.22.1

### 表单定义 > 新增 `switch` 组件

在 2.22.1 中，我们为 FormKit 表单新增了 `switch` 组件，用于定义一个功能的开关，详细文档可查阅：[表单定义#switch](../../developer-guide/form-schema.md#switch)

## 2.22.0

### 自定义模型索引 API 更新

在 2.22.0 中，我们重构了自定义模型索引和查询 API，插件中直接使用索引 API 的代码建议进行以下调整：

1. 使用 `IndexSpecs.single(name, keyType)` 和 `IndexSpecs.multi(name, keyType)` 声明索引，替代 `IndexAttributeFactory.simpleAttribute()`、`IndexAttributeFactory.multiValueAttribute()` 和直接创建 `new IndexSpec()` 的旧写法。
2. 索引值类型不再局限于字符串，可以使用 `String`、`Boolean`、`Integer`、`Long`、`Instant` 等实现 `Comparable` 的类型。
3. 使用 `Queries` 创建 `FieldSelector` 查询条件，替代已过时的 `QueryFactory`。
4. `ReactiveExtensionClient` 和 `ExtensionClient` 新增了 `listAllNames`、`listTopNames`、`listNamesBy` 和 `countBy` 等查询方法，直接使用 `indexedQueryEngine()` 的方式已过时。

详细文档可查阅：[自定义模型使用索引](./api-reference/server/extension.md#using-indexes) 和 [ExtensionClient 查询](./api-reference/server/extension-client.md#query)。

### `@halo-dev/console-shared` 改名

从 Halo 2.11 支持个人中心以后，插件的 UI 项目能同时扩展 Console 和 UC，所以为了避免歧义，我们在 Halo 2.22 中将 UI 的 `@halo-dev/console-shared` 依赖更名为 `@halo-dev/ui-shared`，虽然在 Halo 中兼容了旧版依赖，但仍然推荐使用新版依赖，迁移方案：

```bash
pnpm uninstall @halo-dev/console-shared
pnpm install @halo-dev/ui-shared
```

然后在插件项目全局搜索 `@halo-dev/console-shared` 并替换为 `@halo-dev/ui-shared` 即可，同时需要将 `plugin.yaml` 的 `spec.requires` 字段修改为 `>=2.22.0`。

### `@halo-dev/ui-shared` 工具库

在 2.22.0 中，Halo 在 `@halo-dev/ui-shared` 包中提供一些常用工具，用于减少部分业务的开发工作量，目前提供：

1. `stores`
   1. `currentUser`：用于获取当前用户信息
   2. `globalInfo`：用于获取网站一些公开的信息，比如外部访问地址
2. utils
   1. `date`：时间日期格式化工具
   2. `permission`：用户权限检查工具
   3. `id`：uuid 生成工具
   4. `attachment`：附件相关工具，比如获取附件缩略图地址
3. events
   1. `core:plugin:configMap:updated`：用于监听插件配置变更

详细文档可查阅：[共享工具库](./api-reference/ui/shared.md)

### UI 扩展点 > 附件选择选项卡类型更新

在 2.22.0 中，我们为 `AttachmentLike` 复合类型添加了 `mediaType` 字段，用于区分文件类型，方便在插入到文章时显示正确的媒体类型，如不填写，所选择的文件将作为链接插入到编辑器，所以实现了此扩展点的插件都需要进行改动，具体步骤：

1. 升级依赖

   ```bash
   pnpm install @halo-dev/ui-shared@2.22.0
   ```

2. 提升 [plugin.yaml#spec.requires](./basics/manifest.md#字段详解) 版本为 `>=2.22.0`。
3. 按照[最新文档](./extension-points/ui/attachment-selector-create.md)修改插件代码

### 表单定义 > 新增 Iconify 图标选择器

在 2.22.0 中，我们为 FormKit 表单提供了通用的图标选择器，基于 [Iconify](https://icon-sets.iconify.design/)，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

### 表单定义 > 新增 `array` 组件

在 2.22.0 中，我们为 FormKit 表单新增了 `array` 组件，用于定义一组数据，并计划使用 `array` 组件替换原有的 `repeater` 组件。详细文档可查阅：[表单定义#array](../../developer-guide/form-schema.md#array)

### 编辑器 > BubbleMenu 扩展点改动

在 Halo 2.22.0 中，我们升级了编辑器的 Tiptap 版本至 3.x，由于 Tiptap 在 3.x 中做了一些破坏性更新且 Halo 也遵循其更新，因此如果插件扩展了编辑器，并使用了 BubbleMenu 扩展点，则需要根据以下方式进行更新升级。

1. 使用 `options` 代替 `tippyOptions`。

```diff
- tippyOptions: {
-  fixed: false,
- },
+ options: {
+  strategy:"absolute",
+ },
```

2. 使用 `getReferencedVirtualElement` 代替 `getRenderContainer`。

```diff
- getRenderContainer: (node: HTMLElement) => {
-   let container = node;
-   if (container.nodeName === "#text") {
-     container = node.parentElement as HTMLElement;
-   }
-   while (
-     container &&
-     container.classList &&
-    !container.classList.contains("column")
-   ) {
-     container = container.parentElement as HTMLElement;
-   }
-   return container;
- },
+ getReferencedVirtualElement() {
+  const editor = this.editor;
+   if (!editor) {
+     return null;
+   }
+  const parentNode = findParentNode(
+     (node) => node.type.name === Column.name
+   )(editor.state.selection);
+   if (parentNode) {
+     const domRect = posToDOMRect(
+       editor.view,
+       parentNode.pos,
+       parentNode.pos + parentNode.node.nodeSize
+     );
+     return {
+       getBoundingClientRect: () => domRect,
+       getClientRects: () => [domRect],
+     };
+   }
+   return null;
+ },
```

3. 移除 `defaultAnimation`。

```diff
- defaultAnimation: false,
```

此外，扩展其他 Node 中 `BubbleMenu` 的旧方式将会失效，例如 [编辑器超链接卡片](https://github.com/halo-sigs/plugin-editor-hyperlink-card/blob/dbec29e91fb22863b6baee03db8ae5509eded8e0/ui/src/editor/text-bubble-extension.ts) 扩展了 Text Node 的 `BubbleMenu`。 此版本中引入了 `extendsKey` 字段，用于扩展已有的 `BubbleMenu`。**需要已有的 `BubbleMenu` 设置了 PluginKey**。
用法如下：

```ts
Extension.create({
    name: "expandTextBubbleMenu",
    addOptions() {
      return {
        getBubbleMenu() {
          return {
            // 目标 BubbleMenu 的 PluginKey。当前版本会导出 Halo UI Editor 中的所有 PluginKey。
            extendsKey: TEXT_BUBBLE_MENU_KEY,
            items: [
              {
                priority: 10,
                // 具有同一个 key 的 items 将会被覆盖
                key: "textItem1",
                props: { title: "ExpandText" },
              },
            ],
          };
        },
      };
    },
  }),
```

有关 `BubbleMenu` 扩展的详细文档可查阅：[悬浮菜单扩展](./extension-points/ui/default-editor-extension-create.md#4-悬浮菜单扩展)

### 编辑器 > 新增 getDraggableMenuItems 扩展点

在 Halo 2.22.0 中，我们为编辑器增加了拖拽菜单的功能，同时支持插件动态扩展拖拽菜单。与此同时，旧的 `getDraggable` 扩展点被移除，取而代之的是 `getDraggableMenuItems` 扩展点。

可直接移除 `getDraggable` 扩展点，不再使用，也无需考虑兼容性问题。

关于 `getDraggableMenuItems` 扩展点的详细文档可查阅：[拖拽菜单扩展](./extension-points/ui/default-editor-extension-create.md#5-拖拽菜单扩展)

### 表单定义 > 重构 `attachment` 表单类型

在 Halo 2.22 中，我们重构了原有的 attachment 表单类型，支持了预览和直接上传文件，并将旧版的表单类型更名为了 [attachmentInput](../form-schema.md#attachmentinput)
