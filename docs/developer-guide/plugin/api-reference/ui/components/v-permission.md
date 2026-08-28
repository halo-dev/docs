---
title: v-permission
description: 使用 v-permission 指令为单个界面元素声明所需权限列表，根据当前用户的 UI 权限自动控制按钮或其他操作元素的显示与隐藏
---

与 [HasPermission](./has-permission.md) 组件相同，此指令也是用于根据权限控制元素的显示与隐藏。

## 使用方式

```vue
<script lang="ts" setup>
import { VButton } from "@halo-dev/components"
</script>

<template>
  <VButton type="danger" v-permission="['system:posts:manage']">删除</VButton>
</template>
```
