---
title: API 变更日志
description: 记录每一个版本的插件 API 变更记录，方便开发者适配
---

## 2.22.0

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

此外，扩展其他 Node 中 `BubbleMenu` 的旧方式将会失效，例如 [编辑器超链接卡片](https://github.com/halo-sigs/plugin-editor-hyperlink-card/blob/main/ui/src/editor/text-bubble-extension.ts) 扩展了 Text Node 的 `BubbleMenu`。 此版本中引入了 `extendsKey` 字段，用于扩展已有的 `BubbleMenu`。**需要已有的 `BubbleMenu` 设置了 PluginKey**。
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
