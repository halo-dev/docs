---
title: v-permission
description: 权限指令
---

与 [HasPermission](./has-permission.md) 组件相同，此指令也是用于根据权限控制元素的显示与隐藏。

## 使用方式

```html
<script lang="ts" setup>
import { VButton } from "@halo-dev/components"
</script>

<template>
  <VButton type="danger" v-permission="['system:posts:manage']">删除</VButton>
</template>
```
