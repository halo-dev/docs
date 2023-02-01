```json title="ListedSinglePageVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:31:00.876Z"    // 创建时间
  },
  "spec": {
    "title": "string",                                  // 标题
    "slug": "string",                                   // 别名，通常用于生成 status.permalink
    "releaseSnapshot": "string",
    "headSnapshot": "string",
    "baseSnapshot": "string",
    "owner": "string",                                  // 创建者名称，即 Contributor 的 metadata.name，非显示名称
    "template": "string",                               // 自定义渲染模板
    "cover": "string",                                  // 封面图
    "deleted": false,
    "publish": false,
    "publishTime": "2022-11-20T14:31:00.876Z",          // 发布时间
    "pinned": false,                                    // 是否置顶
    "allowComment": true,                               // 是否允许评论
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,                             // 是否自动生成摘要
      "raw": "string"                                   // 摘要内容
    },
    "htmlMetas": [
      {
        "additionalProp1": "string"
      }
    ]
  },
  "status": {
    "permalink": "string",                              // 固定链接
    "excerpt": "string",                                // 最终生成的摘要
    "inProgress": true,
    "lastModifyTime": "2022-11-20T13:06:38.505Z",       // 最后修改时间
    "commentsCount": 0,                                 // 评论数
    "contributors": [                                   // 贡献者名称，Contributor 的 metadata.name 的集合
      "string"
    ]
  },
  "stats": {
    "visit": 0,                                         // 访问数量
    "upvote": 0,                                        // 点赞数量
    "comment": 0                                        // 评论数量
  },
  "contributors": "List<#Contributor>",                 // 贡献者的集合
  "owner": "#Contributor"                               // 创建者
}
```
