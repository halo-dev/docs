---
title: FilterDropdown
description: 过滤器下拉组件
---

此组件为通用的下拉筛选组件，可以接收一个对象数组作为选项，并使用 `v-model` 绑定选择的值。

## 使用示例

```html
<script lang="ts" setup>
import { ref } from "vue"

const value = ref("")
const items = [
  {
    label: "最近创建",
    value: "creationTimestamp,desc"
  },
  {
    label: "较晚创建",
    value: "creationTimestamp,asc"
  }
]

</script>
<template>
  <FilterDropdown
    v-model="value"
    label="排序"
    :items="items"
  />
</template>
```

## Props

| 属性名       | 类型                                                      | 默认值    | 描述                                               |
|--------------|-----------------------------------------------------------|-----------|--------------------------------------------------|
| `items`      | \{ label: string; value?: string \| boolean \| number; \}[] | 无，必填   | 包含 `label` 和可选 `value` 的对象数组。            |
| `label`      | string                                                    | 无，必填   | 组件的标签文本。                                    |
| `modelValue` | string \| boolean \| number                               | undefined | 可选，用于绑定到组件的值，可以是字符串、布尔值或数字。 |

## Emits

| 事件名称          | 参数                                                   | 描述                |
|-------------------|--------------------------------------------------------|-------------------|
| update:modelValue | `modelValue`: string \| boolean \| number \| undefined | 当模型值更新时触发。 |
