---
title: 插件数据列表显示字段
description: 扩展插件数据列表显示字段 - plugin:list-item:field:create
---

此扩展点用于扩展插件数据列表的显示字段。

![插件数据列表显示字段](/img/developer-guide/plugin/extension-points/ui/plugin-list-item-field-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "plugin:list-item:field:create": (plugin: Ref<Plugin>): EntityFieldItem[] | Promise<EntityFieldItem[]> => {
      return [
        {
          priority: 0,
          position: "start",
          component: markRaw(FooComponent),
          props: {},
          permissions: [],
          hidden: false,
        }
      ];
    },
  },
});
```

```ts title="EntityFieldItem"
export interface EntityFieldItem {
  priority: number;
  position: "start" | "end";
  component: Raw<Component>;
  props?: Record\<string, unknown\>;
  permissions?: string[];
  hidden?: boolean;
}
```

## 示例

此示例将添加一个显示插件 requires（版本要求）的字段。

```ts
import { definePlugin } from "@halo-dev/console-shared";
import { markRaw, type Ref } from "vue";
import type { Plugin } from "@halo-dev/api-client";
import { VEntityField } from "@halo-dev/components";

export default definePlugin({
  extensionPoints: {
    "plugin:list-item:field:create": (plugin: Ref<Plugin>) => {
      return [
        {
          priority: 0,
          position: "end",
          component: markRaw(VEntityField),
          props: {
            description: plugin.value.spec.requires,
          },
          permissions: [],
          hidden: false,
        },
      ];
    },
  },
});
```

## 实现案例

- [https://github.com/halo-dev/plugin-app-store](https://github.com/halo-dev/plugin-app-store)

## 类型定义

### Plugin

```mdx-code-block
import Plugin from "./interface/Plugin.md";

<Plugin />
```
