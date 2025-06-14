```ts
export interface ListedSinglePage {
  contributors: Array<{                           // 页面的贡献者集合
    avatar: string;                               // 贡献者头像
    displayName: string;                          // 贡献者名称
    name: string;                                 // 贡献者唯一标识
  }>;
  owner: {                                        // 页面的作者信息
    avatar: string;                               // 作者头像
    displayName: string;                          // 作者名称
    name: string;                                 // 作者唯一标识
  };
  page: {                                         // 页面信息
    apiVersion: "content.halo.run/v1alpha1";
    kind: "SinglePage";
    metadata: {
      annotations: {};
      creationTimestamp: string;
      labels: {};
      name: string;                               // 页面的唯一标识
      version: number;
    };
    spec: {
      allowComment: boolean;                      // 是否允许评论
      baseSnapshot: string;                       // 内容基础快照
      cover: string;                              // 页面封面图
      deleted: boolean;                           // 是否已删除
      excerpt: {                                  // 页面摘要
        autoGenerate: boolean;                    // 是否自动生成
        raw: string;                              // 摘要内容
      };
      headSnapshot: string;                       // 内容最新快照
      htmlMetas: Array<{}>;
      owner: string;                              // 页面作者的唯一标识
      pinned: boolean;                            // 是否置顶
      priority: number;                           // 页面优先级
      publish: boolean;                           // 是否发布
      publishTime: string;                        // 发布时间
      releaseSnapshot: string;                    // 已发布的内容快照
      slug: string;                               // 页面别名
      template: string;                           // 页面渲染模板
      title: string;                              // 页面标题
      visible: string;                            // 页面可见性
    };
    status: {
      commentsCount: number;                      // 页面评论总数
      conditions: Array<{
        lastTransitionTime: string;
        message: string;
        reason: string;
        status: string;
        type: string;
      }>;
      contributors: Array<string>;
      excerpt: string;                            // 最终的页面摘要，根据是否自动生成计算
      inProgress: boolean;                        // 是否有未发布的内容
      lastModifyTime: string;                     // 页面最后修改时间
      permalink: string;                          // 页面的永久链接
      phase: string;
    };
  };
  stats: {
    approvedComment: number;                      // 已审核的评论数
    totalComment: number;                         // 评论总数
    upvote: number;                               // 点赞数
    visit: number;                                // 访问数
  };
}

```
