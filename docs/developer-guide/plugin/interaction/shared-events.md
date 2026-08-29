---
title: 事件共享
description: 介绍 Halo 与插件以及插件与插件之间的事件共享机制。
---

在 Halo 插件开发中，事件机制是实现插件间通信和功能解耦的重要工具。
`@SharedEvent` 注解使得插件可以方便地在 Halo 主程序和其他插件间共享自定义的事件。
当插件为自定义的 Spring Event 类型标注 `@SharedEvent` 注解时，Halo 将自动将该事件共享到事件总线，其他依赖了此插件的组件即可订阅并监听该事件。
通过这一机制，插件不仅可以监听 Halo 提供的共享事件，也可以发布自己的共享事件，从而实现插件与插件之间的事件通信机制。

## 监听 Halo 提供的共享事件

Halo 提供了一些内置共享事件，插件开发者可以利用这些事件响应系统中的特定行为。以下步骤说明如何在插件中监听这些事件。

### 注册监听器

在插件中，要监听 Halo 提供的共享事件，首先需要注册事件监听器。事件监听器通常通过 `@EventListener` 注解来注册。

Halo 在检测到事件触发时会调用被标注的监听方法。

```java
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import run.halo.app.event.post.PostPublishedEvent;

@Component
public class HaloEventListener {

    @EventListener
    public void onPostPublished(PostPublishedEvent event) {
        System.out.println("Published post: " + event.getName());
    }
}
```

在上面的示例中，文章发布后，Halo 会调用 `onPostPublished` 并通过 `event.getName()` 提供文章的 `metadata.name`。

当然也可以通过实现 `org.springframework.context.ApplicationListener` 接口来监听，这与 [Spring 事件监听](https://docs.spring.io/spring-framework/reference/core/beans/context-introduction.html#context-functionality-events) 的方式一致。

### Halo 内置共享事件

#### 文章

- PostPublishedEvent：文章被发布
- PostUnpublishedEvent：文章被取消发布
- PostUpdatedEvent：文章被更新
- PostDeletedEvent：文章被删除
- PostVisibleChangedEvent：文章的可见性（spec.visible）被修改

#### 第三方登录

- UserConnectionDisconnectedEvent：用户解绑第三方登录方式时触发的事件

#### 用户

- UserLoginEvent：用户登录成功
- UserLogoutEvent：用户登出成功

#### 搜索索引

- HaloDocumentAddRequestEvent：请求向搜索索引添加或更新文档
- HaloDocumentDeleteRequestEvent：请求从搜索索引删除指定文档；未提供文档 ID（`null`）时表示删除全部文档
- HaloDocumentRebuildRequestEvent：请求重建搜索索引

## 发布自定义共享事件

除了监听已有的共享事件，插件也可以定义和发布自定义的共享事件，使得其他依赖该插件的组件能够监听和响应。

### 定义共享事件类型

要定义一个共享事件，首先需要创建一个事件类，并使用 `@SharedEvent` 注解对其进行标注。通常这个类需要继承自 Spring 的 ApplicationEvent 类或其他类似的事件基类。

示例代码：

```java
import run.halo.app.plugin.SharedEvent;
import org.springframework.context.ApplicationEvent;

@SharedEvent
public class CustomSharedEvent extends ApplicationEvent {

    private final String message;

    public CustomSharedEvent(Object source, String message) {
        super(source);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
```

在上面的例子中，CustomSharedEvent 是一个自定义的共享事件，带有 message 属性，用于传递信息。

### 发布共享事件到事件总线

要发布事件，可以通过 Spring 的 `ApplicationEventPublisher` 发布自定义事件到事件总线，从而触发其他插件的监听器。

示例代码：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class CustomEventPublisher {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public void publishCustomEvent(String message) {
        CustomSharedEvent event = new CustomSharedEvent(this, message);
        eventPublisher.publishEvent(event);
        System.out.println("Published custom shared event with message: " + message);
    }
}
```

在这里，`publishCustomEvent` 方法会创建一个 CustomSharedEvent 实例并将其发布到事件总线。任何依赖此事件提供者插件的插件监听 CustomSharedEvent 都将收到该事件并响应。

这需要以下步骤作为前提：

1. 插件 A 将包含了 `CustomSharedEvent` 这个类的依赖 `plugin-a-api` 发布到 Maven 仓库
2. 插件 B 引入 `plugin-a-api` 作为项目依赖并将其作为 `compileOnly`，必须是 `compileOnly` 依赖

   ```groovy
   dependencies {
     compileOnly "com.example.app:plugin-a-api:1.0.0"
   }
   ```

3. 配置插件 B 的 `plugin.yaml` 中的 `pluginDependencies` 依赖插件 A，参考 [插件依赖声明](dependency.md#依赖声明方式)

:::info 将依赖插件 API 声明为 compileOnly
关于为什么必须将插件 A 的 `plugin-a-api` 声明为 `compileOnly`?

插件类加载的顺序是：

先从当前插件找 -> 不存在则从 Halo 找 -> 不存在则从依赖插件找。

插件 B 要监听到插件 A 的事件，必须确保是同一个类型也就是同一个类加载器加载的类。
那么只有声明为 compileOnly，插件 B 监听事件时才能从依赖的插件 A 中查找已加载的类
:::

## 最佳实践

- 事件命名与分类：使用清晰且具有描述性的事件名称，避免让使用者产生困惑如 MomentCreatedEvent 不应该在 Moment 创建之前触发因为事件名称表示是创建后的事件。
- 避免冲突与重复订阅：确保事件逻辑集中处理，防止监听器重复触发导致性能问题。
- 性能与资源管理：避免频繁触发事件或长时间占用资源的事件处理逻辑，以确保系统稳定性。
- 异步监听：耗时且不依赖同步顺序或调用线程上下文的监听器，可以使用 `@Async` 避免阻塞事件发布者；依赖事务、顺序或 Reactor Context 时不要直接切换为异步监听

  ```java
  import org.springframework.scheduling.annotation.Async;

  @Async
  @EventListener
  public void handleCustomSharedEvent(CustomSharedEvent event) {
    // do something...
  }
  ```

- 只发布自己定义的**共享事件**：插件应该始终只去发布自己定义的共享事件避免出现循环，如插件 A 定义的 CustomSharedEvent 只应该由插件 A 去发布，插件 B 中不应该去发布 CustomSharedEvent 事件。
