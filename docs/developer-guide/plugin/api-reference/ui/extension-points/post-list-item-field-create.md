---
title: 文章数据列表显示字段
description: 扩展文章数据列表显示字段 - plugin:list-item:field:create
---

此扩展点用于扩展文章数据列表的显示字段。

![文章数据列表显示字段](/img/developer-guide/plugin/api-reference/ui/extension-points/post-list-item-field-create.png)

## 类型定义

```ts
{
  "plugin:list-item:field:create"?: (
    plugin: Ref<Plugin>
  ) => EntityFieldItem[] | Promise<EntityFieldItem[]>;
}
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
