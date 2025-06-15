---
title: PluginDetailModal
description: 插件详情弹窗组件
---

此组件可以在 UI 部分的任意组件中打开差价的详情和设置弹窗，可以用于实现在不打断正常操作流程的情况下让用户查看和修改插件的详细信息。

## 使用方式

```html
<script lang="ts" setup>
import { ref } from "vue"

const modalVisible = ref(false)

function onPluginDetailModalClose() {
  // Do something
}
</script>

<template>
  <PluginDetailModal v-if="modalVisible" @close="onPluginDetailModalClose" name="starter" />
</template>
```

## Props

| 属性名 | 类型   | 默认值   | 描述                                          |
| ------ | ------ | -------- | --------------------------------------------- |
| `name` | string | 无，必填 | 插件名称，即 plugin.yaml 中的 `metadata.name` |
