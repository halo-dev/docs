---
title: 页面与模板变量
description: Halo 商城页面路由、模板文件、商品分页筛选、详情字段，以及结算和订单页面的变量说明。
---

本页以 Halo 商城版 2.27 为基线。商品 handle 路由、订阅页面和游客订单支持自 2.27 起可用；早期版本差异见[版本差异](./api-changelog.md)。

## 页面路由

以下模板路径均相对于主题的 `templates/`：

| 访问路径                                                          | 模板                                 | 页面专属变量                                       |
| ----------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------- |
| `/shop`                                                           | 无                                   | 重定向到 `/shop/products`                          |
| `/shop/products`                                                  | `shop/products.html`                 | `productPage`、`categoryTree`                      |
| `/shop/products/{handle}`                                         | `shop/product.html`                  | `product`                                          |
| `/shop/product/{id}`                                              | `shop/product.html`                  | 兼容数字 ID 入口；有 handle 时重定向到商品永久链接 |
| `/shop/subscription/{handle}`                                     | `shop/product.html`                  | `product`；仅接受已发布的订阅商品                  |
| `/shop/cart`                                                      | `shop/cart.html`                     | 无购物车数据变量，由组件请求数据                   |
| `/shop/checkout/{contextId}`                                      | `shop/checkout.html`                 | `context`、`paymentMethods`、`authenticated`       |
| `/shop/order/{orderCode}/payments`                                | `shop/payments.html`                 | `orderCode`、`authenticated`                       |
| `/shop/order/{orderCode}`                                         | `shop/order.html`                    | 见下方订单页面说明                                 |
| `/shop/order/{orderCode}/payment-sessions/{sessionCode}/redirect` | `shop/payments/alipay-redirect.html` | `redirectionData`，用于支付宝跳转                  |

这些路由由商城提供，不需要在主题中另行注册。模板存在也不代表商城已启用；关闭商城时，受商城开关控制的路由会返回 404。

除专属变量外，还可以使用 Halo 的[全局变量](../../theme/global-variables.mdx)，如 `site` 和 `theme`。提交表单或发起写请求时使用 `${_csrf.token}`。

## 商品列表

### 筛选与分页参数

`GET /shop/products` 接受以下查询参数：

| 参数                   | 含义                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `page`                 | 页码，从 **1** 开始                                                 |
| `size`                 | 每页数量，默认 10，最大 100                                         |
| `sort`                 | 如 `minPrice,asc`、`minPrice,desc`、`title,asc`；未传时按 `id` 降序 |
| `keyword`              | 商品标题关键词                                                      |
| `categoryId`           | 分类 ID                                                             |
| `minPrice`、`maxPrice` | 价格筛选边界                                                        |

例如 `/shop/products?keyword=键盘&sort=minPrice,asc&page=1`。切换筛选条件时应清除旧的 `page`，分页跳转时则保留当前筛选条件。

`productPage` 为 `ListResult<ProductResponse>`，使用 `items` 获取当前页商品，`page`、`size`、`total` 分别表示页码、每页数量和总条数；可用 `hasNext`、`hasPrevious` 判断翻页按钮状态。

```html
<section>
  <p th:if="${productPage.items.isEmpty()}">没有找到商品</p>
  <article th:each="product : ${productPage.items}">
    <a th:href="@{${product.permalink}}" th:text="${product.title}"></a>
    <span
      th:if="${product.minPrice != null}"
      th:text="|¥${#numbers.formatDecimal(product.minPrice, 1, 2)} 起|"
    ></span>
  </article>
</section>
```

`categoryTree` 是分类树列表。每项包含 `id`、`name`、`slug`、`image`、`description`、`parentId` 和 `children` 等字段。需要展示多级分类时自行递归渲染 `children`。

## 商品详情

`product` 是 `ProductResponse`。列表与详情共用该模型，但列表数据不包含完整详情内容；正文、图库与 SKU 应从详情页变量、`getByHandle` 或详情接口获取。

