```json title="TagVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T13:06:38.512Z",    // 创建时间
  },
  "spec": {
    "displayName": "string",                            // 显示名称
    "slug": "string",                                   // 别名，通常用于生成 status.permalink
    "color": "#F9fEB1",                                 // 背景颜色
    "cover": "string"                                   // 封面图
  },
  "status": {
    "permalink": "string",                              // 固定链接
    "visiblePostCount": 0,                              // 已发布文章数
    "postCount": 0                                      // 文章数
  },
  "postCount": 0
}
```
