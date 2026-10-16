---
title: 订阅 Webhook
description: 订阅 Webhook 的投递格式、签名验证、重试与去重，以及各订阅事件的触发时机、载荷字段与处理建议。
---

:::note 适用范围
本页适用于 **Halo 商城版 2.27.0 及以上版本**。Webhook 的创建与投递记录查看见[商城 / Webhook](../../../guide/shop/webhooks.md)，订阅业务语义见[订阅生命周期](./subscription-lifecycle.md)。
:::

## 投递格式

Halo 以 `POST` 请求把事件投递到接入方配置的回调 URL，请求体是统一信封：

```json
{
  "eventType": "SUBSCRIPTION_CREATED",
  "timestamp": "2026-09-17T10:00:00Z",
  "webhookId": 1,
  "data": {
    "subscription": {}
  }
}
```

| 字段        | 说明                                               |
| ----------- | -------------------------------------------------- |
| `eventType` | 事件类型，例如 `SUBSCRIPTION_CREATED`。            |
| `timestamp` | 载荷生成时间（ISO-8601 UTC）。                     |
| `webhookId` | Webhook **配置**的 ID（数字），不是本次投递的 ID。 |
| `data`      | 事件数据，订阅事件固定为 `data.subscription`。     |

请求头：

| 请求头                      | 说明                                               |
| --------------------------- | -------------------------------------------------- |
| `X-Halo-Event`              | 事件类型，便于路由                                 |
| `X-Halo-Signature-256`      | `sha256=<hex>`，对**原始请求体**计算的 HMAC-SHA256 |
| `X-Halo-Delivery-Timestamp` | 本次投递时间（Unix 秒），**不参与签名**            |
| `X-Halo-Webhook-Id`         | 本次投递的 ID（UUID），重试与手动重投保持不变      |
| `X-Halo-Delivery-Attempt`   | 当前投递次数，从 1 开始                            |
| `User-Agent`                | `Halo-Webhook/1.0`                                 |

## 验证签名

使用创建 Webhook 时填写的密钥，对未经解析的原始请求体验签，并使用常量时间比较：

```python
import hashlib
import hmac

expected = "sha256=" + hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
if not hmac.compare_digest(received_signature, expected):
    raise ValueError("invalid webhook signature")
```

:::warning 注意
签名只覆盖原始请求体，`X-Halo-Delivery-Timestamp` 与 `X-Halo-Webhook-Id` 均不参与签名。获得有效旧请求的人可以修改这两个请求头，因此请求头时间窗与投递 ID 去重不能作为防重放保障。

如需防重放，可在验签后持久化原始请求体的摘要以识别重复载荷，并基于正文中已签名的 `timestamp` 制定接受时间窗。时间窗需要考虑自动重试约 10 小时及更晚的人工重投，超出窗口的通知应通过查询当前业务状态对账处理。业务操作仍须保持幂等，不能因为请求头改变就再次交付或增加额度。

不要先解析再重新序列化 JSON，字节变化会导致验签失败。
:::

## 返回状态与重试

| 端点返回                      | Halo 的处理                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `2xx`                         | 投递成功                                                                              |
| `4xx`                         | 判定为请求或配置错误，立即终止，不再重试                                              |
| `5xx`、`3xx` 或网络错误、超时 | 重试，间隔约 1 分钟、5 分钟、30 分钟、2 小时、8 小时，最多投递 6 次（约 10 小时窗口） |

Halo 等待响应的超时时间为 10 秒。请先完成验签与持久化，尽快返回 `2xx`，耗时处理放到后台任务。投递失败后可以在控制台的**投递记录**中查看请求与响应，并手动重新投递。

## 幂等与顺序

