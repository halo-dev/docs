```ts title="OperationItem"
export interface OperationItem<T> {
  priority: number;                 // 排序优先级
  component: Raw<Component>;        // 菜单项组件
  props?: Record<string, unknown>;  // 菜单项组件属性
  action?: (item?: T) => void;      // 菜单项点击事件
  label?: string;                   // 菜单项标题
  hidden?: boolean;                 // 菜单项是否隐藏
  permissions?: string[];           // 菜单项 UI 权限
  children?: OperationItem<T>[];    // 子菜单项
}
```
