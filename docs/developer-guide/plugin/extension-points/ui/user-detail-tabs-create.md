---
title: 用户详情选项卡
description: '使用 user:detail:tabs:create 为 Halo Console 用户详情页添加自定义选项卡，配置 Vue 面板和排序，并通过 user 属性读取所查看的用户信息'
---

此扩展点用于扩展用户详情页面的选项卡。

![用户详情选项卡](/img/developer-guide/plugin/extension-points/ui/user-detail-tabs-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "user:detail:tabs:create": (): UserTab[] | Promise<UserTab[]> => {
      return [
        {
          id: "foo",
          label: "foo",
          component: markRaw(FooComponent),
          priority: 20,
        },
      ];
    },
  },
});
```

```ts title="UserTab"
export interface UserTab {
  id: string;                 // 选项卡 ID
  label: string;              // 选项卡标题
  component: Raw<Component>;  // 选项卡面板组件
  priority: number;           // 排序优先级
}
```

其中，`component` 组件有以下实现要求：

1. 组件包含以下 props：
   1. `user:DetailedUser`：当前用户信息。
