```ts
export interface ListedReply {
  owner: {                                     // 创建者信息
    avatar: string;                            // 头像
    displayName: string;                       // 描述
    email: string;                             // 邮箱
    kind: string;
    name: string;                              // 创建者的唯一标识
  } 
  reply:{
    apiVersion: "content.halo.run/v1alpha1"
    kind: "Reply"
    metadata: {
      annotations: {}
      creationTimestamp: string                   
      labels: {}
      name: string                             // 评论的唯一标识
      version: number
    }
    spec: {
      allowNotification: boolean;              // 是否允许通知
      approved: boolean;
      approvedTime: string;
      commentName: string;                     // 被回复的评论名称，即 Comment 的 metadata.name
      content: string;                         // 最终渲染的文本
      creationTime: string;                    // 创建时间
      hidden: boolean;
      ipAddress: string;                       // 评论者 IP 地址
      owner: {                                 // 创建者信息
        annotations: {};
        displayName: string;
        kind: string;
        name: string;
      };
      priority: number;                        // 排序字段
      quoteReply: string;                      // 被回复的回复名称，即 Reply 的 metadata.name
      raw: string;                             // 原始文本，一般用于给编辑器使用
      top: boolean;                            // 是否置顶
      userAgent: string;                       // 评论者 UserAgent 信息
    }
    status: {
      observedVersion: number;
    }
  }
  stats: {
    upvote: number;
  }
}
```
