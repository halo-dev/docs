---
title: SearchInput
description: 搜索输入框组件
---

此组件适用于关键词搜索场景，输入数据的过程中不会触发搜索，只有在输入完成后，点击回车才会触发搜索。

## 使用方式

```html
<script lang="ts" setup>
import { ref } from "vue"

const keyword = ref("")
</script>

<template>
  <SearchInput v-model="keyword" placeholder="请输入关键字" />
</template>
```

## Props

| 属性名        | 类型   | 默认值    | 描述                               |
|---------------|--------|-----------|----------------------------------|
| `placeholder` | string | undefined | 可选，用于指定输入字段的占位符文本。 |
| `modelValue`  | string | 无，必填   | 用于绑定输入字段的值。              |

## Emits

| 事件名称          | 参数                                  | 描述                |
|-------------------|-------------------------------------|-------------------|
| update:modelValue | `modelValue`: string 类型，表示模型值。 | 当模型值更新时触发。 |
