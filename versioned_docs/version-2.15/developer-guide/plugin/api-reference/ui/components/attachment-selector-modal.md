---
title: AttachmentSelectorModal
description: 附件选择组件
---

此组件用于调出附件选择器，以供用户选择附件。

:::info 注意
此组件当前仅在 Console 中可用。
:::

## 使用示例

```html
<script lang="ts" setup>
import { ref } from "vue"

const visible = ref(false)

function onAttachmentSelect (attachments: AttachmentLike[]) {
  console.log(attachments)
}
</script>

<template>
  <VButton @click="visible = true">选择附件</VButton>

  <AttachmentSelectorModal
    v-model:visible="visible"
    @select="onAttachmentSelect"
  />
</template>
```

## Props

| 属性名    | 类型     | 默认值        | 描述                       |
|-----------|----------|---------------|--------------------------|
| `visible` | boolean  | false         | 控制组件是否可见。          |
| `accepts` | string[] | () => ["*/*"] | 可选，定义可接受的文件类型。 |
| `min`     | number   | undefined     | 可选，定义最小选择数量。     |
| `max`     | number   | undefined     | 可选，定义最大选择数量。     |

## Emits

| 事件名称       | 参数                                               | 描述                  |
|----------------|---------------------------------------------------|---------------------|
| update:visible | `visible`: boolean 类型，表示可见状态。              | 当可见状态更新时触发。 |
| close          | 无                                                 | 当弹框关闭时触发。     |
| select         | `attachments`: AttachmentLike[] 类型，表示附件数组。 | 当选择确定按钮时触发。 |
