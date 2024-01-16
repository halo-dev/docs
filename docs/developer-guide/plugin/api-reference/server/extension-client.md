---
title: 与自定义模型交互
description: 了解如果通过代码的方式操作数据
---

Halo 提供了两个类用于与自定义模型对象交互 `ExtensionClient` 和 `ReactiveExtensionClient`。

它们提供了对自定义模型对象的增删改查操作，`ExtensionClient` 是阻塞式的用于后台任务如控制器中操作数据，而 `ReactiveExtensionClient` 返回值都是 Mono 或 Flux 是反应式非阻塞的，它们由 [reactor](https://projectreactor.io/) 提供。

```java
public interface ReactiveExtensionClient {

    /**
     * Lists Extensions by Extension type, filter and sorter.
     *
     * @param type is the class type of Extension.
     * @param predicate filters the reEnqueue.
     * @param comparator sorts the reEnqueue.
     * @param <E> is Extension type.
     * @return all filtered and sorted Extensions.
     */
    <E extends Extension> Flux<E> list(Class<E> type, Predicate<E> predicate,
        Comparator<E> comparator);

    /**
     * Lists Extensions by Extension type, filter, sorter and page info.
     *
     * @param type is the class type of Extension.
     * @param predicate filters the reEnqueue.
     * @param comparator sorts the reEnqueue.
     * @param page is page number which starts from 0.
     * @param size is page size.
     * @param <E> is Extension type.
     * @return a list of Extensions.
     */
    <E extends Extension> Mono<ListResult<E>> list(Class<E> type, Predicate<E> predicate,
        Comparator<E> comparator, int page, int size);

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
}
```

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
