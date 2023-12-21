---
title: 主题数据列表操作菜单
description: 扩展主题数据列表操作菜单 - theme:list-item:operation:create
---

此扩展点用于扩展主题数据列表的操作菜单项。

![主题数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/theme-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "theme:list-item:operation:create": (
      theme: Ref<Theme>
    ): OperationItem<Theme>[] | Promise<OperationItem<Theme>[]> => {
      return [
        {
          priority: 10,
          component: markRaw<VDropdownItem>,
          props: {},
          action: (item?: Theme) => {
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

## 实现案例

- <https://github.com/halo-dev/plugin-app-store>
