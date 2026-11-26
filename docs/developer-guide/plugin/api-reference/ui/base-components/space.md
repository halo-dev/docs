---
title: VSpace 间距
description: 使用 VSpace 在 Halo 插件中控制一组元素的间距、排列方向、分布、换行与子元素填充
---

`VSpace` 用于给一组元素设置统一的间距，避免手动添加 margin。

从 2.28.0 开始，`VSpace` 支持自定义数值间距、分布方式、换行、块级布局、子元素等分填充和自定义根元素；不传这些属性时，渲染结果与之前一致。

## 引入

```ts
import { VSpace } from "@halo-dev/components";
```

## 示例

### 水平排列

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace>
    <VButton>按钮</VButton>
    <VButton>按钮</VButton>
    <VButton>按钮</VButton>
  </VSpace>
</template>
```

### 垂直排列

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VButton>第一个按钮</VButton>
    <VButton>第二个按钮</VButton>
    <VButton>第三个按钮</VButton>
  </VSpace>
</template>
```

### 不同间距

预设间距从小到大依次为 `xs`、`sm`、`md`、`lg`、`xl`、`2xl`，对应 10、12、16、20、24、32 像素，其中 `xl` 和 `2xl` 从 2.28.0 开始提供。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VSpace spacing="xs">
      <VButton size="sm">xs</VButton>
      <VButton size="sm">xs</VButton>
    </VSpace>
    <VSpace spacing="sm">
      <VButton size="sm">sm</VButton>
      <VButton size="sm">sm</VButton>
    </VSpace>
    <VSpace spacing="md">
      <VButton size="sm">md</VButton>
      <VButton size="sm">md</VButton>
    </VSpace>
    <VSpace spacing="lg">
      <VButton size="sm">lg</VButton>
      <VButton size="sm">lg</VButton>
    </VSpace>
    <VSpace spacing="xl">
      <VButton size="sm">xl</VButton>
      <VButton size="sm">xl</VButton>
    </VSpace>
    <VSpace spacing="2xl">
      <VButton size="sm">2xl</VButton>
      <VButton size="sm">2xl</VButton>
    </VSpace>
  </VSpace>
</template>
```

### 自定义间距

从 2.28.0 开始，`spacing` 也可以直接传入像素数字，或传入 `[水平间距, 垂直间距]` 数组，分别控制列间距与行间距。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start">
    <VSpace :spacing="6">
      <VTag>数字间距</VTag>
      <VTag>6px</VTag>
    </VSpace>
    <VSpace :spacing="[16, 4]" direction="column" align="start">
      <VTag>水平 16px</VTag>
      <VTag>垂直 4px</VTag>
    </VSpace>
  </VSpace>
</template>
```

### 对齐方式

`align` 控制交叉轴对齐方式，从 2.28.0 开始还支持 `baseline`。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace align="start">
    <VButton size="lg">大按钮</VButton>
    <VButton size="sm">小按钮</VButton>
  </VSpace>
</template>
```

### 分布方式

从 2.28.0 开始，`justify` 控制主轴上的分布方式，常用 `between` 把两端的内容撑开。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace block justify="between" class="w-full">
    <span class="text-sm text-gray-600">共 12 篇文章</span>
    <VButton size="sm">刷新</VButton>
  </VSpace>
</template>
```

### 换行

从 2.28.0 开始，`wrap` 让子元素在空间不足时换行，配合 `[水平, 垂直]` 数组间距可以单独调整行间距。

```vue preview
<script lang="ts" setup>
import { VSpace, VTag } from "@halo-dev/components";
</script>

<template>
  <div class="w-48">
    <VSpace wrap :spacing="[8, 4]">
      <VTag>标签</VTag>
      <VTag>标签</VTag>
      <VTag>标签</VTag>
      <VTag>标签</VTag>
      <VTag>标签</VTag>
      <VTag>标签</VTag>
    </VSpace>
  </div>
</template>
```

### 子元素等分宽度

从 2.28.0 开始，`fill` 让直接子元素等分可用宽度，适合底部并排的操作按钮。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace block fill class="w-full">
    <VButton>取消</VButton>
    <VButton type="primary">保存</VButton>
  </VSpace>
</template>
```

### 自定义根元素

从 2.28.0 开始，`as` 可以指定根元素或组件，例如把一组链接渲染为 `nav`；不传时仍然是 `div`。

```vue preview
<script lang="ts" setup>
import { VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace as="nav" direction="column" align="start">
    <a class="text-primary" href="#posts">文章</a>
    <a class="text-primary" href="#pages">页面</a>
    <a class="text-primary" href="#comments">评论</a>
  </VSpace>
</template>
```

## 覆盖间距变量

从 2.28.0 开始，间距通过 `--v-space-gap-x`（列间距）和 `--v-space-gap-y`（行间距）两个 CSS 变量设置，可以在外层用类或内联样式覆盖，不需要 `!important`。

```vue preview
<script lang="ts" setup>
import { VButton, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column" align="start" style="--v-space-gap-y: 6px">
    <VButton size="sm">第一行</VButton>
    <VButton size="sm">第二行</VButton>
  </VSpace>
</template>
```

## Props

| 属性        | 类型                                                                          | 默认值      | 说明                                                                                                                                                         |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spacing`   | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| number \| [number, number]` | `"xs"`      | 元素间距：预设值对应 10、12、16、20、24、32 像素，数字按像素处理，数组为 `[水平, 垂直]`；数字、数组、`xl` 和 `2xl` 从 2.28.0 开始支持，未知预设值回退到 `xs` |
| `direction` | `"row" \| "column"`                                                           | `"row"`     | 排列方向                                                                                                                                                     |
| `align`     | `"start" \| "end" \| "center" \| "stretch" \| "baseline"`                     | `"center"`  | 交叉轴对齐方式，`baseline` 从 2.28.0 开始支持                                                                                                                |
| `justify`   | `"start" \| "end" \| "center" \| "between" \| "around" \| "evenly"`           | `undefined` | 主轴分布方式，从 2.28.0 开始支持                                                                                                                             |
| `wrap`      | `boolean`                                                                     | `false`     | 空间不足时是否换行，从 2.28.0 开始支持                                                                                                                       |
| `block`     | `boolean`                                                                     | `false`     | 使用块级 `flex` 而不是 `inline-flex`，从 2.28.0 开始支持                                                                                                     |
| `fill`      | `boolean`                                                                     | `false`     | 直接子元素等分可用宽度，从 2.28.0 开始支持                                                                                                                   |
| `as`        | `string \| Component`                                                         | `"div"`     | 根元素或组件，例如 `"ul"`、`"nav"`，从 2.28.0 开始支持                                                                                                       |

## Slots

| 插槽      | 说明               |
| --------- | ------------------ |
| `default` | 需要设置间距的元素 |
