---
title: VMenu 菜单
description: 使用 VMenu、VMenuItem 和 VMenuLabel 在 Halo 插件中构建多级垂直导航菜单
---

`VMenu` 用于构建垂直导航菜单，支持多级子菜单、图标和选中状态。

## 引入

```ts
import { VMenu, VMenuItem, VMenuLabel } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VMenu, VMenuItem } from "@halo-dev/components";

const activeId = ref("dashboard");
</script>

<template>
  <VMenu>
    <VMenuItem
      id="dashboard"
      title="概览"
      :active="activeId === 'dashboard'"
      @select="activeId = 'dashboard'"
    />
    <VMenuItem
      id="posts"
      title="文章"
      :active="activeId === 'posts'"
      @select="activeId = 'posts'"
    />
    <VMenuItem
      id="pages"
      title="页面"
      :active="activeId === 'pages'"
      @select="activeId = 'pages'"
    />
  </VMenu>
</template>
```

### 带图标

```vue preview
<script lang="ts" setup>
import {
  IconDashboard,
  IconPages,
  IconSettings,
  VMenu,
  VMenuItem,
} from "@halo-dev/components";
</script>

<template>
  <VMenu>
    <VMenuItem id="dashboard" title="概览" active>
      <template #icon>
        <IconDashboard />
      </template>
    </VMenuItem>
    <VMenuItem id="content" title="内容">
      <template #icon>
        <IconPages />
      </template>
    </VMenuItem>
    <VMenuItem id="settings" title="设置">
      <template #icon>
        <IconSettings />
      </template>
    </VMenuItem>
  </VMenu>
</template>
```

### 多级菜单

默认插槽中的 `VMenuItem` 会作为子菜单渲染。

```vue preview
<script lang="ts" setup>
import { VMenu, VMenuItem } from "@halo-dev/components";
</script>

<template>
  <VMenu :open-ids="['content']">
    <VMenuItem id="content" title="内容管理">
      <VMenuItem id="posts" title="文章" />
      <VMenuItem id="pages" title="页面" />
      <VMenuItem id="categories" title="分类" />
    </VMenuItem>
    <VMenuItem id="settings" title="设置" />
  </VMenu>
</template>
```

### 分组标签

```vue preview
<script lang="ts" setup>
import { VMenu, VMenuItem, VMenuLabel } from "@halo-dev/components";
</script>

<template>
  <VMenu>
    <VMenuLabel>内容</VMenuLabel>
    <VMenuItem id="posts" title="文章" />
    <VMenuItem id="pages" title="页面" />
    <VMenuLabel>系统</VMenuLabel>
    <VMenuItem id="settings" title="设置" />
  </VMenu>
</template>
```

## VMenu Props

| 属性      | 类型       | 默认值      | 说明                     |
| --------- | ---------- | ----------- | ------------------------ |
| `openIds` | `string[]` | `undefined` | 默认展开的菜单项 ID 列表 |

## VMenuItem Props

| 属性     | 类型      | 默认值  | 说明           |
| -------- | --------- | ------- | -------------- |
| `id`     | `string`  | `""`    | 菜单项唯一标识 |
| `title`  | `string`  | `""`    | 菜单项文字     |
| `active` | `boolean` | `false` | 是否为选中状态 |

## Emits

| 事件     | 参数     | 说明                                |
| -------- | -------- | ----------------------------------- |
| `select` | `string` | 点击菜单项时触发，参数为菜单项 `id` |

## Slots

| 组件         | 插槽      | 说明         |
| ------------ | --------- | ------------ |
| `VMenuItem`  | `default` | 子菜单项     |
| `VMenuItem`  | `icon`    | 菜单项图标   |
| `VMenuLabel` | `default` | 分组标签内容 |
