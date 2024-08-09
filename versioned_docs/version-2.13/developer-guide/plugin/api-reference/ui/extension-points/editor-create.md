---
title: 编辑器集成
description: 通过实现扩展点为文章提供新的编辑器 - editor:create
---

此扩展点可以为文章提供新的独立编辑器。

![编辑器集成](/img/developer-guide/plugin/api-reference/ui/extension-points/editor-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "editor:create": (): EditorProvider[] | Promise<EditorProvider[]> => {
      return [
        {
          name: "foo",
          displayName: "foo",
          logo: "/plugins/plugin-foo/assets/logo.png",
          component: FooComponent,
          rawType: "markdown",
        },
      ];
    },
  },
});
```

```ts title="EditorProvider"
export interface EditorProvider {
  name: string;
  displayName: string;
  logo?: string;
  component: Component;
  rawType: string;
}
```

其中，`component` 可以是组件对象或组件名称，且此组件有以下实现要求：

1. 组件必须包含以下 props：
   1. `raw:string`：用于接收原始内容。
   2. `content:string`：用于接收渲染后的内容。
   3. `uploadImage?: (file: File) => Promise<Attachment>`：用于上传图片，在编辑器内部获取到 File 之后直接调用此方法即可得到上传后的附件信息。
2. 组件必须包含以下 emit 事件：
   1. `update:raw`：用于更新原始内容。
   2. `update:content`：用于更新渲染后的内容。
   3. `update`：发送更新事件。

## 示例

此示例将实现一个简单的 Markdown 编辑器。

```ts title="index.ts"
import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";
import MarkdownEditor from "./components/markdown-editor.vue";

export default definePlugin({
  extensionPoints: {
    "editor:create": () => {
      return [
        {
          name: "markdown",
          displayName: "Markdown 编辑器",
          component: markRaw(MarkdownEditor),
          rawType: "markdown",
          logo: "/plugins/markdown-editor/assets/logo.png",
        },
      ];
    },
  },
});
```

```html title="./components/markdown-editor.vue"
<script setup lang="ts">
import { marked } from "marked";
import { debounce } from "lodash-es";
import { ref, computed, onMounted } from "vue";
import type { Attachment } from "@halo-dev/api-client";

const props = withDefaults(
  defineProps<{
    raw: string;
    content: string;
    uploadImage?: (file: File) => Promise<Attachment>;
  }>(),
  {
    raw: "",
    content: "",
    uploadImage: undefined,
  }
);

const emit = defineEmits<{
  (event: "update:raw", value: string): void;
  (event: "update:content", value: string): void;
  (event: "update", value: string): void;
}>();

const output = computed(() => marked(props.raw));

const update = debounce((e) => {
  emit("update:raw", e.target.value);
  emit("update:content", marked(e.target.value));

  if (e.target.value !== props.raw) {
    emit("update", e.target.value);
  }
}, 100);

const textareaRef = ref();

onMounted(() => {
  textareaRef.value.addEventListener("paste", (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          props.uploadImage?.(file).then((attachment: Attachment) => {
            emit(
              "update:raw",
              props.raw +
                `![${attachment.spec.displayName}](${attachment.status?.permalink})`
            );
          });
        }
      }
    }
  });
});
</script>

<template>
  <div class="editor">
    <textarea ref="textareaRef" class="input" :value="raw" @input="update"></textarea>
    <div class="output" v-html="output"></div>
  </div>
</template>

<style>
body {
  margin: 0;
}

.editor {
  height: 100vh;
  display: flex;
}

.input,
.output {
  overflow: auto;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.input {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: 'Monaco', courier, monospace;
  padding: 20px;
}

code {
  color: #f66;
}
</style>
```

> 来源：[https://vuejs.org/examples/#markdown](https://vuejs.org/examples/#markdown)

## 实现案例

- [https://github.com/halo-sigs/plugin-stackedit](https://github.com/halo-sigs/plugin-stackedit)
- [https://github.com/halo-sigs/plugin-bytemd](https://github.com/halo-sigs/plugin-bytemd)
- [https://github.com/justice2001/halo-plugin-vditor](https://github.com/justice2001/halo-plugin-vditor)
