---
title: 替换评论编辑器
description: 使用 comment:editor:replace 扩展点替换 Halo Console 中的默认评论和回复编辑器
---

此扩展点用于替换 Halo Console 中的默认评论和回复编辑器，适合需要支持富文本、Markdown 或其他自定义内容格式的插件。

## 定义方式

```ts
import { definePlugin } from "@halo-dev/ui-shared";
import { markRaw } from "vue";
import CommentEditor from "./components/CommentEditor.vue";

export default definePlugin({
  extensionPoints: {
    "comment:editor:replace": () => {
      return {
        component: markRaw(CommentEditor),
      };
    },
  },
});
```

扩展点可以同步返回 Provider，也可以返回 `Promise<CommentEditorProvider>`。如果多个插件提供此扩展点，Halo 使用插件加载顺序中的第一个 Provider。

## 组件约定

Provider 的 `component` 必须使用 `markRaw()` 包装。组件需要遵循以下输入和输出约定：

| 类型 | 名称        | 说明                                                                            |
| ---- | ----------- | ------------------------------------------------------------------------------- |
| Prop | `autoFocus` | 可选的 `boolean`，为 `true` 时应在组件挂载后聚焦编辑器                           |
| Emit | `update`    | 内容变化时发送 `{ content: string; characterCount: number }`                    |

`content` 是最终提交给评论或回复 API 的内容，`characterCount` 是当前内容的字符数。

```ts title="CommentEditorProvider"
import type { Component, Raw } from "vue";

export interface CommentEditorProvider {
  component: Raw<Component>;
}
```

## 实现案例

- [halo-dev/plugin-comment-widget](https://github.com/halo-dev/plugin-comment-widget)
