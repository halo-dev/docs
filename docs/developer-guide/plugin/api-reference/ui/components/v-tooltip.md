---
title: v-tooltip
description: Tooltip 指令
---

此指令用于在任何元素上添加一个提示框。

## 使用方式

```html
<script lang="ts" setup>
import { IconDeleteBin } from "@halo-dev/components"
</script>

<template>
  <IconDeleteBin v-tooltip="'删除此文档'" />
</template>
```
