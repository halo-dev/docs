```ts
export interface ListedPost {
  categories: Array<{
    apiVersion: string;
    kind: string;
    metadata: {
      annotations: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      creationTimestamp: string;
      deletionTimestamp: string;
      finalizers: Array<string>;
      generateName: string;
      labels: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      name: string;
      version: number;
    };
    spec: {
      children: Array<string>;
      cover: string;
      description: string;
      displayName: string;
      priority: number;
      slug: string;
      template: string;
    };
    status: {
      permalink: string;
      postCount: number;
      visiblePostCount: number;
    };
  }>;
  contributors: Array<{
    avatar: string;
    displayName: string;
    name: string;
  }>;
  owner: {
    avatar: string;
    displayName: string;
    name: string;
  };
  post: {
    apiVersion: string;
    kind: string;
    metadata: {
      annotations: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      creationTimestamp: string;
      deletionTimestamp: string;
      finalizers: Array<string>;
      generateName: string;
      labels: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      name: string;
      version: number;
    };
    spec: {
      allowComment: boolean;
      baseSnapshot: string;
      categories: Array<string>;
      cover: string;
      deleted: boolean;
      excerpt: {
        autoGenerate: boolean;
        raw: string;
      };
      headSnapshot: string;
      htmlMetas: Array<{
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      }>;
      owner: string;
      pinned: boolean;
      priority: number;
      publish: boolean;
      publishTime: string;
      releaseSnapshot: string;
      slug: string;
      tags: Array<string>;
      template: string;
      title: string;
      visible: string;
    };
    status: {
      commentsCount: number;
      conditions: Array<{
        lastTransitionTime: string;
        message: string;
        reason: string;
        status: string;
        type: string;
      }>;
      contributors: Array<string>;
      excerpt: string;
      inProgress: boolean;
      lastModifyTime: string;
      permalink: string;
      phase: string;
    };
  };
  stats: {
    approvedComment: number;
    totalComment: number;
    upvote: number;
    visit: number;
  };
  tags: Array<{
    apiVersion: string;
    kind: string;
    metadata: {
      annotations: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      creationTimestamp: string;
      deletionTimestamp: string;
      finalizers: Array<string>;
      generateName: string;
      labels: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      };
      name: string;
      version: number;
    };
    spec: {
      color: string;
      cover: string;
      displayName: string;
      slug: string;
    };
    status: {
      permalink: string;
      postCount: number;
      visiblePostCount: number;
    };
  }>;
}

```
