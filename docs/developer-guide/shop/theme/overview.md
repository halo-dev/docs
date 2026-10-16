---
title: 开发概述
description: 了解 Halo 商城主题的渲染方式、模板回退机制、开发路径与版本兼容要求。
---

商城主题是普通 Halo 主题的一部分。你可以在现有主题的 `templates/shop/` 中添加商城页面，也可以开发以商城为主的完整主题。主题负责商品展示和顾客交互，商品、订单、支付与履约由 Halo 商城版提供。

本系列以 **Halo 商城版 2.27** 为基线。首次开发主题时，请先了解[主题目录结构](../../theme/structure.md)、[主题配置](../../theme/config.md)和 [Thymeleaf](../../theme/thymeleaf.md)。

## 页面如何渲染

Halo 商城版内置了 [shop-templates](https://github.com/lxware-dev/shop-templates) 提供的商城模板。访问商城时，优先使用当前主题中的同名模板；主题未提供的模板继续使用内置版本。

内置模板采用两种方式组合渲染：

- **Thymeleaf**：在服务器端输出商品列表、商品详情正文和订单详情，便于展示内容和搜索引擎读取公开商品页面。
- **Web Components**：在浏览器中处理购买规格、购物车、结算和支付等交互。内置组件由 Svelte 编译，使用这些组件的主题不需要采用 Svelte。

商品详情同时包含服务端商品内容和浏览器端购买组件。订单详情是 Thymeleaf 页面，不需要寻找一个 `shop-page-order` 组件。

## 选择开发方式

| 需求                               | 方式                                                             | 需要维护的内容                  |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------- |
| 只调整颜色、圆角或内容宽度         | [定制样式](./styling.md)                                         | CSS 变量和少量样式覆盖          |
| 加入主题导航、页脚，统一页面布局   | [复用模板](./template-reuse.md)                                  | 页面外壳和被覆盖的模块          |
| 自定义商品列表或详情，保留交易交互 | [页面与变量](./pages-and-variables.md) + [组件](./components.md) | 自定义 HTML、数据展示及组件挂载 |
| 大幅调整交易页面结构与交互         | [源码二次开发](./source-development.md)                          | UI 源码、构建产物及 API 兼容性  |
| 使用其他前端框架实现商城           | [前台接口与交易流程](./storefront-api.md)                        | 完整交易流程与错误处理          |

通常可以先复用内置模板，再逐页替换确有定制需求的部分。未覆盖的模块能够继续使用 Halo 升级带来的更新；复制进主题的模板和 UI 源码则需要自行同步。

## 版本与参考资料

`shop-templates` 的 `main` 是开发分支，可能包含 Halo 商城版暂未发布的功能。开发前从[分支列表](https://github.com/lxware-dev/shop-templates/branches)选择与目标 Halo 商城版对应的 release 分支，不要将最新版源码与旧版后端直接混用。

- [基础示例主题](https://github.com/lxware-dev/theme-shop-starter)：复用内置模板。
- [二次开发示例主题](https://github.com/lxware-dev/theme-shop-advanced-starter)：在主题中集成商城 UI 源码。
- [Halo 商城版 2.27 RESTful API](https://api.halo.run/?version=2.27-paid)：查询请求字段、响应模型与接口分组。
- [版本差异](./api-changelog.md)：查看本系列涉及的重要模板和 API 变化。

接下来按照[快速开始](./quick-start.md)完成第一个页面。
