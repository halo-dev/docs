---
title: 默认编辑器
description: 扩展默认编辑器 - default:editor:extension:create
---

此扩展点用于扩展默认编辑器的功能。

## 类型定义

```ts
{
  "default:editor:extension:create"?: () => AnyExtension[] | Promise<AnyExtension[]>;
}
```

:::info 提示
AnyExtension 类型来自 [Tiptap](https://github.com/ueberdosis/tiptap)，这意味着 Halo 默认编辑器的扩展点返回类型与 Tiptap 的扩展完全一致，Tiptap 的扩展文档可参考：<https://tiptap.dev/docs/editor/api/extensions>。此外，Halo 也为默认编辑器的扩展提供了一些独有的参数，用于实现工具栏、指令等扩展。
:::

## 示例

// TODO

## 实现案例

- <https://github.com/halo-sigs/plugin-hybrid-edit-block>
- <https://github.com/halo-sigs/plugin-katex>
