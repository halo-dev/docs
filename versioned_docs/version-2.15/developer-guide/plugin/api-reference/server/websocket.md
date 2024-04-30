---
title:  实现 WebSocket
description: 了解在插件中如何实现 WebSocket。
---

从 Halo 2.15.0 版本开始，核心提供了 WebSocketEndpoint 接口，其主要目的是为了方便插件实现 WebSocket 功能。

插件只需要实现这个接口，并添加 `@Component` 注解，WebSocket 实现将会在插件启动后生效，插件卸载后，该实现也会随之删除。

在插件中实现 WebSocket 的代码样例如下：

```java
@Component
public class MyWebSocketEndpoint implements WebSocketEndpoint {

  @Override
  public GroupVersion groupVersion() {
    return GroupVersion.parseApiVersion("my-plugin.halowrite.com/v1alpha1");
  }

  @Override
  public String urlPath() {
    return "/resources";
  }

  @Override
  public WebSocketHandler handler() {
    return session -> {
      var messages = session.receive()
              .map(message -> {
                var payload = message.getPayloadAsText();
                return session.textMessage(payload.toUpperCase());
              });
      return session.send(messages);
    };
  }
}
```

当插件安装成功后，可以通过路径 `/apis/my-plugin.halowrite.com/v1alpha1/resources` 访问。 示例如下：

```bash
websocat --basic-auth admin:admin ws://127.0.0.1:8090/apis/my-plugin.halowrite.com/v1alpha1/resources
```

需要注意的是， 插件中实现的 WebSocket 相关的 API 仍然受当前权限系统约束。
