---
title: 使用商城组件
description: 在主题中挂载 Halo 商城购买、购物车、结算和支付 Web Components，正确传递上下文与 CSRF 参数。
---

本页以 Halo 商城版 2.27 的内置组件为基线。组件使用 Svelte 的 [Custom Elements](https://svelte.dev/docs/svelte/custom-elements) 机制，可以直接嵌入 Thymeleaf 模板。

## 加载组件资源

复用内置组件时，在页面中引入一次：

```html
<th:block th:replace="~{shop/modules/style}" />
<th:block th:replace="~{shop/modules/script}" />
```

这会加载 Halo 提供的 `/shop-dist/style.css` 和 `/shop-dist/main.iife.js`，内置引用附带 `site.version` 用于区分版本。

如果使用了[源码二次开发](./source-development.md)构建的组件，应改用主题自己的资源入口，避免重复注册相同标签。

## 组件与参数

下表使用 HTML 属性名。模板中的 `th:csrfToken` 最终对应 `csrftoken`，不要改写成 `csrf-token`。

| 标签                 | 属性                                      | 用途                         |
| -------------------- | ----------------------------------------- | ---------------------------- |
| `shop-buy-box`       | `id`、`csrftoken`                         | 商品购买区域；`id` 为商品 ID |
| `shop-page-cart`     | `csrftoken`                               | 当前顾客或游客会话的购物车   |
| `shop-page-checkout` | `contextid`、`csrftoken`、`authenticated` | 结算页                       |
| `shop-page-payments` | `ordercode`、`csrftoken`、`authenticated` | 支付页                       |

`authenticated` 是字符串属性，组件以字符串 `'true'` 判断登录状态。应传入服务端变量，不要仅写一个没有值的 `authenticated` 属性。

### 商品购买区域

```html
<shop-buy-box
  th:id="${product.id}"
  th:csrfToken="${_csrf.token}"
></shop-buy-box>
```

组件查询商品详情和 SKU 后处理规格选择、价格、数量、库存与购买入口。外链商品展示外部跳转；询价商品使用店铺的询价地址或联系方式。

2.27 中，订阅商品同样使用 `shop-buy-box`。组件内部查询订阅计划并展示档位、周期、试用和当前订阅状态；`SubscriptionBuyBox` 是内部组件，不是一个可直接挂载的独立 HTML 标签。

### 购物车

```html
<shop-page-cart th:csrfToken="${_csrf.token}"></shop-page-cart>
```

组件通过 `/shop/cart/items` 获取当前会话购物车。游客使用需启用游客结算；不要在模板中自行拼装其他客户的购物车数据。

### 结算页

```html
<shop-page-checkout
  th:contextId="${context.id}"
  th:csrfToken="${_csrf.token}"
  th:authenticated="${authenticated}"
></shop-page-checkout>
```

该标签放在 `/shop/checkout/{contextId}` 对应的页面中。组件读取结算上下文，处理收货地址、备注、折扣和优惠券等交互。游客流程不使用登录用户的地址簿或客户优惠券。

Halo 商城版 2.27 尚未实现配送方式选择与运费计算，填写收货地址不代表支持这两项能力。

### 支付页

```html
<shop-page-payments
  th:orderCode="${orderCode}"
  th:csrfToken="${_csrf.token}"
  th:authenticated="${authenticated}"
></shop-page-payments>
```

组件查询订单、选择支付方式、创建支付会话并检查支付状态。游客访问凭据失效时，提供邮箱找回访问链接的入口。

## 样式与语言

内置组件关闭 Shadow DOM，因此主题 CSS 可以影响其内部元素。优先通过 `--shop-*` CSS 变量调整外观，具体见[定制样式](./styling.md)。

内置 UI 支持 `en`、`es`、`zh-CN`、`zh-TW`。语言优先取 `language` Cookie，再取浏览器语言，未匹配时回退到英文。服务端模板文案与组件文案分别维护；只修改 `site.language` 或 `<html lang>` 并不会替换全部 UI 文案。定制组件文案需要修改对应源码语言文件并重新构建。
