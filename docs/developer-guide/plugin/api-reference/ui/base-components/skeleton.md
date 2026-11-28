---
title: VSkeleton 骨架屏
description: 使用 VSkeleton 和 VSkeletonText 在 Halo 插件中展示加载占位，支持矩形、文字、圆形三种形状与闪烁、呼吸两种动画
---

数据还没返回时，用骨架屏先画出内容的大致轮廓，避免页面空白或跳动，加载完成后再替换为真实内容。

从 2.28.0 开始，`@halo-dev/components` 提供 `VSkeleton` 和 `VSkeletonText` 两个组件。`VSkeleton` 是单个占位块，`VSkeletonText` 把它组合成多行文字的占位。

## 引入

```ts
import { VSkeleton, VSkeletonText } from "@halo-dev/components";
```

## 示例

### 基础用法

不传尺寸时是一块宽 `100%`、高 `1rem` 的矩形，默认播放闪烁动画：

```vue preview
<script lang="ts" setup>
import { VSkeleton } from "@halo-dev/components";
</script>

<template>
  <VSkeleton class="max-w-xs" />
</template>
```

### 不同形状

`shape` 决定圆角与默认高度：`rect` 是直角矩形容器，`text` 表示一行文字，`circle` 用于头像和图标。

```vue preview
<script lang="ts" setup>
import { VSkeleton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start" class="max-w-xs">
    <VSkeleton width="100%" height="2.5rem" />
    <VSkeleton width="70%" shape="text" />
    <VSkeleton width="2.5rem" shape="circle" />
  </VSpace>
</template>
```

`circle` 只需要给一个尺寸：只传 `width` 时高度与宽度相同，只传 `height` 时宽度与高度相同，得到正圆。

### 尺寸

`width` 和 `height` 接受数字或 CSS 长度字符串。数字按像素处理，数字 `16` 等于 `"16px"`；字符串原样传给 CSS，可以直接写 `"40%"`、`"2.5rem"`。

```vue preview
<script lang="ts" setup>
import { VSkeleton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start" class="max-w-xs">
    <VSkeleton :height="8" width="100%" />
    <VSkeleton width="60%" height="1.25rem" />
    <VSkeleton width="8rem" height="0.75rem" />
  </VSpace>
</template>
```

组件默认样式使用零特异性选择器，普通 Tailwind 类就能覆盖宽度、圆角和颜色，例如 `class="rounded-full h-6 w-32"`。

### 动画

`animation` 取 `shimmer`（默认，从左向右扫过的高光）、`pulse`（整体明暗呼吸）或 `none`（静态色块）。

```vue preview
<script lang="ts" setup>
import { VSkeleton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start" class="max-w-xs">
    <VSkeleton width="100%" />
    <VSkeleton width="100%" animation="pulse" />
    <VSkeleton width="100%" animation="none" />
  </VSpace>
</template>
```

窗口宽度变化、列表滚动等频繁重绘的场景更适合 `pulse` 或 `none`，一屏多个骨架同时闪烁容易分散注意力。

### 多行文字占位

`VSkeletonText` 按行渲染文字骨架，默认 3 行，最后一行宽度为 `60%`：

```vue preview
<script lang="ts" setup>
import { VSkeletonText } from "@halo-dev/components";
</script>

<template>
  <VSkeletonText class="max-w-sm" />
</template>
```

用 `lines` 指定行数，`widths` 逐行指定宽度，也可以用 `lastLineWidth` 只调整最后一行：

```vue preview
<script lang="ts" setup>
import { VSkeletonText } from "@halo-dev/components";
</script>

<template>
  <VSkeletonText
    class="max-w-sm"
    :lines="4"
    :widths="['100%', '92%', '84%', '48%']"
  />
</template>
```

`lineHeight` 控制每行的粗细，`spacing` 控制行间距，默认分别是 `0.875rem` 和 `0.5rem`。

### 组合成卡片

