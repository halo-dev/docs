---
title: 版本差异
description: Halo 商城主题开发相关的 Finder 返回结构、商品永久链接、订阅和游客交易流程版本说明。
---

本页记录与商城主题适配直接相关的变化。本系列代码示例以 **Halo 商城版 2.27** 为基线；完整接口模型见 [2.27 商城版 API](https://api.halo.run/?version=2.27-paid)。

## Halo 商城版 2.27

- 新增基于 handle 的商品详情入口 `/shop/products/{handle}`，商品响应提供 `permalink`。旧数字 ID 入口 `/shop/product/{id}` 在商品有 handle 时重定向到永久链接。
- `productFinder` 新增 `getByHandle(handle)`。
- 新增订阅商品和 `subscriptionFinder`。`/shop/subscription/{handle}` 复用 `shop/product.html`，内置 `shop-buy-box` 根据商品类型展示订阅计划。
- 前台交易流程支持启用游客结算后的会话购物车、结算、订单访问和访问邮件找回。主题应使用匹配版本的组件与接口，处理游客邮箱、访问凭据和订单锁定状态。
- 订单详情由 `shop/order.html` 渲染，需处理 `locked`、`order`、`fulfillments`、`canPay`、`canCancel` 等变量。

从旧版模板升级时，重点复查商品链接、购买组件、结算请求地址、订单权限恢复和支付状态处理。复制到主题中的模板不会随 Halo 升级自动更新。

## Halo 商城版 2.23.2

`productFinder.list(params)` 的返回值从 2.23.0、2.23.1 中的 `Page<ProductResponse>` 改为 `ListResult<ProductResponse>`：

- 商品集合由 `content` 改为 `items`。
- 返回页码由 `number`（从 0 开始）改为 `page`（从 1 开始）。
- 总条数由 `totalElements` 改为 `total`。

`productCategoryFinder.list(params)` 仍返回 `Page`，不要对分类列表应用同样的字段替换。

## Halo 商城版 2.23

提供 `productFinder.list(params)` 和 `productCategoryFinder.list(params)`，用于在主题中分页查询商品与分类。

## 选择对应源码

从 [shop-templates 分支列表](https://github.com/lxware-dev/shop-templates/branches)选择与目标商城版本对应的 release 分支。`main` 为开发分支，可能包含暂未发布的功能。

主题采用源码二次开发时，模板、UI、客户端类型和后端需要作为一组验证。通用 Halo 主题能力的变化另见[主题 API 变更记录](../../theme/api-changelog.md)。
