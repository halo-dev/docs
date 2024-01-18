---
title: 文章数据列表操作菜单
description: 扩展文章数据列表操作菜单 - post:list-item:operation:create
---

此扩展点用于扩展文章数据列表的操作菜单项。

![文章数据列表操作菜单](/img/developer-guide/plugin/api-reference/ui/extension-points/post-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "post:list-item:operation:create": (
      post: Ref<ListedPost>
    ): OperationItem<ListedPost>[] | Promise<OperationItem<ListedPost>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: ListedPost) => {
            // do something
          },
          label: "foo",
          hidden: false,
          permissions: [],
          children: [],
        },
      ];
    },
  },
});
```

```mdx-code-block
import OperationItem from "./interface/OperationItem.md";

<OperationItem />
```

## 示例

此示例将实现一个操作菜单项，点击后会将文章内容作为文件下载到本地。

```ts
import type { ListedPost } from "@halo-dev/api-client";
import { VDropdownItem } from "@halo-dev/components";
import { definePlugin } from "@halo-dev/console-shared";
import axios from "axios";
import { markRaw } from "vue";

export default definePlugin({
  extensionPoints: {
    "post:list-item:operation:create": () => {
      return [
        {
          priority: 21,
          component: markRaw(VDropdownItem),
          label: "下载到本地",
          visible: true,
          permissions: [],
          action: async (post: ListedPost) => {
            const { data } = await axios.get(
              `/apis/api.console.halo.run/v1alpha1/posts/${post.post.metadata.name}/head-content`
            );
            const blob = new Blob([data.raw], {
              type: "text/plain;charset=utf-8",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${post.post.spec.title}.${data.rawType}`;
            link.click();
          },
        },
      ];
    },
  },
});
```

## 类型定义

### ListedPost

```mdx-code-block
import ListedPost from "./interface/ListedPost.md";

<ListedPost />
```