| 字段                                        | 用途                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| `id`                                        | 商品 ID，用于商品接口和购买组件                              |
| `handle`、`permalink`                       | 商品标识与后端生成的前台链接，输出链接时优先使用 `permalink` |
| `title`、`description`                      | 商品标题与简短介绍，使用 `th:text` 输出                      |
| `coverImageUrl`、`images`                   | 封面与详情图库；为空时显示占位内容                           |
| `content`                                   | 商品详情 HTML，可使用 `th:utext` 渲染                        |
| `productType`                               | 商品类型，包括订阅与外链商品等                               |
| `specDefinition`                            | 规格定义，`usedForSku` 表示是否参与 SKU 选择                 |
| `productVariants`                           | SKU 列表，包含价格、规格、库存与购买限制                     |
| `minPrice`、`maxPrice`                      | 商品价格区间                                                 |
| `minOriginalPrice`、`maxOriginalPrice`      | 原价区间                                                     |
| `externalLinkUrl`、`externalLinkButtonText` | 外链商品的目标地址与按钮文案                                 |

```html
<h1 th:text="${product.title}"></h1>
<p th:text="${product.description}"></p>
<shop-buy-box
  th:id="${product.id}"
  th:csrfToken="${_csrf.token}"
></shop-buy-box>
<div
  th:if="${!#strings.isEmpty(product.content)}"
  th:utext="${product.content}"
></div>
```

示例中的购买组件需要先加载商城脚本和样式。它会根据商品类型选择普通 SKU 或订阅计划交互，主题不需要另建订阅详情模板。

商品 ID、SKU ID、订阅计划 ID 是不同标识：购买请求使用 SKU ID；订阅商品使用计划的 `variantId`。不要把 `product.id` 或计划 `id` 直接用作购买参数。

## 结算与支付页面

`context.id` 是当前会话的结算上下文标识，由准备结算请求创建。不能随意构造 ID，也不能从另一浏览器会话复制结算链接使用；上下文缺失或不匹配时，结算页会重定向到购物车。

结算页的 `paymentMethods` 是当前销售渠道的公开支付方式。内置结算组件使用 `context.id` 再请求上下文，支付页则使用 `orderCode` 请求订单和可用支付方式。

`authenticated` 表示当前是否登录。它是展示提示，订单操作仍由服务端校验权限。完整过程见[前台接口与交易流程](./storefront-api.md)。

## 订单详情与游客访问

订单地址支持 HTML 与 JSON 两种响应；脚本读取 JSON 时显式发送 `Accept: application/json`。

| 变量                  | 含义                                 |
| --------------------- | ------------------------------------ |
| `orderCode`           | 订单号                               |
| `locked`              | 是否需要重新获取访问凭据             |
| `order`               | 订单内容，仅在 `locked=false` 时提供 |
| `fulfillments`        | 履约列表，仅在 `locked=false` 时提供 |
| `authenticated`       | 当前登录用户是否为订单所有者         |
| `canPay`、`canCancel` | 是否可以显示付款、取消操作           |

自定义页面必须先处理 `locked`，再读取订单内容：

```html
<section th:if="${locked}">
  <p>请输入下单时使用的邮箱以重新获取访问链接。</p>
  <form
    th:action="@{/shop/order/{code}/access-link(code=${orderCode})}"
    method="post"
  >
    <input type="hidden" name="_csrf" th:value="${_csrf.token}" />
    <label>邮箱 <input type="email" name="email" required /></label>
    <button type="submit">发送访问链接</button>
  </form>
</section>
<section th:unless="${locked}">
  <h1 th:text="|订单 ${order.orderCode}|"></h1>
  <span
    th:text="|¥${#numbers.formatDecimal(order.payableAmount, 1, 2)}|"
  ></span>
</section>
```

订单金额中，`discountAmount` 和 `couponDiscountAmount` 分别表示普通优惠与优惠券抵扣，展示汇总时需要分别处理；应付金额使用 `payableAmount`，不要在主题中重新计算。

履约列表可能包含快递、自提、同城配送或虚拟交付。附件下载链接使用 `/shop/order/{orderCode}/digital-resources/{publicId}/download`；卡密与数字资源只应在订单授权成功后展示。

## 支付跳转中间页

`shop/payments/alipay-redirect.html` 接收支付接口生成的 `redirectionData`。通常保留内置模板即可，覆盖时需要保留该表单 HTML 的输出与自动提交行为，避免把它转义成普通文本。

不要把 `/shop/checkout/success` 当作通用支付成功地址。2.27 的正常流程根据订单状态跳转到订单页或支付页，主题应遵循后端返回的跳转地址。
