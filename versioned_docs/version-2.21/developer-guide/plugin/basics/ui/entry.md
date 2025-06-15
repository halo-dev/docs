---
title: 入口文件
description: UI 扩展部分的入口文件
---

入口文件即 Halo 核心会加载的文件，所有插件有且只有一个入口文件，构建之后会放置在插件项目的 `src/resources/console` 下，名为 `main.js`。

为了方便开发者，我们已经在 [halo-dev/plugin-starter](https://github.com/halo-dev/plugin-starter) 配置好了基础项目结构，包括构建配置，后续文档也会以此为准。

## 定义入口文件

```ts title="ui/src/index.ts"
import { definePlugin } from "@halo-dev/console-shared";

export default definePlugin({
  components: {},
  routes: [],
  ucRoutes: [],
  extensionPoints: {}
});
```

## 类型定义

```ts
export function definePlugin(plugin: PluginModule): PluginModule {
  return plugin;
}
```

```ts title="PluginModule"
import type { Component, Ref } from "vue";
import type { RouteRecordRaw, RouteRecordName } from "vue-router";
import type { FunctionalPage } from "../states/pages";
import type { AttachmentSelectProvider } from "../states/attachment-selector";
import type { EditorProvider, PluginTab } from "..";
import type { AnyExtension } from "@halo-dev/richtext-editor";
import type { CommentSubjectRefProvider } from "@/states/comment-subject-ref";
import type { BackupTab } from "@/states/backup";
import type { PluginInstallationTab } from "@/states/plugin-installation-tabs";
import type { EntityFieldItem } from "@/states/entity";
import type { OperationItem } from "@/states/operation";
import type { ThemeListTab } from "@/states/theme-list-tabs";
import type {
  Attachment,
  Backup,
  ListedPost,
  Plugin,
  Theme,
} from "@halo-dev/api-client";

export interface RouteRecordAppend {
  parentName: RouteRecordName;
  route: RouteRecordRaw;
}

export interface ExtensionPoint {
  // @deprecated
  "page:functional:create"?: () => FunctionalPage[] | Promise<FunctionalPage[]>;

  "attachment:selector:create"?: () =>
    | AttachmentSelectProvider[]
    | Promise<AttachmentSelectProvider[]>;

  "editor:create"?: () => EditorProvider[] | Promise<EditorProvider[]>;

  "plugin:self:tabs:create"?: () => PluginTab[] | Promise<PluginTab[]>;

  "default:editor:extension:create"?: () =>
    | AnyExtension[]
    | Promise<AnyExtension[]>;

  "comment:subject-ref:create"?: () => CommentSubjectRefProvider[];

  "backup:tabs:create"?: () => BackupTab[] | Promise<BackupTab[]>;

  "plugin:installation:tabs:create"?: () =>
    | PluginInstallationTab[]
    | Promise<PluginInstallationTab[]>;

  "post:list-item:operation:create"?: (
    post: Ref<ListedPost>
  ) => OperationItem<ListedPost>[] | Promise<OperationItem<ListedPost>[]>;

  "plugin:list-item:operation:create"?: (
    plugin: Ref<Plugin>
  ) => OperationItem<Plugin>[] | Promise<OperationItem<Plugin>[]>;

  "backup:list-item:operation:create"?: (
    backup: Ref<Backup>
  ) => OperationItem<Backup>[] | Promise<OperationItem<Backup>[]>;

  "attachment:list-item:operation:create"?: (
    attachment: Ref<Attachment>
  ) => OperationItem<Attachment>[] | Promise<OperationItem<Attachment>[]>;

  "plugin:list-item:field:create"?: (
    plugin: Ref<Plugin>
  ) => EntityFieldItem[] | Promise<EntityFieldItem[]>;

  "post:list-item:field:create"?: (
    post: Ref<ListedPost>
  ) => EntityFieldItem[] | Promise<EntityFieldItem[]>;

  "theme:list:tabs:create"?: () => ThemeListTab[] | Promise<ThemeListTab[]>;

  "theme:list-item:operation:create"?: (
    theme: Ref<Theme>
  ) => OperationItem<Theme>[] | Promise<OperationItem<Theme>[]>;
}

export interface PluginModule {
  components?: Record<string, Component>;

  routes?: RouteRecordRaw[] | RouteRecordAppend[];

  ucRoutes?: RouteRecordRaw[] | RouteRecordAppend[];

  extensionPoints?: ExtensionPoint;
}
```

- `components`：组件列表，key 为组件名称，value 为组件对象，在此定义之后，加载插件时会自动注册到 Vue App 全局。
- `routes`：Console 控制台路由定义，详细文档可参考 [路由定义](../../api-reference/ui/route.md)
- `ucRoutes`：UC 个人中心路由定义，详细文档可参考 [路由定义](../../api-reference/ui/route.md)
- `extensionPoints`：扩展点定义，详细文档可参考 [扩展点](../../extension-points/ui/index.md)
