`OperationItem<T>` 由 `@halo-dev/ui-shared` 提供，请直接使用当前依赖中的类型。`priority` 和使用 `markRaw` 包装的 `component` 为必需字段；`props`、`action`、`label`、`hidden`、`permissions` 和递归的 `children` 为可选字段。

`priority` 越小，操作项的显示位置越靠前（内置操作项通常以 0、10、20… 依次排列，如需插入到内置项之间，可选择中间值）。
