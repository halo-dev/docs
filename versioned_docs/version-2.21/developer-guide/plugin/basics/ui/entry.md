---
title: 入口文件
description: UI 扩展部分的入口文件
---

入口文件即 Halo 核心会加载的文件，所有插件有且只有一个入口文件，构建之后会放置在插件项目的 `src/resources/console` 下，名为 `main.js`。

为了方便开发者，我们已经在 [halo-dev/create-halo-plugin](https://github.com/halo-dev/create-halo-plugin) 配置好了基础项目结构，包括构建配置，后续文档也会以此为准。

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
import type { BackupTab } from "@/states/backup";
import type { CommentSubjectRefProvider } from "@/states/comment-subject-ref";
import type { EntityFieldItem } from "@/states/entity";
import type { OperationItem } from "@/states/operation";
import type { PluginInstallationTab } from "@/states/plugin-installation-tabs";
import type { ThemeListTab } from "@/states/theme-list-tabs";
import type { UserProfileTab, UserTab } from "@/states/user-tab";
import type {
  Attachment,
  Backup,
  ListedPost,
  Plugin,
  Theme,
  ListedComment,
  ListedReply,
  ListedSinglePage,
} from "@halo-dev/api-client";
import type { AnyExtension } from "@halo-dev/richtext-editor";
import type { Component, Ref } from "vue";
import type { RouteRecordName, RouteRecordRaw } from "vue-router";
import type {
  DashboardWidgetDefinition,
  DashboardWidgetQuickActionItem,
  EditorProvider,
  PluginTab,
} from "..";
import type { AttachmentSelectProvider } from "../states/attachment-selector";
import type { FunctionalPage } from "../states/pages";

export interface RouteRecordAppend {
  parentName: NonNullable<RouteRecordName>;
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
  ) => OperationItem<ListedPost>[];

  "single-page:list-item:operation:create"?: (
    singlePage: Ref<ListedSinglePage>
  ) => OperationItem<ListedSinglePage>[];

  "comment:list-item:operation:create"?: (
    comment: Ref<ListedComment>
  ) => OperationItem<ListedComment>[];

  "reply:list-item:operation:create"?: (
    reply: Ref<ListedReply>
  ) => OperationItem<ListedReply>[];

  "plugin:list-item:operation:create"?: (
    plugin: Ref<Plugin>
  ) => OperationItem<Plugin>[];

  "backup:list-item:operation:create"?: (
    backup: Ref<Backup>
  ) => OperationItem<Backup>[];

  "attachment:list-item:operation:create"?: (
    attachment: Ref<Attachment>
  ) => OperationItem<Attachment>[];

  "plugin:list-item:field:create"?: (plugin: Ref<Plugin>) => EntityFieldItem[];

  "post:list-item:field:create"?: (post: Ref<ListedPost>) => EntityFieldItem[];

  "single-page:list-item:field:create"?: (
    singlePage: Ref<ListedSinglePage>
  ) => EntityFieldItem[];

  "theme:list:tabs:create"?: () => ThemeListTab[] | Promise<ThemeListTab[]>;

  "theme:list-item:operation:create"?: (
    theme: Ref<Theme>
  ) => OperationItem<Theme>[];

  "user:detail:tabs:create"?: () => UserTab[] | Promise<UserTab[]>;

  "uc:user:profile:tabs:create"?: () =>
    | UserProfileTab[]
    | Promise<UserProfileTab[]>;

  "console:dashboard:widgets:create"?: () =>
    | DashboardWidgetDefinition[]
    | Promise<DashboardWidgetDefinition[]>;

  "console:dashboard:widgets:internal:quick-action:item:create"?: () =>
    | DashboardWidgetQuickActionItem[]
    | Promise<DashboardWidgetQuickActionItem[]>;
}

export interface PluginModule {
  /**
   * These components will be registered when plugin is activated.
   */
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
