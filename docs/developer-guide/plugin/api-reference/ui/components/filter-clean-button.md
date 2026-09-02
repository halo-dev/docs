---
title: FilterCleanButton
description: 使用 FilterCleanButton 为 Halo 插件的筛选界面提供统一的清除操作入口，并通过点击事件重置当前页面已经应用的过滤条件
---

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
