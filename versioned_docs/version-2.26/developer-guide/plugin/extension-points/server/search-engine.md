---
title: 搜索引擎
description: 为 Halo 提供内容搜索引擎的扩展点，可用于替换默认的搜索实现。
---

搜索引擎扩展点用于扩展 Halo 的内容搜索能力，例如：使用 Elasticsearch、Meilisearch 等替代内置的 Lucene 搜索引擎。

```java
public interface SearchEngine extends ExtensionPoint {

    boolean available();

    void addOrUpdate(Iterable<HaloDocument> haloDocuments);

    void deleteDocument(Iterable<String> haloDocIds);

    void deleteAll();

    SearchResult search(SearchOption option);
}
```

- `available` 方法用于判断搜索引擎是否可用，返回 `true` 表示可用。
- `addOrUpdate` 方法用于添加或更新搜索文档。
- `deleteDocument` 方法用于根据文档 ID 删除搜索文档。
- `deleteAll` 方法用于删除所有搜索文档。
- `search` 方法用于执行搜索，参数 `option` 为搜索选项，返回 `SearchResult` 搜索结果。

`SearchOption` 包含以下常用字段：

- `keyword`：搜索关键词。
- `limit`：返回结果数量限制，默认 10，最大 1000。
- `highlightPreTag` / `highlightPostTag`：高亮标签，默认 `<B>` / `</B>`。
- `filterExposed` / `filterRecycled` / `filterPublished`：是否过滤公开/回收站/已发布内容。
- `includeTypes`：包含的文档类型，例如 `post.content.halo.run`、`singlepage.content.halo.run`。
- `includeOwnerNames`：包含的文档所有者。
- `includeCategoryNames` / `includeTagNames`：包含的分类和标签。

`HaloDocument` 为搜索文档对象，包含以下字段：

- `id`：全局唯一文档 ID。
- `metadataName`：对应扩展的 metadata name。
- `title`：文档标题。
- `description`：文档描述。
- `content`：文档内容（安全内容，无 HTML 标签）。
- `categories` / `tags`：分类和标签的 metadata name 列表。
- `published` / `recycled` / `exposed`：发布、回收站、公开状态。
- `ownerName`：文档所有者。
- `creationTimestamp` / `updateTimestamp`：创建和更新时间。
- `permalink`：文档永久链接。
- `type`：文档类型，例如 `post.content.halo.run`。

`SearchEngine` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: search-engine
spec:
  className: run.halo.app.search.SearchEngine
  displayName: "搜索引擎"
  type: SINGLETON
  description: "扩展内容搜索引擎"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `search-engine`。

使用案例可以参考：

- [Halo 内置 Lucene 搜索引擎](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/search/lucene/LuceneSearchEngine.java)
- [Meilisearch 搜索插件](https://github.com/halo-sigs/plugin-meilisearch)
