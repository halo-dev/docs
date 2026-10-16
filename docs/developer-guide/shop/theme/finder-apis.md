---
title: Finder API
description: 在 Thymeleaf 中查询商城商品、分类和订阅计划，了解查询参数、返回模型与分页差异。
---

商城 Finder 用于在首页、侧边栏或自定义页面中读取商品数据，不需要浏览器额外发送请求。以下示例以 Halo 商城版 2.27 为基线。

## productFinder.list(params)

商品 Finder 自 Halo 商城版 2.23 起提供，**2.23.2 起返回 `ListResult`**；2.23.0 和 2.23.1 返回 `Page`，字段差异见[版本差异](./api-changelog.md#halo-商城版-2232)。2.27 支持下表中的参数。

### 参数

`params` 是一个 Map，支持：

| 参数                   | 类型       | 默认值与说明                               |
| ---------------------- | ---------- | ------------------------------------------ |
| `page`                 | 整数       | 默认 1，从 1 开始                          |
| `size`                 | 整数       | 默认 10，有效范围 1–999；超出范围回退到 10 |
| `sort`                 | 字符串列表 | 如 `{'id,desc'}`，未设置时不指定排序       |
| `keyword`              | 字符串     | 商品标题关键词                             |
| `categoryId`           | 长整数     | 分类 ID，正数                              |
| `minPrice`、`maxPrice` | 数值       | 价格筛选边界                               |

Finder 的每页数量限制与 `/shop/products` HTTP 路由的最大 100 条不同，不要混用。

### 返回值

返回 `ListResult<ProductResponse>`，只包含已发布商品。用 `items` 遍历，`page` 为从 1 开始的页码，`total` 为总条数。

```html
<section
  th:with="products = ${productFinder.list({page: 1, size: 6, sort: {'id,desc'}})}"
>
  <article th:each="product : ${products.items}">
    <a th:href="@{${product.permalink}}">
      <img
        th:if="${!#strings.isEmpty(product.coverImageUrl)}"
        th:src="${product.coverImageUrl}"
        th:alt="${product.title}"
        loading="lazy"
      />
      <span th:text="${product.title}"></span>
    </a>
  </article>
  <p th:if="${products.items.isEmpty()}">暂无商品</p>
</section>
```

列表返回用于商品卡片的摘要数据。商品字段说明见[商品详情](./pages-and-variables.md#商品详情)。

## productFinder.getByHandle(handle)

**自 Halo 商城版 2.27 起可用。**

按字符串 `handle` 查询单个已发布商品，返回包含正文、图库和 SKU 的 `ProductResponse`。商品不存在、未发布或 handle 为空时无结果，模板应处理空值。

```html
<th:block th:with="product = ${productFinder.getByHandle('example-product')}">
  <article th:if="${product != null}">
    <h2 th:text="${product.title}"></h2>
    <a th:href="@{${product.permalink}}">查看商品</a>
  </article>
</th:block>
```

## productCategoryFinder.list(params)

**自 Halo 商城版 2.23 起可用。** 2.27 中仍返回 `Page<ProductCategoryResponse>`。

### 参数

支持 `page`、`size`、`sort`，默认值与商品 Finder 相同；不支持商品关键词、价格或 `categoryId` 筛选。

### 返回值

分类分页与商品分页使用不同字段：

| 含义       | 商品 `ListResult` | 分类 `Page`         |
| ---------- | ----------------- | ------------------- |
| 当前页数据 | `items`           | `content`           |
| 当前页码   | `page`，从 1 开始 | `number`，从 0 开始 |
| 每页数量   | `size`            | `size`              |
| 总条数     | `total`           | `totalElements`     |
| 总页数     | `totalPages`      | `totalPages`        |

两者的**输入参数 `page` 都从 1 开始**。分类 Finder 返回平铺分页，不等同于商品列表页的 `categoryTree`。

```html
<nav
  th:with="categories = ${productCategoryFinder.list({page: 1, size: 20, sort: {'name,asc'}})}"
>
  <a
    th:each="category : ${categories.content}"
    th:href="@{/shop/products(categoryId=${category.id})}"
    th:text="${category.name}"
  ></a>
</nav>
```

## subscriptionFinder.subscription(handle, customerId)

**自 Halo 商城版 2.27 起可用。**

查询已发布订阅商品的渲染数据；普通商品、未发布商品或不存在的 handle 无结果。

- `handle`：订阅商品的 handle。
- `customerId`：商城客户的数字 ID，传 `null` 时仅查询公开计划信息。

`customerId` 不是 Halo 用户名，也不会自动取当前登录用户。主题展示公开订阅计划时传 `null` 即可；展示当前用户的订阅时，优先使用购买组件或登录态订阅商品接口，不要从查询参数读取客户 ID 传给 Finder。

### 返回值

| 字段                  | 含义                                                 |
| --------------------- | ---------------------------------------------------- |
| `product`             | 商品详情                                             |
| `tiers`               | 有已发布计划的档位列表                               |
| `currentSubscription` | 指定客户的当前订阅；未传客户 ID 时为空               |
| `subscriptions`       | 指定客户在该商品下的订阅列表；未传客户 ID 时为空列表 |
| `singleSubscription`  | 该商品是否采用单订阅策略                             |

`tiers` 中每项包含 `id`、`name`、`handle`、`sortOrder`、`entitlements` 和 `plans`。计划包含 `id`、`variantId`、`name`、`price`、`billingMode`、`billingPeriod`、`periodCount`、试用与数量限制等信息。完整模型可查阅 [2.27 商城版 API](https://api.halo.run/?version=2.27-paid) 中的 `SubscriptionPlanResponse`。

```html
<th:block
  th:with="subscription = ${subscriptionFinder.subscription('membership', null)}"
>
  <section th:if="${subscription != null}">
    <h2 th:text="${subscription.product.title}"></h2>
    <article th:each="tier : ${subscription.tiers}">
      <h3 th:text="${tier.name}"></h3>
      <ul>
        <li th:each="plan : ${tier.plans}">
          <span th:text="${plan.name}"></span>
          <span th:text="|¥${#numbers.formatDecimal(plan.price, 1, 2)}|"></span>
        </li>
      </ul>
    </article>
    <a th:href="@{${subscription.product.permalink}}">选择订阅计划</a>
  </section>
</th:block>
```

上例只展示公开计划价格。试用资格、续费、升级补差价和数量限制应交给商城交易流程处理。

## subscriptionFinder.list(params)

**自 Halo 商城版 2.27 起可用。** 支持 `page`、`size`，默认分别为 1 和 10，`size` 有效范围为 1–999。返回 `ListResult<SubscriptionProductRenderModel>`，每项结构与上节相同，且不包含客户订阅数据。

:::warning 2.27 的分页限制
此方法先获取一页已发布商品，再筛选其中的订阅商品。返回数量可能少于 `size`，`total` 为该页筛选后的数量，不能用来计算全站订阅商品总数或可靠的连续分页。如果需要展示确定的订阅商品入口，优先逐个按 handle 查询。
:::

它不支持商品 Finder 的关键词、价格、分类与排序参数。
