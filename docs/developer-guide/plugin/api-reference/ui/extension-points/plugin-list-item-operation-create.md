---
title: 插件数据列表操作菜单
description: 扩展插件数据列表操作菜单 - plugin:list-item:operation:create
---

此扩展点用于扩展插件数据列表的操作菜单项。

![插件数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/plugin-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "plugin:list-item:operation:create": (
      plugin: Ref<Plugin>
    ): OperationItem<Plugin>[] | Promise<OperationItem<Plugin>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: Plugin) => {
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

## 实现案例

- <https://github.com/halo-dev/plugin-app-store>

## 类型定义

### Plugin

```mdx-code-block
import Plugin from "./interface/Plugin.md";

<Plugin />
```
