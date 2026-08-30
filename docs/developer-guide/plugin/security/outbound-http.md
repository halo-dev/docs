---
title: 敏感数据与出站请求
description: 使用 Halo Secret 保存插件密钥，并为 WebClient 出站请求防范 SSRF、凭据泄漏、危险重定向和配置读取失败时的意外开放
---

插件连接第三方服务时，需要同时保护认证信息和 Halo 所在网络。用户能够填写一个 URL，不代表插件可以直接从服务端访问该地址，更不能在校验地址前附加 Token。

## 使用 Secret 保存敏感数据

密码、Token、API Key 和私钥应保存在 Halo `Secret` 中。Setting、ConfigMap、自定义模型 `spec` 和 UI 状态只保存 Secret 的名称，不保存或返回密钥明文。

Setting 表单可以使用 `secret` 输入组件：

```yaml
- $formkit: secret
  name: apiKeySecretName
  label: API Key
  descriptionPreset: 第三方服务 API
  requiredKeys:
    - key: token
      help: 第三方服务访问令牌
```

服务端通过 `ReactiveExtensionClient` 获取 Secret，并按插件约定的键读取值：

```java
return client.fetch(Secret.class, secretName)
    .switchIfEmpty(Mono.error(new IllegalArgumentException("Secret not found")))
    .map(Secret::getStringData)
    .map(data -> data.get("token"));
```

不要把 Secret 内容写入日志、异常消息、资源状态、公开 API 或返回给 Console 的普通查询接口。提供查看权限的 RoleTemplate 也不应因此获得密钥读取能力。

`secret` 输入组件从 Halo 2.25.0 开始支持 `descriptionPreset`，其他参数及版本参考[表单定义](../../form-schema.md#secret)。

## 限制出站目标

第三方 API 地址固定时，应在代码中使用固定 HTTPS 地址，不提供自定义基础 URL。确实需要支持私有部署或多个服务地址时，至少执行以下检查：

1. 使用 URI 解析器处理地址，只允许业务需要的协议、主机和端口，禁止用户名、密码和不受支持的 URI 结构。
2. 优先使用明确的域名允许列表。仅依赖字符串前缀、正则表达式或 URL 后缀判断不足以防止绕过。
3. 解析目标的全部 IPv4 和 IPv6 地址，拒绝环回、私网、链路本地、组播、未指定地址和云平台元数据地址。
4. 禁止自动跟随重定向，或对每一次重定向重新执行同样的目标检查。
5. 目标确认安全之后再添加 Authorization、Cookie 或其他凭据；不要在可能跳转到其他主机的客户端上配置全局认证头。
6. 为连接、响应和整体请求设置超时，并限制响应体大小，避免出站请求长期占用事件循环、连接或内存。

DNS 结果可能变化，允许用户输入任意域名时还需要考虑 DNS rebinding。能使用固定地址或受控允许列表时，不要实现一个通用代理。

Halo 服务端基于 Spring WebFlux。出站 HTTP 请求应使用响应式 `WebClient`，不要在请求、过滤器、端点或 Reconciler 的响应式链路中调用阻塞客户端。

更多通用防护原则参考 [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)。

## 对安全开关采用 fail closed

公开 API、匿名访问、远程同步等安全相关能力在配置缺失或读取失败时应保持关闭。不要通过 `defaultIfEmpty(true)` 或 `onErrorReturn(true)` 把异常变成开放状态。

读取错误应记录不包含敏感值的诊断信息，并返回关闭状态或明确失败；只有配置被成功读取且显式启用时，才开放相应能力。

## 发布前检查

- 资源和 ConfigMap 中没有密码、Token、API Key 或私钥明文。
- 读取普通业务资源的用户无法获得 Secret 内容。
- 所有用户可配置的出站地址都经过协议、主机、DNS 地址和重定向检查。
- 凭据只发送给完成校验的目标。
- WebClient 配置了超时和响应大小边界。
- 配置缺失、读取失败和远程服务异常不会意外开放 API 或权限。
- 日志、Toast 和 API 错误响应不包含凭据或完整敏感请求内容。
