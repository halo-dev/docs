```ts
export interface ListedPost {
  categories: Array<{                             // 文章的分类集合
    apiVersion: "content.halo.run/v1alpha1";
    kind: "Category";
    metadata: {
      annotations: {};
      creationTimestamp: string;
      labels: {};
      name: string;                               // 分类的唯一标识
      version: number;
    };
    spec: {
      children: Array<string>;                    // 子分类
      cover: string;                              // 分类封面图
      description: string;                        // 分类描述
      displayName: string;                        // 分类名称
      priority: number;                           // 分类优先级
      slug: string;                               // 分类别名
      template: string;                           // 分类渲染模板
    };
    status: {
      permalink: string;                          // 分类的永久链接
    };
    postCount: number;                            // 分类下的文章总数
  }>;
  contributors: Array<{                           // 文章的贡献者集合
    avatar: string;                               // 贡献者头像
    displayName: string;                          // 贡献者名称
    name: string;                                 // 贡献者唯一标识
  }>;
  owner: {                                        // 文章的作者信息
    avatar: string;                               // 作者头像
    displayName: string;                          // 作者名称
    name: string;                                 // 作者唯一标识
  };
  post: {                                         // 文章信息
    apiVersion: "content.halo.run/v1alpha1";
    kind: "Post";
    metadata: {
      annotations: {};
      creationTimestamp: string;
      labels: {};
      name: string;                               // 文章的唯一标识
      version: number;
    };
    spec: {
      allowComment: boolean;                      // 是否允许评论
      baseSnapshot: string;                       // 内容基础快照
      categories: Array<string>;                  // 文章所属分类
      cover: string;                              // 文章封面图
      deleted: boolean;                           // 是否已删除
      excerpt: {                                  // 文章摘要
        autoGenerate: boolean;                    // 是否自动生成
        raw: string;                              // 摘要内容
      };
      headSnapshot: string;                       // 内容最新快照
      htmlMetas: Array<{}>;
      owner: string;                              // 文章作者的唯一标识
      pinned: boolean;                            // 是否置顶
      priority: number;                           // 文章优先级
      publish: boolean;                           // 是否发布
      publishTime: string;                        // 发布时间
      releaseSnapshot: string;                    // 已发布的内容快照
      slug: string;                               // 文章别名
      tags: Array<string>;                        // 文章所属标签
      template: string;                           // 文章渲染模板
      title: string;                              // 文章标题
      visible: string;                            // 文章可见性
    };
    status: {
      commentsCount: number;                      // 文章评论总数
      conditions: Array<{
        lastTransitionTime: string;
        message: string;
        reason: string;
        status: string;
        type: string;
      }>;
      contributors: Array<string>;
      excerpt: string;                            // 最终的文章摘要，根据是否自动生成计算
      inProgress: boolean;                        // 是否有未发布的内容
      lastModifyTime: string;                     // 文章最后修改时间
      permalink: string;                          // 文章的永久链接
      phase: string;
    };
  };
  stats: {
    approvedComment: number;                      // 已审核的评论数
    totalComment: number;                         // 评论总数
    upvote: number;                               // 点赞数
    visit: number;                                // 访问数
  };
  tags: Array<{                                   // 文章的标签集合
    apiVersion: "content.halo.run/v1alpha1";
    kind: "Tag";
    metadata: {
      annotations: {};
      creationTimestamp: string;
      labels: {};
      name: string;                               // 标签的唯一标识
      version: number;
    };
    spec: {
      color: string;                              // 标签颜色
      cover: string;                              // 标签封面图
      displayName: string;                        // 标签名称
      slug: string;                               // 标签别名
    };
    status: {
      permalink: string;                          // 标签的永久链接
    };
    postCount: number;                            // 标签下的文章总数
  }>;
}

```
