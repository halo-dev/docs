---
title: VDescription 描述列表
description: 使用 VDescription 和 VDescriptionItem 在 Halo 插件界面中以键值对形式展示详情信息，支持多列、垂直与行内布局、尺寸、边框表格、标题区和空值兜底
---

描述列表用于以“标签 - 内容”的形式展示对象的详细信息，常用于详情页和侧边信息面板。

从 2.28.0 开始，`VDescription` 支持多列网格、垂直与行内布局、尺寸、边框表格、标题区，以及标签宽度、对齐和空值兜底；不传这些属性时，渲染结果与之前一致。

## 引入

```ts
import { VDescription, VDescriptionItem } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription>
      <VDescriptionItem label="名称" content="Halo" />
      <VDescriptionItem label="版本" content="2.27.0" />
      <VDescriptionItem label="运行状态" content="正常" />
    </VDescription>
  </div>
</template>
```

### 自定义内容

`VDescriptionItem` 的默认插槽优先级高于 `content` 属性，可以在内容中放置标签、链接等富文本。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem, VTag } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription>
      <VDescriptionItem label="插件状态">
        <VTag theme="primary">已启用</VTag>
      </VDescriptionItem>
      <VDescriptionItem label="开发者">
        <a class="text-primary" href="https://www.halo.run" target="_blank">
          Halo 团队
        </a>
      </VDescriptionItem>
    </VDescription>
  </div>
</template>
```

### 多列布局

`columns` 取 `1` 到 `12`，超出范围会被限制在边界内。列数大于 `1` 时，从 `sm` 断点起使用网格布局，窄屏仍然单列显示。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <VDescription :columns="2" bordered>
    <VDescriptionItem label="名称" content="Halo" />
    <VDescriptionItem label="版本" content="2.28.0" />
    <VDescriptionItem label="运行状态" content="正常" />
    <VDescriptionItem label="安装方式" content="Docker" />
  </VDescription>
</template>
```

`VDescriptionItem` 的 `span` 可以让某一项跨越多列，取值会被限制在 `1` 到 `columns` 之间，只在网格布局中生效。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <VDescription :columns="3" bordered>
    <VDescriptionItem label="文章标题" content="Halo 2.28.0 发布" :span="2" />
    <VDescriptionItem label="作者" content="Halo 团队" />
    <VDescriptionItem label="摘要" :span="3">
      这一版带来新的基础组件和若干问题修复。
    </VDescriptionItem>
  </VDescription>
</template>
```

### 布局方式

`layout` 支持三种取值：

- `horizontal`（默认）：标签与内容左右排列，窄屏时标签在上。
- `vertical`：标签在上、内容在下。
- `inline`：标签和内容在同一行内依次排列，用 `separator` 分隔，适合展示较短的属性。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription layout="vertical">
      <VDescriptionItem label="插件名称" content="plugin-comment-widget" />
      <VDescriptionItem label="说明">
        为 Halo 提供独立的评论组件，支持嵌入到任意页面。
      </VDescriptionItem>
    </VDescription>
  </div>
</template>
```

行内布局默认使用冒号分隔，可以用 `separator` 换成其他字符，传空字符串则不显示分隔符。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription layout="inline">
      <VDescriptionItem label="版本" content="2.28.0" />
      <VDescriptionItem label="作者" content="Halo" />
      <VDescriptionItem label="许可证" content="GPL-3.0" />
    </VDescription>
  </div>
</template>
```

### 尺寸

`size` 控制每一项的内边距和字号，可选 `xs`、`sm`、`md`（默认）和 `lg`。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="space-y-4">
    <VDescription size="xs" bordered>
      <VDescriptionItem label="站点名称" content="Halo" />
      <VDescriptionItem label="站点地址" content="https://www.halo.run" />
    </VDescription>
    <VDescription size="lg" bordered>
      <VDescriptionItem label="站点名称" content="Halo" />
      <VDescriptionItem label="站点地址" content="https://www.halo.run" />
    </VDescription>
  </div>
</template>
```

### 边框表格

`bordered` 会把描述项渲染成带边框的表格样式，标签列使用浅色背景，适合字段较多、需要横向对齐的详情页。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <VDescription :columns="2" bordered>
    <VDescriptionItem label="名称" content="Halo" />
    <VDescriptionItem label="版本" content="2.28.0" />
    <VDescriptionItem label="仓库" content="halo-dev/halo" :span="2" />
  </VDescription>
</template>
```

### 标题区

传入 `title` 或在 `#title` 插槽中提供内容，会在描述列表上方显示标题区；`#extra` 插槽用于放置标题右侧的操作。

```vue preview
<script lang="ts" setup>
import { VButton, VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription title="站点信息">
      <template #extra>
        <VButton size="sm">编辑</VButton>
      </template>
      <VDescriptionItem label="名称" content="Halo" />
      <VDescriptionItem label="地址" content="https://www.halo.run" />
    </VDescription>
  </div>
</template>
```