- 采用**至少一次**投递：自动重试与手动重投都可能产生重复请求。正常投递去重可使用 `X-Halo-Webhook-Id`，处理过的 ID 直接返回 `2xx`；它不替代防重放校验与业务幂等。
- 同一订单（或同一订阅）的事件通常按发布顺序投递，但重试不受顺序约束，可能出现交错。重试使用保存的原始载荷，不会重新查询订阅；不同事件的 ID 去重也不能阻止旧快照覆盖新状态。
- 当前载荷没有订阅状态的单调递增版本号，正文 `timestamp` 是载荷生成时间，也不能作为状态版本。更新权益时，应按订阅 ID 串行执行「查询当前订阅 → 更新本地快照与权益」，不要直接用每次收到的事件快照覆盖本地状态。查询接口和令牌权限见[查询与对账接口](./subscription-lifecycle.md#查询与对账接口)；仅有履约上报权限时，需要由有查询权限的运营侧服务完成对账。
- 自动重试与 Webhook **投递记录**中的手动重新投递共享原 `X-Halo-Webhook-Id`，后者的 `X-Halo-Delivery-Attempt` 会重置为 1。订单详情页重新发送履约请求会产生新事件和新 ID，详见[交付请求通知](./fulfillment-callback.md#交付请求通知出站)。

## 订阅事件参考

| 事件                                 | 触发时机                                   | 建议动作                                                                  |
| ------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------- |
| `SUBSCRIPTION_CREATED`               | 购买支付成功后开通订阅                     | 按 `effectiveEntitlements` 开通权益                                       |
| `SUBSCRIPTION_TRIAL_STARTED`         | 按试用价开通订阅                           | 开通试用权益，记录 `trialEndAt`                                           |
| `SUBSCRIPTION_TRIAL_CONVERTED`       | 试用转正支付完成                           | 切换为付费档次权益                                                        |
| `SUBSCRIPTION_RENEWAL_REMINDER`      | 到期前 `renewalLeadDays` 天                | 用自有渠道提醒客户续费；同一到期时点只发一次                              |
| `SUBSCRIPTION_RENEWAL_ORDER_CREATED` | 客户发起续费并生成续费单                   | 如需代付，可通过变更流水取到 `orderId`                                    |
| `SUBSCRIPTION_RENEWED`               | 续费支付完成，覆盖终点顺延                 | 刷新周期与到期时间，按自有规则重置额度                                    |
| `SUBSCRIPTION_PLAN_CHANGED`          | 计划变更已生效                             | 用新快照替换本地权益；**周期已重置**，按新的 `paidThroughAt` 更新到期时间 |
| `SUBSCRIPTION_QUANTITY_CHANGED`      | 订阅数量发生变化                           | 按新快照刷新权益                                                          |
| `SUBSCRIPTION_CHANGE_APPLIED`        | 变更单已应用                               | 审计与对账；常与 `PLAN_CHANGED` 一同出现                                  |
| `SUBSCRIPTION_CANCEL_SCHEDULED`      | 客户勾选到期取消                           | 当期仍然有效；标记本地「不再续费」                                        |
| `SUBSCRIPTION_CANCELLED`             | 订阅已取消                                 | **立即停用**业务权益                                                      |
| `SUBSCRIPTION_PAST_DUE`              | 到期未续费，进入宽限期                     | 可降级为只读或限流，或等待宽限结束                                        |
| `SUBSCRIPTION_EXPIRED`               | 已过期（宽限结束、预付一期到期或试用过期） | **立即停用**业务权益                                                      |

:::note 暂不投递的事件
`SUBSCRIPTION_RENEWAL_FAILED` 与 `SUBSCRIPTION_CHANGE_FAILED` 会出现在控制台的事件列表中，但当前版本不会产生投递：支付失败不会改变订阅状态，`PAST_DUE` 仅由到期时间驱动。
:::

:::tip 试用转正
试用中的订阅调用续费入口时生成的是**转正单**，不会触发 `SUBSCRIPTION_RENEWAL_ORDER_CREATED`；转正支付完成后会触发 `SUBSCRIPTION_TRIAL_CONVERTED`。
:::

## 载荷字段

所有订阅事件的 `data.subscription` 结构一致，是载荷生成时查询到的订阅快照，不包含订单号与变更前后明细。延迟或重试投递中的快照可能已经过时：

| 字段                                          | 类型     | 说明                                                         |
| --------------------------------------------- | -------- | ------------------------------------------------------------ |
| `id`                                          | 数字     | 订阅 ID                                                      |
| `customerId`                                  | 数字     | 客户 ID                                                      |
| `productId`                                   | 数字     | 产品线 ID                                                    |
| `planId`                                      | 数字     | 当前计划 ID                                                  |
| `variantId`                                   | 数字     | 当前计划对应的商品规格 ID                                    |
| `status`                                      | 字符串   | `TRIALING` / `ACTIVE` / `PAST_DUE` / `CANCELLED` / `EXPIRED` |
| `quantity`                                    | 数字     | 订阅数量                                                     |
| `cancelAtPeriodEnd`                           | 布尔     | 是否已勾选到期取消                                           |
| `trialStartAt` / `trialEndAt`                 | 时间或空 | 试用起止                                                     |
| `currentPeriodStartAt` / `currentPeriodEndAt` | 时间或空 | 当前周期起止                                                 |
| `paidThroughAt`                               | 时间或空 | 已付费覆盖终点；买断为 `null`                                |
| `effectiveEntitlements`                       | 对象或空 | 权益契约快照                                                 |

需要订单号、差价明细或变更前后的周期时，请用 Console 查询接口补全：续费单、转正单与变更单本身也是订单，会同时触发订单域事件。

## 关联的订单事件

订阅的续费单、转正单与变更单都是普通订单，因此还会触发订单域 Webhook：

- `ORDER_CREATED`：订单创建。
- `ORDER_PAID`：订单支付完成。应付金额为 0 的订单在创建时即视为已支付，会同时触发 `ORDER_CREATED` 与 `ORDER_PAID`。
- `FULFILLMENT_REQUESTED`：需要接入方交付订阅行时的交付请求，见[履约回调](./fulfillment-callback.md)。

订单载荷中的 `data.order.items[].subscriptionMetadata` 可以区分订单来源：

| 字段                                         | 说明                                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| `type`                                       | `PURCHASE` / `RENEWAL` / `PLAN_CHANGE` / `TRIAL_CONVERT` |
| `planId`                                     | 相关计划 ID                                              |
| `changeId`                                   | 关联的变更 ID（变更单）                                  |
| `fromQuantity` / `toQuantity`                | 变更前后的数量                                           |
| `periodDelta`                                | 周期偏移（预留字段，当前版本不写入）                     |
| `feeType`                                    | 费用类型，如 `TRIAL` / `FREE` / `FIXED_FEE` / `PRORATED` |
| `planName` / `billingPeriod` / `billingMode` | 下单时的计划快照                                         |

## 处理建议

1. 验签并校验重放 → 投递去重并持久化待处理任务 → 按 `data.subscription.id` 串行查询当前订阅 → 用查询结果更新本地快照 → 按当前 `status` 与 `effectiveEntitlements` 调整限额。事件载荷中的权益字段同样是 `data.subscription.effectiveEntitlements`。
2. 开通与关闭权益必须幂等，重复投递不得叠加额度。
3. 以 Halo 下发的快照为准，不要在本地自行推算周期，详见[权益如何判定](./subscription-lifecycle.md#权益如何判定)。
4. 控制台的**发送测试事件**会投递 `WEBHOOK_TEST`，载荷是订单结构且字段与真实事件不完全一致（例如收货地址使用的是测试字段），请勿写入业务数据。
