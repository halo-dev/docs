```jsonc title="MenuVo"
{
  "metadata": {
    "name": "string", // 唯一标识
    "labels": {
      "additionalProp1": "string",
    },
    "annotations": {
      "additionalProp1": "string",
    },
    "creationTimestamp": "2022-11-20T14:44:58.984Z", // 创建时间
  },
  "spec": {
    "displayName": "string", // 显示名称
    "menuItems": [
      // 自 Halo 2.26.0 起已弃用，请使用 MenuItem.spec.menuName 和 MenuItem.spec.parent
      "string",
    ],
  },
  "menuItems": "List<#MenuItemVo>", // menuFinder 根据当前层级关系构建的根菜单项集合
}
```
