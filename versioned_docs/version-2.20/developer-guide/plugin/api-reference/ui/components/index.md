---
title: 组件
description: 在 Halo UI 中可使用的组件。
---

此文档将介绍所有在插件中可用的组件，以及它们的使用方法和区别。

## 基础组件库

我们为 Halo 的前端封装了一个基础组件的库，你可以在插件中使用这些组件。

安装方式：

```bash
pnpm install @halo-dev/components
```

在 Vue 组件中：

```html
<script lang="ts" setup>
import { VButton } from "@halo-dev/components";
</script>

<template>
  <VButton>Hello</VButton>
</template>
```

所有可用的基础组件以及文档可查阅：[https://halo-ui-components.pages.dev](https://halo-ui-components.pages.dev)

## 业务组件和指令

除了基础组件库，我们还为 Halo 的前端封装了一些业务组件和指令，这些组件已经在全局注册，你可以直接在插件中使用这些组件和指令。

以下是所有可用的业务组件和指令：

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
