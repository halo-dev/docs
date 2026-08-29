`Attachment` 由 `@halo-dev/api-client` 提供，请直接使用当前依赖中的生成类型，不要在插件中重新定义。常用字段包括：

- `metadata.name`：附件唯一标识。
- `spec.displayName`：附件显示名称，可能为空。
- `status?.permalink`：附件公开访问地址，状态尚未计算时可能为空。
- `status?.thumbnails`：按缩略图尺寸名称索引的地址集合，可能为空。
