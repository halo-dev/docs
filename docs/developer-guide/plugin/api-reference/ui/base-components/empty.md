---
title: VEmpty 空状态
description: 使用 VEmpty 在 Halo 插件列表中展示无数据时的占位提示和引导操作，支持紧凑尺寸和纯文字模式
---

当列表或页面没有数据时，使用 `VEmpty` 展示友好的空状态提示，并提供下一步操作。

从 2.28.0 开始，`VEmpty` 新增 `size`、`showImage`、`imageAlt` 属性和 `#title` 插槽，并只渲染实际提供了内容的部分；不传这些属性时，默认外观与之前一致。

## 引入

```ts
import { VEmpty } from "@halo-dev/components";
```

从 2.28.0 开始还导出了尺寸类型 `EmptySize`（`"sm" | "md"`）。

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="暂无文章" message="创建一篇文章来填充这里的内容。" />
</template>
```

### 带操作按钮

```vue preview
<script lang="ts" setup>
import { VButton, VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="还没有插件" message="从应用市场安装插件来扩展功能。">
    <template #actions>
      <VButton type="primary">前往应用市场</VButton>
    </template>
  </VEmpty>
</template>
```

### 搜索无结果

```vue preview
<script lang="ts" setup>
import { VButton, VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="没有找到相关内容" message="试试更换关键词或清除筛选条件。">
    <template #actions>
      <VButton size="sm">清除筛选</VButton>
    </template>
  </VEmpty>
</template>
```

### 紧凑的纯文字空状态

在弹层、下拉面板等空间有限的位置，可以隐藏插图并使用小尺寸：

```vue preview
<script lang="ts" setup>
import { VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty title="暂无选项" size="sm" :show-image="false" />
</template>
```

### 自定义标题内容

`title` 属性接收纯文本，需要插入链接或其他元素时改用 `#title` 插槽：

```vue preview
<script lang="ts" setup>
import { VEmpty } from "@halo-dev/components";
</script>

<template>
  <VEmpty message="查看文档了解如何创建第一篇文章。">
    <template #title>
      <span>还没有文章</span>
    </template>
  </VEmpty>
</template>
```

## Props

| 属性        | 类型           | 默认值      | 说明                                                               |
| ----------- | -------------- | ----------- | ------------------------------------------------------------------ |
| `title`     | `string`       | `undefined` | 空状态标题，从 2.28.0 开始也可以用 `#title` 插槽                   |
| `message`   | `string`       | `undefined` | 补充说明                                                           |
| `image`     | `string`       | `undefined` | 自定义图片地址，默认使用内置插图                                   |
| `imageAlt`  | `string`       | `""`        | 插图的替代文本，从 2.28.0 开始支持；默认留空，因为内置插图仅作装饰 |
| `size`      | `"sm" \| "md"` | `"md"`      | 空状态尺寸，从 2.28.0 开始支持；`sm` 会缩小插图、间距和内边距      |
| `showImage` | `boolean`      | `true`      | 是否显示插图，从 2.28.0 开始支持；设为 `false` 得到纯文字空状态    |

## Slots

| 插槽      | 说明                                            |
| --------- | ----------------------------------------------- |
| `title`   | 标题内容，替换 `title` 文字，从 2.28.0 开始支持 |
| `image`   | 自定义插图                                      |
| `message` | 自定义补充说明                                  |
| `actions` | 操作区域，显示在说明下方                        |
