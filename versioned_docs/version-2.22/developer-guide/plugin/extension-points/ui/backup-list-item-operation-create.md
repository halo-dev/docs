---
title: 备份数据列表操作菜单
description: 扩展备份数据列表操作菜单 - backup:list-item:operation:create
---

此扩展点用于扩展备份数据列表的操作菜单项。

![备份数据列表操作菜单](/img/developer-guide/plugin/extension-points/ui/backup-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "backup:list-item:operation:create": (
      backup: Ref<Backup>
    ): OperationItem<Backup>[] | Promise<OperationItem<Backup>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: Backup) => {
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
