---
title: VPageHeader 页头
description: 使用 VPageHeader 在 Halo 插件页面顶部展示标题、副标题、标签和操作按钮，支持加载、吸顶、截断与响应式布局
---

`VPageHeader` 用于页面顶部，展示页面标题、图标、副标题、标签和操作区域，通常作为插件独立页面的第一个元素。

从 2.28.0 开始，页头改为语义化结构：根元素渲染为 `<header>`，标题渲染为 `h1`；新增 `subtitle`、`sticky`、`bordered`、`loading`、`truncate` 属性和 `title`、`subtitle`、`tags`、`center` 插槽。已有 `title`、`#icon`、`#actions` 用法保持不变，不传新属性时渲染结果与之前一致。

## 引入

```ts
import { VPageHeader } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VPageHeader } from "@halo-dev/components";
</script>

<template>
  <VPageHeader title="文章管理" />
</template>
```

### 带图标和操作

```vue preview
<script lang="ts" setup>
import {
  IconAddCircle,
  IconPages,
  VButton,
  VPageHeader,
  VSpace,
} from "@halo-dev/components";
</script>

<template>
  <VPageHeader title="文章管理">
    <template #icon>
      <IconPages />
    </template>
    <template #actions>
      <VSpace>
        <VButton size="sm">导入</VButton>
        <VButton size="sm" type="primary">
          <template #icon>
            <IconAddCircle />
          </template>
          新建文章
        </VButton>
      </VSpace>
    </template>
  </VPageHeader>
</template>
```

### 副标题与标签

副标题用于放置数量、版本、更新时间等次要信息，显示在标题下方；`tags` 插槽的内容显示在标题右侧的同一行。

```vue preview
<script lang="ts" setup>
import { VButton, VPageHeader, VTag } from "@halo-dev/components";
</script>

<template>
  <VPageHeader
    title="Markdown 编辑器"
    subtitle="halo-dev · v2.1.0 · 3 天前更新"
    bordered
  >
    <template #tags>
      <VTag theme="primary">已启用</VTag>
    </template>
    <template #actions>
      <VButton size="sm">停用</VButton>
    </template>
  </VPageHeader>
</template>
```

标题也可以完全由 `title` 插槽渲染，此时组件不再输出 `title` 文字的悬停提示：

```vue
<template>
  <VPageHeader subtitle="共 128 项">
    <template #title>
      <span class="text-primary">文章管理</span>
    </template>
  </VPageHeader>
</template>
```

### 居中内容

`center` 插槽用于在页头中间放置与标题、操作区域分开的内容，例如切换视图的标签栏。宽度不小于 640px 时，页头按「左侧标题、中间内容、右侧操作」三列排布，`center` 的内容对齐页头本身的中线，而不是两侧宽度不等时的空隙中点；宽度小于 640px 时该区域与其它内容一起按需要换行。

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VButton, VPageHeader, VTabbar } from "@halo-dev/components";

const activeId = ref("desktop");

const items = [
  { id: "desktop", label: "桌面端" },
  { id: "tablet", label: "平板" },
  { id: "mobile", label: "移动端" },
];
</script>

<template>
  <VPageHeader title="编辑仪表盘">
    <template #center>
      <VTabbar v-model:active-id="activeId" :items="items" type="outline" />
    </template>
    <template #actions>
      <VButton size="sm" type="primary">保存</VButton>
    </template>
  </VPageHeader>
</template>
```

### 加载状态

`loading` 用骨架替换标题和副标题，同时在根元素上设置 `aria-busy`，并让操作区域变为不可交互：`#actions` 中的内容会降为半透明、不再响应点击，也不会进入键盘焦点顺序。

```vue preview
<script lang="ts" setup>
import { VButton, VPageHeader } from "@halo-dev/components";
</script>

<template>
  <VPageHeader title="Markdown 编辑器" subtitle="halo-dev · v2.1.0" loading>
    <template #actions>
      <VButton size="sm">刷新</VButton>
    </template>
  </VPageHeader>
</template>
```

### 吸顶

`sticky` 让页头固定在视口顶部，滚动时保持可见，并自动获得底部分隔线；页头开始吸附后还会显示一层阴影。它依赖窗口滚动，页面如果滚动在内层容器里，页头不会跟随吸附。

