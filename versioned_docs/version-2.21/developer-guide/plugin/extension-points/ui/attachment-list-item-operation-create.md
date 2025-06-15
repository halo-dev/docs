---
title: 附件数据列表操作菜单
description: 扩展附件数据列表操作菜单 - attachment:list-item:operation:create
---

此扩展点用于扩展附件数据列表的操作菜单项。

![附件数据列表操作菜单](/img/developer-guide/plugin/extension-points/ui/attachment-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "attachment:list-item:operation:create": (
      attachment: Ref<Attachment>
    ): OperationItem<Attachment>[] | Promise<OperationItem<Attachment>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: Attachment) => {
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

此示例将实现一个下载附件到本地的操作菜单项。

```ts
import { definePlugin, type OperationItem } from "@halo-dev/console-shared";
import { Toast, VDropdownItem } from "@halo-dev/components";
import { markRaw, type Ref } from "vue";
import type { Attachment } from "@halo-dev/api-client";

export default definePlugin({
  extensionPoints: {
    "attachment:list-item:operation:create": (
      attachment: Ref<Attachment>
    ): OperationItem<Attachment>[] | Promise<OperationItem<Attachment>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: Attachment) => {
            if (!item?.status?.permalink) {
              Toast.error("该附件没有下载地址");
              return;
            }

            const a = document.createElement("a");
            a.href = item.status.permalink;
            a.download = item?.spec.displayName || item.metadata.name;
            a.click();
          },
          label: "下载",
          hidden: false,
          permissions: [],
          children: [],
        },
      ];
    },
  },
});

```

## 实现案例

- [https://github.com/halo-dev/plugin-s3](https://github.com/halo-dev/plugin-s3)

## 类型定义

### Attachment

```mdx-code-block
import Attachment from "./interface/Attachment.md";

<Attachment />
```
