---
title: 路由定义
description: 通过插件为 Console 控制台和 UC 个人中心添加新路由
---

Halo 为插件提供了为 Console 控制台和 UC 个人中心添加新路由的入口，可以用于为插件单独提供一个页面。

此文档将介绍如何定义路由以及侧边菜单项。

## 定义方式

Console 控制台和 UC 个人中心的路由定义基本和 Vue Router 官方的保持一致，为了区分 Console 控制台和 UC 个人中心的路由，Halo 为插件提供了两个不同的路由定义入口。

- `routes`：Console 控制台路由定义
- `ucRoutes`：UC 个人中心路由定义

```ts
import HomeView from "./views/HomeView.vue"
import { IconComputer } from "@halo-dev/components";

export default definePlugin({
  routes: [                                 // Console 控制台路由定义
    {
      parentName: "Root",
      route: {
        path: "/foo",
        name: "Foo",
        component: HomeView,
        meta: {
          permissions: [""],
          menu: {
            name: "Foo",
            group: "content",
            icon: markRaw(IconComputer),
            priority: 40
          },
        },
      },
    },
  ],
  ucRoutes: [                               // UC 个人中心路由定义
    {
      parentName: "Root",
      route: {
        path: "/uc-foo",
        name: "FooUC",
        component: HomeView,
        meta: {
          permissions: [""],
          menu: {
            name: "FooUC",
            group: "content",
            icon: markRaw(IconComputer),
            priority: 40
          },
        },
      },
    },
  ]
});
```

## 类型定义

```ts
{
  routes?: RouteRecordRaw[] | RouteRecordAppend[];
  ucRoutes?: RouteRecordRaw[] | RouteRecordAppend[];
}
```

```ts
export interface RouteRecordAppend {
  parentName: RouteRecordName;
  route: RouteRecordRaw;
}
```

- `parentName`：父路由名称，主要用于确认页面 Layout，如果想要添加到顶级路由，可以设置为 `Root`。如果不需要设置父路由，可以完全使用 `RouteRecordRaw` 定义。此外，如果同时设置了 `parentName` 以及其下路由设置了 `meta.menu`，那么此路由的菜单项将成为父菜单的子菜单项，可支持的父路由名称如下：
  - Console：
    - `AttachmentsRoot`（附件）
    - `CommentsRoot`（评论）
    - `SinglePagesRoot`（页面）
    - `PostsRoot`（文章）
    - `MenusRoot`（菜单）
    - `ThemeRoot`（主题）
    - `OverviewRoot`（概览）
    - `BackupRoot`（备份）
    - `PluginsRoot`（插件）
    - `SettingsRoot`（设置）
    - `UsersRoot`（用户）
    - `ToolsRoot`（工具）
  - UC：
    - `PostsRoot`（文章）
    - `NotificationsRoot`（消息）

:::info 提示
`RouteRecordRaw` 来自 Vue Router，详见 [API 文档 | Vue Router](https://router.vuejs.org/zh/api/#Type-Aliases-RouteRecordRaw)
:::

此外，为了方便插件在 Console 控制台和 UC 个人中心添加菜单项等操作，Halo 为 `RouteRecordRaw` 添加了 `meta` 属性，该属性为 `RouteMeta` 类型，定义如下：

```ts
interface RouteMeta {
  title?: string;               // 浏览器标题
  searchable?: boolean;         // 是否可以在 Console 的全局搜索中搜索到
  permissions?: string[];       // UI 权限
  menu?: {                      // 侧边菜单配置
    name: string;               // 菜单名称
    group?: CoreMenuGroupId;    // 内置菜单分组 ID，如果不使用内置的分组，也可以直接填写分组名称
    icon?: Component;           // 菜单图标，类型为 Vue 组件，推荐使用 https://github.com/unplugin/unplugin-icons
    priority: number;           // 菜单项排序，数字越小越靠前
    mobile?: boolean;           // 是否在移动端显示
  };
}
```

```ts
export type CoreMenuGroupId = "dashboard" | "content" | "interface" | "system" | "tool";
```
