```jsonc title="ReplyVo"
{
  "metadata": {
    "name": "string", // 唯一标识
    "labels": {
      "additionalProp1": "string",
    },
    "annotations": {
      "additionalProp1": "string",
    },
    "creationTimestamp": "2022-11-20T12:25:32.357Z", // 创建时间
  },
  "spec": {
    "raw": "string", // 原始文本，一般用于给编辑器使用
    "content": "string", // 最终渲染的文本
    "owner": {
      // 创建者关联
      "kind": "string",
      "name": "", // 公开查询中已脱敏
      "displayName": "string",
      "annotations": {
        "additionalProp1": "string",
        "email-hash": "string", // 邮箱的 SHA-256，仅在邮箱存在时提供
      },
    },
    "userAgent": "string", // 评论者 UserAgent 信息
    "ipAddress": "", // 公开查询中已脱敏
    "priority": 0, // 排序字段
    "top": false, // 是否置顶
    "allowNotification": true, // 是否允许通知
    "approved": false,
    "hidden": false,
    "commentName": "string", // 被回复的评论名称，即 Comment 的 metadata.name
    "quoteReply": "string", // 被回复的回复名称，即 Reply 的 metadata.name
  },
  "owner": {
    // 创建者信息
    "kind": "string",
    "name": null, // 公开查询中已脱敏
    "displayName": "string",
    "avatar": "string",
    "email": null, // 公开查询中已脱敏
  },
  "stats": {
    "upvote": 0, // 点赞数量
  },
}
```
