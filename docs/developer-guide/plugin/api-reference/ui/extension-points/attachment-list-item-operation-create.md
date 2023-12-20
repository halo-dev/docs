---
title: 附件数据列表操作菜单
description: 扩展附件数据列表操作菜单 - attachment:list-item:operation:create
---

此扩展点用于扩展附件数据列表的操作菜单项。

![附件数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/attachment-list-item-operation-create.png)

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
          component: markRaw<VDropdownItem>,
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

```ts title="OperationItem"
export interface OperationItem<T> {
  priority: number;
  component: Raw<Component>;
  props?: Record<string, unknown>;
  action?: (item?: T) => void;
  label?: string;
  hidden?: boolean;
  permissions?: string[];
  children?: OperationItem<T>[];
}
```

## 实现案例

- <https://github.com/halo-dev/plugin-s3>
