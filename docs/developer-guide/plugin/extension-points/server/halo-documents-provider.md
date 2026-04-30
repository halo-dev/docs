---
title: 搜索文档提供者
description: 为搜索引擎提供可索引文档数据的扩展点。
---

搜索文档提供者扩展点用于为 Halo 搜索引擎提供可索引的文档数据，例如：文章、页面等。当重建搜索索引时，Halo 会收集所有启用的文档提供者，获取它们提供的文档数据并写入搜索引擎。

```java
public interface HaloDocumentsProvider extends ExtensionPoint {

    Flux<HaloDocument> fetchAll();

    String getType();
}
```

- `fetchAll` 方法用于获取所有文档数据，返回 `Flux<HaloDocument>`。`HaloDocument` 包含标题、内容、分类、标签等字段。
- `getType` 方法返回文档类型标识，例如 `post.content.halo.run`、`singlepage.content.halo.run`。

`HaloDocumentsProvider` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: halo-documents-provider
spec:
  className: run.halo.app.search.HaloDocumentsProvider
  displayName: "搜索文档提供者"
  type: MULTI_INSTANCE
  description: "提供用于重建搜索索引的文档数据"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `halo-documents-provider`。

使用案例可以参考：

- [文章搜索文档提供者](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/search/post/PostHaloDocumentsProvider.java)
- [Meilisearch 搜索插件](https://github.com/halo-sigs/plugin-meilisearch)
