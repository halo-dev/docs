---
title: VStatusDot 状态点
description: 使用 VStatusDot 在 Halo 插件中展示运行状态，支持六种状态、尺寸、自定义颜色、无障碍名称和动画效果
---

`VStatusDot` 用一个小圆点表示状态，常用于展示插件、服务器或任务的运行情况。

从 2.28.0 开始，`VStatusDot` 新增 `info` 和 `processing` 状态，以及 `size`、`color`、`label`、`title` 属性；圆点本身对辅助技术隐藏，状态说明通过 `label` 或 `text` 提供。

## 引入

```ts
import { VStatusDot } from "@halo-dev/components";
```

## 示例

### 不同状态

```vue preview
<script lang="ts" setup>
import { VSpace, VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VStatusDot state="default" text="未知" />
    <VStatusDot state="success" text="运行中" />
    <VStatusDot state="warning" text="有警告" />
    <VStatusDot state="error" text="已停止" />
    <VStatusDot state="info" text="已暂停" />
    <VStatusDot state="processing" text="发布中" />
  </VSpace>
</template>
```

`info` 用于中性信息（例如已暂停、已归档待确认），`processing` 用于进行中的操作（例如发布中、恢复中），并自动带呼吸动画，无需再设置 `animate`。

### 动画效果

除 `processing` 状态外，其他状态可以通过 `animate` 单独开启呼吸动画：

```vue preview
<script lang="ts" setup>
import { VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VStatusDot state="success" animate text="正在运行" />
</template>
```

动画遵循系统的「减弱动态效果」设置，用户在操作系统中开启后，圆点不再播放动画。

### 不同尺寸

```vue preview
<script lang="ts" setup>
import { VSpace, VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VStatusDot size="sm" text="小尺寸" />
    <VStatusDot size="md" text="默认尺寸" />
  </VSpace>
</template>
```

### 自定义颜色

`color` 会覆盖状态自带颜色，支持任何 CSS 颜色值。它只改变颜色，语义仍由 `state` 决定：

```vue preview
<script lang="ts" setup>
import { VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VStatusDot state="default" color="#8B5CF6" text="自定义颜色" />
    <VStatusDot state="processing" color="#8B5CF6" text="自定义颜色的进行中" />
  </VSpace>
</template>
```

### 没有可见文字时的说明

当圆点旁不显示文字（例如放在列表项的标题后面）时，用 `label` 提供说明。`label` 同时是无障碍名称和悬停提示，屏幕阅读器和键盘用户都能获知它表示的状态：

```vue preview
<script lang="ts" setup>
import { VSpace, VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VStatusDot state="processing" label="发布中" />
    <VStatusDot state="warning" label="删除中" />
  </VSpace>
</template>
```

`label` 只在没有 `text` 或 `text` 插槽时输出到 DOM，避免同一句说明被朗读两次。若已经提供了可见文字，`label` 仅作为悬停提示使用。

### 自定义文字

```vue preview
<script lang="ts" setup>
import { VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VStatusDot state="warning">
    <template #text>
      <span class="text-xs text-orange-500">磁盘空间不足</span>
    </template>
  </VStatusDot>
</template>
```

## Props

| 属性      | 类型                                                                       | 默认值      | 说明                                                     |
| --------- | -------------------------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `state`   | `"default" \| "success" \| "warning" \| "error" \| "info" \| "processing"` | `"success"` | 状态类型，决定颜色；`processing` 自动播放动画            |
| `animate` | `boolean`                                                                  | `false`     | 是否显示呼吸动画                                         |
| `text`    | `string`                                                                   | `undefined` | 圆点旁的状态文字                                         |
| `size`    | `"sm" \| "md"`                                                             | `"md"`      | 圆点尺寸                                                 |
| `color`   | `string`                                                                   | `undefined` | 自定义颜色，覆盖 `state` 对应的颜色                      |
| `label`   | `string`                                                                   | `undefined` | 无障碍名称，同时作为悬停提示；没有可见文字时才输出到 DOM |
| `title`   | `string`                                                                   | `undefined` | 浏览器原生 `title` 属性，用于需要原生提示的场景          |

`size`、`color`、`label`、`title` 从 2.28.0 开始提供。

## Slots

| 插槽   | 说明           |
| ------ | -------------- |
| `text` | 自定义状态文字 |

## 无障碍

- 圆点本身带有 `aria-hidden="true"`，状态由可见文字、`label` 或调用方提供的 `v-tooltip` 传达，不要只用颜色表示状态。
- `state` 的颜色通过 `--status-dot-color` 变量输出，需要整体调整配色时可以在外层覆盖该变量。
- 警告状态使用满足非文本对比度要求的颜色；动画会遵循 `prefers-reduced-motion`。
