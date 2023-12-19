---
title: 评论来源显示
description: 扩展评论来源显示 - comment:subject-ref:create
---

Console 的评论管理列表的评论来源默认仅支持显示来自文章和页面的评论，如果其他插件中的业务模块也使用了评论，那么就可以通过该拓展点来扩展评论来源的显示。

:::info 提示
此扩展点需要后端配合使用，请参考 TODO
:::

![评论来源显示](/img/developer-guide/plugin/api-reference/ui/extension-points/comment-subject-ref-create.png)

## 类型定义

```ts
{
  "comment:subject-ref:create"?: () => CommentSubjectRefProvider[];
}
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

// TODO

## 实现案例

- <https://github.com/halo-sigs/plugin-moments>