### 标签宽度与对齐

在横向布局中，`labelWidth` 用于固定标签列的宽度，数字按像素处理，也可以传入 `12rem` 这样的 CSS 长度。`align` 控制标签和内容的对齐方式，`verticalCenter` 让标签与内容垂直居中。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription :label-width="140" bordered>
      <VDescriptionItem label="插件名称" content="plugin-comment-widget" />
      <VDescriptionItem label="开发者" content="Halo 团队" />
      <VDescriptionItem label="说明" vertical-center>
        为 Halo 提供独立的评论组件。
      </VDescriptionItem>
    </VDescription>
  </div>
</template>
```

### 空值兜底

内容为 `undefined`、`null` 或空字符串时，`VDescriptionItem` 会显示 `emptyText`，没有设置则留空。该属性可以写在 `VDescription` 上作为默认值，也可以单独写在某一项上。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <div class="overflow-hidden rounded-base border border-gray-100 bg-white">
    <VDescription empty-text="未设置">
      <VDescriptionItem label="别名" content="" />
      <VDescriptionItem label="描述" :content="undefined" />
      <VDescriptionItem label="许可证" content="GPL-3.0" />
    </VDescription>
  </div>
</template>
```

### 关闭分隔线与悬停背景

单列布局默认在描述项之间显示分隔线，`divider` 设为 `false` 可以关闭。`hover` 控制鼠标悬停时的浅色背景，`bordered` 为 `true` 时不再显示悬停背景。

```vue preview
<script lang="ts" setup>
import { VDescription, VDescriptionItem } from "@halo-dev/components";
</script>

<template>
  <VDescription :divider="false" :hover="false">
    <VDescriptionItem label="名称" content="Halo" />
    <VDescriptionItem label="版本" content="2.28.0" />
  </VDescription>
</template>
```

## VDescription Props

| 属性         | 类型                                     | 默认值         | 说明                                                       |
| ------------ | ---------------------------------------- | -------------- | ---------------------------------------------------------- |
| `columns`    | `number`                                 | `1`            | 列数，取值 `1`–`12`，大于 `1` 时从 `sm` 断点起使用网格布局 |
| `layout`     | `"horizontal" \| "vertical" \| "inline"` | `"horizontal"` | 标签与内容的排列方式                                       |
| `size`       | `"xs" \| "sm" \| "md" \| "lg"`           | `"md"`         | 内边距与字号                                               |
| `bordered`   | `boolean`                                | `false`        | 是否使用带边框的表格样式                                   |
| `divider`    | `boolean`                                | `true`         | 是否显示描述项之间的分隔线                                 |
| `hover`      | `boolean`                                | `true`         | 是否显示鼠标悬停背景，`bordered` 为 `true` 时不生效        |
| `title`      | `string`                                 | `undefined`    | 标题区文本                                                 |
| `separator`  | `string`                                 | `":"`          | 行内布局中标签后的分隔符，空字符串表示不显示               |
| `emptyText`  | `string`                                 | `undefined`    | 内容为空时的占位文本，可被单个描述项覆盖                   |
| `labelWidth` | `string \| number`                       | `undefined`    | 横向布局中标签列的宽度，数字按像素处理，可被单个描述项覆盖 |
| `align`      | `"left" \| "center" \| "right"`          | `undefined`    | 标签与内容的对齐方式，可被单个描述项覆盖                   |

## VDescriptionItem Props

| 属性             | 类型                            | 默认值      | 说明                                     |
| ---------------- | ------------------------------- | ----------- | ---------------------------------------- |
| `label`          | `string`                        | `""`        | 标签文本，可选                           |
| `content`        | `string \| number`              | `undefined` | 内容文本                                 |
| `span`           | `number`                        | `1`         | 在网格布局中跨越的列数，上限为 `columns` |
| `labelWidth`     | `string \| number`              | `undefined` | 覆盖 `VDescription` 的 `labelWidth`      |
| `align`          | `"left" \| "center" \| "right"` | `undefined` | 覆盖 `VDescription` 的 `align`           |
| `emptyText`      | `string`                        | `undefined` | 覆盖 `VDescription` 的 `emptyText`       |
| `verticalCenter` | `boolean`                       | `false`     | 是否让标签和内容垂直居中                 |

## Slots

| 组件               | 插槽      | 说明                         |
| ------------------ | --------- | ---------------------------- |
| `VDescription`     | `default` | 描述项列表                   |
| `VDescription`     | `title`   | 自定义标题区内容             |
| `VDescription`     | `extra`   | 标题区右侧的操作区域         |
| `VDescriptionItem` | `default` | 自定义内容，优先于 `content` |
| `VDescriptionItem` | `label`   | 自定义标签内容               |
