---
title: 前台接口与交易流程
description: Halo 商城前台商品、购物车、结算、支付和游客订单接口的使用流程，以及 Cookie、CSRF 与金额处理要求。
---

本页以 **Halo 商城版 2.27** 为基线，面向需要自行实现交互的主题。仅调整页面外观时，优先使用[内置组件](./components.md)。2.27 新增的游客购物车、结算与订单访问能力不能直接用于旧版后端。

商品、订阅和结算等 RESTful API 的请求字段与响应模型见 [Halo 商城版 2.27 RESTful API](https://api.halo.run/?version=2.27-paid)，可在 **User-center API V1alpha1** 中查找 `EcommerceProductUc`、`EcommerceSubscriptionUc`、`EcommerceCheckoutUc` 等标签。该站点的 2.27 定义不包含本页列出的 `/shop/**` 页面与交易路由，这部分应结合匹配版本的 [shop-templates](https://github.com/lxware-dev/shop-templates) 使用。

## 选择接口与身份

| 接口范围                                      | 典型用途                                             |
| --------------------------------------------- | ---------------------------------------------------- |
| `/shop/**`                                    | 浏览器前台页面、会话购物车、结算表单、订单与支付操作 |
| `/apis/uc.api.ecommerce.halo.run/v1alpha1/**` | 商品查询、订阅计划、登录用户地址簿和优惠券等         |
| Console 商城 API                              | 管理端操作，不应作为顾客前台的调用入口               |

不能仅凭 `uc.api` 前缀推断接口必须登录或允许匿名，具体由接口决定。商品详情和订阅商品公开计划可供匿名访问；用户地址簿和客户优惠券依赖登录身份。

普通前台购物车和交易使用当前会话。店铺启用游客结算后，游客可购买支持游客流程的商品；未开启时，需要先登录。**订阅商品不支持游客购买**，应引导登录后继续。

## Cookie 与 CSRF

浏览器请求应与 Halo 保持同源并携带会话 Cookie。不要把管理端 Personal Access Token 写入主题脚本。

普通 HTML 表单带上隐藏字段：

```html
<input type="hidden" name="_csrf" th:value="${_csrf.token}" />
```

JavaScript 写请求可以使用内置组件采用的 `X-XSRF-TOKEN` 请求头。下面的函数可放在商品详情模板中，调用时传入用户选中的 SKU ID 与数量：

```html
<script th:inline="javascript">
  const csrfToken = /*[[${_csrf.token}]]*/ "";

  async function addToCart(productVariantId, quantity) {
    const response = await fetch("/shop/cart/items", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify({ productVariantId, quantity }),
    });

    if (!response.ok) {
      throw new Error("加入购物车失败，请刷新页面后重试");
    }
    return response.json();
  }
</script>
```

调用方需要显示成功或失败结果。CSRF 失效时应让用户刷新当前页面，不要复用其他会话的令牌。

## 查询商品与订阅计划

常用只读接口：

| 方法与路径                                                                        | 用途                                     |
| --------------------------------------------------------------------------------- | ---------------------------------------- |
| `GET /apis/uc.api.ecommerce.halo.run/v1alpha1/products/{id}?includeVariants=true` | 获取商品详情与 SKU                       |
| `GET /apis/uc.api.ecommerce.halo.run/v1alpha1/subscription-products/{id}`         | 获取公开订阅计划及当前登录客户的订阅信息 |
| `GET /apis/uc.api.ecommerce.halo.run/v1alpha1/ecommerceconfigs/shop`              | 获取店铺询价地址和联系信息               |

订阅商品响应包含 `plans`、`currentSubscription`、`subscriptions` 和 `singleSubscription`。游客获得公开计划，客户订阅为空。新购订阅使用所选计划的 `variantId`；切换已有订阅是另一条业务流程，不能简单当作再买一次。可以复用内置购买组件，或引导到 `/uc/shop/subscriptions/{subscriptionId}/change?planId={planId}` 处理变更。

## 购物车

2.27 的前台购物车接口同时支持登录用户和开启游客结算后的游客会话：

| 方法与路径                     | 数据                                                            |
| ------------------------------ | --------------------------------------------------------------- |
| `GET /shop/cart/items`         | 返回当前购物车商品列表                                          |
| `POST /shop/cart/items`        | JSON：`productVariantId`、`quantity`                            |
| `PUT /shop/cart/items/{id}`    | JSON：更新该购物车项的数量                                      |
| `DELETE /shop/cart/items/{id}` | 删除购物车项，成功返回 204                                      |
| `POST /shop/cart`              | 表单：`productVariantId`、`quantity`、`_csrf`；成功跳转到购物车 |

登录用户的购物车项 `id` 是购物车记录的 ID；游客会话使用 SKU ID 作为购物车项 `id`。两种身份都应使用 `GET /shop/cart/items` 返回的 `id` 更新或删除购物车项，不要自行推导标识。

## 准备结算

`POST /shop/checkout/prepare` 接受 `application/x-www-form-urlencoded` 表单。成功后由服务端建立会话结算上下文，并重定向到 `/shop/checkout/{contextId}`。

立即购买时，`source=BUY_NOW`，每一项传 SKU ID 和数量：

```html
<form action="/shop/checkout/prepare" method="post">
  <input type="hidden" name="_csrf" th:value="${_csrf.token}" />
  <input type="hidden" name="source" value="BUY_NOW" />
  <label
    >SKU ID
    <input type="number" name="items[0].productVariantId" min="1" required
  /></label>
  <label
    >数量
    <input type="number" name="items[0].quantity" min="1" value="1" required
  /></label>
  <button type="submit">立即购买</button>
</form>
```

上例便于在开发环境验证表单字段。正式购买界面应把 SKU ID 输入替换为规格选择产生的隐藏字段，并显示价格、库存与数量限制。

购物车结算使用 `source=CART`，对应字段为 `items[0].cartItemId` 和 `items[0].quantity`；多项依次使用 `[1]`、`[2]` 等索引。`cartItemId` 使用当前购物车接口返回的 `id`，登录用户和游客都遵循这一规则。两个来源不要混用字段。

如果在动作地址上附加 `redirect_uri` 以便登录后返回当前页面，使用 `encodeURIComponent` 编码完整 URL，保留原页面的查询参数。

## 读取和提交结算

| 方法与路径                                                                  | 用途                                                |
| --------------------------------------------------------------------------- | --------------------------------------------------- |
| `GET /shop/checkout/{contextId}/context`                                    | 读取当前会话结算上下文和计算结果                    |
| `POST /shop/checkout/{contextId}/discount`                                  | JSON `{ "code": "优惠码" }`，应用折扣               |
| `DELETE /shop/checkout/{contextId}/discount`                                | 移除折扣                                            |
| `PUT /apis/uc.api.ecommerce.halo.run/v1alpha1/checkout/{contextId}/coupons` | 登录客户应用优惠券，JSON 字段为 `customerCouponIds` |
| `POST /shop/checkout/{contextId}/submit`                                    | 提交结算表单并创建订单                              |

结算提交同样使用表单编码。主要字段包括：

- `items[i].productVariantId`、`items[i].quantity`。
- `selectedAddressId`，或 `userAddress.*` 中的新地址字段。
- `customerNotes`、`saveAsNewAddress`。
- 游客的 `email`，以及 `_csrf`。

模型中还包含 `items[i].selectedShippingRateId`，但 Halo 商城版 2.27 尚未实现配送方式选择与运费计算，不应依赖该字段完成配送计费。

地址字段和必填约束应按 API 模型 `CheckoutSubmitRequest`、`UserAddressUpsertRequest` 处理。游客不能借用用户地址簿，提交时使用自己的联系信息；订阅商品要求登录。

展示金额时读取结算响应中的 `calculateResult`，优惠券可能部分成功，应同时处理 `appliedCoupons` 与 `rejectedCoupons`。重新计算失败时，保留用户已填写的表单并展示错误，不要把已有内容替换成空白页。

提交成功返回重定向：待支付订单进入支付页，已经支付的订单进入对应订单页。游客跳转还可能携带访问令牌，**应遵循服务端返回地址**。使用原生表单可以直接完成页面跳转；若改用 `fetch`，需要自行处理浏览器导航，不能把最终 HTML 当作 JSON 解析。

## 支付

订单创建后按以下顺序处理：

1. `GET /shop/order/{orderCode}`，携带 `Accept: application/json` 获取订单。
2. `GET /shop/order/{orderCode}/payment-methods`，获取该订单可用支付方式。
3. `POST /shop/order/{orderCode}/initiate-payment`，JSON 包含 `paymentMethodId`、`returnUrl`，按需提供 `preferredResponseType`。
4. 按响应中的支付渠道、响应类型和 `payload` 展示二维码、表单、跳转或人工付款说明。
5. 使用返回的 `sessionCode` 请求 `GET /shop/order/{orderCode}/payment-sessions/{sessionCode}/status`，在终态停止轮询并更新订单显示。

不要把支付链接返回、打开支付 App 或回到 `returnUrl` 当作已付款。支付结果以服务端状态为准，人工转账类方式还需等待确认。切换支付方式产生新会话后，轮询应跟随新的 `sessionCode`，重新计算超时。

微信 H5、微信内置浏览器、桌面二维码和支付宝表单跳转的处理不同。没有自行实现这些分支的需求时，保留内置支付组件。

## 游客订单与履约

2.27 中，游客订单依赖下单后或邮件中的访问凭据。有效的 `access` 查询参数由服务端处理并写入订单访问 Cookie，再跳转到不含该参数的地址。主题应保留这一导航过程，不要把订单号本身视为授权凭据。

无权限或凭据失效时，订单 JSON 请求可能返回 **404**；HTML 订单页则可能提供 `locked=true` 的找回界面。自定义支付页应提供找回入口，而非只针对 401、403 处理。

| 方法与路径                                                          | 用途                         |
| ------------------------------------------------------------------- | ---------------------------- |
| `POST /shop/order/{orderCode}/access-link`                          | 提交下单邮箱重新获取访问邮件 |
| `POST /shop/order/{orderCode}/cancel`                               | 取消允许取消的订单           |
| `GET /shop/order/{orderCode}/fulfillments`                          | 获取履约信息                 |
| `GET /shop/order/{orderCode}/digital-resources/{publicId}/download` | 通过订单授权下载数字资源     |
| `GET /shop/order/{orderCode}/items/{orderItemId}/cdks`              | 获取订单项对应的卡密         |

找回接口支持表单和 JSON。JSON 请求使用 `Accept: application/json`，成功返回 204；提示应为“如果邮箱与订单一致，访问链接已发送”，不要宣称已验证订单归属或一定发送成功。

订单金额、支付状态、可取消状态和履约结果都应使用服务端数据。主题只负责呈现与发起操作，不在浏览器中推导最终授权或支付成功状态。
