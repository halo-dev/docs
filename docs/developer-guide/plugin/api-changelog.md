---
title: API 变更日志
description: 按 Halo 版本查阅插件服务端 API、UI 构建工具、表单组件和依赖升级等变更，识别兼容性影响并完成插件迁移
---

## 2.28.0

### 状态点新增进行中与信息状态、尺寸和无障碍说明

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `VStatusDot` 新增 `info` 与 `processing` 两种状态，其中 `processing` 自动带呼吸动画；新增 `size`（`sm`、`md`）、`color`、`label` 和 `title` 属性。`color` 通过 `--status-dot-color` 变量覆盖状态颜色，自定义主题可以在外层覆盖同一变量；`label` 同时作为无障碍名称和悬停提示，仅在没有可见文字时输出到 DOM。

行为变化：圆点本身改为对辅助技术隐藏（`aria-hidden`），状态需要由可见文字、`label` 或调用方的 `v-tooltip` 传达；警告状态的颜色提高了对比度；动画遵循系统的「减弱动态效果」设置。原先用 `success` 加 `animate` 表示「进行中」的写法仍然可用，建议改用语义更准确的 `processing`。详细说明请参考[状态点](./api-reference/ui/base-components/status.md)。

### 间距组件支持自定义间距与布局属性

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `VSpace` 新增 `justify`、`wrap`、`block`、`fill` 和 `as` 属性；`spacing` 现在也接受自定义像素数字或 `[水平, 垂直]` 数组，并新增 `xl`（24 像素）和 `2xl`（32 像素）两个预设；`align` 新增 `baseline`。间距改为通过 `--v-space-gap-x` 和 `--v-space-gap-y` 两个 CSS 变量设置，在外部覆盖间距时不再需要 `!important`。默认值与已有的类名保持不变，不传这些属性时渲染结果与之前一致。详细说明请参考[间距](./api-reference/ui/base-components/space.md)。

### 轻提示组件重做并扩展 API

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `Toast` 基于 Reka UI 重做，所有提示共用一个通知区域：多条提示依次堆叠、不再互相遮挡，按内容收缩宽度并在窄屏换行；类型和内容相同的提示会合并并显示重复次数；同时最多显示 5 条，超出时关闭最旧的一条。自动关闭会在鼠标悬停、键盘焦点进入通知区域或窗口失去焦点时暂停，离开后按剩余时间继续；错误提示会被读屏软件立即播报；按 `F8` 可把焦点移到通知区域，按 `Esc` 或向右滑动可关闭提示。通知区域默认仍在顶部居中，可通过 `Toast.configure({ placement })` 改为六个方向之一。

公开 API 只做新增，不替换原有用法：新增 `Toast.loading`、`Toast.promise`、`Toast.update`、`Toast.dismiss`、`Toast.clear` 和 `Toast.configure`，以及 `title`、`icon`、`action`、`customClass`、`key`、`grouping`、`status`、`count` 属性。原有 `Toast.success/info/warning/error(content, props?)` 签名和 `ToastInstance` 保持不变，已有调用无需修改。`duration` 传 `0` 或负数时不自动关闭；`frozenOnHover` 保留但不再生效，现在始终在悬停或聚焦时暂停倒计时；`ToastInstance.vnode` 标记为废弃。详细说明请参考[轻提示](./api-reference/ui/base-components/toast.md)。

### 按钮新增变体、形状、无障碍名称与自定义根元素

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `VButton` 新增 `variant`（`solid`、`soft`、`ghost`）、`shape`（`default`、`circle`、`round`）、`label` 和 `as` 属性。`label` 同时用作无障碍名称和悬停提示；`as` 可以把按钮渲染为链接等其他元素，此时不渲染 `type`，禁用状态改用 `aria-disabled` 并阻止点击。`circle` 和 `ghost` 标记为废弃但继续可用，且优先级高于 `shape` 和 `variant`。

仅含图标的按钮（只有 `icon` 插槽或加载状态、没有文本内容）自动改为正方形布局并去掉左右内边距，开发环境下缺少无障碍名称时会输出警告。同时 `VModal` 的 `actions` 插槽不再为裸 `<span>` 元素提供样式，也不再在悬停头部时隐藏操作项，插件应改用 `VButton`，否则操作项会失去按钮外观。详细说明请参考[按钮](./api-reference/ui/base-components/button.md)和[VModal 弹窗](./api-reference/ui/base-components/modal.md)。

