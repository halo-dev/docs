---
title: FilterCleanButton
description: 使用 FilterCleanButton 为 Halo 插件的筛选界面提供统一的清除操作入口，并通过点击事件重置当前页面已经应用的过滤条件
---

:::info
此组件为兼容已有插件而保留。从 Halo 2.28.0 开始，推荐使用 [VFilterDropdownGroup](../base-components/filter-dropdown.md) 内置的清除按钮，它可以自动感知组内筛选状态并一键清空。
:::

## 使用示例

```vue
<script lang="ts" setup>
function onClear() {
  console.log("clear");
}
</script>

<template>
  <FilterCleanButton @click="onClear" />
</template>
```
