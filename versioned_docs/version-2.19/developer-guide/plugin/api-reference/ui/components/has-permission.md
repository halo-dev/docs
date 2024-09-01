---
title: HasPermission
description: 权限判断组件
---

此组件用于根据权限控制元素的显示与隐藏。

## 使用方式

```html
<script lang="ts" setup>
import { VButton } from "@halo-dev/components"
</script>

<template>
  <HasPermission :permissions="['system:posts:manage']">
    <VButton type="danger">删除</VButton>
  </HasPermission>
</template>
```

## Props

| 属性名        | 类型     | 默认值  | 描述                    |
|---------------|----------|------|-----------------------|
| `permissions` | string[] | 无，必填 | 定义组件所需的权限列表。 |
