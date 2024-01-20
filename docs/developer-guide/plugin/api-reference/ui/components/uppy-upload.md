---
title: UppyUpload
description: 文件上传组件
---

## 使用方式

```html
<script lang="ts" setup>
const policyName = ref('my-test-policy')
const groupName = ref('my-test-group')
</script>

<template>
  <UppyUpload
    endpoint="/apis/api.console.halo.run/v1alpha1/attachments/upload"
    :meta="{
      policyName: policyName,
      groupName: groupName,
    }"
  />
</template>
```

## Props

| 属性名              | 类型                                                           | 默认值    | 描述                           |
|---------------------|----------------------------------------------------------------|-----------|------------------------------|
| `restrictions`      | Restrictions                                                   | undefined | 可选，指定任何限制。             |
| `meta`              | Record<string, unknown>                                        | undefined | 可选，要发送的额外元数据。       |
| `autoProceed`       | boolean                                                        | false     | 可选，在某些操作后自动继续。     |
| `allowedMetaFields` | string[]                                                       | undefined | 可选，指定允许的元数据字段。     |
| `endpoint`          | string                                                         | 无，必填   | 数据发送到的端点URL。           |
| `name`              | string                                                         | file      | 可选，用于上传的表单字段的名称。 |
| `note`              | string                                                         | undefined | 可选，任何备注或描述。           |
| `method`            | "GET" \| "POST" \| "PUT" \| "HEAD" \| "get" \| "post" \| "put" | post      | 可选，用于请求的HTTP方法。       |
| `disabled`          | boolean                                                        | false     | 可选，如果为真，则禁用组件。      |
| `width`             | string                                                         | 750px     | 可选，组件的宽度。               |
| `height`            | string                                                         | 550px     | 可选，组件的高度。               |
| `doneButtonHandler` | () => void                                                     | undefined | 可选，完成时调用的处理函数。     |

## Emits

| 事件名称 | 参数                                                   | 描述                  |
|----------|------------------------------------------------------|---------------------|
| uploaded | `response`: SuccessResponse 类型，表示上传成功的响应。   | 当文件上传成功时触发。 |
| error    | `file`: 出错的文件。<br />`response`: 出错时的响应数据。 | 当文件上传出错时触发。 |
