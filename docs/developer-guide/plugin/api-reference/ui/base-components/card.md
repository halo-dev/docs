---
title: VCard 卡片
description: 使用 VCard 在 Halo 插件界面中组织内容，支持标题、头部操作、工具栏、主体和页脚区域，以及贴边、撑满高度、滚动、悬停与阴影等布局选项
---

`VCard` 是一个带边框和阴影的内容容器，用来把相关的内容和操作组织在一起。

从 2.28.0 开始，`VCard` 新增 `#title`、`#toolbar` 插槽和 `flush`、`fullHeight`、`scrollable`、`overflow`、`bodyStyle`、`hoverable`、`shadow`、`as` 属性，默认外观与已有用法完全不变。

## 引入

```ts
import { VCard } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VCard } from "@halo-dev/components";
</script>

<template>
  <VCard title="关于 Halo">
    Halo 是一个强大易用的开源建站工具，拥有丰富的可扩展性。
  </VCard>
</template>
```

### 带头部操作

```vue preview
<script lang="ts" setup>
import { VButton, VCard } from "@halo-dev/components";
</script>

<template>
  <VCard title="文章">
    <template #actions>
      <VButton size="sm" type="primary">新建文章</VButton>
    </template>
    这里展示文章列表。
  </VCard>
</template>
```

### 自定义标题

`#title` 插槽替换标题文字，位置、字号与截断行为保持不变，`#actions` 仍然显示在右侧。不传 `title` 时也可以只使用 `#actions`，操作区会自动靠右。

```vue preview
<script lang="ts" setup>
import { VCard, VTag } from "@halo-dev/components";
</script>

<template>
  <VCard>
    <template #title>
      <span>插件设置</span>
      <VTag class="ml-2" theme="primary">已启用</VTag>
    </template>
    插件设置内容。
  </VCard>
</template>
```

### 带工具栏

列表页常见的筛选、批量操作条使用 `#toolbar` 插槽。插槽自带浅灰背景、内边距和底部分隔线，不需要再自己包一层灰色容器；工具栏位于头部与主体之间。

```vue preview
<script lang="ts" setup>
import { VButton, VCard } from "@halo-dev/components";
</script>

<template>
  <VCard title="文章">
    <template #toolbar>
      <div class="flex items-center gap-2">
        <VButton size="sm">批量删除</VButton>
        <span class="ml-auto text-sm text-gray-500">共 12 篇</span>
      </div>
    </template>
    <div class="divide-y divide-gray-100">
      <div class="py-2">如何使用 Halo 搭建个人博客</div>
      <div class="py-2">插件开发入门</div>
    </div>
  </VCard>
</template>
```

### 去掉主体内边距

主体默认有内边距。放置表格、图片或自定义列表这类需要贴边的整块内容时，用 `flush` 去掉主体内边距，不要再用 `body-class="['!p-0']"`。

```vue preview
<script lang="ts" setup>
import { VCard } from "@halo-dev/components";
</script>

<template>
  <VCard title="标签" flush>
    <div class="divide-y divide-gray-100">
      <div class="px-4 py-3">Halo</div>
      <div class="px-4 py-3">建站</div>
      <div class="px-4 py-3">插件</div>
    </div>
  </VCard>
</template>
```

### 撑满父容器并滚动

`full-height` 让卡片高度占满父容器，`scrollable` 让主体在超出高度时自行滚动、头部与页脚保持可见，适合侧边栏、抽屉和整屏布局。

```vue preview
<script lang="ts" setup>
import { VCard } from "@halo-dev/components";
</script>

<template>
  <div class="h-48">
    <VCard title="通知" full-height scrollable>
      <div v-for="index in 12" :key="index" class="py-1">
        第 {{ index }} 条通知
      </div>
    </VCard>
  </div>
</template>
```

### 悬停与阴影

`shadow` 控制阴影：`always`（默认）、`hover`（悬停时才出现）、`never`（始终没有）。`hoverable` 在悬停时同时加深边框颜色，适合可点击的卡片；在 `shadow="never"` 时 `hoverable` 不生效。

```vue preview
<script lang="ts" setup>
import { VCard, VSpace } from "@halo-dev/components";
</script>

<template>
  <VSpace direction="column">
    <VCard title="默认阴影" hoverable>悬停时阴影加深。</VCard>
    <VCard title="只在悬停时显示阴影" shadow="hover"
      >默认状态下没有阴影。</VCard
    >
    <VCard title="没有阴影" shadow="never">始终与背景平齐。</VCard>
  </VSpace>
</template>
```