### 确认对话框支持尺寸、更多关闭控制与自定义内容

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `Dialog` 与 `VDialog` 新增 `size`（`sm`、`md`、`lg`）、`width`、`icon`、`showClose`、`closeOnEsc`、`layerClosable` 属性，`VDialog` 提供 `default`、`icon`、`description`、`footer` 插槽。函数式调用现在返回 `{ close, destroy }` 实例，并新增 `Dialog.destroyAll()`。

行为变化：确认操作进行中（`onConfirm` 返回的 Promise 未结束时）不能再通过 Esc、遮罩、取消按钮或关闭按钮关闭对话框；`onConfirm` 被 reject 时对话框保持打开，方便用户重试；`onCancel` 不会在程序调用 `close()` 时触发。已有的属性和函数式用法保持兼容。详细说明请参考[Dialog 确认对话框](./api-reference/ui/base-components/dialog.md)。

### 选项卡支持图标、徽标、禁用状态与持久化面板

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `VTabItem` 新增 `icon`、`badge`、`disabled`、`ariaLabel` 和 `persistent` 属性，`VTabs` 与 `VTabbar` 新增 `flush` 属性，用于卡片头部的贴边全宽形态；`VTabbar` 的 `items` 现在直接接受带这些字段的对象。同时补齐了选项卡的键盘交互与 ARIA 语义，标签溢出时改为横向手势滚动、普通垂直滚轮仍然滚动页面。

原有用法不需要修改，默认渲染保持不变。详细说明请参考[选项卡](./api-reference/ui/base-components/tabs.md)。

### 描述列表新增布局与展示选项

从 Halo 2.28.0 开始，`@halo-dev/components` 的 `VDescription` 新增 `columns`、`layout`、`size`、`bordered`、`title`、`divider`、`hover`、`separator`、`emptyText`、`labelWidth` 和 `align` 属性，`VDescriptionItem` 新增 `span`、`labelWidth`、`align`、`emptyText` 属性，`label` 变为可选。不传这些属性时渲染结果与之前一致，已有用法无需修改。同时修复了横向布局在大屏下内容区留白和长链接撑破单元格的问题。详细文档请参考[描述列表](./api-reference/ui/base-components/description.md)。

### 移除 openapi4j 依赖

从 Halo 2.28.0 开始，Halo 不再依赖已归档的 `org.openapi4j:openapi-schema-validator`（该库自 2021 年起不再维护，且仅支持 Jackson 2），Extension Schema 校验改用 `com.networknt:json-schema-validator`。因此 `run.halo.app:api` 不再传递引入 `org.openapi4j.*`。

如果插件直接使用了 `org.openapi4j.*`，需要在 `build.gradle` 中自行声明依赖和版本，或迁移到其他 OpenAPI / JSON Schema 校验库。仅通过 Extension API 读写数据的插件不受影响。该变更不改变 HTTP 接口和 Extension 数据格式，不要求提升 `spec.requires`。

### 索引支持语义版本和启动快照

从 Halo 2.28.0 开始，使用 `IndexSpecs.single()` 或 `IndexSpecs.multi()` 声明的索引支持 `.version(int)`，默认版本为 `1`。当索引函数的取值语义发生变化时，插件必须递增该版本，否则 Halo 可能复用旧的启动快照，返回与数据库不一致的查询结果。

