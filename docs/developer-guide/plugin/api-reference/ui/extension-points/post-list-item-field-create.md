---
title: 文章数据列表显示字段
description: 扩展文章数据列表显示字段 - plugin:list-item:field:create
---

此扩展点用于扩展文章数据列表的显示字段。

![文章数据列表显示字段](/img/developer-guide/plugin/api-reference/ui/extension-points/post-list-item-field-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "post:list-item:field:create": (post: Ref<ListedPost>): EntityFieldItem[] | Promise<EntityFieldItem[]> => {
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
