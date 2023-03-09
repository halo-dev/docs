```json title="MenuItemVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T14:44:58.984Z",    // 创建时间
  },
  "spec": {
    "displayName": "string",                            // 显示名称，但是不要直接使用这个字段进行显示，最终字段为 status.displayName
    "href": "string",                                   // 链接，同样不要直接使用这个字段，最终字段为 status.href
    "priority": 0,                                      // 排序字段
    "children": [                                       // 下级菜单项，菜单项的 metadata.name 集合
      "string"
    ],
    "target": "#Target",                                // 菜单页面打开方式，枚举类型
    "targetRef": {                                      // 与其他资源比如文章的关联，一般无需直接使用
      "group": "string",
      "version": "string",
      "kind": "string",
      "name": "string"
    }
  },
  "status": {
    "displayName": "string",                            // 显示名称
    "href": "string"                                    // 链接
  },
  "children": "List<#MenuItemVo>",                      // 下级菜单项，MenuItemVo 的集合
  "parentName": "string",
}
```

```java title="Target"
enum Target {
    BLANK("_blank"),                                     // 在新窗口打开
    SELF("_self"),                                       // 在当前窗口打开
    PARENT("_parent"),                                   // 在父窗口打开
    TOP("_top");                                         // 在顶级窗口打开
}
```
