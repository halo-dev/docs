---
title: 插件数据列表显示字段
description: 扩展插件数据列表显示字段 - plugin:list-item:field:create
---

此扩展点用于扩展插件数据列表的显示字段。

![插件数据列表显示字段](/img/developer-guide/plugin/api-reference/ui/extension-points/plugin-list-item-field-create.png)

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
  props?: Record<string, unknown>;
  permissions?: string[];
  hidden?: boolean;
}
```

## 示例

## 实现案例

- <https://github.com/halo-dev/plugin-app-store>
