```ts
export interface Attachment {
  apiVersion: "storage.halo.run/v1alpha1"
  kind: "Attachment"
  metadata: {
    annotations: {}
    creationTimestamp: string
    labels: {}
    name: string                                // 附件的唯一标识
    version: number
  }
  spec: {
    displayName: string                         // 附件名称
    groupName: string                           // 附件分组
    mediaType: string                           // 附件类型
    ownerName: string                           // 附件上传者
    policyName: string                          // 附件存储策略
    size: number                                // 附件大小
    tags: Array<string>
  }
  status: {
    permalink: string                           // 附件固定访问地址
  }
}
```
