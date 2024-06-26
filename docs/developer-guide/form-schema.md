---
title: 表单定义
---

在 Halo 2.0，在 Console 端的所有表单我们都使用了 [FormKit](https://github.com/formkit/formkit) 的方案。FormKit 不仅支持使用 Vue 组件的形式来构建表单，同时支持使用 Schema 的形式来构建。因此，我们的 [Setting](https://github.com/halo-dev/halo/blob/87ccd61ae5cd35a38324c30502d4e9c0ced41c6a/src/main/java/run/halo/app/core/extension/Setting.java#L20) 资源中的表单定义，都是使用 FormKit Schema 来定义的，最常用的场景即主题和插件的设置表单定义。当然，如果要在 Halo 2.0 的插件中使用，也可以参考 FormKit 的文档使用 Vue 组件的形式使用，但不需要在插件中引入 FormKit。

此文档将不会介绍 FormKit 的具体使用教程，因为我们已经很好的集成了 FormKit，并且使用方式基本无异。此文章将介绍 Halo 2.0 中表单定义的一些规范，以及额外的一些输入组件。

FormKit 相关文档：

- Form Schema: <https://formkit.com/essentials/schema>
- FormKit Inputs: <https://formkit.com/inputs>

:::tip
目前不支持 FormKit Pro 中的输入组件，但 Halo 额外提供了部分输入组件，将在下面文档列出。
:::

## Setting 资源定义方式

```yaml title="settings.yaml"
apiVersion: v1alpha1
kind: Setting
metadata:
  name: foo-setting
spec:
  forms:
    - group: group_1
      label: 分组 1
      formSchema:
        - $formkit: radio
          name: color_scheme
          label: 默认配色
          value: system
          options:
            - label: 跟随系统
              value: system
            - label: 深色
              value: dark
            - label: 浅色
              value: light

    - group: group_2
      label: 分组 2
      formSchema:
        - $formkit: text
          name: username
          label: 用户名
          value: ""
        - $formkit: password
          name: password
          label: 密码
          value: ""
```

:::tip
需要注意的是，FormKit Schema 本身应该是 JSON 格式的，但目前我们定义一个表单所使用的是 YAML，可能在参考 FormKit 写法时需要手动转换一下。
:::

字段说明：

1. `metadata.name`：设置资源的名称，建议以 `-setting` 结尾。
2. `spec.forms`：表单定义，可以定义多个表单，每个表单都有一个 `group` 字段，用于区分不同的表单。
3. `spec.forms[].label`：表单的标题。
4. `spec.forms[].formSchema`：表单的定义，使用 FormKit Schema 来定义。虽然我们使用的 YAML，但与 FormKit Schema 完全一致。

## 组件类型

除了 FormKit 官方提供的常用输入组件之外，Halo 还额外提供了一些输入组件，这些输入组件可以在 Form Schema 中使用。

### list

#### 描述

列表类型的输入组件，支持动态添加、删除数据项。

#### 参数

- `item-type`：数据项的数据类型，用于初始化数据。可选参数 `string`, `number`, `boolean`, `object`，默认为 `string`
- `min`：数组最小要求数量，默认为 `0`
- `max`：数组最大容量，默认为 `Infinity`，即无限制
- `addButton`：是否显示添加按钮
- `addLabel`：添加按钮的文本
- `upControl`：是否显示上移按钮
- `downControl`：是否显示下移按钮
- `insertControl`：是否显示插入按钮
- `removeControl`：是否显示移除按钮

#### 示例

```yaml
- $formkit: list
  name: socials
  label: 社交账号
  addLabel: 添加账号
  min: 1
  max: 5
  itemType: string
  children:
    - $formkit: text
      index: "$index"
      validation: required
```

:::tip
`list` 组件有且只有一个子节点，并且必须为子节点传递 `index` 属性。若想提供多个字段，则建议使用 `group` 组件包裹，并将 itemType 改为 object。
:::

最终保存表单之后得到的值为以下形式：

```json
{
  "socials": [
    "GitHub",
    "Twitter"
  ]
}
```

### verificationForm

#### 描述

用于远程验证一组数据是否符合要求的组件。

#### 参数

- `action`：对目标数据进行验证的接口地址
- `label`：验证按钮文本
- `submitAttrs`：验证按钮的额外属性

#### 示例

```yaml
- $formkit: verificationForm
  action: /apis/console.api.halo.run/v1alpha1/verify/verify-password
  label: 账户校验
  children:
    - $formkit: text
      label: "用户名"
      name: username
      validation: required
    - $formkit: password
      label: "密码"
      name: password
      validation: required
```

:::tip
尽管 `verificationForm` 本身是一个输入组件，但与其他输入组件不同的是，它仅仅用于包装待验证的数据，所以并不会破坏原始数据的格式。例如上述示例中的值在保存后为：

```json
{
  "username": "admin",
  "password": "admin"
}
```

而不是

```json
{
  "verificationForm": {
    "username": "admin",
    "password": "admin"
  }
}
```

:::

示例中发送至验证地址的值为如下格式：

```json
{
  "username": "admin",
  "password": "admin"
}
```

当验证接口返回成功响应时，则验证通过，否则验证失败。

若用户在验证失败时想显示错误信息，可以在验证接口返回错误信息，该错误信息的结构定义需遵循 [RFC 7807 - Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807.html) 。例如：

```json
{
  "title": "无效凭据",
  "status": 401,
  "detail": "用户名或密码错误。"
}
```

UI 效果：

<img src="/img/formkit/formkit-verify-form.png" width="50%" />

### repeater

#### 描述

一组重复的输入组件，可以用于定义一组数据，最终得到的数据为一个对象的数组，可以方便地让使用者对其进行增加、移除、排序等操作。

#### 参数

- `min`：数组最小要求数量，默认为 `0`
- `max`：数组最大容量，默认为 `Infinity`，即无限制
- `addButton`：是否显示添加按钮
- `addLabel`：添加按钮的文本
- `upControl`：是否显示上移按钮
- `downControl`：是否显示下移按钮
- `insertControl`：是否显示插入按钮
- `removeControl`：是否显示移除按钮

#### 示例

```yaml
- $formkit: repeater
  name: socials
  label: 社交账号
  value: []
  max: 5
  min: 1
  children:
    - $formkit: select
      name: enabled
      id: enabled
      label: 是否启用
      options:
        - label: 是
          value: true
        - label: 否
          value: false
    - $formkit: text
      # 在 Repeater 中进行条件判断的方式，当 enabled 为 true 时才显示
      if: "$value.enabled === true",
      name: name
      label: 名称
      value: ""
    - $formkit: text
      if: "$value.enabled === true",
      name: url
      label: 地址
      value: ""
```

:::tip
使用 `repeater` 类型时，一定要设置默认值，如果不需要默认有任何元素，可以设置为 `[]`。
:::

其中 `name` 和 `url` 即数组对象的属性，最终保存表单之后得到的值为以下形式：

```json
{
  "socials": [
    {
      "name": "GitHub",
      "url": "https://github.com/halo-dev"
    }
  ]
}
```

UI 效果：

<img src="/img/formkit/formkit-repeater.png" width="50%" />

### attachment

#### 描述

附件类型的输入框，支持直接调用附件库弹框选择附件。

#### 参数

- `accepts`：文件类型，数据类型为 `string[]`。

#### 示例

```yaml
- $formkit: attachment
  name: logo
  label: Logo
  accepts:
    - "image/png"
    - "video/mp4"
    - "audio/*"
  value: ""
```

### code

#### 描述

代码编辑器的输入组件，集成了 [Codemirror](https://codemirror.net/)。

#### 参数

- `language`：代码语言，目前支持 `yaml` `html` `javascript` `css` `json`。
- `height`：代码编辑器的高度。

#### 示例

```yaml
- $formkit: code
  name: footer_code
  label: 页脚代码注入
  value: ""
  language: yaml
```

### menuCheckbox

#### 描述

菜单复选框，用于选择系统内的导航菜单。其中选择的值为菜单资源 `metadata.name` 的集合。

#### 示例

```yaml
- $formkit: menuCheckbox
  name: menus
  label: 菜单
  value: []
```

### menuRadio

#### 描述

菜单单选框，用于选择系统内的导航菜单。其中选择的值为菜单资源 `metadata.name`。

#### 示例

```yaml
- $formkit: menuRadio
  name: menu
  label: 菜单
  value: ""
```

### postSelect

#### 描述

文章选择器，用于选择系统内的文章。其中选择的值为文章资源 `metadata.name`。

#### 示例

```yaml
- $formkit: postSelect
  name: post
  label: 文章
  value: ""
```

### singlePageSelect

#### 描述

单页选择器，用于选择系统内的独立页面。其中选择的值为独立页面资源 `metadata.name`。

#### 示例

```yaml
- $formkit: singlePageSelect
  name: singlePage
  label: 单页
  value: ""
```

### categorySelect

#### 描述

文章分类选择器，用于选择系统内的文章分类。其中选择的值为文章分类资源 `metadata.name`。

#### 示例

```yaml
- $formkit: categorySelect
  name: category
  label: 分类
  value: ""
```

### categoryCheckbox

#### 描述

文章分类复选框，用于选择系统内的文章分类。其中选择的值为文章分类资源 `metadata.name` 的集合。

#### 示例

```yaml
- $formkit: categoryCheckbox
  name: categories
  label: 分类
  value: []
```

### tagSelect

#### 描述

文章标签选择器，用于选择系统内的文章标签。其中选择的值为文章标签资源 `metadata.name`。

#### 示例

```yaml
- $formkit: tagSelect
  name: tag
  label: 标签
  value: ""
```

### tagCheckbox

#### 描述

文章标签复选框，用于选择系统内的文章标签。其中选择的值为文章标签资源 `metadata.name` 的集合。

#### 示例

```yaml
- $formkit: tagCheckbox
  name: tags
  label: 标签
  value: []
```
