---
title: VAvatar 头像
description: 使用 VAvatar 和 VAvatarGroup 在 Halo 插件界面中展示用户或应用头像，支持尺寸、圆形、加载失败占位和头像组
---

头像用于展示用户、应用或站点的图片标识。`VAvatar` 在图片加载失败时会显示 `alt` 的首字母作为占位，`VAvatarGroup` 用于把多个头像组合在一起。

## 引入

```ts
import { VAvatar, VAvatarGroup } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VAvatar } from "@halo-dev/components";

const avatar = "https://www.halo.run/logo";
</script>

<template>
  <VAvatar :src="avatar" alt="Halo" />
</template>
```

### 不同尺寸

```vue preview
<script lang="ts" setup>
import { VAvatar, VSpace } from "@halo-dev/components";

const avatar = "https://www.halo.run/logo";
</script>

<template>
  <VSpace>
    <VAvatar :src="avatar" alt="Halo" size="xs" />
    <VAvatar :src="avatar" alt="Halo" size="sm" />
    <VAvatar :src="avatar" alt="Halo" size="md" />
    <VAvatar :src="avatar" alt="Halo" size="lg" />
  </VSpace>
</template>
```

### 圆形头像

```vue preview
<script lang="ts" setup>
import { VAvatar } from "@halo-dev/components";

const avatar = "https://www.halo.run/logo";
</script>

<template>
  <VAvatar :src="avatar" alt="Halo" circle />
</template>
```

### 无图片或加载失败

没有图片地址或图片无法加载时，会显示 `alt` 的首字母；没有 `alt` 时显示警告图标。

```vue preview
<script lang="ts" setup>
import { VAvatar, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VAvatar alt="Halo" />
    <VAvatar />
  </VSpace>
</template>
```

### 自定义尺寸

```vue preview
<script lang="ts" setup>
import { VAvatar } from "@halo-dev/components";

const avatar = "https://www.halo.run/logo";
</script>

<template>
  <VAvatar :src="avatar" alt="Halo" width="64px" height="64px" circle />
</template>
```

### 头像组

`VAvatarGroup` 会统一应用尺寸和形状，并让相邻头像产生重叠效果。

```vue preview
<script lang="ts" setup>
import { VAvatar, VAvatarGroup } from "@halo-dev/components";

const avatar = "https://www.halo.run/logo";
</script>

<template>
  <VAvatarGroup size="sm" circle>
    <VAvatar :src="avatar" alt="Halo" />
    <VAvatar :src="avatar" alt="Halo" />
    <VAvatar :src="avatar" alt="Halo" />
  </VAvatarGroup>
</template>
```

## VAvatar Props

| 属性     | 类型                           | 默认值      | 说明                                       |
| -------- | ------------------------------ | ----------- | ------------------------------------------ |
| `src`    | `string`                       | `undefined` | 图片地址                                   |
| `alt`    | `string`                       | `undefined` | 图片替代文本，加载失败时取其首字母作为占位 |
| `size`   | `"lg" \| "md" \| "sm" \| "xs"` | `"md"`      | 头像尺寸                                   |
| `width`  | `string`                       | `undefined` | 自定义宽度，优先级高于 `size`              |
| `height` | `string`                       | `undefined` | 自定义高度，优先级高于 `size`              |
| `circle` | `boolean`                      | `false`     | 是否显示为圆形                             |

## VAvatarGroup Props

| 属性     | 类型                           | 默认值      | 说明                                      |
| -------- | ------------------------------ | ----------- | ----------------------------------------- |
| `size`   | `"lg" \| "md" \| "sm" \| "xs"` | `"md"`      | 组内头像尺寸，会覆盖 `VAvatar` 的同名属性 |
| `width`  | `string`                       | `undefined` | 组内头像宽度                              |
| `height` | `string`                       | `undefined` | 组内头像高度                              |
| `circle` | `boolean`                      | `false`     | 组内头像是否显示为圆形                    |

## Slots

| 组件           | 插槽      | 说明     |
| -------------- | --------- | -------- |
| `VAvatarGroup` | `default` | 头像内容 |
