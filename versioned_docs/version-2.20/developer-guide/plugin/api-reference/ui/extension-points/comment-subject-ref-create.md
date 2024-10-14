---
title: 评论来源显示
description: 扩展评论来源显示 - comment:subject-ref:create
---

Console 的评论管理列表的评论来源默认仅支持显示来自文章和页面的评论，如果其他插件中的业务模块也使用了评论，那么就可以通过该拓展点来扩展评论来源的显示。

:::info 提示
此扩展点需要后端配合使用，请参考 [评论主体展示](../../server/extension-points/comment-subject.md)。
:::

![评论来源显示](/img/developer-guide/plugin/api-reference/ui/extension-points/comment-subject-ref-create.png)

## 定义方式

```ts
export default definePlugin({
  extensionPoints: {
    "comment:subject-ref:create": (): CommentSubjectRefProvider[] => {
      return [
        {
          kind: "Example",
          group: "example.halo.run",
          resolve: (subject: Extension): CommentSubjectRefResult => {
            return {
              label: "foo",
              title: subject.title,
              externalUrl: `/example/${subject.metadata.name}`,
              route: {
                name: "Example",
              },
            };
          },
        },
      ];
    },
  },
});
```

```ts title="CommentSubjectRefProvider"
export type CommentSubjectRefProvider = {
  kind: string;
  group: string;
  resolve: (subject: Extension) => CommentSubjectRefResult;
};
```

```ts title="CommentSubjectRefResult"
export interface CommentSubjectRefResult {
  label: string;
  title: string;
  route?: RouteLocationRaw;
  externalUrl?: string;
}
```

## 示例

此示例以[瞬间插件](https://github.com/halo-sigs/plugin-moments)为例，目前瞬间插件中的评论是通过 Halo 的内置的评论功能实现的，所以需要扩展评论来源显示。

```ts
import {
  definePlugin,
  type CommentSubjectRefResult,
} from "@halo-dev/console-shared";
import { markRaw } from "vue";
import type { Moment } from "@/types";
import { formatDatetime } from "./utils/date";
import type { Extension } from "@halo-dev/api-client/index";

export default definePlugin({
  extensionPoints: {
    "comment:subject-ref:create": () => {
      return [
        {
          kind: "Moment",
          group: "moment.halo.run",
          resolve: (subject: Extension): CommentSubjectRefResult => {
            const moment = subject as Moment;
            return {
              label: "瞬间",
              title: determineMomentTitle(moment),
              externalUrl: `/moments/${moment.metadata.name}`,
              route: {
                name: "Moments",
              },
            };
          },
        },
      ];
    },
  },
});

const determineMomentTitle = (moment: Moment) => {
  const pureContent = stripHtmlTags(moment.spec.content.raw);
  const title = !pureContent?.trim()
    ? formatDatetime(new Date(moment.spec.releaseTime || ""))
    : pureContent;
  return title?.substring(0, 100);
};

const stripHtmlTags = (str: string) => {
  // strip html tags
  const stripped = str?.replace(/<\/?[^>]+(>|$)/gi, "") || "";
  // strip newlines and collapse spaces
  return stripped.replace(/\n/g, " ").replace(/\s+/g, " ");
};
```

## 实现案例

- [https://github.com/halo-sigs/plugin-moments](https://github.com/halo-sigs/plugin-moments)