复杂布局用基础块自己拼，不必等待预设。下面是一个「头像 + 标题 + 正文 + 按钮」的卡片骨架：

```vue preview
<script lang="ts" setup>
import { VSkeleton, VSkeletonText } from "@halo-dev/components";
</script>

<template>
  <div class="max-w-md rounded-base border border-gray-100 bg-white p-5">
    <div class="flex items-start gap-3">
      <VSkeleton width="2.5rem" shape="circle" />
      <div class="min-w-0 flex-1 space-y-2">
        <VSkeleton width="40%" height="0.875rem" />
        <VSkeleton width="24%" height="0.75rem" />
      </div>
    </div>
    <div class="mt-5">
      <VSkeletonText :lines="3" last-line-width="72%" />
    </div>
    <div class="mt-5 flex gap-2">
      <VSkeleton width="5rem" height="2rem" />
      <VSkeleton width="4rem" height="2rem" />
    </div>
  </div>
</template>
```

骨架的宽高、间距尽量与真实内容一致，替换时页面才不会跳动。

## Props

### VSkeleton

| 属性        | 类型                             | 默认值      | 说明                                         |
| ----------- | -------------------------------- | ----------- | -------------------------------------------- |
| `width`     | `number \| string`               | `undefined` | 宽度，数字按像素处理，字符串按 CSS 值处理    |
| `height`    | `number \| string`               | `undefined` | 高度，数字按像素处理，字符串按 CSS 值处理    |
| `shape`     | `"rect" \| "text" \| "circle"`   | `"rect"`    | 形状，`text` 用于单行文字，`circle` 用于头像 |
| `animation` | `"shimmer" \| "pulse" \| "none"` | `"shimmer"` | 动画效果                                     |
| `as`        | `string \| Component`            | `"div"`     | 渲染的根元素或组件                           |

### VSkeletonText

| 属性            | 类型                             | 默认值       | 说明                                                      |
| --------------- | -------------------------------- | ------------ | --------------------------------------------------------- |
| `lines`         | `number`                         | `3`          | 行数，小数会向下取整，负数按 `0` 处理                     |
| `widths`        | `(number \| string)[]`           | `[]`         | 逐行宽度，未提供的行用 `100%`，最后一行用 `lastLineWidth` |
| `lastLineWidth` | `number \| string`               | `"60%"`      | 最后一行宽度，`widths` 已提供该行时以 `widths` 为准       |
| `lineHeight`    | `number \| string`               | `"0.875rem"` | 每行的粗细                                                |
| `spacing`       | `number \| string`               | `"0.5rem"`   | 行间距                                                    |
| `animation`     | `"shimmer" \| "pulse" \| "none"` | `"shimmer"`  | 动画效果，逐行传递给 `VSkeleton`                          |
| `as`            | `string \| Component`            | `"div"`      | 渲染的根元素或组件                                        |

## CSS 变量

两个组件都暴露以下变量，可以在外层或元素上覆盖，例如 `<VSkeleton style="--v-skeleton-bg: #eef2ff">`：

| 变量                     | 默认值    | 说明                   |
| ------------------------ | --------- | ---------------------- |
| `--v-skeleton-bg`        | `#f3f4f6` | 骨架的基础颜色         |
| `--v-skeleton-highlight` | `#e5e7eb` | 闪烁动画扫过的高光颜色 |
| `--v-skeleton-duration`  | `1.25s`   | 闪烁动画一个周期的时长 |

## 无障碍

骨架块本身标记为 `aria-hidden`，屏幕阅读器不会读出占位内容。请不要只靠骨架表达状态，加载中的语义应由可见文字或容器的 `aria-busy` 提供，例如 [`VPageHeader`](./header.md) 的 `loading` 就会在根元素上设置 `aria-busy`。

用户在系统中开启「减弱动态效果」后，`shimmer` 和 `pulse` 自动停用，显示为静态色块。
