---
title: AnnotationsForm
description: 元数据表单组件
---

此组件用于提供统一的 [Annotations 表单](../../../../annotations-form.md)，可以根据 `group` 和 `kind` 属性自动渲染对应的表单项。

## 使用示例

```html
<script lang="ts" setup>
import { ref } from "vue"

const annotationsFormRef = ref()
const currentAnnotations = ref()

function handleSubmit () {
  annotationsFormRef.value?.handleSubmit();
  await nextTick();

  const { customAnnotations, annotations, customFormInvalid, specFormInvalid } =
    annotationsFormRef.value || {};

  // 表单验证不通过
  if (customFormInvalid || specFormInvalid) {
    return;
  }

  // 合并自定义数据和表单提供的数据
  const newAnnotations = {
    ...annotations,
    ...customAnnotations,
  };
}
</script>

<template>
  <AnnotationsForm
    ref="annotationsFormRef"
    :value="currentAnnotations"
    kind="Post"
    group="content.halo.run"
  />

  <VButton @click="handleSubmit">提交</VButton>
</template>
```

## Props

| 属性名  | 类型                               | 默认值  | 描述                                      |
|---------|------------------------------------|---------|-----------------------------------------|
| `group` | string                             | 无，必填 | 定义组件所属的分组。                       |
| `kind`  | string                             | 无，必填 | 定义组件的种类。                           |
| `value` | \{ [key: string]: string; \} \| null \| null    | 可选，包含键值对的对象或空值，用于存储数据。 |
