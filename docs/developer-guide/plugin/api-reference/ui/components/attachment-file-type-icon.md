---
title: AttachmentFileTypeIcon
description: 附件文件类型图标组件
---

此组件用于根据文件名显示文件类型图标。

## 使用示例

```html
<script lang="ts" setup></script>

<template>
  <AttachmentFileTypeIcon fileName="example.png" />
</div>
```

## Props

| 属性名       | 类型                | 默认值    | 描述                                 |
|--------------|---------------------|-----------|------------------------------------|
| `fileName`   | string \| undefined | undefined | 文件名，可以是字符串或未定义。         |
| `displayExt` | boolean             | true      | 可选，是否显示文件扩展名，默认为 true。 |
| `width`      | number              | 10        | 可选，组件宽度，默认为 10。             |
| `height`     | number              | 10        | 可选，组件高度，默认为 10。             |
