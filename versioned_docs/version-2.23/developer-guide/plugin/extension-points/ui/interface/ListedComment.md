```ts
export interface ListedComment {
  comment:{
    apiVersion: "content.halo.run/v1alpha1"
    kind: "Comment"
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
      content: string;                         // 最终渲染的文本
      creationTime: string;                    // 创建时间
      hidden: boolean;
      ipAddress: string;                       // 评论者 IP 地址
      lastReadTime: string;
      owner: {                                 // 创建者信息
        annotations: {};
        displayName: string;
        kind: string;
        name: string;
      };
      priority: number;                        // 排序字段
      raw: string;                             // 原始文本，一般用于给编辑器使用
      subjectRef: {                            // 引用关联，比如文章、自定义页面
        group: string;
        kind: string;
        name: string;
        version: string;
      };
      top: boolean;                            // 是否置顶
      userAgent: string;                       // 评论者 UserAgent 信息
    }
    status: {
      hasNewReply: boolean;                    // 是否有新回复
      lastReplyTime: string;
      observedVersion: number;
      replyCount: number;                      // 回复数量
      unreadReplyCount: number;
      visibleReplyCount: number;
    }
  }
  owner: {                                     // 创建者信息
    avatar: string;                            // 头像
    displayName: string;                       // 描述
    email: string;                             // 邮箱
    kind: string;
    name: string;                              // 创建者的唯一标识
  } 
  stats: {
    upvote: number;
  }
  subject: {
    apiVersion: string;
    kind: string;
    metadata: Metadata;
  } 
}
```
