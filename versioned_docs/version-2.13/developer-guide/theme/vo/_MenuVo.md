```json title="MenuVo"
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
    "displayName": "string",                            // 显示名称
    "menuItems": [                                      // 菜单的菜单项名称集合，即 MenuItem 的 metadata.name 的集合
      "string"
    ]
  },
  "menuItems": "List<#MenuItemVo>"                      // 菜单项的集合
}
```
