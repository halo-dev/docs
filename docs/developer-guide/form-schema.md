---
title: 表单定义与组件速查
description: 面向 Halo 主题、插件和元数据表单的 FormKit Schema 通用速查，介绍 Setting 结构、默认值、数据边界以及扩展输入组件。
---

从 Halo 2.0 开始，Console 端的表单使用 [FormKit](https://github.com/formkit/formkit) 构建。FormKit 既支持 Vue 组件，也支持可序列化的 Schema。Halo 的主题设置、插件设置和元数据表单都可以复用 FormKit Schema 和本文列出的扩展输入组件。

本文是通用速查，只说明 [Setting](https://github.com/halo-dev/halo/blob/main/api/src/main/java/run/halo/app/core/extension/Setting.java) 结构、Schema 约束和输入组件契约。如何关联资源、读取配置以及处理场景特有的限制，请先进入对应指南。

## 选择正确的使用场景

| 场景                 | 指南                                              | 本页提供的内容                                             |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| 主题设置             | [设置选项](./theme/settings.md)                   | Schema 字段和可用输入组件                                  |
| 插件设置或自定义表单 | [插件设置与表单组件](./plugin/basics/ui/forms.md) | Setting Schema、宿主输入组件和数据边界                     |
| 模型元数据表单       | [元数据表单定义](./annotations-form.md)           | 可返回字符串的输入组件；具体值类型限制以元数据表单指南为准 |

FormKit 相关文档：

- Form Schema: [https://formkit.com/essentials/schema](https://formkit.com/essentials/schema)
- FormKit Inputs: [https://formkit.com/inputs](https://formkit.com/inputs)

:::tip 组件支持范围
Halo 使用 FormKit 开源版本提供的默认输入组件，不支持 FormKit Pro 输入组件。Halo 额外提供的组件将在下文列出。
:::

## 常用 FormKit 原生输入

Halo 已经注册 FormKit 开源版本的原生输入。以下是 Setting Schema 中常用的类型，具体参数和验证规则以 FormKit 官方文档为准。

| 类型                | 用途                             |
| ------------------- | -------------------------------- |
| `text`、`textarea`  | 单行或多行文本                   |
| `email`、`url`      | 邮箱或 URL，并可配合对应验证规则 |
| `number`、`range`   | 数值或范围                       |
| `checkbox`、`radio` | 多选、布尔开关或单选项           |
| `date`、`time`      | 日期或时间                       |
| `password`          | 遮蔽输入内容，但不会加密保存值   |

Halo 已覆盖原生 `select`，请使用本文的 [`select`](#select) 参数。附件应优先使用 [`attachment`](#attachment)，不要使用 FormKit 原生文件上传自行实现附件管理。

插件需要注册自定义输入类型时，通过 UI 入口文件的 `formkit.inputs` 注册，详细文档请参考 [插件 FormKit 扩展](./plugin/api-reference/ui/formkit.md)。

## Setting 资源定义方式

```yaml title="settings.yaml"
apiVersion: v1alpha1
kind: Setting
metadata:
  name: example-setting
spec:
  forms:
    - group: general
      label: 基础设置
      formSchema:
        - $formkit: text
          name: display_name
          label: 显示名称
          value: 示例
        - $formkit: radio
          name: display_mode
          label: 展示模式
          value: list
          options:
            - label: 列表
              value: list
            - label: 网格
              value: grid

    - group: features
      label: 功能设置
      formSchema:
        - $formkit: switch
          name: enabled
          label: 启用功能
          value: true
```

:::warning 不要在 Setting 中直接保存敏感信息
Setting 的值最终保存在 ConfigMap 中。`password` 输入类型只会隐藏界面上的输入内容，并不会加密保存的数据。密码、Token、API Key 等敏感信息应保存在 Halo 的 Secret 资源中，并通过 [`secret`](#secret) 组件选择对应资源。
:::

:::tip 遵循具体场景的设置边界
主题设置不应重复定义 Logo、favicon、全局代码注入和系统级 SEO，具体边界请参考[主题设置选项](./theme/settings.md#区分系统设置与主题设置)。插件设置也应只包含插件自身的业务配置，不要为 Halo 已有的系统设置增加第二个配置入口。
:::

:::tip YAML 与 FormKit Schema
FormKit Schema 是可 JSON 序列化的数据结构，Setting 使用 YAML 只是资源文件的表示形式，不需要手动进行 JSON 与 YAML 转换。可以将 FormKit 文档中的对象结构改写为等价的 YAML，但不能直接在 YAML 中定义 JavaScript 函数。只有渲染端通过 Schema `data` 提供的函数才能在表达式中调用。
:::

字段说明：

1. `metadata.name`：设置资源的名称，建议以 `-setting` 结尾。
2. `spec.forms`：必填的表单定义列表，至少包含一个表单分组。
3. `spec.forms[].group`：必填的分组名称，同时也是 ConfigMap 中保存该组数据的键。发布后应保持稳定，并且不能与同一 Setting 中的其他分组重复。
4. `spec.forms[].label`：可选的表单标题。
5. `spec.forms[].formSchema`：必填的 FormKit Schema 节点列表。

每个需要持久化的输入项都应设置唯一的 `name`。保存后，该 `name` 将作为表单数据对象中的字段名。

:::tip 默认值的提取规则
Halo 只会从 `formSchema` 的直接子节点中提取同时具有 `name` 和 `value` 的节点，用于初始化对应 ConfigMap。嵌套在 `children` 中的节点不会被递归提取；`list`、`array` 等容器需要在容器节点上设置完整的默认 `value`。
:::

## Halo 扩展组件速查

| 组件                                                                                                                                      | 用途                   | 保存值                 |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------- |
| [`select`](#select)                                                                                                                       | 静态或远程选择         | `string` 或 `string[]` |
| [`list`](#list)                                                                                                                           | 基本类型或对象列表     | 数组                   |
| [`verificationForm`](#verificationform)                                                                                                   | 提交前远程验证一组字段 | 不改变子字段的数据结构 |
| [`attachment`](#attachment) / [`attachmentInput`](#attachmentinput)                                                                       | 上传或选择附件         | `string` 或 `string[]` |
| [`attachmentGroupSelect`](#attachmentgroupselect) / [`attachmentPolicySelect`](#attachmentpolicyselect)                                   | 选择附件分组或存储策略 | `string`               |
| [`code`](#code)                                                                                                                           | 编辑代码或结构化文本   | `string`               |
| [`color`](#color)                                                                                                                         | 选择颜色               | `string`               |
| [`menuSelect`](#menuselect) / [`menuItemSelect`](#menuitemselect) / [`menuCheckbox`](#menucheckbox) / [`menuRadio`](#menuradio)           | 选择菜单或菜单项       | 资源名称或资源名称数组 |
| [`postSelect`](#postselect) / [`singlePageSelect`](#singlepageselect)                                                                     | 选择文章或独立页面     | 资源名称               |
| [`categorySelect`](#categoryselect) / [`tagSelect`](#tagselect) / [`categoryCheckbox`](#categorycheckbox) / [`tagCheckbox`](#tagcheckbox) | 选择分类或标签         | `string` 或 `string[]` |
| [`roleSelect`](#roleselect) / [`userSelect`](#userselect)                                                                                 | 选择角色或用户         | 资源名称               |
| [`iconify`](#iconify)                                                                                                                     | 选择 Iconify 图标      | `string` 或对象        |
| [`array`](#array)                                                                                                                         | 编辑对象数组           | 对象数组               |
| [`switch`](#switch) / [`toggle`](#toggle)                                                                                                 | 在预设值之间切换       | 单值或数组             |
| [`secret`](#secret)                                                                                                                       | 选择 Secret 资源       | Secret 资源名称        |

:::warning 组件可用不代表数据可直接使用

- `verificationForm` 需要可访问的服务端验证接口，通常由插件或其他服务端扩展提供。
- `secret` 只保存 Secret 资源名称，Secret 内容必须由服务端读取，主题模板不能通过设置值直接获得凭据。
- `multiple: true` 会让部分选择器返回数组，不适用于只允许字符串值的 AnnotationSetting。
- 组件涉及的附件、用户、角色、分类、标签等资源仍受当前用户权限限制。

:::

## 组件类型

除了 FormKit 官方提供的常用输入组件之外，Halo 还额外提供了一些输入组件，这些输入组件可以在 Form Schema 中使用。

### select

#### 描述

自定义的选择器组件，支持静态和动态数据源，支持多选等功能。

选项对象至少需要包含 `label` 与 `value`。除此之外，还可以提供 `icon` 与 `description` 用于增强下拉选项展示（引入版本：2.25.0，远程动态数据源可通过 `requestOption.iconField` 与 `requestOption.descriptionField` 映射响应字段）：

- `icon`：图标图片地址，会以 `<img>` 渲染。
- `description`：显示在 `label` 下方的说明文字，同时参与本地静态选项搜索。

选中后的单选展示和多选标签仍然只显示 `label`，提交值保持为选项的 `value`，多选时提交 `value` 数组。

#### 参数 {#select-params}

- `options`：静态数据源。当 `action` 存在时，此参数无效。
- `action`：远程动态数据源的接口地址。
- `requestOption`：动态数据源的请求参数，可以通过此参数来指定如何获取数据，适配不同的接口。当 `action` 存在时，此参数有效。
- `remoteOptimize`：是否开启远程数据源优化，默认为 `true`。开启后，将会对远程数据源进行优化，减少请求次数。仅在动态数据源下有效。
- `allowCreate`：是否允许把搜索关键词作为新选项值，默认为 `false`，需要同时开启 `searchable`。此选项不会在远程服务中创建对应资源。
- `clearable`：是否允许清空选项，默认为 `false`。
- `multiple`：是否多选，默认为 `false`。
- `maxCount`：多选时最大可选数量，默认为 `Infinity`。仅在多选时有效。
- `sortable`：是否支持拖动排序，默认为 `true`。仅在多选时有效。
- `searchable`: 是否支持搜索，默认为 `false`。
- `autoSelect`：当初始值不存在且未设置 `placeholder` 时，是否自动选择第一个选项，默认为 `true`。仅在单选时有效。

#### 参数类型定义

```ts
{
  options?: Array<
    Record<string, unknown> & {
      label: string;
      value: string;
      icon?: string;
      description?: string;
      attrs?: {
        disabled?: boolean;
      };
    }
  >;
  action?: string;
  requestOption?: {
    method?: "GET" | "POST";

    /**
     * 请求结果中 page 的字段名，默认为 `page`。
     */
    pageField?: PropertyPath;

    /**
     * 请求结果中 size 的字段名，默认为 `size`。
     */
    sizeField?: PropertyPath;

    /**
     * 请求结果中 total 的字段名，默认为 `total`。
     */
    totalField?: PropertyPath;

    /**
     * 从请求结果中解析数据的字段名，默认为 `items`。
     */
    itemsField?: PropertyPath;

    /**
     * 从 items 中解析出 label 的字段名，默认为 `label`。
     */
    labelField?: PropertyPath;

    /**
     * 从 items 中解析出 value 的字段名，默认为 `value`。
     */
    valueField?: PropertyPath;

    /**
     * 从 items 中解析出选项图标地址的字段名。
     */
    iconField?: PropertyPath;

    /**
     * 从 items 中解析出选项描述的字段名。
     */
    descriptionField?: PropertyPath;

    /**
     * 使用 value 查询详细信息时，fieldSelector 的查询参数 key，默认为 `metadata.name`。
     */
    fieldSelectorKey?: PropertyPath;
  };
  remoteOptimize?: boolean;
  allowCreate?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxCount?: number;
  sortable?: boolean;
  searchable?: boolean;
  autoSelect?: boolean;
}
```

`PropertyPath` 表示响应对象中的属性路径，例如 `post.spec.title`。

#### 静态数据示例

```yaml
- $formkit: select
  name: countries
  label: What country makes the best food?
  sortable: true
  multiple: true
  clearable: true
  searchable: true
  placeholder: Select a country
  options:
    - label: China
      value: cn
      icon: /assets/flags/cn.svg
      description: Chinese cuisine with rich regional styles
    - label: France
      value: fr
      icon: /assets/flags/fr.svg
      description: French cuisine and bakery classics
    - label: Germany
      value: de
    - label: Spain
      value: es
    - label: Italy
      value: it
    - label: Greece
      value: gr
```

#### 远程动态数据示例

支持远程动态数据源，通过 `action` 和 `requestOption` 参数来指定如何获取数据。

请求的接口将会自动拼接 `page`、`size` 与 `keyword` 参数，其中 `keyword` 为搜索关键词。

`action` 使用 Halo Console 提供的 Axios 实例和当前登录会话发起请求，因此应指向当前用户有权访问的同源 Halo API。如果需要访问第三方服务，应由插件后端代理请求并向 Console 暴露受权限保护的接口。

```yaml
- $formkit: select
  name: postName
  label: Choose a post
  clearable: true
  action: /apis/api.console.halo.run/v1alpha1/posts
  requestOption:
    method: GET
    pageField: page
    sizeField: size
    totalField: total
    itemsField: items
    labelField: post.spec.title
    valueField: post.metadata.name
    iconField: post.spec.cover
    descriptionField: post.status.excerpt
    fieldSelectorKey: metadata.name
```

:::tip 分页数据的默认选项
当远程数据具有分页时，可能会出现默认选项不在第一页的情况，此时 Select 组件将会发送另一个查询请求，以获取默认选项的数据。此接口会携带如下参数：

```ts
fieldSelector: `${requestOption.fieldSelectorKey}=(value1,value2,value3)`;
```

其中，value1, value2, value3 为默认选项的值。返回值与查询一致，通过 `requestOption` 解析。
:::

### list

#### 描述

列表类型的输入组件，支持动态添加、删除数据项。

:::tip list 与 array 的区别
`list` 组件与 [array](#array) 组件功能类似，但它们的用途不同。`list` 组件适合展示基本类型的数据，而 `array` 组件更适合于展示复杂类型的数据。
:::

#### 参数

- `itemType`：数据项的数据类型，用于初始化数据。可选参数 `string`、`number`、`boolean`、`object`，默认为 `string`
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

:::tip list 子节点限制
`list` 组件有且只有一个子节点，并且必须为子节点传递 `index` 属性。若想提供多个字段组成对象，则建议改为使用 [array](#array) 组件。
:::

最终保存表单之后得到的值为以下形式：

```json
{
  "socials": ["GitHub", "Twitter"]
}
```

### verificationForm

#### 描述

用于远程验证一组数据是否符合要求的组件。

#### 参数

- `action`：对目标数据进行验证的接口地址
- `label`：验证按钮文本
- `buttonAttrs`：验证按钮的属性，例如通过 `disabled` 禁用按钮

#### 示例

```yaml
- $formkit: verificationForm
  action: /apis/console.api.my-plugin.halo.run/v1alpha1/configurations/verify
  label: 验证配置
  children:
    - $formkit: text
      label: 仓库地址
      name: repository_url
      validation: required|url
    - $formkit: text
      label: 分支
      name: branch
      value: main
      validation: required
```

:::tip verificationForm 不改变数据结构
尽管 `verificationForm` 本身是一个输入组件，但与其他输入组件不同的是，它仅仅用于包装待验证的数据，所以并不会破坏原始数据的格式。例如上述示例中的值在保存后为：

```json
{
  "repository_url": "https://github.com/halo-dev/halo",
  "branch": "main"
}
```

而不是

```json
{
  "verificationForm": {
    "repository_url": "https://github.com/halo-dev/halo",
    "branch": "main"
  }
}
```

:::

示例中发送至验证地址的值为如下格式：

```json
{
  "repository_url": "https://github.com/halo-dev/halo",
  "branch": "main"
}
```

当验证接口返回成功响应时，则验证通过，否则验证失败。

若用户在验证失败时想显示错误信息，可以在验证接口返回错误信息，该错误信息的结构定义需遵循 [RFC 7807 - Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807.html)。例如：

```json
{
  "title": "配置验证失败",
  "status": 400,
  "detail": "无法访问指定的仓库或分支。"
}
```

UI 效果：

<img src="/img/formkit/formkit-verify-form.png" width="50%" />

### ~~repeater~~(已过时)

:::warning 请使用 array 组件
`repeater` 组件已不再推荐使用，请使用 [array](#array) 组件代替。
:::

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
      if: "$value.enabled === true"
      name: name
      label: 名称
      value: ""
    - $formkit: text
      if: "$value.enabled === true"
      name: url
      label: 地址
      value: ""
```

:::tip 设置 repeater 默认值
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

:::info Halo 2.22 的 attachment 类型变更
在 Halo 2.22 中，我们重构了原有的 attachment 表单类型，支持了预览和直接上传文件，并将旧版的表单类型更名为了 [attachmentInput](#attachmentinput)。
:::

附件类型的输入框，支持预览附件、直接上传文件、从附件库选择。

#### 参数

- `accepts`：允许选择的文件类型，数据类型为 `string[]`，默认为 `["*"]`
- `width`：预览区域宽度，默认为 `5rem`
- `aspectRatio`：预览区域长宽比，默认为 `1/1`，也可以设置为 `16/9` 等比例
- `multiple`：是否支持多选，默认为 `false`。设置为 `true` 后，值为字符串数组

#### 示例

```yaml
- $formkit: attachment
  name: hero_image
  label: 首页横幅
  width: 10rem
  aspectRatio: 16/9
  accepts:
    - "image/png"
    - "image/jpeg"
    - "image/webp"
  value: ""
```

附件上传和附件库入口会根据当前用户权限显示；用户也可以输入可访问的附件链接。

### attachmentInput

#### 描述

附件类型的输入框，支持直接调用附件库弹框选择附件。

#### 参数

- `accepts`：文件类型，数据类型为 `string[]`

#### 示例

```yaml
- $formkit: attachmentInput
  name: project_cover
  label: 项目封面
  accepts:
    - "image/png"
    - "image/jpeg"
  value: ""
```

### attachmentGroupSelect

附件分组选择器，用于选择系统中未被隐藏的附件分组，保存值为分组资源的 `metadata.name`。

**引入版本**：2.4.0

```yaml
- $formkit: attachmentGroupSelect
  name: attachment_group
  label: 附件分组
  value: ""
```

### attachmentPolicySelect

附件存储策略选择器，用于选择系统中的附件存储策略，保存值为策略资源的 `metadata.name`。

**引入版本**：2.4.0

```yaml
- $formkit: attachmentPolicySelect
  name: attachment_policy
  label: 存储策略
  value: ""
```

### code

#### 描述

代码编辑器的输入组件，集成了 [Codemirror](https://codemirror.net/)。

#### 参数

- `language`：代码语言，目前支持 `yaml`、`html`、`javascript`、`css`、`json`、`markdown`。其中 `markdown` 从 Halo 2.22.0 开始支持。
- `height`：代码编辑器的高度。

#### 示例

```yaml
- $formkit: code
  name: mapping_rules
  label: 字段映射规则
  value: |-
    title: spec.title
    cover: spec.cover
  language: yaml
```

### color

颜色选择器，支持通过拾色器或文本输入颜色，保存值为指定格式的字符串。

**引入版本**：2.22.0

#### 参数

- `format`：颜色格式，可选值为 `hex`、`hex8`、`rgb`、`hsl`，默认为 `hex`

```yaml
- $formkit: color
  name: accent_color
  label: 强调色
  format: hex
  value: "#2563eb"
```

### menuSelect

#### 描述

菜单选择器，用于选择系统内的导航菜单，支持单选、多选、排序。

#### 示例

```yaml
- $formkit: menuSelect
  name: menus
  label: 菜单
  multiple: true
  value: []
```

:::info menuSelect 兼容 select 参数
menuSelect 基于 select，并兼容 select 的[参数](#select-params)。
:::

### menuItemSelect

菜单项选择器，用于从指定的菜单项资源中选择一项，保存值为菜单项资源的 `metadata.name`。

**引入版本**：2.4.0

#### 参数

- `menuItems`：必填的菜单项资源名称数组，用于限定可选范围

```yaml
- $formkit: menuItemSelect
  name: featured_menu_item
  label: 推荐菜单项
  menuItems:
    - menu-item-a
    - menu-item-b
  value: ""
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

文章选择器，用于选择系统内已发布且未删除的文章。其中选择的值为文章资源 `metadata.name`。

#### 示例

```yaml
- $formkit: postSelect
  name: post
  label: 文章
  value: ""
```

### singlePageSelect

#### 描述

单页选择器，用于选择系统内已发布且未删除的独立页面。其中选择的值为独立页面资源 `metadata.name`。

#### 示例

```yaml
- $formkit: singlePageSelect
  name: singlePage
  label: 单页
  value: ""
```

### categorySelect

#### 描述

文章分类选择器，用于选择系统内的文章分类。其中选择的值为文章分类资源 `metadata.name`；开启多选后，值为资源名称数组。

#### 参数

- `multiple`：是否支持多选，默认为 `false`
- `excludedNames`：需要排除的分类资源名称数组（引入版本：2.26.0）
- `allowCreate`：是否允许创建新分类，默认为 `true`（引入版本：2.26.0）

#### 示例

```yaml
- $formkit: categorySelect
  name: category
  label: 分类
  allowCreate: false
  value: ""
```

创建分类需要当前用户具有文章管理权限。如果设置表单只应选择现有分类，请显式设置 `allowCreate: false`。

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

文章标签选择器，用于选择系统内的文章标签。其中选择的值为文章标签资源 `metadata.name`；开启多选后，值为资源名称数组。

#### 参数

- `multiple`：是否支持多选，默认为 `false`

#### 示例

```yaml
- $formkit: tagSelect
  name: tags
  label: 标签
  multiple: true
  value: []
```

当用户输入不存在的标签且具有文章管理权限时，选择器可以创建新标签。使用方不应假定该组件只会读取已有资源。

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

### roleSelect

角色选择器，用于选择系统中的非模板角色，保存值为角色资源的 `metadata.name`。

**引入版本**：2.4.0

```yaml
- $formkit: roleSelect
  name: default_role
  label: 默认角色
  value: ""
```

### userSelect

用户选择器，支持远程搜索，并排除匿名用户和已删除用户，保存值为用户资源的 `metadata.name`。

**引入版本**：2.4.0

```yaml
- $formkit: userSelect
  name: owner
  label: 负责人
  value: ""
```

### iconify

统一的图标选择器，基于 [Iconify](https://iconify.design/)。

**引入版本**: 2.22.0

示例

```yaml
- $formkit: iconify
  name: social_icon
  label: 社交图标
  format: svg # svg / dataurl / url / name
```

#### 参数

- `format`：图标格式，默认为 `svg`
  - `svg`：svg 字符串
  - `dataurl`：经过 URI 编码的 SVG Data URL，可以直接用于 `img` 标签
  - `url`：Iconify 的 CDN 链接
  - `name`：Iconify 的图标名称，需要在使用的地方自行加载图标
- `value-only`：是否仅返回图标数据，默认为 `false`
- `popper-placement`：图标选择弹窗的打开位置，默认为 `auto`，可以为：`auto`、`auto-end`、`auto-start`、`bottom`、`bottom-end`、`bottom-start`、`left`、`left-end`、`left-start`、`right`、`right-end`、`right-start`、`top`、`top-end`、`top-start`
- `sizing`：图标尺寸配置对象（引入版本：2.23.0），包含以下属性：
  - `enabled`：是否显示图标尺寸配置，默认为 `false`
  - `default`：默认尺寸，字符串类型，默认为 `"24"`
  - `presets`：预设尺寸，字符串数组类型

#### 值类型

当 `value-only` 参数为 `true` 时，此表单项的值为 `string` 类型，比如当 `format` 为 `svg` 时，返回值数据形如 `<svg>...</svg>`

当 `value-only` 参数不填写或为 `false` 时，表单类型的值为对象，包含以下属性：

- `value`: 图标数据，当 `format` 参数不同时，value 的形式也不同，具体如下：
  - `svg`：value 的值为 svg 字符串，可以直接放置在 HTML 中使用
  - `dataurl` / `url`：可以使用 `img` 标签加载
  - `name`：Iconify 对应的图标名称，需要在前端加载 [Iconify](https://iconify.design/docs/iconify-icon/) 的依赖配合使用
- `name`：Iconify 对应的图标名称，保留这个字段的目的是为了在 Console 中回显图标信息，通常不需要使用此字段
- `width`：用户在选择图标时设置的图标大小，此字段的目的是为了在 Console 中再次编辑时回显，通常不需要使用此字段
- `color`：用户在选择图标时设置的图标颜色，此字段的目的是为了在 Console 中再次编辑时回显，通常不需要使用此字段

在主题模板中的使用示例：

```html
<!-- 当 format 为 name 时，使用 Iconify 封装的 Web Component 加载图标 -->
<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
<iconify-icon th:icon="${theme.config.group.social_icon.value}"></iconify-icon>

<!-- svg -->
<th:block th:utext="${theme.config.group.social_icon.value}"></th:block>

<!-- dataurl 或者 url -->
<img th:src="${theme.config.group.social_icon.value}" />
```

开发者可根据具体使用情况自行选择图标格式，通常推荐 `svg` 或者 `dataurl`，因为这样无需任何网络请求，确保图标可以稳定地正常加载。

UI 效果：

<p>
<img src="/img/formkit/formkit-iconify.png" width="50%" class="medium-zoom-image" />
</p>

### array

一组重复的输入组件，展示为列表形式，可以用于定义一组数据。最终得到的数据为一个对象的数组，方便使用者对此数组进行增加、删除、排序等操作。

**引入版本**: 2.22.0（计划用于替换已过时的 `repeater` 组件）

参数

- `min`：数组最小要求数量，默认为 `0`
- `max`：数组最大容量，默认为 `Infinity`，即无限制
- `removeControl`：是否允许移除元素
- `addButton`：是否显示添加按钮
- `addLabel`：添加按钮上显示的文本
- `addAttrs`：添加按钮的额外属性
- `emptyText`: 当数组为空时显示的文本
- `itemLabels`: 列表元素上显示的内容，数据类型为 `{ type: "image" | "text" | "iconify" | "color"; label: string }[]`

:::tip 建议设置 itemLabels
强烈建议为 `array` 设置 `itemLabels` 属性，以便于更直观的展示元素内容，设置的元素内容将按照设置顺序展示在列表元素上。

在 `itemLabels` 中定义 `label` 时，可以使用 `$value` 指向当前项的值，也可以使用 `$value.name`、`$value.profile.name` 等路径读取嵌套字段。
:::

#### 示例

```yaml
- $formkit: array
  name: socials
  label: 社交账号
  value: []
  max: 5
  min: 1
  itemLabels:
    - type: image
      label: $value.icon
    - type: text
      label: $value.name
  children:
    - $formkit: attachment
      name: icon
      label: 图标
      value: ""
    - $formkit: text
      name: name
      label: 名称
      value: ""
    - $formkit: text
      name: url
      label: 地址
      value: ""
```

### switch

开关组件，提供两个值之间的选择；当您想使用户切换功能开或关时，这是一个很好的选项

**引入版本**: 2.22.1

参数

- `onValue`：开关打开时的值，默认为 `true`
- `offValue`：开关关闭时的值，默认为 `false`
- `disabled`：是否禁用开关，默认为 `false`

#### 示例

```yaml
- $formkit: switch
  name: enabled
  label: 是否启用
  value: false
```

如果需要开关的值为其他值，可以设置 `onValue` 和 `offValue` 参数。

```yaml
- $formkit: switch
  name: enabled
  label: 是否启用
  value: "active"
  onValue: "active"
  offValue: "inactive"
```

### toggle

切换组件，用于对一组图片、颜色或文字等选择切换，支持单选与多选。它的功能与 `select` 组件类似，但相较于 `select` 组件，`toggle` 组件可以更直观的展示选项。

**引入版本**: 2.22.8

参数：

- `renderType`：当前组件的渲染类型，可选参数为 `image`、`color`、`text`，默认为 `text`。
- `options`：一组同类型的数据源，数据类型为 `{ label?: string; value: string; render?: string }[]`，其中 `label` 为选项的文本，`value` 为选项的值。`render` 为选项的渲染展示内容，与 `renderType` 参数配合使用。
  - 当 `renderType` 为 `image` 时，`render` 参数为图片的 URL。
  - 当 `renderType` 为 `color` 时，`render` 参数为颜色的十六进制代码。例如 `#000000`。
  - 当 `renderType` 为 `text` 时，`render` 参数为文字内容。
- `multiple`：可选，是否支持多选，默认为 `false`。
- `size`：可选，渲染内容的尺寸，`number` 类型，单位为 `px`。
- `gap`：可选，渲染内容之间的间距，`number` 类型，单位为 `px`。
- `value`: 可选初始值，数据类型为 `string | number | boolean | (string | number | boolean)[]`。

#### 示例

```yaml
- $formkit: toggle
  label: 选择图片
  name: toggle
  render-type: image
  size: 100
  gap: 10
  help: 选择图片作为背景
  options:
    - label: 图文1
      value: 1
      render: https://placehold.co/600x400
    - label: 图文2
      value: 2
      render: https://placehold.co/600x400
    - label: 图文3
      value: 3
      render: https://placehold.co/600x400
```

#### UI 效果

<p>
<img src="/img/formkit/formkit-toggle.png" width="50%" class="medium-zoom-image" />
</p>

### secret

密钥输入组件，用于选择一个密钥资源。

**引入版本**：2.17.0

:::note 使用 Secret 存储敏感数据
在 Halo 中，我们提供了一种更加安全的数据存储模型，即 Secret，通常我们使用 Secret 来存储敏感数据，比如密码、token、密钥等。

需要注意的是，此表单类型保存的是 Secret 资源名称，需要服务端根据该名称查询 Secret 资源。主题模板不能通过该设置值直接获取 Secret 内容。
:::

参数

- `requiredKeys`：所需的密钥字段，用于说明所选 Secret 应包含的字段（引入版本：2.22.10）。此字段为对象数组类型，对象包含以下属性：
  - `key`：密钥字段名称
  - `help`：可选的密钥字段说明
- `descriptionPreset`：创建密钥时的备注预设（引入版本：2.25.0）。打开创建密钥弹窗时，备注字段会预填为 `<descriptionPreset> - <当前时间>`，用户仍可在保存前编辑。

:::warning requiredKeys 不是后端校验
`requiredKeys` 只用于 Console 中的创建提示和缺失提醒，不会阻止服务端读取到字段缺失或值为空的 Secret。使用 Secret 的服务端代码必须自行校验所需字段，并返回清晰的错误信息。
:::

#### 示例

```yaml
- $formkit: secret
  name: secret
  label: 密钥
  descriptionPreset: 第三方 API
  requiredKeys:
    - key: apiKey
      help: API 密钥
    - key: secretKey
      help: 密钥
```
