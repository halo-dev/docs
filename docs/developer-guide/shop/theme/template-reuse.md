---
title: 复用与覆盖模板
description: 通过同名模板覆盖、Thymeleaf 模块复用和主题布局组合，逐步适配 Halo 商城页面。
---

本页以 Halo 商城版 2.27 的内置模板为基线。

## 页面与模块的关系

主题内的商城文件可以按以下方式组织；只需创建要覆盖的文件：

```text
templates/
└── shop/
    ├── products.html
    ├── product.html
    ├── cart.html
    ├── checkout.html
    ├── payments.html
    ├── order.html
    ├── payments/
    │   └── alipay-redirect.html
    └── modules/
        ├── custom-styles.html
        └── products.html
```

`shop/products.html` 是完整页面，`shop/modules/products.html` 是商品列表内容模块。覆盖完整页面适合添加主题布局；覆盖内容模块适合改变列表或表单的 HTML 结构。

| 模块路径                     | 用途                                            |
| ---------------------------- | ----------------------------------------------- |
| `shop/modules/style`         | 引入内置商城 CSS                                |
| `shop/modules/script`        | 引入内置 JavaScript，注册商城组件和图库相关功能 |
| `shop/modules/custom-styles` | 在内置样式之后追加主题样式                      |
| `shop/modules/products`      | 商品筛选、列表和分页                            |
| `shop/modules/product`       | 商品图库、介绍、购买组件和正文                  |
| `shop/modules/cart`          | 挂载购物车组件                                  |
| `shop/modules/checkout`      | 挂载结算组件                                    |
| `shop/modules/payments`      | 挂载支付组件                                    |
| `shop/modules/order`         | 订单状态、金额、履约信息和访问链接找回表单      |

## 复用内置模块

在主题页面中使用 Thymeleaf 的模板表达式：

```html
<th:block th:replace="~{shop/modules/style}" />
<th:block th:replace="~{shop/modules/script}" />
<th:block th:replace="~{shop/modules/product}" />
```

其中商品详情模块需要 `product` 变量，应在商品详情页中使用。在首页插入这个模块时，需要先通过 [Finder API](./finder-apis.md)查询商品并显式提供 `product`。

购物车、结算、支付模块也有各自的数据要求，不能只复制标签到任意页面就获得完整上下文。参见[组件参数](./components.md)。

## 覆盖一个内容模块

例如，创建主题内的 `templates/shop/modules/products.html` 后，内置商品列表页和主题自己的商品列表页都会优先引用该文件。你可以使用 `productPage` 和 `categoryTree` 自行渲染列表，其余页面保持内置实现。

:::warning 避免模板递归
不要在主题的 `shop/modules/products.html` 中再次执行 `th:replace="~{shop/modules/products}"`。同名解析会重新命中自身，无法借此引用被覆盖的内置版本。需要保留原内容时，从匹配版本的模板复制后修改，或仅覆盖页面外壳。
:::

## 接入主题布局

将内置模块放入主题现有的内容插槽，并按主题约定引入商城 CSS 和脚本。接入时检查：

- 布局中的 `<html>`、`<head>` 和 `<body>` 各保留一份，内容模块不要再套完整 HTML 文档。
- 商城脚本和组件只注册一次，不要同时加载内置脚本和自己打包的同名组件。
- 自定义页面仍引用 `custom-styles`，或者通过主题自己的 CSS 入口加载商城覆盖样式。
- 主题的全局按钮、表单、图片和排版规则可能影响商城组件，需要验证交易页面。

CSS 变量和布局调整见[定制样式](./styling.md)。
