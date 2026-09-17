---
title: 履约回调
description: 订阅订单的交付请求通知与发货上报接口：鉴权准备、请求与响应字段、幂等语义、错误处理与对账。
---

:::note 适用范围
本页适用于 **Halo 商城版 2.27.0 及以上版本**。
:::

订阅订单行不走物流发货，Halo **不会自行判定订阅权益是否已经交付**：订单支付后 Halo 通知接入方交付，接入方交付完成后调用 Halo 的接口回执，Halo 据此记账。

```mermaid
sequenceDiagram
  participant H as Halo 商城
  participant I as 接入方服务
  H->>I: ① Webhook FULFILLMENT_REQUESTED（请求交付）
  I->>I: 完成交付（开通权益、发放授权等）
  I->>H: ② POST /orders/{id}/fulfillment-reports（回执）
  H->>H: 记账并刷新订单履约状态
```

- ① 在订单支付成功后自动发出一次，运营也可以在控制台订单详情页重新发送。
- ② 只接受**订阅订单行**。实物行与虚拟商品行沿用原有发货流程，上报会被拒绝。
- 上报不会创建发货单，也不会发放卡密或数字资源；虚拟交付见[商城 / 虚拟交付](../../guide/shop/virtual-delivery.mdx)。

## 鉴权准备

1. 在控制台创建一个专用 Halo 用户，并绑定角色**「订单发货上报」**（`role-template-report-ecommerce-fulfillments`）。
2. 用该用户登录用户中心，创建个人令牌，只勾选该角色。
3. 在接入方系统中配置令牌，请求时携带 `Authorization: Bearer pat_xxx`。

该角色只包含两项权限：

| API 分组                         | 资源                         | 权限          |
| -------------------------------- | ---------------------------- | ------------- |
| `console.api.ecommerce.halo.run` | `orders`                     | `get`、`list` |
| `console.api.ecommerce.halo.run` | `orders/fulfillment-reports` | `create`      |

:::warning 先授角色，再签令牌
个人令牌只能申请签发者已有的角色，因此必须先在控制台给该用户授权，再用它创建令牌。请勿把管理员令牌交给接入方服务。
:::

## 交付请求通知（出站）

订单支付成功后，只要订单中还有未履约的订阅行，Halo 就会投递一次 `FULFILLMENT_REQUESTED`：

```
POST {你的回调地址}
X-Halo-Event: FULFILLMENT_REQUESTED
X-Halo-Signature-256: sha256={hex}
X-Halo-Webhook-Id: {uuid}
```