```vue
<template>
  <VPageHeader title="插件设置" sticky>
    <template #actions>
      <VButton type="primary">保存</VButton>
    </template>
  </VPageHeader>
</template>
```

`sticky` 依赖窗口滚动：页头需要在视口范围内开始滚动才会吸附，页面内容滚动在内层容器里时页头不会跟随。

### 长标题

标题和副标题默认只显示一行，超出部分用省略号截断，悬停时通过浏览器原生提示显示完整文字。需要完整展示时传 `truncate` 为 `false`，文字会换行显示。

```vue preview
<script lang="ts" setup>
import { VPageHeader } from "@halo-dev/components";
</script>

<template>
  <VPageHeader
    title="Halo 官方 Markdown 编辑器（增强版） · 支持实时预览与自定义快捷键"
    subtitle="halo-dev · v2.28.0 · 最近更新于 2026-11-25"
    :truncate="false"
  />
</template>
```

## Props

| 属性       | 类型      | 默认值      | 说明                                                                                |
| ---------- | --------- | ----------- | ----------------------------------------------------------------------------------- |
| `title`    | `string`  | `undefined` | 页面标题，使用 `title` 插槽时忽略                                                   |
| `subtitle` | `string`  | `undefined` | 标题下方的次要信息，使用 `subtitle` 插槽时忽略，从 2.28.0 开始支持                  |
| `sticky`   | `boolean` | `false`     | 滚动时吸附在视口顶部，会同时启用 `bordered`，开始吸附后显示阴影，从 2.28.0 开始支持 |
| `bordered` | `boolean` | `false`     | 显示底部分隔线，设置 `sticky` 时自动启用，从 2.28.0 开始支持                        |
| `loading`  | `boolean` | `false`     | 用骨架替换标题和副标题，并使操作区域不可交互，从 2.28.0 开始支持                    |
| `truncate` | `boolean` | `true`      | 标题和副标题只显示一行并截断，传 `false` 时换行显示，从 2.28.0 开始支持             |

## Slots

| 插槽       | 说明                                                                |
| ---------- | ------------------------------------------------------------------- |
| `icon`     | 标题前的图标，图标外层固定为 `1.25rem` 字号，与标题字号对齐         |
| `title`    | 替换 `title` 文字渲染的标题内容，从 2.28.0 开始支持                 |
| `subtitle` | 替换 `subtitle` 文字渲染的副标题内容，从 2.28.0 开始支持            |
| `tags`     | 标题右侧的标签区域，与标题同一行显示，从 2.28.0 开始支持            |
| `center`   | 页头中间的内容，宽度不小于 640px 时对齐页头中线，从 2.28.0 开始支持 |
| `actions`  | 右侧操作区域                                                        |

## 响应式

窗口宽度小于 640px 时，标题和操作区域默认保持在同一行，只有在操作区域放不下时才换到标题下方单独一行并保持右对齐。没有 `actions` 插槽内容时不会渲染空的 `actions` 容器，标题因此在垂直方向保持居中。

## 无障碍

根元素是 `<header>`，标题是 `h1`，适合作为页面唯一的一级标题。`icon` 插槽被标记为 `aria-hidden`，图标本身不会被读屏软件读出；`actions` 区域使用 `role="group"`，并带有跟随界面语言的 `aria-label`（中文为「页面操作」）。

## CSS 变量

页头在根元素上暴露以下变量，可以按页面单独覆盖，例如 `<VPageHeader style="--page-header-border: #d0d5dd">`，改动只影响这一个页头。

| 变量                               | 默认值    | 说明               |
| ---------------------------------- | --------- | ------------------ |
| `--page-header-bg`                 | `#fff`    | 页头背景色         |
| `--page-header-text`               | `#1f2937` | 标题文字颜色       |
| `--page-header-subtle`             | `#6b7280` | 副标题文字颜色     |
| `--page-header-border`             | `#e5e7eb` | 底部分隔线颜色     |
| `--page-header-skeleton`           | `#f3f4f6` | 加载骨架的基础颜色 |
| `--page-header-skeleton-highlight` | `#e5e7eb` | 加载骨架的高亮颜色 |
