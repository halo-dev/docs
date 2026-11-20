---
title: FilterDropdown
description: 使用 FilterDropdown 构建通用下拉筛选器，通过包含标签和值的选项列表渲染菜单，并使用 v-model 读取和更新当前筛选值
---

此组件为通用的下拉筛选组件，可以接收一个对象数组作为选项，并使用 `v-model` 绑定选择的值。

:::info
此组件为兼容已有插件而保留。从 Halo 2.28.0 开始，推荐使用基础组件库中的 [VFilterDropdown](../base-components/filter-dropdown.md)，它支持搜索、分组、树形选项、远程加载和一键清空。
:::

## 使用示例

```vue
<script lang="ts" setup>
import { ref } from "vue";

const value = ref("");
const items = [
  {
    label: "最近创建",
    value: "creationTimestamp,desc",
  },
  {
    label: "较晚创建",
    value: "creationTimestamp,asc",
  },
];
</script>
<template>
  <FilterDropdown v-model="value" label="排序" :items="items" />
</template>
```

## Props

| 属性名       | 类型                                                        | 默认值    | 描述                                                   |
| ------------ | ----------------------------------------------------------- | --------- | ------------------------------------------------------ |
| `items`      | \{ label: string; value?: string \| boolean \| number; \}[] | 无，必填  | 包含 `label` 和可选 `value` 的对象数组。               |
| `label`      | string                                                      | 无，必填  | 组件的标签文本。                                       |
| `modelValue` | string \| boolean \| number                                 | undefined | 可选，用于绑定到组件的值，可以是字符串、布尔值或数字。 |

## Emits

| 事件名称          | 参数                                                   | 描述                 |
| ----------------- | ------------------------------------------------------ | -------------------- |
| update:modelValue | `modelValue`: string \| boolean \| number \| undefined | 当模型值更新时触发。 |
