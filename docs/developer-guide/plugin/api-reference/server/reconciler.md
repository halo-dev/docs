---
title: 编写控制器
description: 了解如何为自定义模型编写控制器
---

控制器是 Halo 的关键组件，它们负责对每个自定义模型对象进行操作，协调所需状态和当前状态，参考： [控制器概述](../../../core/framework.md#controller)。

控制器通常在具有一般事件序列的控制循环中运行：

1. 观察：每个控制器将被设计为观察一组自定义模型对象，例如文章的控制器会观察文章对象，插件的控制器会观察插件自定义模型对象等。
2. 比较：控制器将对象配置的期望状态与其当前状态进行比较，以确定是否需要更改，例如插件的 `spec.enabled` 为 `true`，而插件的当前状态是未启动，则插件控制器会处理启动插件的逻辑。
3. 操作：控制器将根据比较的结果执行相应的操作，以确保对象的实际状态与其期望状态一致，例如插件期望启动，插件控制器会处理启动插件的逻辑。
3. 重复：上述所有步骤都由控制器重复执行直到与期望状态一致。

这是一个描述控制器作用的例子：房间里的温度自动调节器。

当你设置了温度，告诉了温度自动调节器你的期望状态（Desired State）。
房间的实际温度是当前状态（Current State）。 通过对设备的开关控制，温度自动调节器让其当前状态接近期望状态，未到达期望状态则继续调节，直到达到期望状态。

在 Halo 中控制器的运行部分已经有一个默认实现，你只需要编写控制器的调谐的逻辑也就是 [控制器概述](../../../core/framework.md#controller) 中的所说的 Reconciler 即可。

## 编写 Reconciler

Reconciler 是控制器的核心，它是一个接口，你需要实现它的 `reconcile()` 方法，该方法接收一个 `Reconciler.Request` 对象，它包含了当前自定义模型对象的名称，你可以通过它来获取自定义模型对象的当前状态和期望状态，然后编写调谐的逻辑。

```java
@Component
public class PostReconciler implements Reconciler<Reconciler.Request> {
    @Override
    public Result reconcile(Request request) {

    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder
            .extension(new Post())
            .build();
    }
}
```

以上是一个简单的 Reconciler 实现，它实现了 `reconcile()` 方法，然后在 `setupWith()` 方法中将其通过 `ControllerBuilder` 构建为一个控制器并指定了
它要观察的自定义模型对象为`Post`，当文章自定义模型对象发生变化时，`reconcile()` 方法就会被调用，从 `Request request` 参数中你可以获得当前发生变化的文章自定义模型对象的名称，然后你就可以通过名称来查询到自定义模型对象进行调谐了。

### 构建控制器

`setupWith()` 方法用于根据当前类的 `reconcile` 方法构建控制器，你可以通过 `ControllerBuilder` 提供的方法来构建并定制控制器：

```java
public class ControllerBuilder {
    private final String name;
    private Duration minDelay;
    private Duration maxDelay;
    private final Reconciler<Reconciler.Request> reconciler;
    private Supplier<Instant> nowSupplier;
    private Extension extension;
    private ExtensionMatcher onAddMatcher;
    private ExtensionMatcher onDeleteMatcher;
    private ExtensionMatcher onUpdateMatcher;
    private ListOptions syncAllListOptions;
    private boolean syncAllOnStart = true;
    private int workerCount = 1;
}
```

- `name`：控制器的名称，用于标识控制器。
- `minDelay`：控制器的最小延迟，用于控制控制器的最小调谐间隔，默认为 5 毫秒。
- `maxDelay`：控制器的最大延迟，用于控制控制器的最大调谐间隔，默认为 1000 秒。
- `reconciler`：控制器的调谐器，用于执行调谐逻辑，你需要实现 `Reconciler` 接口。
- `nowSupplier`：用于获取当前时间的供应商，用于控制器的时间戳，默认使用 `Instant.now()` 获取当前时间。
- `extension`：控制器要观察的自定义模型对象。
- `onAddMatcher`：用于匹配添加事件的匹配器，当自定义模型对象被创建时会触发。
- `onDeleteMatcher`：用于匹配删除事件的匹配器，当自定义模型对象被删除时会触发。
- `onUpdateMatcher`：用于匹配更新事件的匹配器，当自定义模型对象被更新时会触发。
- `syncAllListOptions`：用于同步所有自定义模型对象的查询条件，仅当 `syncAllOnStart` 为 `true` 时生效。
- `syncAllOnStart`：是否在控制器启动时同步所有自定义模型对象，默认为 `true`，可以配合 `syncAllListOptions` 使用以缩小需要同步的对象范围避免不必要的同步，例如只同步某个用户创建的文章或者某个固定名称的 ConfigMap 对象。如果你的控制器不需要同步所有对象，可以将其设置为 `false`。
- `workerCount`：控制器的工作线程数，用于控制控制器的并发度，如果你的控制器需要处理大量的对象，可以将其设置为大于 1 的值，以提高控制器的处理能力，但需要注意的是并发度越高，系统的负载也会越高。这里的并发度是指控制器的并发度，但是每个控制器还是单线程执行的。

#### ExtensionMatcher

`onAddMatcher/onUpdateMatcher/onDeleteMatcher` 都是 `ExtensionMatcher` 类型，用于决定当自定义模型对象发生变化时是否触发控制器：

```java
public interface ExtensionMatcher {
    boolean match(Extension extension);
}
```

这里`match` 方法的 `Extension` 参数类型与 `ControllerBuilder` 中的 `extension` 类型始终是一致的，因此可以直接通过强制类型转换来得到需要的类型。

比如我们想要观察文章对象，但是只想观察文章对象中 `visible` 字段为 `PUBLIC` 的文章，可以这样

```java
public class PostReconciler implements Reconciler<Reconciler.Request> {
    @Override
    public Result reconcile(Request request) {
        return Result.doNotRetry();
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        // 只想观察 VisibleEnum.PUBLIC 的文章
        ExtensionMatcher extensionMatcher = extension -> {
            var post = (Post) extension;
            return VisibleEnum.PUBLIC.equals(post.getSpec().getVisible());
        };
        return builder
            .extension(new Post())
            .onAddMatcher(extensionMatcher)
            .onUpdateMatcher(extensionMatcher)
            .onDeleteMatcher(extensionMatcher)
            .build();
    }
}
```

#### 控制启动时同步的范围

如果想要在控制器启动时控制同步对象的范围，可以通过 `syncAllListOptions` 和 `syncAllOnStart` 来实现，例如只同步某个用户创建的文章：

```java
public class PostReconciler implements Reconciler<Reconciler.Request> {
    @Override
    public Result reconcile(Request request) {
        return Result.doNotRetry();
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder
            .extension(new Post())
            .syncAllListOptions(ListOptions.builder()
                .fieldQuery(QueryFactory.equal("spec.owner", "guqing"))
                .build()
            )
            .syncAllOnStart(true)
            .build();
    }
}
```

### Reconciler 的返回值

`reconcile()` 方法的返回值是一个 `Result` 对象，它包含了调谐的结果，你可以通过它来告诉控制器是否需要重试，如果需要重试则控制器会在稍后再次调用 `reconcile()` 方法，而这个过程会一直重复，直到 `reconcile()` 方法返回成功为止，这个过程被称之为调谐循环（Reconciliation Loop）。

```java
record Result(boolean reEnqueue, Duration retryAfter) {}
```

`Result` 对象包含了两个属性：reEnqueue 和 retryAfter，reEnqueue 用于标识是否需要重试，retryAfter 用于标识重试的时间间隔，如果 reEnqueue 为 true 则会在 retryAfter 指定的时间间隔后再次调用 `reconcile()` 方法，如果 reEnqueue 为 false 则不会再次调用 `reconcile()` 方法。

在没有特殊需要时，`retryAfter` 可以不指定，控制器会有一套默认的重试策略。

如果直接返回 `null` 则会被视为成功，效果等同于返回 `new Result(false, null)`。

### Reconciler 的异常处理

当 `reconcile()` 方法抛出异常时，控制器会将异常记录到日志中，然后会将 `Request request` 对象重新放入队列中，等待下次调用 `reconcile()` 方法，这个过程会一直重复，直到 `reconcile()` 成功，对于默认重试策略，每次重试间隔会越来越长，直到达到最长间隔后不再增加。

## 控制器示例

本章节将通过一个简单的示例来演示如何编写控制器。

### 场景：事件管理系统

创建一个名为 ”EventTracker“ 的自定义模型，用于管理和追踪组织内的各种事件。这些事件可以是会议、研讨会、社交聚会或任何其他类型的组织活动。
“EventTracker“ 自定义模型将提供一个框架，用于记录事件的详细信息，如时间、地点、参与者和状态。

由于这里的重点是控制器，因此我们将忽略自定义模型的详细信息，只关注控制器的实现，一个可能的 “EventTracker” 数据结构如下:

```yaml
apiVersion: tracker.halo.run/v1alpha1
kind: EventTracker
metadata:
  name: event-tracker-1
spec:
  eventName: "Halo Meetup"
  eventDate: "2024-01-20T12:00:00Z"
  location: "Chengdu"
  participants: ["@sig-doc", "@sig-console", "@sig-halo"]
  description: "Halo Meetup in Chengdu"
status:
  phase: "Planned" # Planned, Ongoing, Completed
  participants: []
  conditions:
    - type: "Invalid"
      status: "True"
      reason: "InvalidEventDate"
      message: "Event date is invalid"
```

业务逻辑处理：

1. 事件创建：

    - 当新的 EventTracker 资源被创建时，控制器需验证所有必要字段的存在和格式正确性。
    - 初始化事件状态为 Planned。

2. 事件更新：

    - 检查 eventDate、location 和 participants 字段的变更。
    - 如果接近事件日期，自动更新状态为 Ongoing。

3. 状态管理：

    - 根据当前日期和事件日期自动管理 phase 字段。
    - 当事件日期过去时，将状态更新为 Completed。
4. 数据验证和完整性：
    - 确保所有输入数据的格式正确且合理。
    - 如有不一致或缺失的重要信息，记录警告或错误。
5. 事件提醒和通知：
    - 在事件状态改变或临近事件日期时发送通知。
6. 清理和维护：
    - 对于已完成的事件，提供自动清理机制，例如在事件结束后一定时间内删除资源。

首先实现 EventTracker 控制器的协调循环主体，通过依赖注入 `ExtensionClient` 可以用于获取当前变更的对象：

```java
@Component
@RequiredArgsConstructor
public class EventTrackerReconciler implements Reconciler<Reconciler.Request> {

    private final ExtensionClient client;

    @Override
    public Result reconcile(Request request) {
      // ...
    }

    @Override
    public Controller setupWith(ControllerBuilder builder) {
        return builder
            .extension(new EventTracker())
            .build();
    }
}
```

然后在 `reconcile()` 方法中根据 `EventTracker` 对象的状态来执行响应的操作，确保执行逻辑是是幂等的，这意味着即使多次执行相同操作，结果也应该是一致的。

```java
public Result reconcile(Request request) {
    client.fetch(EventTracker.class, request.name()).ifPresent(eventTracker -> {
      // 获取到当前变更的 EventTracker 对象
      // 1. 检查必要字段的存在和格式正确性
      // 2. 初始化事件状态为 Planned
      if (eventTracker.getStatus() == null) {
        eventTracker.setStatus(new EventTracker.Status());
      }
      var status = eventTracker.getStatus();
      if (status.getPhase() == null) {
        status.setPhase(EventTracker.Phase.PLANNED);
      }

      var eventName = eventTracker.getSpec().getEventName();
      if (StringUtils.isBlank(eventName)) {
        Condition condition = Condition.builder()
                .type("Invalid")
                .reason("InvalidEventName")
                .message("Event name is invalid")
                .status(ConditionStatus.FALSE)
                .lastTransitionTime(Instant.now())
                .build();
        status.getConditions().addAndEvictFIFO(condition);
      }

      client.update(eventTracker);
    });
    return new Result(false, null);
}
```

上述，我们通过 `client.fetch()` 方法获取到了当前变更的 `EventTracker` 对象，然后根据 `EventTracker` 对象的状态来执行响应的操作，例如初始化事件状态为 Planned，检查必要字段的存在和格式正确性等，但需要注意控制器的执行是异步的，如果我们通过 `EventTracker` 的 API 来创建或更改了一个 `EventTracker` 对象，那么 API 会在控制器执行之前返回结果，这意味着在用户界面看到的结果可能不是最新的，并且可能会在稍后更新。

对于上述校验 `eventName` 的逻辑只是保证后续的执行是可靠的，如果有些字段是必须的，那么我们可以通过 `@Schema` 注解来标注，为了让控制器中校验字段失败的信息能够呈现到用户界面，我们通过向 `status.conditions` 中添加了一条 Condition 记录来用于记录这个事件，再用户界面可以展示这个 Condition 记录的信息以让用户知晓。

最后，我们通过 `client.update()` 方法来更新 `EventTracker` 对象，这个过程就是将实际状态回写到 `EventTracker` 对象并应用到数据库中，这样就完成了一次调谐。

当 `EventTracker` 对象发生变更时，控制器也会被执行，这时我们可以根据 `EventTracker` 对象的状态来执行响应的操作，例如检查和更新 `eventDate`、`location` 和 `participants` 字段的变更，如果接近事件日期，自动更新状态为 Ongoing。

```java
public Result reconcile(Request request) {
    client.fetch(EventTracker.class, request.name()).ifPresent(eventTracker -> {
      // ...此处省略之前的逻辑
      if (isApproach(eventTracker.getSpec().getEventDate())) {
        status.setPhase(EventTracker.Phase.ONGOING);
        sendNotification(eventTracker, "Event is ongoing");
      }
    });
  return new Result(false, null);
}
```

这里我们通过 `isApproach()` 方法来表示判断是否接近事件日期，如果接近则更新状态为 Ongoing，并使用 `sendNotification` 来发送发送通知。

> 为了简化示例，我们省略了 `isApproach()` 和 `sendNotification` 方法的实现。

还可以根据 `spec.participants` 字段来解析参与者信息，然后将其添加到 `status.participants` 中，这样就可以在用户界面看到参与者信息了。

```java
public Result reconcile(Request request) {
    client.fetch(EventTracker.class, request.name()).ifPresent(eventTracker -> {
      // ...此处省略之前的逻辑
      var participants = eventTracker.getSpec().getParticipants();
      resolveParticipants(participants).forEach(status::addParticipant);
    });
  return new Result(false, null);
}
```

### 使用 Finalizers

`Finalizers` 允许控制器实现异步预删除钩子。假设您为正在实现的 API 类型的每个对象创建了一个外部资源，例如存储桶，并且您希望在从 Halo 中删除相应对象
时清理外部资源，您可以使用终结器来删除外部资源资源。

比如 `EventTracker` 对象被删除时，我们需要删除 `EventTracker` 对象记录的日志，这时我们可以通过 `Finalizers` 来实现。

首先我们需要在 `reconcile()` 的开头判断 `EventTracker` 对象的 `metadata.deletionTimestamp` 是否存在，如果存在则表示 `EventTracker` 对象被删除了，
这时我们就可以执行清理操作。

```java
public Result reconcile(Request request) {
    client.fetch(EventTracker.class, request.name()).ifPresent(eventTracker -> {
      if (ExtensionOperator.isDeleted(eventTracker)) { // 1. 判断是否被删除
        // 2. 调用 removeFinalizers 方法移除终结器（稍后会说明）
        ExtensionUtil.removeFinalizers(eventTracker.getMetadata(), Set.of(FINALIZER_NAME));
        // 3. 执行清理操作
        cleanUpLogsForTracker(eventTracker);
        // 4. 更新 EventTracker 对象将变更应用到数据库中
        client.update(eventTracker);
        // 5. return 避免执行后续逻辑
        return;
      }
      // ...此处省略之前的逻辑
    });
  return new Result(false, null);
}
```

1. `ExtensionOperator.isDeleted` 方法是 Halo 提供的工具方法，用于判断对象是否被删除，它会判断 `metadata.deletionTimestamp` 是否存在，如果存在则表示对象被标记删除了。
关于自定义模型对象的删除可以参考：[自定义模型对象生命周期](../../../core/framework.md#extension-lifecycle)
2. `ExtensionUtil.removeFinalizers` 方法是 Halo 提供的工具方法，用于移除对象的终结器，它接收两个参数，第一个参数是对象的元数据，第二个参数是要移除的终结器名称集合，它来自 `run.halo.app.extension.ExtensionUtil`。
3. `cleanUpLogsForTracker` 方法是我们自己实现的，这里的示例是用于清理 `EventTracker` 对象记录的日志，你可以根据自己的业务需求来实现，如清理外部资源等。

经过上述步骤，我们只是写了移除终结器但是发现没有添加终结器的逻辑，添加终结器的逻辑需要在判断删除之后，`metadata.finalizers` 是一个字符串集合，用于标识对象是否可回收，如果 `metadata.finalizers` 不为空则表示对象不可回收，否则表示对象可回收，我们可以通过 `ExtensionUtil.addFinalizers` 方法来添加终结器。

最佳实践是，一个控制器最多添加一个终结器，名称为了防止冲突可以使用当前业务的 `group/终结器名称` 来命名，例如 `tracker.halo.run/finalizer`，例如在 Halo 中文章的控制器使用了一个终结器，但可能插件也会定义一个文章控制器来扩展文章的业务，那么根据最佳实践命名终结器可以避免冲突。

```java
private static final String FINALIZER_NAME = "tracker.halo.run/finalizer";

public Result reconcile(Request request) {
    client.fetch(EventTracker.class, request.name()).ifPresent(eventTracker -> {
      if (ExtensionOperator.isDeleted(eventTracker)) {
// ... 省略删除逻辑
      }
      // 添加终结器
      ExtensionUtil.addFinalizers(post.getMetadata(), Set.of(FINALIZER_NAME));
      // ...此处省略之前的逻辑
      // 会在更新时将终结器的变更写入到数据库中
      client.update(eventTracker);
    });
}
```
