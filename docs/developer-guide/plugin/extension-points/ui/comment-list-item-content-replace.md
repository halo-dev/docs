---
title: 替换评论内容显示
description: 使用 comment:list-item:content:replace 扩展点替换 Halo Console 中的评论和回复内容显示组件
---

此扩展点用于替换 Halo Console 中评论和回复的默认内容显示组件。替换后的组件会用于评论列表、回复列表和详情弹窗。

## 定义方式

```ts
import { definePlugin } from "@halo-dev/ui-shared";
import { markRaw } from "vue";
import CommentContent from "./components/CommentContent.vue";

export default definePlugin({
  extensionPoints: {
    "comment:list-item:content:replace": () => {
      return {
        component: markRaw(CommentContent),
      };
    },
  },
});
```

扩展点可以同步返回 Provider，也可以返回 `Promise<CommentContentProvider>`。如果多个插件提供此扩展点，Halo 使用插件加载顺序中的第一个 Provider。

## 组件约定

Provider 的 `component` 必须使用 `markRaw()` 包装。组件接收以下 Prop：

| 名称      | 类型     | 说明                       |
| --------- | -------- | -------------------------- |
| `content` | `string` | 评论或回复中保存的原始内容 |

评论内容可能由站点用户提交。如果组件通过 `v-html` 渲染内容，必须先进行 HTML 清理，不能直接渲染未经信任的输入。

```ts title="CommentContentProvider"
import type { Component, Raw } from "vue";

export interface CommentContentProvider {
  component: Raw<Component>;
}
```

## 实现案例

- [halo-dev/plugin-comment-widget](https://github.com/halo-dev/plugin-comment-widget)
