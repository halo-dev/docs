---
title: 页面数据列表操作菜单
description: 扩展页面数据列表操作菜单 - single-page:list-item:operation:create
---

此扩展点用于扩展页面数据列表的操作菜单项。

![页面数据列表操作菜单](/img/developer-guide/plugin/extension-points/ui/single-page-list-item-operation-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "single-page:list-item:operation:create": (
      singlePage: Ref<ListedSinglePage>
    ): OperationItem<ListedSinglePage>[] | Promise<OperationItem<ListedSinglePage>[]> => {
      return [
        {
          priority: 10,
          component: markRaw(VDropdownItem),
          props: {},
          action: (item?: ListedSinglePage) => {
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

此示例将实现一个操作菜单项，点击后会将页面内容作为文件下载到本地。

```ts
import type { ListedSinglePage } from "@halo-dev/api-client";
import { VDropdownItem } from "@halo-dev/components";
import { definePlugin } from "@halo-dev/console-shared";
import axios from "axios";
import { markRaw } from "vue";

export default definePlugin({
  extensionPoints: {
    "single-page:list-item:operation:create": () => {
      return [
        {
          priority: 21,
          component: markRaw(VDropdownItem),
          label: "下载到本地",
          visible: true,
          permissions: [],
          action: async (singlePage: ListedSinglePage) => {
            const { data } = await axios.get(
              `/apis/api.console.halo.run/v1alpha1/single-pages/${singlePage.page.metadata.name}/head-content`
            );
            const blob = new Blob([data.raw], {
              type: "text/plain;charset=utf-8",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${singlePage.page.spec.title}.${data.rawType}`;
            link.click();
          },
        },
      ];
    },
  },
});
```

## 类型定义

### ListedSinglePage

```mdx-code-block
import ListedSinglePage from "./interface/ListedSinglePage.md";

<ListedSinglePage />
```
