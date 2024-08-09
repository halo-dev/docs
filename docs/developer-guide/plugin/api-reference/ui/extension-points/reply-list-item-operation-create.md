---
title: 回复数据列表操作菜单
description: 扩展回复数据列表操作菜单 - reply:list-item:operation:create
---

此扩展点用于扩展回复数据列表的操作菜单项。

![回复数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/reply-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "reply:list-item:operation:create": (
      reply: Ref<ListedReply>
    ): OperationItem<ListedReply>[] | Promise<OperationItem<ListedReply>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: ListedReply) => {
            // do something
          },
          label: "foo",
          hidden: false,
          permissions: [],
          children: [],
        },
      ];
    },
  },
});
```

```mdx-code-block
import OperationItem from "./interface/OperationItem.md";

<OperationItem />
```

## 示例

此示例将实现一个操作菜单项。

```ts
import type { ListedReply } from "@halo-dev/api-client";
import { VDropdownItem } from "@halo-dev/components";
import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";

export default definePlugin({
  extensionPoints: {
    "reply:list-item:operation:create": () => {
      return [
        {
          priority: 21,
          component: markRaw(VDropdownItem),
          label: "测试回复菜单",
          visible: true,
          permissions: [],
          action: async (reply: ListedReply) => {
            console.log(reply)
          },
        },
      ];
    },
  },
});
```

## 类型定义

### ListedReply

```mdx-code-block
import ListedReply from "./interface/ListedReply.md";

<ListedReply />
```
