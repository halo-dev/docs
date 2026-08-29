---
title: 与自定义模型交互
description: 使用 ExtensionClient 和 ReactiveExtensionClient 增删改查自定义模型，并通过 ListOptions、Queries、Sort 和 PageRequest 构建查询、排序与分页条件
---

Halo 提供了两个类用于与自定义模型对象交互 `ExtensionClient` 和 `ReactiveExtensionClient`。

它们提供了对自定义模型对象的增删改查操作。`ExtensionClient` 是阻塞式的，只能用于非响应式环境，例如已经切换到工作线程的后台任务；WebFlux 控制器、WebFilter 等响应式调用链应使用 `ReactiveExtensionClient`。后者返回 Reactor 提供的 `Mono` 或 `Flux`。

```java
public interface ReactiveExtensionClient {

    <E extends Extension> Flux<E> list(Class<E> type, Predicate<E> predicate,
        Comparator<E> comparator);

    // 已经过时，建议使用 listBy 或 listAll 代替
    @Deprecated
    <E extends Extension> Mono<ListResult<E>> list(Class<E> type, Predicate<E> predicate,
        Comparator<E> comparator, int page, int size);

    <E extends Extension> Flux<E> listAll(Class<E> type, ListOptions options, Sort sort);

    <E extends Extension> Mono<ListResult<E>> listBy(Class<E> type, ListOptions options,
        PageRequest pageable);

    /**
     * Fetches Extension by its type and name.
     *
     * @param type is Extension type.
     * @param name is Extension name.
     * @param <E> is Extension type.
     * @return an optional Extension.
     */
    <E extends Extension> Mono<E> fetch(Class<E> type, String name);

    Mono<Unstructured> fetch(GroupVersionKind gvk, String name);

    <E extends Extension> Mono<E> get(Class<E> type, String name);

    /**
     * Creates an Extension.
     *
     * @param extension is fresh Extension to be created. Please make sure the Extension name does
     * not exist.
     * @param <E> is Extension type.
     */
    <E extends Extension> Mono<E> create(E extension);

    /**
     * Updates an Extension.
     *
     * @param extension is an Extension to be updated. Please make sure the resource version is
     * latest.
     * @param <E> is Extension type.
     */
    <E extends Extension> Mono<E> update(E extension);

    /**
     * Deletes an Extension.
     *
     * @param extension is an Extension to be deleted. Please make sure the resource version is
     * latest.
     * @param <E> is Extension type.
     */
    <E extends Extension> Mono<E> delete(E extension);

    /**
     * Watches the changes of all extensions.
     */
    void watch(Watcher watcher);
}
```

- `fetch(GroupVersionKind, name)`：以 `Unstructured` 形式按 GVK 和名称获取自定义模型，适用于不确定具体 Java 类型的场景。
- `watch`：注册一个 `Watcher` 监听所有自定义模型的变更事件。两个 API 均自 Halo 2.4.0 起可用。

:::warning 已废弃的方法
`getJsonExtension(GroupVersionKind, name)` 自 Halo 2.23.0 起被标记为 `@Deprecated(forRemoval = true)`，请迁移到 `fetch(GroupVersionKind, name)`。
:::

### 示例

如果你想在插件中根据 name 参数查询获取到 Person 自定义模型的数据，则可以这样写：

```java
@Service
@RequiredArgsConstructor
public PersonService {
    private final ReactiveExtensionClient client;
    
    Mono<Person> getPerson(String name) {
        return client.fetch(Person.class, name);
    }
}
```

或者使用阻塞式 Client

```java
@Service
@RequiredArgsConstructor
public PersonService {
    private final ExtensionClient client;
    
    Optional<Person> getPerson(String name) {
        return client.fetch(Person.class, name);
    }
}
```

注意：非阻塞线程中不能调用阻塞式方法。

我们建议你更多的使用响应式的 `ReactiveExtensionClient` 去替代 `ExtensionClient`。

### 监听模型变更 {#watch}

如果只需要在自定义模型发生变更时执行一些逻辑（而不是持续调谐到期望状态），可以通过 `watch` 方法注册一个 `Watcher`：

```java
import jakarta.annotation.PreDestroy;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class PersonWatcher implements Watcher {

    private final AtomicBoolean disposed = new AtomicBoolean();
    private Runnable disposeHook = () -> {};

    public PersonWatcher(ReactiveExtensionClient client) {
        client.watch(this);
    }

    @Override
    public void onAdd(Extension extension) {
        if (extension instanceof Person person) {
            // do something
        }
    }

    @Override
    public void onUpdate(Extension oldExtension, Extension newExtension) {
        // do something
    }

    @Override
    public void onDelete(Extension extension) {
        // do something
    }

    @Override
    public void registerDisposeHook(Runnable dispose) {
        this.disposeHook = dispose;
    }

    @PreDestroy
    @Override
    public void dispose() {
        if (disposed.compareAndSet(false, true)) {
            disposeHook.run();
        }
    }

    @Override
    public boolean isDisposed() {
        return disposed.get();
    }
}
```

`Watcher` 的 `onAdd`、`onUpdate`、`onDelete` 分别对应模型的创建、更新和删除事件。需要注意的是 `watch` 会接收**所有**自定义模型的变更，需要在回调中自行过滤类型，并在插件上下文关闭时调用 `dispose()` 取消注册；如果需要声明式地将资源持续调谐到期望状态，应优先使用 [Reconciler](./reconciler.md)。

### 查询 {#query}

