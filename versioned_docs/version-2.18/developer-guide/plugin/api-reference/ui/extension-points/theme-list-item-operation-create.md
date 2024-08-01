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
          component: markRaw(VDropdownItem),
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

此示例将实现一个跳转到前台预览主题的操作菜单项。

```ts
import { definePlugin, type OperationItem } from "@halo-dev/console-shared";
import { VButton } from "@halo-dev/components";
import { markRaw, type Ref } from "vue";
import type { Theme } from "@halo-dev/api-client";

export default definePlugin({
  extensionPoints: {
    "theme:list-item:operation:create": (
      theme: Ref<Theme>
    ): OperationItem<Theme>[] | Promise<OperationItem<Theme>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VButton),
          props: {
            size: "sm",
          },
          action: (item?: Theme) => {
            window.open(`/?preview-theme=${item?.metadata.name}`);
          },
          label: "前台预览",
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

- <https://github.com/halo-dev/plugin-app-store>

## 类型定义

### Theme

```mdx-code-block
import Theme from "./interface/Theme.md";

<Theme />
```
