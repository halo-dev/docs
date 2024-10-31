---
title: 自定义模型
description: 了解什么是自定义模型及如何创建
---

## 概述

Halo 自定义模型是参考自 [Kubernetes CRD](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) 的一种灵活可扩展的数据存储和使用方式，旨在为插件开发者提供自定义数据支持。
自定义模型遵循 [OpenAPI v3](https://spec.openapis.org/oas/v3.1.0)，便于开发者在插件中存储、读取和操作自定义数据。
详情请参考 [自定义模型设计](https://github.com/halo-dev/rfcs/tree/main/extension)。

### 示例 {#person-extension-example}

以下是一个典型的自定义模型代码示例：

```java
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;
import run.halo.app.extension.GroupKind;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@GVK(group = "my-plugin.halo.run",
        version = "v1alpha1",
        kind = "Person",
        plural = "persons",
        singular = "person")
public class Person extends AbstractExtension {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private Spec spec;

    @Data
    @Schema(name = "PersonSpec")
    public static class Spec {
      @Schema(description = "The description on name field", maxLength = 100)
      private String name;

      @Schema(description = "The description on age field", maximum = "150", minimum = "0")
      private Integer age;

      @Schema(description = "The description on gender field")
      private Gender gender;

      private Person otherPerson;
    }

    public enum Gender {
        MALE, FEMALE,
    }
}
```

## 创建自定义模型步骤 {#create-extension}

创建一个自定义模型需要以下三个步骤：

1. **继承 `AbstractExtension` 类**：创建一个类继承 `run.halo.app.extension.AbstractExtension`。
2. **使用 `GVK` 注解**：通过 `GVK` 注解定义自定义模型的基本信息，包括 group、version、kind 等。
3. **注册自定义模型**：在插件的 `start()` 生命周期方法中注册自定义模型。

```java
@Autowired
private SchemeManager schemeManager;

@Override
public void start() {
  schemeManager.register(Person.class);
}
```

### `GVK` 注解详解

- **group**：表示自定义模型所属的组，通常采用域名形式，建议使用你的组织或公司拥有的子域名。例如 `widget.mycompany.com`。
- **version**：API 的版本，通常用于与 group 组合形成 `apiVersion`，例如`api.halo.run/v1alpha1`。
- **kind**：标识自定义模型的类型，即资源的 REST 表示形式。
- **plural**/**singular**：自定义资源的复数和单数名称，用于在 API 路径中标识资源类型。
  - singular: 必须全部小写，通常是将 `kind` 的值转换为小写作为 `singular` 的值。
  - plural：自定义资源在 `/apis/<group>/<version>/.../<plural>` 下提供，必须为全部小写，通常是将 `kind` 的值转换为小写并转为复数形式作为 `plural` 的值。

### 自定义模型定义结构

一个自定义模型通常包含以下几部分：

- `apiVersion`：标识 API 版本，由 `GVK` 注解的 `group` 和 `version` 组合而成。
- `kind`：标识自定义模型类型。
- `metadata`：[Metadata](#metadata) 类型，用于存储模型的元数据，如名称、创建时间。
- `spec`：声明自定义模型对象的期望状态。它是声明式的，用户只需要声明期望状态，实际状态由具体的控制器来维护，最终达到用户期望的状态。
- `status`：描述自定义模型对象资源的实际状态。

`apiVersion`、`kind` 和 `metadata` 已包含在 `AbstractExtension` 类中，开发者只需关注 `spec` 和 `status` 即可。

#### Metadata

自定义模型的 Metadata 包含以下属性：

- `name`: 用于标识自定义模型的名称。
- `creationTimestamp`: 用于标识自定义模型的创建时间，无法修改，只在创建时自动生成。
- `version`: 用于标识自定义模型的数据乐观锁版本，无法修改，由更新时自动填充，如果更新时指定了 `version` 且与当前 `version` 不一致则会更新失败。
- `deletionTimestamp`: 用于标识自定义模型的删除时间，表示此自定义模型对象被声明为删除，此时仍然可以通过 API 访问到此对象，参考 [自定义模型对象生命周期](../../../core/framework.md#extension-lifecycle)
- `finalizers`: 用于标识终结器，它是一个字符串集合，用于标识自定义模型对象是否可回收，参考 [自定义模型对象生命周期](../../../core/framework.md#extension-lifecycle)
- `labels`: 用于标识自定义模型的标签，它是一个字符串键值对集合，用于标识自定义模型对象的标签，可以通过标签来查询自定义模型对象。
- `annotations`: 用于存放扩展信息，它是一个字符串键值对集合，用于存放自定义模型对象的扩展信息。

## 声明自定义模型对象 {#declare-extension-object}

在创建了自定义模型之后，可以通过在插件项目的 `src/main/resources/extensions` 目录下编写 `yaml` 文件来声明自定义模型对象。示例如下：

```yaml
apiVersion: my-plugin.halo.run/v1alpha1
kind: Person
metadata:
  name: fake-person
spec:
  name: halo
  age: 18
  gender: male
```

该目录下所有的 `yaml` 文件中声明的自定义模型对象都会**在插件启动后被创建/更新**，文件名是任意的，只需根据 `kind` 和 `apiVersion` 确定类型。
基于这个特性，开发者可以将一些**初始化资源**的声明放在这个目录下，以便在插件启动时自动创建。但需要注意的是，如果资源如配置等能被用户修改，则不应该放在这个目录下，因为这些资源会在插件启动时被强制覆盖。

## 校验自定义模型对象 {#validate-extension-object}

Halo 使用 [OpenAPI v3](https://spec.openapis.org/oas/v3.1.0) 标准来定义自定义模型。
OpenAPI 规范定义了自定义模型的数据结构、字段属性及其校验规则，然后将其转换为 JSON Schema，注册到 Halo 的 SchemeManager 中。

使用 `@Schema` 注解可以为自定义模型的字段添加校验规则，`@Schema` 是 OpenAPI 提供的一个注解，通过这个注解，我们可以在生成的 OpenAPI 文档中展示字段的详细信息（如名称、描述、类型、是否必填等），同时也可以对字段进行一定的校验，比如限制字段的最大长度、最小值、格式等。

### 基本用法

`@Schema` 注解中有许多可用的属性，用来对字段进行更加细致的校验和文档说明。下面是一些常用的属性：

- description：字段的描述信息，用于在文档中展示。
- example：字段的示例值。
- requiredMode：是否必填字段。
- minLength：字符串字段的最小长度。
- maxLength：字符串字段的最大长度。
- minimum：数值字段的最小值。
- maximum：数值字段的最大值。
- format：字段的格式，常用于指定日期、时间、邮箱等特殊格式。

例如，如果我们有一个电子邮件字段，并且想要校验它的格式，可以这样定义：

```java
@Schema(description = "用户电子邮箱", example = "user@example.com", format = "email")
private String email;
```

当用户向 API 提交一个自定义模型对象时，Halo 会根据自定义模型中定义的 OpenAPI `@Schema` 注解对对象进行以下几个步骤的校验：

1. **基本结构校验**：验证对象的字段结构是否符合定义的 OpenAPI 模式，例如字段类型是否正确、是否存在必填字段等。
2. **字段约束校验**：针对特定字段的约束条件（如最小值、最大长度、正则表达式等）进行校验，确保字段值符合条件。
3. **成功或失败**：如果校验通过，Halo 接受并存储该对象；如果校验失败，会返回详细的错误信息，说明哪些字段不符合要求

参考示例 [Person](#person-extension-example)。

## 使用索引 {#using-indexes}

为了让插件可以方便的定义自定义模型定义，而不需要考虑操作数据库表的细节且可以切换存储介质如可以使用 `MySQL`，`PostgreSQL`，`H2` 等数据库来来作为存储介质，数据存储使用 `byte[]` 的形式，这使得无法利用数据库的原生索引来提高查询效率。

Halo 提供了一套索引机制，开发者可以通过注册自定义模型时声明索引来提高查询效率。

示例：

```java
import static run.halo.app.extension.index.IndexAttributeFactory.multiValueAttribute;
import static run.halo.app.extension.index.IndexAttributeFactory.simpleAttribute;

@Override
public void start() {
  schemeManager.register(Moment.class, indexSpecs -> {
    indexSpecs.add(new IndexSpec()
      .setName("spec.tags")
      // multiValueAttribute 用于得到一个返回多个值的索引函数
      .setIndexFunc(multiValueAttribute(Moment.class, moment -> {
          var tags = moment.getSpec().getTags();
          return tags == null ? Set.of() : tags;
      }))
      // simpleAttribute 用于得到一个返回单个值的索引函数，可以返回 null
      indexSpecs.add(new IndexSpec()
        .setName("spec.owner")
        .setIndexFunc(
          simpleAttribute(Moment.class, moment -> moment.getSpec().getOwner())));
  );
}
```

`IndexSpec` 用于声明索引项，它包含以下属性：

- name：索引名称，在同一个自定义模型的索引中必须唯一，一般建议使用字段路径作为索引名称，例如 `spec.slug`。
- order：对索引值的排序方式，支持 `ASC` 和 `DESC`，默认为 `ASC`。
- unique：是否唯一索引，如果为 `true` 则索引值必须唯一，如果创建自定义模型对象时检测到此索引字段有重复值则会创建失败。
- indexFunc：索引函数，用于获取索引值，接收当前自定义模型对象，返回一个索引值，索引值必须是字符串任意类型，如果不是字符串类型则需要自己转为字符串，可以使用 `IndexAttributeFactory` 提供的静态方法来创建 `indexFunc`：
  - `simpleAttribute()`：用于得到一个返回单个值的索引函数，例如 `moment -> moment.getSpec().getSlug()`。
  - `multiValueAttribute()`：用于得到一个返回多个值的索引函数，例如 `moment -> moment.getSpec().getTags()`。

当注册自定义模型时声明了索引，Halo 会在插件启动时构建索引，在构建索引期间插件处于未启动状态。

Halo 默认会为每个自定义模型建立以下几个索引，因此不需要为下列字段再次声明索引：

- `metadata.name` 创建唯一索引
- `metadata.labels`
- `metadata.creationTimestamp`
- `metadata.deletionTimestamp`

创建了索引的字段可以在查询时使用 `fieldSelector` 参数来查询，参考 [自定义模型 API](#extension-apis)。

:::tip Note

- 索引是一种存储数据结构，可提供对数据集中字段的高效查找。
- 索引将自定义模型中的字段映射到数据库行，以便在查询特定字段时不需要完整的扫描。
- 查询数据之前，必须对需要查询的字段创建索引。
- 索引可以包含一个或多个字段的值，可以包含唯一值或重复值。索引中的值按照索引中的顺序进行排序。
- 索引可以提高查询性能，但会占用额外的存储空间，因为它们需要存储索引字段的副本。索引的大小取决于字段的数据类型和索引的类型，因此，创建索引时应该考虑存储成本和性能收益。
  :::

## 命名规范

### `metadata.name` {#naming-spec-for-metadata-name}

`metadata.name` 是自定义模型对象的唯一标识名，需遵循以下规则：

- 不超过 253 个字符。
- 只能包含小写字母、数字和 `-`，且以字母或数字开头和结尾。

### `labels` {#naming-spec-for-labels}

`labels` 是一个字符串键值对集合，用于标识模型的标签，格式为 `<prefix>/<name>`。例如，`halo.run/post-slug`。遵循以下规则：

- 前缀是可选的，通常是反向的域名表示形式，用于避免键名冲突。
- 名称必须是合法的 DNS 标签，最多 63 个字符，且以字母数字字符开头和结尾。

建议保持标签的命名简洁易懂，在整个项目中保持一致性，不包含敏感信息。

**需要注意的是**，`metadata.labels` 被用于通过标签查询自定义模型对象。**它会被自动创建索引**，因此使用时需谨慎，避免索引过多导致性能问题，对于不需要索引的额外字段，可以使用 `metadata.annotations`。

#### labels 命名规范

前缀规则：

- 如果 label 用于特定于一个组织的资源，建议使用一个前缀，如 `plugin.halo.run/plugin-name`。
- 前缀必须是一个有效的 DNS 子域名（参考 metadata.name），且最多可包含 253 个字符。
- 保留了不带前缀的 label 键以及特定前缀（如 halo.run），因此插件不可使用。

名称规则：

- 名称必须是合法的 DNS 标签，最多可包含 63 个字符。
- 必须以字母数字字符开头和结尾。
- 可以包含 `-`、`.`、`_` 和`字母数字`字符。

通用规范:

- 避免使用容易引起混淆或误解的键名。
- 尽量保持简洁明了，易于理解。
- 使用易于记忆和识别的单词或缩写。

一致性和清晰性:

- 在整个项目或组织中保持一致的命名约定。
- labels 应直观地反映其代表的信息或用途。
- 不要在 labels 中包含敏感信息，例如用户凭据或个人识别信息。

### `annotations` {#naming-spec-for-annotations}

`annotations` 是一个字符串键值对集合，用于存放扩展信息，命名规则与 `labels` 相同。

可以使用 `metadata.annotations` 存放一些额外的信息，如 JSON 数据、配置信息等。

## 自定义模型 API {#extension-apis}

定义并注册自定义模型后，Halo 会根据 `GVK` 注解自动生成一组 `CRUD` APIs。

生成 APIs 的规则为：`/apis/<group>/<version>/<extension>/{extensionname}/<subextension>`

例如，`Person` 自定义模型将有以下 APIs：

- `GET /apis/my-plugin.halo.run/v1alpha1/persons`：列出所有对象。
- `GET /apis/my-plugin.halo.run/v1alpha1/persons/{name}`：根据名称查询对象。
- `POST /apis/my-plugin.halo.run/v1alpha1/persons`：创建对象。
- `PUT /apis/my-plugin.halo.run/v1alpha1/persons/{name}`：更新对象。
- `DELETE /apis/my-plugin.halo.run/v1alpha1/persons/{name}`：删除对象。

其中，**列出所有对象**的 API 支持以下参数：

- **page**：页码，从 1 开始。
- **size**：每页的数据量。
- **sort**：排序字段，格式为 `字段名,排序方式`，例如 `name,desc`，可传递多个排序字段，排序使用的字段必须是注册为索引的字段。
- **labelSelector**：标签选择器，用于筛选特定标签的对象。详见 [标签选择器参数规则](#label-selector-query-params)。
- **fieldSelector**：字段选择器，用于筛选注册为索引的字段。详见 [字段选择器参数规则](#field-selector-query-params)。

示例：

```shell
GET /apis/my-plugin.halo.run/v1alpha1/persons?page=1&size=10&sort=name,desc&labelSelector=name=halo&fieldSelector=spec.slug=halo
```

表示查询 `metadata.labels` 中 `name` 的值等于 `halo` 且 `spec.slug` 的值等于 `halo` 的自定义模型对象，并按照 `name` 字段降序排序，查询第 1 页，每页 10 条数据。

### 自定义模型 API 业务逻辑

自动生成的 `CRUD` APIs 不仅只是简单的数据操作，你可以通过定义[控制器](../../../core/framework.md#controller) 来实现对数据的业务逻辑处理。

自定义模型控制器是专门为自定义模型设计的，它允许用户通过自定义逻辑来响应自定义模型对象的变化，执行自动化操作，从而扩展这组自动生成 APIs 的功能。

自定义模型控制器通常会：

- 监控自定义模型的变化：当某个自定义模型的对象被创建、更新或删除时，控制器会被触发，读取该对象的状态信息。
- 执行特定的业务逻辑：根据自定义模型的状态和需求，控制器可以执行某些动作，如创建或删除其他资源，或调用外部系统进行处理。
- 维护资源的期望状态：控制器的目标是确保自定义模型的状态符合期望状态，维护资源的稳定性。

参考 [自定义模型控制器](../../../core/framework.md#controller) 文档。

### 选择器参数规则

#### 标签选择器 {#label-selector-query-params}

`labelSelector`：标签选择器，用于筛选特定标签的对象，支持以下操作符：

- `=` 表示等于，例如 `labelSelector=name=halo` 表示查询 `metadata.labels` 中 `name` 的值等于 `halo` 的自定义模型对象。
- `!=` 表示不等于，例如 `labelSelector=name!=halo` 表示查询 `metadata.labels` 中 `name` 的值不等于 `halo` 的自定义模型对象。
- `!` 表示不存在 key，例如 `labelSelector=!name` 表示查询 `metadata.labels` 不存在 `name` 这个 key 的自定义模型对象。
- `存在检查` 表示查询存在 key 的对象，例如 `labelSelector=name` 表示查询 `metadata.labels` 存在 `name` 这个 key 的自定义模型对象。

#### 字段选择器 {#field-selector-query-params}

`fieldSelector`：字段选择器，格式与 `labelSelector` 类似，但需要确保对应的字段是注册为索引的字段。

例如 `fieldSelector=spec.name=slug` 表示查询 `spec.slug` 的值等于 `halo` 的自定义模型对象。

支持的操作符有 `=`、`!=` 和 `in`：

- `=` 表示等于，例如 `fieldSelector=spec.slug=halo` 表示查询 `spec.slug` 的值等于 `halo` 的自定义模型对象。
- `!=` 表示不等于，例如 `fieldSelector=spec.slug!=halo` 表示查询 `spec.slug` 的值不等于 `halo` 的自定义模型对象。
- `in` 表示在集合中，例如 `fieldSelector=spec.slug=(halo,halo2)` 表示查询 `spec.slug` 的值为 `halo` 或 `halo2` 的自定义模型对象。

## 自定义 API

对于自动生成的 `CRUD` APIs 不能满足的场景，开发者可以通过定义自定义 API 来扩展功能。

推荐使用 [Spring Webflux](https://docs.spring.io/spring-framework/reference/web/webflux-functional.html) 的 `Functional Endpoints` 来编写轻量级自定义 APIs：

```java
RouterFunction<ServerResponse> route = route()
    .GET("/persons/{name}", accept(APPLICATION_JSON), this::getPerson)
    .POST("/persons", this::createPerson)
    .build();
```

- **HandlerFunction**：用于处理请求，接收 `ServerRequest` 并返回 `ServerResponse`。
- **RouterFunction**：将请求路由到相应的处理函数。

这样开发者可以灵活定义符合业务需求的 APIs，方便地扩展插件的功能。

自定义 APIs 与自动生成的 APIs 一样，都应该遵循以下规范:

`/apis/<group>/<version>/<extension>/{extensionname}/<subextension>`

路径不超过 7 段，如果超过则应当以参数的形式传递或改进路径设计，否则无法适应角色模板的规则，参考 [角色模板](../../security/role-template.md#resource-rules)。

### 自定义 API 的 Group 规则 {#custom-api-group-spec}

为了确保插件定义的自定义 APIs 不与`其他插件的 APIs / 自动生成的 APIs` 冲突，Halo 约定通过不同的 group 来区分，遵循以下规则：

- 在 Console 端使用的自定义 API 的 group 规则遵循 `console.api.<group>`。
- 在个人中心使用的自定义 API 的 group 规则遵循 `uc.api.<group>`，例如 `uc.api.my-plugin.halo.run`。
- 为主题端提供的公开的自定义 API 的 group 规则建议为 `api.<group>`，例如 `api.my-plugin.halo.run`。

其中 `<group>` 为自定义模型的 `GVK` 注解中的 `group`。

例如，`Person` 自定义模型需要提供一个在 Console 使用的自定义 API，可以定义如下：

```java
// my-plugin.halo.run 为 Person 自定义模型的 group
// console.api. 为 Console 端自定义 API 的 group 前缀
RouterFunction<ServerResponse> route = route()
    .GET("/apis/console.api.my-plugin.halo.run/v1alpha1/persons/{name}",
      accept(APPLICATION_JSON), this::getPerson)
    .build();
```

### CustomEndpoint 接口

根据 [自定义 API 的 Group 规则](#custom-api-group-spec) 约定，开发者需要在自定义 API 的路径中包含 `console.api.<group>`，这样会导致 API 路径变得冗长。

为了简化 API 路径写法，Halo 提供了 `run.halo.app.core.extension.endpoint.CustomEndpoint` 接口，开发者可以通过实现该接口来定义自定义 APIs：

```java
import static org.springframework.http.MediaType.APPLICATION_JSON;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;

@Component
public class PersonEndpoint implements CustomEndpoint {

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        return RouterFunctions.route()
            .GET("/persons/{name}",
                RequestPredicates.accept(APPLICATION_JSON), this::getPerson)
            // more routes
            .build();
    }

    private Mono<ServerResponse> getPerson(ServerRequest request) {
        return ServerResponse.ok().bodyValue("Hello, " + request.pathVariable("name"));
    }

    @Override
    public GroupVersion groupVersion() {
        return new GroupVersion("console.api.my-plugin.halo.run", "v1alpha1");
    }
}
```

CustomEndpoint 接口包含以下两个方法：

- `endpoint()`：定义自定义 API 的路由。
- `groupVersion()`：定义自定义 API 的 group 和 version。

实现了 `CustomEndpoint` 接口的类需要添加 `@Component` 注解，Halo 会自动扫描并注册这些自定义 APIs。
注册时会根据 `groupVersion()` 方法返回的 group 和 version 作为 `endpoint()` 中定义路由的前缀以简化路径写法。

本章节相关技术栈参考文档：

- [Reactor 3 Reference Guide](https://projectreactor.io/docs/core/release/reference/)
- [Webflux](https://docs.spring.io/spring-framework/reference/web/webflux.html)。

### 带注解的 MVC 控制器写法

如果开发者习惯使用 Spring MVC 的注解风格，也可以使用 `@Controller`、`@RequestMapping` 等注解来定义自定义 APIs：

唯一的区别是是需要在 MVC 控制器添加 `@ApiVersion` 注解，**没有此注解的 MVC 控制器类无法被注册路由**。

示例：

```java
@ApiVersion("my-plugin.halo.run/v1alpha1")
@RequestMapping("/persons")
@RestController
@RequiredArgsConstructor
public class PersonController {
  private final PersonService personService;

    @GetMapping("/{name}")
    public Mono<Person> getPerson(@PathVariable("name") String name) {
      return personService.getPerson(name);
    }
}
```

这个写法定义的路由与 `CustomEndpoint` 接口的写法是等价的，`@ApiVersion` 等价于 `CustomEndpoint` 接口的 `groupVersion()` 方法。

参考 [Spring Framework Web](https://docs.spring.io/spring-framework/reference/web/webflux/new-framework.html)

### 自定义 API 查询参数定义

以 Person 自定义模型为例，列表查询 API 的查询参数可能包括关键词、排序、分页等，可以通过定义一个 DTO 类来封装查询参数：

```java
@Data
public class PersonQuery {
    private String keyword;
    private Integer page;
    private Integer size;
    private String sort;
}
```

但排序、分页、标签查询和字段查询等参数通常是通用的，因此 Halo 提供了 `run.halo.app.extension.router.SortableRequest` 类来封装这些参数，开发者可以直接继承该类来定义额外查询参数：

```java
public class PersonQuery extends SortableRequest {

    public PersonQuery(ServerWebExchange exchange) {
        super(exchange);
    }

    @Override
    public ListOptions toListOptions() {
        return super.toListOptions();
    }

    @Override
    public PageRequest toPageRequest() {
        return super.toPageRequest();
    }
}
```

- toListOptions()：将查询参数转换为 `ReactiveExtensionClient` 的 list 查询所需参数。
- toPageRequest()：将查询参数转换为 `ReactiveExtensionClient` 的 list 查询所需 page 参数，此方法通常不需要覆盖。

当需要添加额外的查询参数时，只需在 `PersonQuery` 类中添加对应的字段即可。

```java
public class PersonQuery extends SortableRequest {

  public PersonQuery(ServerWebExchange exchange) {
    super(exchange);
  }

  public String getKeyword() {
    return queryParams.getFirst("keyword");
  }

  @Override
  public ListOptions toListOptions() {
    return ListOptions.builder(super.toListOptions())
      .fieldQuery(QueryFactory.or(
          QueryFactory.equal("metadata.name", getKeyword()),
          QueryFactory.contains("spec.name", getKeyword())
      ))
      .build();
  }
}
```

然后使用它：

```java
final ReactiveExtensionClient client;

public Mono<ListResult<Person>> list(ServerRequest request) {
  var query = new PersonQuery(request.exchange());
  return client.listBy(Person.class, query.toListOptions(), query.toPageRequest());
}
```

参考 [ReactiveExtensionClient](./extension-client.md#query)。

### 使用 Java Bean Validation {#using-java-bean-validation}

对于自定义 API 的请求体，开发者可以使用 [Java Bean Validation](https://beanvalidation.org/) 来校验请求体参数，可以减少手动校验的代码量。

Bean Validation 为应用程序提供了一种通过约束声明和元数据的通用验证方式。
要使用它，你可以在域模型属性上使用声明性验证约束进行注解，然后在运行时强制执行这些约束。它包含内置的约束，你还可以定义自己的自定义约束。

以下示例，展示了一个包含两个属性的简单 PersonParam 模型：

```java
public class PersonParam {
  private String name;
  private int age;
}
```

Bean Validation 允许您像以下示例所示那样声明约束：

```java
public class PersonParam {

  @NotNull
  @Size(max=64)
  private String name;

  @Min(0)
  private int age;
}
```

要启用 Bean Validation，需要在插件项目中添加一个配置类，如下所示：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

@Configuration
public class PluginConfig {

  @Bean
  public LocalValidatorFactoryBean validator() {
      return new LocalValidatorFactoryBean();
  }
}
```

然后注入 `Validator` 实例：

```java
@Component
@RequiredArgsConstructor
public class PersonEndpoint implements CustomEndpoint {
    // step 1: 注入 Validator 实例
    private final Validator validator;

    // 省略其他代码

    private Mono<ServerResponse> updatePerson(ServerRequest request) {
      return request.bodyToMono(PersonParam.class)
        // step 3: 调用 validate 方法
        .doOnNext(person -> validate(person, request.exchange()))
        .flatMap(person -> ServerResponse.ok().bodyValue(person));
    }

    // step 2: 校验请求体参数
    private void validate(PersonParam person, ServerWebExchange exchange) {
      var bindResult = validate(person, "person", validator, exchange);
      if (bindResult.hasErrors()) {
          throw new RequestBodyValidationException(bindResult);
      }
    }
}

// 将此工具方法添加到你的插件中
public static BindingResult validate(Object target, String objectName,
  Validator validator, ServerWebExchange exchange) {
  BindingResult bindingResult = new BeanPropertyBindingResult(target, objectName);
  try {
      // 由于 Halo 可以在登录时设置用户语言环境
      // 设置当前请求的 Locale 使得校验错误信息的语言可以根据请求的 Locale 返回
      LocaleContextHolder.setLocaleContext(exchange.getLocaleContext());
      validator.validate(target, bindingResult);
      return bindingResult;
  } finally {
      LocaleContextHolder.resetLocaleContext();
  }
}
```

参考文档:

- [RequestBodyValidationException](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/application/src/main/java/run/halo/app/infra/exception/RequestBodyValidationException.java)
- [Bean Validation](https://beanvalidation.org/)
- [Spring Validation](https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html)

## API 文档

Halo 会自动生成 OpenAPI 文档，包括自动生成的 `CRUD` APIs 和自定义 APIs。

API 文档可以通过访问 `/swagger-ui.html` 查看，例如：`http://localhost:8090/swagger-ui.html`。

API 文档会根据 [自定义 API 的 Group 规则](#custom-api-group-spec)被划分到不同的分组，方便开发者和生成 API Client：

- `Aggregated API V1alpha1`：所有 APIs 都会被聚合到这个分组中。
- `Extension API V1alpha1`：自动生成的所有 `CRUD` API。
- `Console API V1alpha1`：Console 端使用的自定义 API。
- `User-center API V1alpha1`：个人中心使用的自定义 API。
- `Public API V1alpha1`：提供给主题端使用的自定义 API。

参考 [Swagger Config](http://localhost:8090/v3/api-docs/swagger-config)

为了能让自定义 API 能够被 Swagger 文档展示，开发者定义 Functional Endpoints 时需要 SpringDoc 包装过的 `SpringdocRouteBuilder` 来代替 `RouterFunctions`。

```java
public class PersonEndpoint implements CustomEndpoint {

  @Override
  public RouterFunction<ServerResponse> endpoint() {
      final var tag = "PersonV1alpha1Console";
      return SpringdocRouteBuilder.route()
          .GET("/persons", this::getPersons,
              builder -> builder.operationId("ListPersons")
                  .description("List all persons")
                  .tag(tag)
                  .response(responseBuilder()
                      .implementation(ListResult.generateGenericClass(Person.class))
                  )
          )
          .build();
  }
}
```

其中 builder 用于设置 API 文档的元数据：

- operationId：操作 ID，建议首字母大写，驼峰命名，生成 API Client 时将以此为方法名的一部分。
- tag：标签，用于分组 API，建议使用 `{自定义模型Kind}{自定义模型Version}{作用域}` 的格式，例如 `PersonV1alpha1Console`，Console 表示其在 Console 端使用。

关于生成 API Client 文档参考 [Devtools 生成 API Client](../../basics/devtools.md#how-to-generate-api-client)

由于 SpringDoc 缺少对 `SpringdocRouteBuilder` 的文档介绍，开发者可参考示例来使用。

- [PostEndpoint](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/application/src/main/java/run/halo/app/core/endpoint/console/PostEndpoint.java)
- [AttachmentEndpoint](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/application/src/main/java/run/halo/app/core/attachment/endpoint/AttachmentEndpoint.java#L48)
- [UserConnectionEndpoint](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/application/src/main/java/run/halo/app/core/endpoint/uc/UserConnectionEndpoint.java#L55)
- [构建查询参数](https://github.com/halo-dev/halo/blob/25086ee3e63f0c8b6ed380140a068c44404ef2b2/application/src/main/java/run/halo/app/content/PostQuery.java#L97)
