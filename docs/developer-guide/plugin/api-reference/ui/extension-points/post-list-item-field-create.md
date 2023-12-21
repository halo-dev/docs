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

此示例将添加一个显示文章 slug（别名）的字段。

```ts
import { definePlugin } from "@halo-dev/console-shared";
import { markRaw, type Ref } from "vue";
import type { ListedPost } from "@halo-dev/api-client";
import { VEntityField } from "@halo-dev/components";

export default definePlugin({
  extensionPoints: {
    "post:list-item:field:create": (post: Ref<ListedPost>) => {
      return [
        {
          priority: 0,
          position: "end",
          component: markRaw(VEntityField),
          props: {
            description: post.value.post.spec.slug,
          },
          permissions: [],
          hidden: false,
        },
      ];
    },
  },
});
```

## 类型定义

### ListedPost

```mdx-code-block
import ListedPost from "./interface/ListedPost.md";

<ListedPost />
```
