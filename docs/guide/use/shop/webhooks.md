---
title: Webhook
description: 配置 Halo 商城 Webhook，并正确验签、去重和处理订单、支付与发货事件。
---

:::note 适用范围
本页适用于控制台已经显示 **Webhook** 菜单的 Halo 商城版。可选事件以当前安装版本的创建表单为准。
:::

Webhook 会把订单、支付和发货事件以 HTTP `POST` 请求发送到外部系统，可用于对接 ERP、物流或营销系统。

## 创建 Webhook

登录 Halo 控制台，进入 **Webhook**，点击新建并填写：

- 名称：用于在控制台中辨认配置。
- URL：接收事件的 HTTPS 地址。
- 密钥：用于校验请求签名，应使用随机值并妥善保管。
- 事件：需要订阅的事件类型。
- 是否启用：停用后不会发送新的事件。

保存后，可以从列表发送测试事件。测试请求的事件类型是 `WEBHOOK_TEST`，测试订单号为 `TEST-ORDER`，金额为 `0`。

## 请求格式

请求正文是 JSON，基本结构如下：

```json
{
  "eventType": "ORDER_PAID",
  "timestamp": "2026-08-31T08:00:00Z",
  "webhookId": "webhook-config-name",
  "data": {}
}
```

常用请求头：

| 请求头                      | 说明                              |
| --------------------------- | --------------------------------- |
| `X-Halo-Event`              | 事件类型                          |
| `X-Halo-Signature-256`      | `sha256=<十六进制 HMAC>`          |
| `X-Halo-Delivery-Timestamp` | 本次投递时间                      |
| `X-Halo-Webhook-Id`         | 投递 ID；重试和手动重投时保持不变 |
| `X-Halo-Delivery-Attempt`   | 当前投递次数                      |

当前可能出现的业务事件包括：

- `ORDER_CREATED`
- `ORDER_PAID`
- `ORDER_CANCELLED`
- `PAYMENT_FAILED`
- `PAYMENT_CANCELLED`
- `FULFILLMENT_SHIPPED`
- `FULFILLMENT_COMPLETED`

零元订单只触发 `ORDER_CREATED`，不会触发 `ORDER_PAID`。当前没有退款事件。

## 验证签名

使用 Webhook 密钥，对未经解析的原始请求正文计算 HMAC-SHA256，并使用常量时间比较校验签名：

```python
import hashlib
import hmac

expected = "sha256=" + hmac.new(
    secret.encode(), raw_body, hashlib.sha256
).hexdigest()

if not hmac.compare_digest(received_signature, expected):
    raise ValueError("invalid webhook signature")
```

不要先解析再重新序列化 JSON，否则字节变化会导致验签失败。

## 返回状态与重试

- `2xx`：投递成功。
- `4xx`：接收端拒绝请求，不再自动重试。
- `5xx` 或网络错误：按约 1 分钟、5 分钟、30 分钟、2 小时、8 小时的间隔重试，共最多投递 6 次。

Halo 等待接收端响应的超时时间为 10 秒。接收端应先完成验签和持久化，再尽快返回 `2xx`；耗时处理应放到后台任务。

## 防止重复处理

Webhook 采用至少一次投递，同一事件可能被重复发送。接收端应以 `X-Halo-Webhook-Id` 作为幂等键：已经处理过该 ID 时直接返回成功，不要重复扣库存、发货或记账。

不同订单中的事件通常按发布顺序发送，但失败重试可能造成交错，接收端仍需根据业务状态判断能否执行操作。

## 查看投递记录

在 **Webhook -> 投递记录** 中可以按状态和事件类型筛选记录，查看请求头、请求正文及响应结果。失败记录修复后，可以手动重新投递。

:::warning 数据与密钥安全
Webhook 数据可能包含订单金额、姓名、地址和手机号。请只使用 HTTPS，不要把密钥放入前端代码或日志，并限制投递记录和接收端日志的访问权限。
:::
