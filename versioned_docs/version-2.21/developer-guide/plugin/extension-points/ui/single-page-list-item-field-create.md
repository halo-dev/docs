---
title: 页面数据列表显示字段
description: 扩展页面数据列表显示字段 - single-page:list-item:field:create
---

此扩展点用于扩展页面数据列表的显示字段。

![页面数据列表显示字段](/img/developer-guide/plugin/extension-points/ui/single-page-list-item-field-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "single-page:list-item:field:create": (singlePage: Ref<ListedSinglePage>): EntityFieldItem[] | Promise<EntityFieldItem[]> => {
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

此示例将添加一个显示页面 slug（别名）的字段。

```ts
import { definePlugin } from "@halo-dev/console-shared";
import { markRaw, type Ref } from "vue";
import type { ListedSinglePage } from "@halo-dev/api-client";
import { VEntityField } from "@halo-dev/components";

export default definePlugin({
  extensionPoints: {
    "single-page:list-item:field:create": (singlePage: Ref<ListedSinglePage>) => {
      return [
        {
          priority: 0,
          position: "end",
          component: markRaw(VEntityField),
          props: {
            description: singlePage.value.page.spec.slug,
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

### ListedSinglePage

```mdx-code-block
import ListedSinglePage from "./interface/ListedSinglePage.md";

<ListedSinglePage />
```
