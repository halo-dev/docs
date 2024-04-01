---
title: 与自定义模型交互
description: 了解如果通过代码的方式操作数据
---

Halo 提供了两个类用于与自定义模型对象交互 `ExtensionClient` 和 `ReactiveExtensionClient`。

它们提供了对自定义模型对象的增删改查操作，`ExtensionClient` 是阻塞式的用于后台任务如控制器中操作数据，而 `ReactiveExtensionClient` 返回值都是 Mono 或 Flux 是反应式非阻塞的，它们由 [reactor](https://projectreactor.io/) 提供。

```java
public interface ReactiveExtensionClient {

    // 已经过时，建议使用 listBy 或 listAll 代替
    <E extends Extension> Flux<E> list(Class<E> type, Predicate<E> predicate,
        Comparator<E> comparator);

    // 已经过时，建议使用 listBy 或 listAll 代替
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

### 查询

`ReactiveExtensionClient` 提供了两个方法用于查询数据，`listBy` 和 `listAll`。

`listBy` 方法用于分页查询数据，`listAll` 方法用于查询所有数据，它们都需要一个 `ListOptions` 参数，用于传递查询条件：

```java
public class ListOptions {
    private LabelSelector labelSelector;
    private FieldSelector fieldSelector;
}
```

其中 `LabelSelector` 用于传递标签查询条件，`FieldSelector` 用于传递字段查询条件。

`FieldSelector` 支持比自动生成的 APIs 中更多的查询条件，可以通过 `run.halo.app.extension.index.query.QueryFactory` 来构建。

```java
FieldSelector.of(QueryFactory.and(
    QueryFactory.equal("name", "test"),
    QueryFactory.equal("age", 18)
))
```

支持的查询条件如下：

| 方法                         | 说明             | 示例                                                                          |
| ---------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| equal                        | 等于             | equal("name", "test"), name 是字段名，test 是字段值                           |
| equalOtherField              | 等于其他字段     | equalOtherField("name", "otherName"), name 是字段名，otherName 是另一个字段名 |
| notEqual                     | 不等于           | notEqual("name", "test")                                                      |
| notEqualOtherField           | 不等于其他字段   | notEqualOtherField("name", "otherName")                                       |
| greaterThan                  | 大于             | greaterThan("age", 18)                                                        |
| greaterThanOtherField        | 大于其他字段     | greaterThanOtherField("age", "otherAge")                                      |
| greaterThanOrEqual           | 大于等于         | greaterThanOrEqual("age", 18)                                                 |
| greaterThanOrEqualOtherField | 大于等于其他字段 | greaterThanOrEqualOtherField("age", "otherAge")                               |
| lessThan                     | 小于             | lessThan("age", 18)                                                           |
| lessThanOtherField           | 小于其他字段     | lessThanOtherField("age", "otherAge")                                         |
| lessThanOrEqual              | 小于等于         | lessThanOrEqual("age", 18)                                                    |
| lessThanOrEqualOtherField    | 小于等于其他字段 | lessThanOrEqualOtherField("age", "otherAge")                                  |
| in                           | 在范围内         | in("age", 18, 19, 20)                                                         |
| and                          | 且               | and(equal("name", "test"), equal("age", 18))                                  |
| or                           | 或               | or(equal("name", "test"), equal("age", 18))                                   |
| between                      | 在范围内         | between("age", 18, 20), 包含 18 和 20                                         |
| betweenExclusive             | 在范围内         | betweenExclusive("age", 18, 20), 不包含 18 和 20                              |
| betweenLowerExclusive        | 在范围内         | betweenLowerExclusive("age", 18, 20), 不包含 18，包含 20                      |
| betweenUpperExclusive        | 在范围内         | betweenUpperExclusive("age", 18, 20), 包含 18，不包含 20                      |
| startsWith                   | 以指定字符串开头 | startsWith("name", "test")                                                    |
| endsWith                     | 以指定字符串结尾 | endsWith("name", "test")                                                      |
| contains                     | 包含指定字符串   | contains("name", "test")                                                      |
| all                          | 指定字段的所有值 | all("age")                                                                    |

在 `FieldSelector` 中使用的所有字段都必须添加为索引，否则会抛出异常表示不支持该字段。关于如何使用索引请参考 [自定义模型使用索引](./extension.md#using-indexes)。

可以通过 `and` 和 `or` 方法组合和嵌套查询条件：

```java
import static run.halo.app.extension.index.query.QueryFactory.and;
import static run.halo.app.extension.index.query.QueryFactory.equal;
import static run.halo.app.extension.index.query.QueryFactory.greaterThan;
import static run.halo.app.extension.index.query.QueryFactory.or;

Query query = and(
    or(equal("dept", "A"), equal("dept", "B")),
    or(equal("age", "19"), equal("age", "18"))
);
FieldSelector.of(query);
```

### 排序

`listBy` 和 `listAll` 方法都支持传递 `Sort` 参数，用于传递排序条件。

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