Halo 与插件在重启、启停或升级时可以从索引快照恢复 Extension 索引，减少大型数据集下的启动耗时。快照保存在工作目录的 `indices/snapshots` 下，缺失、损坏或不兼容时自动全量重建，无需手动维护。该能力不改变现有的索引声明方式，也不要求提升插件或主题的 `spec.requires`；自定义索引构建器需要按上述规则处理版本。详细说明请参考[自定义模型 > 索引版本与启动快照](./api-reference/server/extension.md#index-version-and-snapshots)。

### 新增通用筛选下拉组件

从 Halo 2.28.0 开始，`@halo-dev/components` 新增 `VFilterDropdown` 和 `VFilterDropdownGroup`，用于构建列表筛选栏，支持本地与远程搜索、分组、树形选项、滚动加载和一键清空。原先在 Console 中全局注册的 `FilterDropdown` 和 `FilterCleanButton` 仍然保留，已有插件无需修改；新插件建议使用新组件。详细文档请参考[筛选下拉](./api-reference/ui/base-components/filter-dropdown.md)。

### 新增日期选择组件

从 Halo 2.28.0 开始，`@halo-dev/components` 新增日期、日期时间和日期范围选择组件：`VDatePickerPanel`、`VDateTimePickerPanel`、`VDateRangePickerPanel`、`VDateTimeRangePickerPanel`，以及在面板外提供触发器的 `VDatePickerDropdown`、`VDateRangePickerDropdown` 和筛选栏变体 `VFilterDateRangeDropdown`。所有值都是普通字符串（`YYYY-MM-DD`、`YYYY-MM-DDTHH:mm` 或 `{ start?, end? }`），调用方不需要依赖 `@internationalized/date`。

Console 和用户中心的发布时间、个人访问令牌过期时间等输入框已改用这些组件，修复了 Firefox 无法选择时间的问题。表单 Schema 中也可以使用新增的 `datepicker` 和 `datetimepicker` 输入类型，详细说明请参考[日期选择](./api-reference/ui/base-components/date-picker.md)和[表单定义 > datepicker](../form-schema.md#datepicker)。

### 新增通用表格组件

从 Halo 2.28.0 开始，`@halo-dev/components` 新增 `VTable` 和 `createTableColumnHelper`，用于展示多列数据，支持列定义、列级排序、行选择、展开行、多级表头、固定列、列宽调整和虚拟滚动。组件基于 TanStack Table 构建，依赖已打包进组件库，插件不需要额外安装。原先的 `VEntity` 系列组件保持不变，卡片式单列列表仍可使用；需要横向对比多个字段时可以使用新组件。详细文档请参考[表格](./api-reference/ui/base-components/table.md)。

### 新增浮层组件

从 Halo 2.28.0 开始，`@halo-dev/components` 新增 `VPopover`，用于在触发元素旁展开包含表单、输入框或提示内容的浮动面板。它支持 `v-model:open` 受控打开状态、12 种弹出位置、箭头、与触发器等宽以及自定义面板样式。

组件基于 Reka UI 构建，提供碰撞检测、按 Esc 或点击外部关闭、关闭后焦点回到触发器，以及配套的无障碍属性。原有的 `VDropdown` 保持不变，仍用于操作菜单，已有用法无需修改。此外还提供 `closeOnFocusOutside`、`closeOnTriggerDetached` 属性和 `open-auto-focus`、`close-auto-focus` 事件，用于在面板中连续操作、接管焦点交接以及处理触发器被移除的情况。详细文档请参考[浮层](./api-reference/ui/base-components/popover.md)。

### 新增抽屉组件

从 Halo 2.28.0 开始，`@halo-dev/components` 新增 `VDrawer`，用于从屏幕边缘展开次级任务和上下文面板，适合在不离开当前列表或编辑页的情况下修改某一条内容的设置。它支持四个方向、像素或 CSS 长度的尺寸、模态与非模态模式、内嵌悬浮样式，以及底部抽屉的吸附点和拖拽关闭。

组件基于 Reka UI 的 Dialog 原语构建（Reka UI 没有独立的 Drawer 原语），提供遮罩点击、Esc、关闭按钮和异步 `beforeClose` 组成的关闭流程，焦点陷阱与关闭后的焦点还原由 Reka UI 负责。`VModal` 保持不变，居中的对话框仍使用它；已有用法无需修改。详细文档请参考[抽屉](./api-reference/ui/base-components/drawer.md)。

### 组件库内置文案跟随界面语言

从 Halo 2.28.0 开始，`@halo-dev/components` 的内置文案（分页、表格、确认框、抽屉、标签栏、筛选和日期选择等）跟随 Console 和用户中心的语言，不再固定为中文或英文。组件属性未显式传入文案时使用内置文案，传入时仍然优先。

## 2.27.0

### UI 构建工具移除旧入口，构建工具依赖改为可选

`@halo-dev/ui-plugin-bundler-kit@2.27.0` 移除了包根入口及 `HaloUIPluginBundlerKit`。原先从包根入口导入 `viteConfig` 或 `rsbuildConfig` 的项目，需要分别改为从 `@halo-dev/ui-plugin-bundler-kit/vite` 或 `@halo-dev/ui-plugin-bundler-kit/rsbuild` 导入；使用 `HaloUIPluginBundlerKit` 的旧项目需要迁移到对应预配置。具体步骤请参考 [UI 构建迁移](./basics/ui/build.mdx#migration)。

Vite、Rsbuild 及各自的 Vue 插件均改为可选 peer 依赖。升级时请显式安装所选构建工具及其 Vue 插件，无需安装另一套工具链。已有 IIFE 产物在 Halo 2.x 中仍可加载；此变更不要求提高插件或主题的 `spec.requires`。

### 移除旧缩略图扩展点

移除了自 2.22.0 起废弃的 `ThumbnailProvider` 接口及 `thumbnail-provider` 扩展点。仍使用旧接口的插件需要迁移到 `AttachmentHandler.getThumbnailLinks()`，并调整扩展注册，具体说明请参考[附件存储策略扩展点](./extension-points/server/attachment.md)。主题使用的缩略图 Finder 和 HTTP API 不受此变更影响。

## 2.26.0

### UI 构建工具新增独立入口

`@halo-dev/ui-plugin-bundler-kit@2.26.0` 新增 Vite 和 Rsbuild 专用入口。Vite 项目应从 `@halo-dev/ui-plugin-bundler-kit/vite` 导入 `viteConfig`，Rsbuild 项目应从 `@halo-dev/ui-plugin-bundler-kit/rsbuild` 导入 `rsbuildConfig`。包根入口中的同名导出仍可在 2.26.0 中使用，但已标记为过时，并计划在 2.27.0 中移除。迁移示例请参考 [UI 构建](./basics/ui/build.mdx)。

### UI 扩展支持 ESM 和异步分块

从 Halo 2.26.0 开始，插件和已激活主题的 Console / UC UI 扩展可以使用 ESM 构建和加载，并支持异步 JavaScript、CSS 和其他静态资源分块。Halo 2.x 会继续兼容已有的 IIFE 产物，无需为兼容新版本而重新构建旧插件。

将 `@halo-dev/ui-plugin-bundler-kit` 升级到 2.26.0 后，`viteConfig` 和 `rsbuildConfig` 默认根据 `plugin.yaml` 的 `spec.requires` 自动选择格式。简单的 `requires: ">=2.26.0"` 会选择 ESM；暂时无法迁移的项目可以显式设置 `format: "iife"`。默认 ESM preset 会为入口、启动样式和异步资源使用内容哈希文件名，`ui-plugin.json` 会记录实际启动资源路径；清单、入口、样式、分块和静态资源必须作为一个完整目录打包。详细文档请参考 [UI 构建](./basics/ui/build.mdx#output-format)。

ESM 插件可以从 Halo 共享运行时导入 Vue、Vue Router、Pinia、Axios、FormKit 和公开的 Halo UI 包，其他依赖默认保留在插件自己的构建产物中。共享包的完整列表、兼容性诊断和自定义配置边界请参考 [共享运行时依赖](./basics/ui/build.mdx#shared-runtime-dependencies)。

### 查询 UI provider 的注册状态

`@halo-dev/ui-shared@2.26.0` 新增 `stores.uiPlugins()`，用于查询插件或已激活主题的 UI provider 是否被发现、是否已经成功注册以及当前状态。它替代了 `window.PluginName` 和 `window.enabledUiPlugins` 等依赖 IIFE 全局变量的检测方式。详细文档请参考 [共享工具库 > uiPlugins](./api-reference/ui/shared.md#uiplugins)。

### 编辑器扩展支持注册快捷键描述

`@halo-dev/richtext-editor@2.26.0` 新增 `defineHaloKeyboardShortcuts()`，插件可以在 Tiptap 的 `addKeyboardShortcuts` 中同时注册快捷键命令和用户可见的描述，并通过 `shortcutId` 将同一条描述关联到工具栏、Slash Command 或悬浮菜单。详细文档请参考 [默认编辑器 > 快捷键扩展](./extension-points/ui/default-editor-extension-create.md#6-快捷键扩展)。

### 编辑器扩展支持声明运行期元数据

`@halo-dev/richtext-editor@2.26.0` 新增 `addHaloEditorMetadata()` 和 `createHaloEditorManifest()`。插件可以为 Tiptap Node、Mark 和 Extension 声明组件用法、属性、结构关系及 HTML 示例，并从最终 Editor 实例生成稳定的运行期 Manifest。详细文档请参考 [默认编辑器 > 编辑器扩展运行期元数据](./extension-points/ui/default-editor-extension-create.md#7-编辑器扩展运行期元数据)。

## 2.25.0

### 表单定义 > `select` 选项支持图标和描述

在 2.25.0 中，`select` 表单类型的选项对象新增了 `icon` 与 `description` 字段，可在下拉选项中展示图标和辅助说明；使用远程动态数据源时，也可以通过 `requestOption.iconField` 与 `requestOption.descriptionField` 映射响应字段。详细文档可查阅：[表单定义#select](../../developer-guide/form-schema.md#select)。

### 支持插件注册自定义 FormKit 输入组件

在 2.25.0 中，插件可以通过 UI 入口文件的 `formkit.inputs` 注册自定义 FormKit 输入组件，并在插件提供的 FormKit Schema 中通过 `$formkit` 使用。详细文档可查阅：[FormKit 扩展](./api-reference/ui/formkit.md)。

如果插件使用 `@formkit/vue` 创建 input definition，需要将 `@halo-dev/ui-plugin-bundler-kit` 升级到 2.25.0 或更高版本，并将 `plugin.yaml` 中的 `spec.requires` 提升到 `>=2.25.0`。

### 表单定义 > `secret` 表单类型新增 `descriptionPreset` 参数

在 2.25.0 中，`secret` 表单类型新增了 `descriptionPreset` 参数，用于在创建密钥时预填备注。详细文档可查阅：[表单定义#secret](../../developer-guide/form-schema.md#secret)。

## 2.23.0

### Spring Boot 依赖升级可能导致插件无法正常启动

在 2.23.0 中，我们升级了 Spring Boot 版本至 4.x，该版本包含一些破坏性更新，可能会导致插件无法正常启动，因此建议插件开发者尽快升级 Halo 依赖，`build.gradle` 修改示例如下：

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation platform('run.halo.tools.platform:plugin:2.23.0')
}

halo {
    version = '2.23.0'
}
```

`plugin.yaml` 中的 `spec.requires` 字段也需要提升至 `>=2.23.0`，示例如下：

```yaml
spec:
  requires: ">=2.23.0"
```

尝试构建并解决编译错误即可。如果使用了 Spring 相关的组件或者 API，请参考 [Spring Boot 4.x 的升级指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)进行适配。

### 表单定义 > Iconify 表单类型新增 `sizing` 参数

在 2.23.0 中，Iconify 表单类型默认不再显示图标大小选项，如果需要让用户设置图标大小，可以配置 `sizing` 参数，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

## 2.22.8

### 表单定义 > 新增 `toggle` 组件

在 2.22.8 中，我们为 FormKit 表单新增了 `toggle` 组件，这是一个可以对一组图片、颜色或文字等进行选择切换的组件，详细文档可查阅：[表单定义#toggle](../../developer-guide/form-schema.md#toggle)

## 2.22.5

### SpringDoc 依赖更新可能导致插件无法启动

在 2.22.5 中，我们更新了 SpringDoc 依赖至 [2.8.15](https://github.com/springdoc/springdoc-openapi/releases/tag/v2.8.15) 版本，该版本[修复](https://github.com/springdoc/springdoc-openapi/pull/3183)了 OpenAPI 文档生成中的一些问题（例如嵌套路由无须定义文档），且为破坏性更新，这可能会导致插件无法正常启动。

因此，建议插件开发者尽快升级 Halo 依赖，`build.gradle` 修改示例如下：

```groovy
dependencies {
    implementation platform('run.halo.tools.platform:plugin:2.22.5')

    ...
}
```

`plugin.yaml` 中的 `spec.requires` 字段也需要提升至 `>=2.22.5`，示例如下：

```yaml
spec:
  requires: ">=2.22.5"
```

尝试构建并解决编译错误即可。

## 2.22.1

### 表单定义 > 新增 `switch` 组件

在 2.22.1 中，我们为 FormKit 表单新增了 `switch` 组件，用于定义一个功能的开关，详细文档可查阅：[表单定义#switch](../../developer-guide/form-schema.md#switch)

## 2.22.0

### 自定义模型索引 API 更新

在 2.22.0 中，我们重构了自定义模型索引和查询 API，插件中直接使用索引 API 的代码建议进行以下调整：

1. 使用 `IndexSpecs.single(name, keyType)` 和 `IndexSpecs.multi(name, keyType)` 声明索引，替代 `IndexAttributeFactory.simpleAttribute()`、`IndexAttributeFactory.multiValueAttribute()` 和直接创建 `new IndexSpec()` 的旧写法。
2. 索引值类型不再局限于字符串，可以使用 `String`、`Boolean`、`Integer`、`Long`、`Instant` 等实现 `Comparable` 的类型。
3. 使用 `Queries` 创建 `FieldSelector` 查询条件，替代已过时的 `QueryFactory`。
4. `ReactiveExtensionClient` 和 `ExtensionClient` 新增了 `listAllNames`、`listTopNames`、`listNamesBy` 和 `countBy` 等查询方法，直接使用 `indexedQueryEngine()` 的方式已过时。

详细文档可查阅：[自定义模型使用索引](./api-reference/server/extension.md#using-indexes) 和 [ExtensionClient 查询](./api-reference/server/extension-client.md#query)。

### `@halo-dev/console-shared` 改名

从 Halo 2.11 支持个人中心以后，插件的 UI 项目能同时扩展 Console 和 UC，所以为了避免歧义，我们在 Halo 2.22 中将 UI 的 `@halo-dev/console-shared` 依赖更名为 `@halo-dev/ui-shared`，虽然在 Halo 中兼容了旧版依赖，但仍然推荐使用新版依赖，迁移方案：

```bash
pnpm uninstall @halo-dev/console-shared
pnpm install @halo-dev/ui-shared
```

然后在插件项目全局搜索 `@halo-dev/console-shared` 并替换为 `@halo-dev/ui-shared` 即可，同时需要将 `plugin.yaml` 的 `spec.requires` 字段修改为 `>=2.22.0`。

### `@halo-dev/ui-shared` 工具库

在 2.22.0 中，Halo 在 `@halo-dev/ui-shared` 包中提供一些常用工具，用于减少部分业务的开发工作量，目前提供：

1. `stores`
   1. `currentUser`：用于获取当前用户信息
   2. `globalInfo`：用于获取网站一些公开的信息，比如外部访问地址
2. utils
   1. `date`：时间日期格式化工具
   2. `permission`：用户权限检查工具
   3. `id`：uuid 生成工具
   4. `attachment`：附件相关工具，比如获取附件缩略图地址
3. events
   1. `core:plugin:configMap:updated`：用于监听插件配置变更

详细文档可查阅：[共享工具库](./api-reference/ui/shared.md)

### UI 扩展点 > 附件选择选项卡类型更新

在 2.22.0 中，我们为 `AttachmentLike` 复合类型添加了 `mediaType` 字段，用于区分文件类型，方便在插入到文章时显示正确的媒体类型，如不填写，所选择的文件将作为链接插入到编辑器，所以实现了此扩展点的插件都需要进行改动，具体步骤：

1. 升级依赖

   ```bash
   pnpm install @halo-dev/ui-shared@2.22.0
   ```

2. 提升 [plugin.yaml#spec.requires](./basics/manifest.md#字段详解) 版本为 `>=2.22.0`。
3. 按照[最新文档](./extension-points/ui/attachment-selector-create.md)修改插件代码

### 表单定义 > 新增 Iconify 图标选择器

在 2.22.0 中，我们为 FormKit 表单提供了通用的图标选择器，基于 [Iconify](https://icon-sets.iconify.design/)，详细文档可查阅：[表单定义#Iconify](../../developer-guide/form-schema.md#iconify)

### 表单定义 > 新增 `array` 组件

在 2.22.0 中，我们为 FormKit 表单新增了 `array` 组件，用于定义一组数据，并计划使用 `array` 组件替换原有的 `repeater` 组件。详细文档可查阅：[表单定义#array](../../developer-guide/form-schema.md#array)

### 编辑器 > BubbleMenu 扩展点改动

在 Halo 2.22.0 中，我们升级了编辑器的 Tiptap 版本至 3.x，由于 Tiptap 在 3.x 中做了一些破坏性更新且 Halo 也遵循其更新，因此如果插件扩展了编辑器，并使用了 BubbleMenu 扩展点，则需要根据以下方式进行更新升级。

1. 使用 `options` 代替 `tippyOptions`。

```diff
- tippyOptions: {
-  fixed: false,
- },
+ options: {
+  strategy:"absolute",
+ },
```

2. 使用 `getReferencedVirtualElement` 代替 `getRenderContainer`。

```diff
- getRenderContainer: (node: HTMLElement) => {
-   let container = node;
-   if (container.nodeName === "#text") {
-     container = node.parentElement as HTMLElement;
-   }
-   while (
-     container &&
-     container.classList &&
-    !container.classList.contains("column")
-   ) {
-     container = container.parentElement as HTMLElement;
-   }
-   return container;
- },
+ getReferencedVirtualElement() {
+  const editor = this.editor;
+   if (!editor) {
+     return null;
+   }
+  const parentNode = findParentNode(
+     (node) => node.type.name === Column.name
+   )(editor.state.selection);
+   if (parentNode) {
+     const domRect = posToDOMRect(
+       editor.view,
+       parentNode.pos,
+       parentNode.pos + parentNode.node.nodeSize
+     );
+     return {
+       getBoundingClientRect: () => domRect,
+       getClientRects: () => [domRect],
+     };
+   }
+   return null;
+ },
```

3. 移除 `defaultAnimation`。

```diff
- defaultAnimation: false,
```

此外，扩展其他 Node 中 `BubbleMenu` 的旧方式将会失效，例如 [编辑器超链接卡片](https://github.com/halo-sigs/plugin-editor-hyperlink-card/blob/dbec29e91fb22863b6baee03db8ae5509eded8e0/ui/src/editor/text-bubble-extension.ts) 扩展了 Text Node 的 `BubbleMenu`。 此版本中引入了 `extendsKey` 字段，用于扩展已有的 `BubbleMenu`。**需要已有的 `BubbleMenu` 设置了 PluginKey**。
用法如下：

```ts
Extension.create({
    name: "expandTextBubbleMenu",
    addOptions() {
      return {
        getBubbleMenu() {
          return {
            // 目标 BubbleMenu 的 PluginKey。当前版本会导出 Halo UI Editor 中的所有 PluginKey。
            extendsKey: TEXT_BUBBLE_MENU_KEY,
            items: [
              {
                priority: 10,
                // 具有同一个 key 的 items 将会被覆盖
                key: "textItem1",
                props: { title: "ExpandText" },
              },
            ],
          };
        },
      };
    },
  }),
```

有关 `BubbleMenu` 扩展的详细文档可查阅：[悬浮菜单扩展](./extension-points/ui/default-editor-extension-create.md#4-悬浮菜单扩展)

### 编辑器 > 新增 getDraggableMenuItems 扩展点

在 Halo 2.22.0 中，我们为编辑器增加了拖拽菜单的功能，同时支持插件动态扩展拖拽菜单。与此同时，旧的 `getDraggable` 扩展点被移除，取而代之的是 `getDraggableMenuItems` 扩展点。

可直接移除 `getDraggable` 扩展点，不再使用，也无需考虑兼容性问题。

关于 `getDraggableMenuItems` 扩展点的详细文档可查阅：[拖拽菜单扩展](./extension-points/ui/default-editor-extension-create.md#5-拖拽菜单扩展)

### 表单定义 > 重构 `attachment` 表单类型

在 Halo 2.22 中，我们重构了原有的 attachment 表单类型，支持了预览和直接上传文件，并将旧版的表单类型更名为了 [attachmentInput](../form-schema.md#attachmentinput)
