---
title: 附件存储
description: 实现 AttachmentHandler 扩展 Halo 附件的上传、删除、共享链接、永久链接和缩略图能力，并注册 attachment-handler 扩展定义
---
附件存储策略扩展点支持扩展附件的上传和存储方式，如将附件存储到第三方云存储服务中。

扩展点接口如下：

```java
public interface AttachmentHandler extends ExtensionPoint {

    Mono<Attachment> upload(UploadContext context);

    Mono<Attachment> delete(DeleteContext context);

    default Mono<URI> getSharedURL(Attachment attachment,
      Policy policy,
      ConfigMap configMap,
      Duration ttl) {
      return Mono.empty();
    }
    
    default Mono<URI> getPermalink(Attachment attachment,
        Policy policy,
        ConfigMap configMap) {
        return Mono.empty();
    }

    default Mono<Map<ThumbnailSize, URI>> getThumbnailLinks(
        Attachment attachment,
        Policy policy,
        ConfigMap configMap
    ) {
        return Mono.empty();
    }
}
```

- `upload` 方法用于上传附件，返回值为 `Mono<Attachment>`，其中 `Attachment` 为上传成功后的附件对象。
- `delete` 方法用于删除附件，返回值为 `Mono<Attachment>`，其中 `Attachment` 为删除后的附件对象。
- `getSharedURL` 方法用于获取附件的共享链接，返回值为 `Mono<URI>`，其中 `URI` 为附件的共享链接。
- `getPermalink` 方法用于获取附件的永久链接，返回值为 `Mono<URI>`，其中 `URI` 为附件的永久链接。
- `getThumbnailLinks` 方法用于按 `ThumbnailSize` 返回附件的缩略图链接。新实现应使用此方法提供缩略图，不要再实现已废弃的 `thumbnail-provider`（`ThumbnailProvider`）扩展点。

`AttachmentHandler` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: attachment-handler
spec:
  className: run.halo.app.core.extension.attachment.endpoint.AttachmentHandler
  displayName: AttachmentHandler
  type: MULTI_INSTANCE
  description: "Provide extension points for attachment storage strategies"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `attachment-handler`。

源码参考：[AttachmentHandler](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/core/extension/attachment/endpoint/AttachmentHandler.java)。

可以参考以下项目示例：

- [S3 对象存储协议的存储插件](https://github.com/halo-dev/plugin-s3)
- [阿里云 OSS 的存储策略插件](https://github.com/halo-sigs/plugin-alioss)
- [又拍云 OSS 的存储策略](https://github.com/AirboZH/plugin-uposs)
