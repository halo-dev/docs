---
title: 个人资料选项卡
description: 扩展个人中心的个人资料选项卡 - uc:user:profile:tabs:create
---

此扩展点用于扩展个人中心的个人资料选项卡。

![个人资料选项卡](/img/developer-guide/plugin/extension-points/ui/uc-user-profile-tabs-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "uc:user:profile:tabs:create": (): UserProfileTab[] | Promise<UserProfileTab[]> => {
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

```ts title="UserProfileTab"
export interface UserProfileTab {
  id: string;                 // 选项卡 ID
  label: string;              // 选项卡标题
  component: Raw<Component>;  // 选项卡面板组件
  priority: number;           // 排序优先级
}
```

其中，`component` 组件有以下实现要求：

1. 组件包含以下 props：
   1. `user:DetailedUser`：当前用户信息。
