---
title: v-tooltip
description: 使用 v-tooltip 指令为 Halo 插件界面中的任意元素添加简短提示文字，在用户悬停或聚焦图标、按钮等控件时说明其用途
---

此指令用于在任何元素上添加一个提示框。

## 使用方式

```vue
<script lang="ts" setup>
import { IconDeleteBin } from "@halo-dev/components"
</script>

<template>
  <IconDeleteBin v-tooltip="'删除此文档'" />
</template>
```
