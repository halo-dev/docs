```json title="ThemeVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:44:58.984Z"    // 创建时间
  },
  "spec": {
    "displayName": "string",                           // 显示名称
    "author": {                                        // 作者相关信息
      "name": "string",                                // 作者名称
      "website": "string"                              // 作者网站
    },
    "description": "string",                           // 主题描述
    "logo": "string",                                  // 主题 Logo
    "website": "string",                               // 主题网站
    "repo": "string",                                  // 主题仓库地址
    "version": "string",                               // 主题版本
    "requires": "string",                              // 主题依赖 Halo 版本的设置
    "settingName": "string",                           // 主题设置表单名称
    "configMapName": "string",                         // 主题配置名称
    "customTemplates": {}                              // 主题自定义模板设置
  },
  "config": {}                                         // 主题配置
}
```

其中：

1. `customTemplates`：一般不会在模板引擎中使用，使用文档请参考：[模板路由#自定义模板](../template-route-mapping.md#custom-templates)
2. `config`：主题配置，使用文档请参考：[设置选项](../settings.md)
