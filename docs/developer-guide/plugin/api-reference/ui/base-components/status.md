---
title: VStatusDot 状态点
description: 使用 VStatusDot 在 Halo 插件中展示运行状态，支持不同颜色、文字说明和动画效果
---

`VStatusDot` 用一个小圆点表示状态，常用于展示插件、服务器或任务的运行情况。

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
  </VSpace>
</template>
```

### 动画效果

```vue preview
<script lang="ts" setup>
import { VStatusDot } from "@halo-dev/components";
</script>

<template>
  <VStatusDot state="success" animate text="正在运行" />
</template>
```

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

| 属性      | 类型                                             | 默认值      | 说明             |
| --------- | ------------------------------------------------ | ----------- | ---------------- |
| `state`   | `"default" \| "success" \| "warning" \| "error"` | `"success"` | 状态类型         |
| `animate` | `boolean`                                        | `false`     | 是否显示呼吸动画 |
| `text`    | `string`                                         | `undefined` | 状态文字         |

## Slots

| 插槽   | 说明           |
| ------ | -------------- |
| `text` | 自定义状态文字 |
