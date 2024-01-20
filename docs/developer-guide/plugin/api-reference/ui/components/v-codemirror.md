---
title: VCodemirror
description: 代码编辑器组件
---

此组件封装了 Codemirror 代码编辑器，适用于一些需要编辑代码的场景。

## 使用方式

```html
<script lang="ts" setup>
import { ref } from "vue"

const value = ref("")
</script>

<template>
  <VCodemirror v-model="value" height="300px" language="html" />
</template>
```

## Props

| 属性名       | 类型                                            | 默认值   | 描述                                        |
|--------------|-------------------------------------------------|----------|-------------------------------------------|
| `modelValue` | string                                          | ""       | 可选，绑定到组件的字符串值，默认为空字符串。   |
| `height`     | string                                          | auto     | 可选，组件的高度，默认为 `"auto"`。            |
| `language`   | keyof typeof presetLanguages \| LanguageSupport | yaml     | 代码编辑器的语言支持，默认为 `"yaml"`。       |
| `extensions` | EditorStateConfig["extensions"]                 | () => [] | 可选，编辑器状态配置的扩展，默认为一个空数组。 |

## Emits

| 事件名称          | 参数                               | 描述                |
|-------------------|----------------------------------|-------------------|
| update:modelValue | `value`: string 类型，表示模型值。   | 当模型值更新时触发。 |
| change            | `value`: string 类型，表示变更的值。 | 当值发生变化时触发。 |
