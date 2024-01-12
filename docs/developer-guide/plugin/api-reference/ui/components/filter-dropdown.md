---
title: FilterDropdown
description: 过滤器下拉组件
---

## Props

| 属性名      | 类型                                  | 默认值      | 描述                                                |
|-------------|---------------------------------------|-------------|-----------------------------------------------------|
| `items`     | { label: string; value?: string \| boolean \| number; }[] | *无默认值*  | 包含 `label` 和可选 `value` 的对象数组。             |
| `label`     | string                              | *无默认值*  | 组件的标签文本。                                    |
| `modelValue`| string \| boolean \| number         | `undefined` | 可选。用于绑定到组件的值，可以是字符串、布尔值或数字。|

## Emits

| 事件名称          | 参数                                                        | 描述                   |
|---------------|-----------------------------------------------------------|----------------------|
| update:modelValue | `modelValue`: string \| boolean \| number \| undefined 类型，表示模型值。 | 当模型值更新时触发。       |
