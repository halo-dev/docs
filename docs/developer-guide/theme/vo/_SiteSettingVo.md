```json title="SiteSettingVo"
{
  "title": "string",                      // 站点标题
  "subtitle": "string",                   // 站点副标题
  "url": "string",                        // 站点的外部访问链接
  "logo": "string",                       // Logo 地址
  "favicon": "string",                    // Favicon 地址
  "allowRegistration": false,             // 是否允许注册
  "post": {                               // 文章相关设置
    "postPageSize": 10,                   // 首页默认分页大小
    "archivePageSize": 10,                // 归档页默认分页大小
    "categoryPageSize": 10,               // 分类归档页默认分页大小
    "tagPageSize": 10                     // 标签归档页默认分页大小
  },
  "seo": {                                // SEO 相关设置
    "blockSpiders": false,                // 禁止搜索引擎抓取
    "keywords": "string",                 // 站点全局关键词，一般不需要主动使用，Halo 会自动插入到 head 标签中
    "description": "string"               // 站点全局描述，一般不需要主动使用，Halo 会自动插入到 head 标签中
  },
  "comment": {                            // 评论相关设置
    "enable": true,                       // 是否开启评论
    "systemUserOnly": false,              // 是否只允许登录用户评论
    "requireReviewForNew": false          // 是否需要审核新评论
  }
}
```
