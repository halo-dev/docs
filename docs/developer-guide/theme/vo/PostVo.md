```json title="PostVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T12:45:43.888Z",    // 创建时间
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
    "publishTime": "2022-11-20T13:06:38.505Z",          // 发布时间
    "pinned": false,                                    // 是否置顶
    "allowComment": true,                               // 是否允许评论
    "visible": "PUBLIC",
    "priority": 0,
    "excerpt": {
      "autoGenerate": true,                             // 是否自动生成摘要
      "raw": "string"                                   // 摘要内容
    },
    "categories": [                                     // 分类的名称集合，即 Category 的 metadata.name 的集合
      "string"
    ],
    "tags": [                                           // 标签的名称集合，即 Tag 的 metadata.name 的集合
      "string"
    ],
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
    "commentsCount": 0,                                 // 评论数
    "contributors": [                                   // 贡献者名称，Contributor 的 metadata.name 的集合
      "string"
    ]
  },
  "categories": "List<#CategoryVo>",                    // 分类的集合
  "tags": "List<#TagVo>",                               // 标签的集合
  "contributors": "List<#Contributor>",                 // 贡献者的集合
  "owner": "#Contributor",                              // 创建者
  "stats": {
    "visit": 0,                                         // 访问数量
    "upvote": 0,                                        // 点赞数量
    "comment": 0                                        // 评论数量
  },
  "content": "#ContentVo"                               // 内容
}
```