`ReactiveExtensionClient` 提供了以下方法用于查询数据：

- `listBy`：分页查询数据。
- `listNamesBy`：分页查询对象名称。
- `listAll`：查询所有数据。
- `listAllNames`：查询所有对象名称。
- `listTopNames`：查询指定数量的对象名称。
- `countBy`：统计符合条件的数据数量。

这些方法都需要一个 `ListOptions` 参数，用于传递查询条件：

```java
public class ListOptions {
    private LabelSelector labelSelector;
    private FieldSelector fieldSelector;
}
```

其中 `LabelSelector` 用于传递标签查询条件，`FieldSelector` 用于传递字段查询条件。

`FieldSelector` 支持比自动生成的 APIs 中更多的查询条件，可以通过 `run.halo.app.extension.index.query.Queries` 来构建。

```java
import static run.halo.app.extension.index.query.Queries.and;
import static run.halo.app.extension.index.query.Queries.equal;

ListOptions.builder()
    .fieldQuery(and(
        equal("name", "test"),
        equal("age", 18)
    ))
    .build();
```

支持的查询条件如下：

| 方法 | 说明 | 示例 |
| --- | --- | --- |
| `equal` | 等于 | `equal("name", "test")` |
| `notEqual` | 不等于 | `notEqual("name", "test")` |
| `greaterThan` | 大于，可通过第三个参数控制是否包含边界 | `greaterThan("age", 18)`、`greaterThan("age", 18, true)` |
| `lessThan` | 小于，可通过第三个参数控制是否包含边界 | `lessThan("age", 18)`、`lessThan("age", 18, true)` |
| `between` | 在范围内，可分别控制上下边界是否包含 | `between("age", 18, true, 20, false)` |
| `in` | 在给定值范围内 | `in("age", 18, 19, 20)` |
| `isNull` | 值为空 | `isNull("deletedAt")` |
| `all` | 指定字段的所有值 | `all("age")` |
| `startsWith` | 以指定字符串开头 | `startsWith("name", "test")` |
| `endsWith` | 以指定字符串结尾 | `endsWith("name", "test")` |
| `contains` | 包含指定字符串 | `contains("name", "test")` |
| `and` | 且 | `and(equal("name", "test"), equal("age", 18))` |
| `or` | 或 | `or(equal("name", "test"), equal("age", 18))` |
| `not` | 取反 | `not(equal("name", "test"))` |
| `labelExists` | 标签存在 | `labelExists("halo.run/hidden")` |
| `labelEqual` | 标签等于 | `labelEqual("env", "production")` |
| `labelIn` | 标签值在给定范围内 | `labelIn("env", Set.of("production", "staging"))` |

在 `FieldSelector` 中使用的所有字段都必须添加为索引，否则会抛出异常表示不支持该字段。关于如何使用索引请参考 [自定义模型使用索引](./extension.md#using-indexes)。

:::note 使用 Queries 构建查询

从 2.22.0 开始，`QueryFactory` 已过时，请使用 `Queries` 创建查询条件。取反查询可以通过 `Queries.not(condition)` 或 `condition.not()` 构建。

:::

可以通过 `and` 和 `or` 方法组合和嵌套查询条件：

```java
import run.halo.app.extension.index.query.Condition;
import static run.halo.app.extension.index.query.Queries.and;
import static run.halo.app.extension.index.query.Queries.equal;
import static run.halo.app.extension.index.query.Queries.or;

Condition query = and(
    or(equal("dept", "A"), equal("dept", "B")),
    or(equal("age", 19), equal("age", 18))
);
ListOptions.builder()
    .fieldQuery(query)
    .build();
```

### 构建 ListOptions

ListOptions 提供了 `builder` 方法用于构建查询条件，`fieldQuery` 方法用于传递字段查询条件，`labelSelector` 方法用于传递标签查询条件。

```java
import static run.halo.app.extension.index.query.Queries.equal;

ListOptions.builder()
    .labelSelector()
    .eq("key-1", "value-1")
    .end()
    .fieldQuery(equal("key-2", "value-2"))
    .build();
```

- `labelSelector` 之后使用 `end` 方法结束标签查询条件的构建。
- `andQuery` 和 `orQuery` 用于组合多个 `FieldSelector` 查询条件。

### 排序

`listBy`、`listNamesBy`、`listAll`、`listAllNames` 和 `listTopNames` 方法都支持传递 `Sort` 参数，用于传递排序条件。

```java
import org.springframework.data.domain.Sort;

Sort.by(Sort.Order.asc("metadata.name")) 
```

通过 `Sort.by` 方法可以构建排序条件，`Sort.Order` 用于指定排序字段和排序方式，`asc` 表示升序，`desc` 表示降序。

排序中使用的字段必须是添加为索引的字段，否则会抛出异常表示不支持该字段。关于如何使用索引请参考 [自定义模型使用索引](./extension.md#using-indexes)。

### 分页

`listBy` 方法支持传递 `PageRequest` 参数，用于传递分页条件。

```java
import run.halo.app.extension.PageRequestImpl;

PageRequestImpl.of(1, 10);

PageRequestImpl.of(1, 10, Sort.by(Sort.Order.asc("metadata.name"));

PageRequestImpl.ofSize(10);
```

通过 `PageRequestImpl.of` 方法可以构建分页条件，具有两个参数的方法用于指定页码和每页数量，具有三个参数的方法用于指定页码、每页数量和排序条件。

`ofSize` 方法用于指定每页数量，页码默认为 1。
