---
title: 与主题集成
description: 按场景选择 Finder、可覆盖模板、页面布局、公开 API、静态资源和主题端扩展点，并定义稳定的插件主题契约
---

插件可以向主题提供数据、页面和渲染增强。设计集成时，插件应拥有业务逻辑、权限控制和默认行为，主题只负责选择性展示或覆盖样式；未适配特定主题时，插件的主要功能仍应可用。

## 选择集成方式

| 目标                                        | 推荐机制                                                                                                                                                           | 说明                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| 在 Thymeleaf 模板中读取插件数据             | [Finder](./api-reference/server/finder-for-theme.md)                                                                                                               | 用于服务端模板渲染，不是浏览器 API                      |
| 提供插件前台页面并允许主题覆盖              | [TemplateNameResolver](./api-reference/server/template-for-theme.md)                                                                                               | 插件提供默认模板，主题覆盖为可选增强                    |
| 让插件页面复用主题页头、页脚和布局          | [页面布局契约](../theme/page-layout.md)                                                                                                                            | Halo 2.26.0 起可用；主题不支持时使用 Halo fallback 布局 |
| 让浏览器脚本请求插件数据                    | [公开自定义 API](./api-reference/server/extension.md#custom-api-group-spec)                                                                                        | 使用 `api.<group>`，并显式配置匿名访问所需的最小权限    |
| 向页面加载插件 CSS、JavaScript 或 meta 标签 | [TemplateHeadProcessor](./extension-points/server/template-head-processor.md) 或 [TemplateFooterProcessor](./extension-points/server/template-footer-processor.md) | Footer 处理器依赖主题保留 `<halo:footer />`             |
| 修改文章或单页面的最终内容                  | [文章内容处理](./extension-points/server/post-content.md)或[单页面内容处理](./extension-points/server/singlepage-content.md)                                       | 适合代码高亮、图表和内容增强，不适合替代主题布局        |
| 公开插件内的静态文件                        | [ReverseProxy](./api-reference/server/reverseproxy.md)                                                                                                             | 资源路径位于 `/plugins/<plugin-name>/assets/` 下        |
| 让插件自定义模型支持评论                    | [CommentSubject](./extension-points/server/comment-subject.md)                                                                                                     | 同时提供评论权限、前台标签和管理端主体展示              |

一个功能可能组合多种机制。例如，插件页面可以由默认模板和 Finder 完成服务端渲染，再通过公开 API 提交交互数据，但每种入口应共享同一套权限和数据语义。

## 提供稳定的模板契约

### Finder 数据

Finder 的变量名应包含插件前缀，避免与 Halo 或其他插件冲突。对主题公开的方法和返回值应保持精简、只读和可分页；优先返回面向展示的 VO，不要让主题依赖插件内部存储结构。

插件文档应列出 Finder 名称、方法、参数、返回类型、空结果和最低插件版本。主题调用 Finder 前，应通过 `pluginFinder.available` 检查插件及所需版本，具体方式参考主题侧的[与插件集成](../theme/plugin-integration.md)。

### 插件页面

插件拥有公共路由时，应提供能够独立渲染主要功能的默认模板，并使用 `TemplateNameResolver` 让主题选择性覆盖。不要直接渲染只存在于某个主题中的模板，也不要让默认模板依赖主题私有变量或片段。

传给模板的模型字段、模板名称和路由都属于集成契约。建议通过 `ModelConst.TEMPLATE_ID` 为 `_templateId` 设置稳定且带插件命名空间的值，例如 `plugin:my-plugin:moments`，让 Head 处理器、SEO 插件和其他渲染扩展能够可靠识别页面。

Halo 2.26.0 及以上版本中，插件默认模板可以调用 `layout :: html(head, content)`。主题支持布局契约时复用主题外壳，否则 Halo 使用 fallback 布局；插件不能据此假设主题一定提供特定 CSS 类或 JavaScript。

## 提供浏览器 API 和资源

Finder 只服务于 Thymeleaf 渲染。页面需要分页加载、提交表单或持续交互时，应提供自定义 API，并遵循主题端公开 API 的 `api.<group>` 命名规则。

公开 API 仍然受 Halo 权限控制。只把访客确实需要的资源和 `get`、`list` 等操作聚合到 `anonymous` 角色；写操作应单独完成输入校验、CSRF 或其他滥用防护，不能因为接口用于前台就直接开放全部权限。角色配置参考[聚合角色](./security/rbac.md#聚合角色)。

插件静态文件应通过 `ReverseProxy` 暴露，并从 `/plugins/<plugin-name>/assets/...` 引用。不要要求主题复制插件资源，也不要引用插件源码目录或构建机路径。

## 扩展最终页面输出

`TemplateHeadProcessor` 适合按设置和页面条件添加插件拥有的资源或标签，`TemplateFooterProcessor` 适合依赖 `<halo:footer />` 的页尾内容。处理器应在插件关闭相关功能时不输出内容，并避免重复加载同一资源。

canonical、Open Graph、Twitter Card 和结构化数据可能由主题或其他插件提供。插件提供这些标签时，应分别提供启用设置，并检查最终 `<head>`，避免同一站点同时输出多套冲突信息；主题侧约定参考[主题 SEO](../theme/seo.md)。

文章和单页面内容处理器会改变交给主题的最终 HTML。实现应支持重复执行、空内容和异常输入，不能依赖某个主题的外围 DOM 结构；停用插件后，原始内容仍应可以正常显示。

## 验证集成状态

至少覆盖以下状态：

1. 使用未提供覆盖模板和布局契约的主题，插件默认页面仍可访问。
2. 使用提供覆盖模板的主题，模型字段、分页、空状态和错误状态均能渲染。
3. 主题布局状态分别为 `SUPPORTED`、`MISSING` 和 `INVALID` 时，插件页面不会返回服务端错误。
4. 插件停用后，主题隐藏插件入口，不再调用 Finder、全局脚本或公开 API。
5. 匿名用户、登录用户和管理角色只能访问各自被授权的数据和操作。
6. 最终页面没有重复资源、冲突 meta 标签、浏览器错误或失效的静态资源路径。

把 Finder 名称、模板名称、路由、模型字段、`_templateId` 和公开 API 视为版本化契约。需要破坏兼容性时，应升级插件主版本、记录迁移方式，并与适配主题共同验证。
