---
title: 评论数据列表操作菜单
description: 扩展评论数据列表操作菜单 - comment:list-item:operation:create
---

此扩展点用于扩展评论数据列表的操作菜单项。

![评论数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/comment-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "comment:list-item:operation:create": (
      comment: Ref<ListedComment>
    ): OperationItem<ListedComment>[] | Promise<OperationItem<ListedComment>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: ListedComment) => {
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
import type { ListedComment } from "@halo-dev/api-client";
import { VDropdownItem } from "@halo-dev/components";
import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";

export default definePlugin({
  extensionPoints: {
    "comment:list-item:operation:create": () => {
      return [
        {
          priority: 21,
          component: markRaw(VDropdownItem),
          label: "测试评论菜单",
          visible: true,
          permissions: [],
          action: async (comment: ListedComment) => {
            console.log(comment)
          },
        },
      ];
    },
  },
});
```

## 类型定义

### ListedComment

```mdx-code-block
import ListedComment from "./interface/ListedComment.md";

<ListedComment />
```
