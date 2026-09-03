```jsonc title="CategoryTreeVo"
{
  "metadata": {
    "name": "string", // 唯一标识
    "labels": {
      "additionalProp1": "string",
    },
    "annotations": {
      "additionalProp1": "string",
    },
    "creationTimestamp": "2022-11-20T14:18:49.230Z", // 创建时间
  },
  "spec": {
    "displayName": "string", // 显示名称
    "slug": "string", // 别名，通常用于生成 status.permalink
    "description": "string", // 描述
    "cover": "string", // 封面图
    "template": "string", // 自定义渲染模板名称
    "priority": 0, // 排序字段
    "parent": "string", // 父分类的 metadata.name，根分类为空
    "children": [
      // 已弃用，仅用于兼容旧数据，不再表示当前分类层级
      "string",
    ],
  },
  "status": {
    "permalink": "string", // 固定链接
  },
  "children": "List<#CategoryTreeVo>", // 下级分类，CategoryTreeVo 的集合
  "parentName": "string",
  "postCount": 0, // 文章数量
}
```