`data.order` 与 `ORDER_PAID` 完全一致，包含订单行列表；订阅行的标识字段见[订阅 Webhook](./subscription-webhook.md#关联的订单事件)。

- 收到该事件表示「Halo 希望你交付这个订单」，**不代表订单已经发货**。
- 该事件在支付后自动发送一次，重试与手动重发共享同一个 `X-Halo-Webhook-Id`。
- 漏收时可以请运营在控制台订单详情页重新发送，也可以核对订单后直接上报，Halo 不要求必须先收到通知。

## 发货上报（入站）

```
POST /apis/console.api.ecommerce.halo.run/v1alpha1/orders/{id}/fulfillment-reports
Authorization: Bearer pat_xxx
Content-Type: application/json
```

`{id}` 是订单 ID，即 Webhook 载荷中的 `data.order.id`，不是订单编号。

| 字段                  | 类型   | 必填 | 说明                                                                           |
| --------------------- | ------ | ---- | ------------------------------------------------------------------------------ |
| `items`               | 数组   | 否   | 上报的订单行。**省略、传空数组或使用空请求体表示上报该订单全部未履约的订阅行** |
| `items[].orderItemId` | 数字   | 是   | 订单行 ID，取自载荷中的 `data.order.items[].id`，必须大于 0                    |
| `items[].quantity`    | 数字   | 是   | 本次交付数量，必须大于 0                                                       |
| `externalReference`   | 字符串 | 否   | 接入方单据号，最长 128 字符，仅用于审计留痕                                    |

请求示例：

```bash
curl -X POST \
  'https://demo.halo.run/apis/console.api.ecommerce.halo.run/v1alpha1/orders/10/fulfillment-reports' \
  -H 'Authorization: Bearer pat_1234567890abcdef' \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"orderItemId":1001,"quantity":1}],"externalReference":"SUB-2026-0001"}'
```

响应 `200`：

```json
{
  "orderId": 10,
  "orderCode": "ORD-20260917-001",
  "fulfillmentStatus": "FULFILLED",
  "items": [
    {
      "orderItemId": 1001,
      "quantity": 1,
      "appliedQuantity": 1,
      "fulfilledQuantity": 1
    }
  ]
}
```

| 字段                        | 说明                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `fulfillmentStatus`         | 上报后的订单履约状态：`PENDING`（还有未履约行）/ `PROCESSING` / `FULFILLED`。该状态按订单的全部订单行（实物与订阅）计算 |
| `items[].quantity`          | 本次上报的数量                                                                                                          |
| `items[].appliedQuantity`   | 本次实际记账的数量；重复上报已履约的行时为 `0`                                                                          |
| `items[].fulfilledQuantity` | 记账后该行的累计已履约数量                                                                                              |

整单上报（省略 `items`）时，目标为该订单所有还有剩余数量的订阅行，已经履约完成的行不会出现在响应中；显式上报的行都会出现在响应里，本次未记账的行 `appliedQuantity` 为 `0`。

## 幂等与重试

| 场景                                                 | 行为                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| 订单行已全部履约，再次上报相同或更少数量（网络重试） | 返回 `200`，`appliedQuantity` 为 `0`，不重复计数，也不写订单时间线 |
| 订单行还有剩余，上报数量不超过剩余数量               | 按差额记账，返回 `200`                                             |
| 订单行还有剩余，上报数量超过剩余数量                 | 返回 `409`，请按剩余数量修正后重报                                 |
| 并发上报同一订单                                     | 服务端串行化记账，不会超额                                         |

建议：

- 交付成功后立即上报，网络失败可以使用相同参数安全重试。
- 请用「订单 ID + 订单行 ID」作为接入方侧的幂等键，避免重复交付。
- 收到 `409` 时不要盲目重试，先查询订单核对剩余数量。

## 错误处理

错误响应遵循 RFC 7807（`application/problem+json`），`detail` 为可读原因并会随 `Accept-Language` 变化，请按 HTTP 状态码判断处理方式。

| HTTP  | 含义                                                                                          | 是否可重试     |
| ----- | --------------------------------------------------------------------------------------------- | -------------- |
| `400` | 请求体校验失败（`orderItemId` 与 `quantity` 必须大于 0，`externalReference` 不超过 128 字符） | 否，修正请求   |
| `400` | 订单中没有订阅行                                                                              | 否             |
| `400` | `items` 中同一订单行重复出现                                                                  | 否             |
| `400` | `orderItemId` 不属于该订单                                                                    | 否             |
| `400` | `orderItemId` 不是订阅行（实物或虚拟商品行）                                                  | 否             |
| `401` | 个人令牌无效、已撤销或已过期                                                                  | 否，更换令牌   |
| `403` | 令牌缺少上报角色                                                                              | 否，补齐角色   |
| `404` | 订单不存在                                                                                    | 否             |
| `409` | 订单未支付或已取消                                                                            | 否             |
| `409` | 上报数量超过剩余可履约数量                                                                    | 修正后重试     |
| `409` | 并发记账冲突（订单行可能已被超额上报）                                                        | 查询订单后重试 |

## 对账与运维

- **查询订单**：`GET /apis/console.api.ecommerce.halo.run/v1alpha1/orders/{id}`（同一令牌可读），用 `items[].quantity`、`items[].fulfilledQuantity` 与 `fulfillmentStatus` 核对是否还有未履约行。
- **查看时间线**：运营可以在控制台订单详情页看到「请求发货」「接入方上报发货」「订单履约状态已更新」等记录，上报写入的内容包含接入方的 `externalReference`。
- **漏收通知**：请运营在订单详情页重新发送发货请求，或核对订单后直接上报。
- **人工兜底**：订阅订单行不能在控制台手动发货，只能由接入方上报。

:::note 上报之后
上报只会更新订单行的已履约数量、刷新订单履约状态并写入一条订单时间线：**不会创建发货单，不会发放卡密或数字资源，也不会触发 `FULFILLMENT_SHIPPED` / `FULFILLMENT_COMPLETED` 事件**。请以接口响应作为记账结果。
:::
