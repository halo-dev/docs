---
title: VEntity 实体
description: 使用 VEntity、VEntityContainer 和 VEntityField 在 Halo 插件中构建与 Console 一致的列表行
---

`VEntity` 表示列表中的一行数据，通常与 `VEntityContainer` 和 `VEntityField` 一起使用，构成 Halo Console 中常见的列表界面。

## 引入

```ts
import { VEntity, VEntityContainer, VEntityField } from "@halo-dev/components";
```

## 示例

### 基础用法

```vue preview
<script lang="ts" setup>
import { VEntity, VEntityContainer, VEntityField } from "@halo-dev/components";

const items = [
  { id: 1, name: "第一篇文档", description: "更新于 2 分钟前" },
  { id: 2, name: "第二篇文档", description: "更新于 1 小时前" },
  { id: 3, name: "第三篇文档", description: "更新于昨天" },
];
</script>

<template>
  <VEntityContainer>
    <VEntity v-for="item in items" :key="item.id">
      <template #start>
        <VEntityField :title="item.name" :description="item.description" />
      </template>
      <template #end>
        <span class="text-xs text-gray-500">已发布</span>
      </template>
    </VEntity>
  </VEntityContainer>
</template>
```

### 选中状态

```vue preview
<script lang="ts" setup>
import { ref } from "vue";
import { VEntity, VEntityContainer, VEntityField } from "@halo-dev/components";

const selectedId = ref(1);

const items = [
  { id: 1, name: "第一篇文档" },
  { id: 2, name: "第二篇文档" },
  { id: 3, name: "第三篇文档" },
];
</script>

<template>
  <VEntityContainer>
    <VEntity
      v-for="item in items"
      :key="item.id"
      :is-selected="selectedId === item.id"
      class="cursor-pointer"
      @click="selectedId = item.id"
    >
      <template #checkbox>
        <input
          type="checkbox"
          :checked="selectedId === item.id"
          @click.stop
          @change="selectedId = item.id"
        />
      </template>
      <template #start>
        <VEntityField :title="item.name" />
      </template>
    </VEntity>
  </VEntityContainer>
</template>
```

### 行内操作菜单

`dropdownItems` 插槽会自动生成右侧的更多操作菜单。

```vue preview
<script lang="ts" setup>
import {
  Toast,
  VDropdownItem,
  VEntity,
  VEntityContainer,
  VEntityField,
} from "@halo-dev/components";

const items = [
  { id: 1, name: "第一篇文档" },
  { id: 2, name: "第二篇文档" },
];
</script>

<template>
  <VEntityContainer>
    <VEntity v-for="item in items" :key="item.id">
      <template #start>
        <VEntityField :title="item.name" />
      </template>
      <template #dropdownItems>
        <VDropdownItem @click="Toast.success(`编辑 ${item.name}`)">
          编辑
        </VDropdownItem>
        <VDropdownItem
          type="danger"
          @click="Toast.success(`删除 ${item.name}`)"
        >
          删除
        </VDropdownItem>
      </template>
    </VEntity>
  </VEntityContainer>
</template>
```

## VEntity Props

| 属性         | 类型      | 默认值  | 说明             |
| ------------ | --------- | ------- | ---------------- |
| `isSelected` | `boolean` | `false` | 是否处于选中状态 |

## VEntityContainer Props

`VEntityContainer` 没有属性，只提供默认插槽，内部会渲染为表格结构。

## VEntityField Props

| 属性          | 类型               | 默认值      | 说明                       |
| ------------- | ------------------ | ----------- | -------------------------- |
| `title`       | `string`           | `undefined` | 标题                       |
| `description` | `string`           | `undefined` | 描述文本                   |
| `route`       | `RouteLocationRaw` | `undefined` | 标题点击后跳转的路由       |
| `width`       | `string \| number` | `undefined` | 固定宽度，数字会按像素处理 |
| `maxWidth`    | `string \| number` | `undefined` | 最大宽度，数字会按像素处理 |

## Emits

| 组件           | 事件    | 参数 | 说明           |
| -------------- | ------- | ---- | -------------- |
| `VEntityField` | `click` | -    | 点击标题时触发 |

## Slots

| 组件               | 插槽            | 说明                 |
| ------------------ | --------------- | -------------------- |
| `VEntity`          | `prepend`       | 显示在行最左侧的内容 |
| `VEntity`          | `checkbox`      | 选择框区域           |
| `VEntity`          | `start`         | 行左侧的主要内容     |
| `VEntity`          | `end`           | 行右侧的内容         |
| `VEntity`          | `dropdownItems` | 更多操作菜单中的内容 |
| `VEntity`          | `footer`        | 行下方的附加内容     |
| `VEntityContainer` | `default`       | 实体行列表           |
| `VEntityField`     | `title`         | 自定义标题           |
| `VEntityField`     | `extra`         | 标题旁的附加内容     |
| `VEntityField`     | `description`   | 自定义描述           |
