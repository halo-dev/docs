---
title: 附件选择选项卡
description: 扩展附件选择组件的选项卡 - attachment:selector:create
---

此扩展点用于扩展附件选择组件的选项卡，目前 Halo 仅包含内置的附件库，你可以通过此扩展点添加自定义的选项卡。

![附件选择选项卡](/img/developer-guide/plugin/extension-points/ui/attachment-selector-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "attachment:selector:create": (): AttachmentSelectProvider[]| Promise<AttachmentSelectProvider[]> => {
      return [
        {
          id: "foo",
          label: "foo",
          component: markRaw(FooComponent),
        },
      ];
    },
  },
});
```

```ts title="AttachmentSelectProvider"
export interface AttachmentSelectProvider {
  id: string;                                   // 选项卡 ID
  label: string;                                // 选项卡名称
  component: Component | string;                // 选项卡组件
}
```

其中，`component` 可以是组件对象或组件名称，且此组件有以下实现要求：

1. 组件必须包含名称为 `selected` 的 `prop`，用于接收当前选中的附件。

    ```ts
    const props = withDefaults(
       defineProps<{
           selected: AttachmentLike[];
       }>(),
       {
           selected: () => [],
       }
    );
    ```

2. 组件必须包含名称为 `update:selected` 的 emit 事件，用于更新选中的附件。

    ```ts
    const emit = defineEmits<{
        (event: "update:selected", attachments: AttachmentLike[]): void;
    }>();
    ```

```ts title="AttachmentLike"
export type AttachmentLike =
  | Attachment
  | string
  | {
      url: string;
      type: string;
    };
```

## 示例

为附件选择组件添加 Stickers 选项卡，用于从给定的贴纸列表选择附件。

```ts title="index.ts"
import {
  definePlugin,
  type AttachmentSelectProvider,
} from "@halo-dev/console-shared";
import { markRaw } from "vue";
import StickerSelectorProvider from "./components/StickerSelectorProvider.vue";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "attachment:selector:create": (): AttachmentSelectProvider[] => {
      return [
        {
          id: "stickers",
          label: "Stickers",
          component: markRaw(StickerSelectorProvider),
        },
      ];
    },
  },
});
```

```html title="StickerSelectorProvider.vue"
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    selected: AttachmentLike[];
  }>(),
  {
    selected: () => [],
  }
);

const emit = defineEmits<{
  (event: "update:selected", attachments: AttachmentLike[]): void;
}>();

const stickers = [
  {
    url: "https://picsum.photos/200?random=1",
  },
  {
    url: "https://picsum.photos/200?random=2",
  },
  {
    url: "https://picsum.photos/200?random=3",
  },
];

const selectedStickers = ref<Set<String>>(new Set());

const handleSelect = async (url: string) => {
  if (selectedStickers.value.has(url)) {
    selectedStickers.value.delete(url);
    return;
  }
  selectedStickers.value.add(url);
  emit('update:selected', Array.from(selectedStickers.value));
};
</script>

<template>
  <div>
    <img v-for="sticker in stickers" :src="sticker.url" @click="handleSelect(sticker.url)" />
  </div>
</template>
```

## 实现案例

- [https://github.com/halo-sigs/plugin-unsplash](https://github.com/halo-sigs/plugin-unsplash)