### 带页脚

```vue preview
<script lang="ts" setup>
import { VButton, VCard, VSpace } from "@halo-dev/components";
</script>

<template>
  <VCard title="站点信息">
    <p class="text-sm text-gray-600">修改站点名称和描述。</p>
    <template #footer>
      <VSpace>
        <VButton size="sm" type="primary">保存</VButton>
        <VButton size="sm">取消</VButton>
      </VSpace>
    </template>
  </VCard>
</template>
```

### 完全自定义头部

`#header` 会替换整个头部区域，包括 `title`、`#title` 和 `#actions`，需要完全控制头部结构时使用。头部区域不会被裁剪，放在其中的贴边内容需要自己处理圆角；在卡片头部放标签栏时，给标签栏设置 `flush`，见 [VTabs](./tabs.md)。

```vue preview
<script lang="ts" setup>
import { VCard, VTag } from "@halo-dev/components";
</script>

<template>
  <VCard>
    <template #header>
      <div class="flex w-full items-center justify-between px-4 py-3">
        <span class="text-base font-medium">插件设置</span>
        <VTag theme="primary">已启用</VTag>
      </div>
    </template>
    插件设置内容。
  </VCard>
</template>
```

## Props

| 属性         | 类型                             | 默认值      | 说明                                                               |
| ------------ | -------------------------------- | ----------- | ------------------------------------------------------------------ |
| `title`      | `string`                         | `undefined` | 卡片标题，渲染为 `h3`                                              |
| `bodyClass`  | `string \| string[]`             | `undefined` | 应用到卡片主体区域的 class 列表                                    |
| `bodyStyle`  | `CSSProperties`                  | `undefined` | 应用到卡片主体区域的内联样式，从 2.28.0 开始支持                   |
| `flush`      | `boolean`                        | `false`     | 去掉主体内边距，从 2.28.0 开始支持                                 |
| `fullHeight` | `boolean`                        | `false`     | 高度占满父容器，主体在剩余空间中伸缩，从 2.28.0 开始支持           |
| `scrollable` | `boolean`                        | `false`     | 主体内容超出高度时滚动，从 2.28.0 开始支持                         |
| `overflow`   | `"hidden" \| "visible"`          | `"hidden"`  | 主体是否允许溢出显示，用于浮层、下拉菜单等场景，从 2.28.0 开始支持 |
| `hoverable`  | `boolean`                        | `false`     | 悬停时加深边框颜色，`shadow="never"` 时不生效，从 2.28.0 开始支持  |
| `shadow`     | `"always" \| "hover" \| "never"` | `"always"`  | 阴影显示时机，从 2.28.0 开始支持                                   |
| `as`         | `string`                         | `"div"`     | 卡片根元素，例如 `"section"`，从 2.28.0 开始支持                   |

## Slots

| 插槽      | 说明                                                                 |
| --------- | -------------------------------------------------------------------- |
| `default` | 卡片主体内容                                                         |
| `title`   | 标题内容，替换 `title` 文字，从 2.28.0 开始支持                      |
| `header`  | 自定义整个头部区域，会覆盖 `title`、`title` 插槽和 `actions`         |
| `actions` | 头部右侧的操作区域，没有标题时也会渲染并靠右                         |
| `toolbar` | 头部与主体之间的工具栏，自带背景、内边距和分隔线，从 2.28.0 开始支持 |
| `footer`  | 卡片底部区域，存在时才显示                                           |

## CSS 变量

卡片在根元素上暴露以下变量，可以按卡片单独覆盖，例如 `<VCard style="--v-card-padding-x: 24px">`，改动只影响这张卡片。

| 变量                          | 默认值    | 说明                         |
| ----------------------------- | --------- | ---------------------------- |
| `--v-card-border-color`       | `#eaecf0` | 卡片边框与区域分隔线的颜色   |
| `--v-card-border-color-hover` | `#d0d5dd` | `hoverable` 悬停时的边框颜色 |
| `--v-card-padding-x`          | `16px`    | 头部、主体、页脚的水平内边距 |
| `--v-card-padding-y`          | `12px`    | 头部、主体、页脚的垂直内边距 |
