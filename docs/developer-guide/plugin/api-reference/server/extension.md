---
title: 自定义模型
description: 定义、注册和校验 Halo 自定义模型，配置索引，并使用自动生成的 API 查询资源
---

Halo 自定义模型参考 Kubernetes 自定义资源设计，用于存储插件业务数据，并自动获得 CRUD API、权限和查询能力。本文描述模型本身；需要编写额外业务接口时参考[自定义 API](./custom-endpoints.md)。

## 定义模型 {#person-extension-example}

自定义模型继承 `AbstractExtension`，并通过 `@GVK` 声明 API group、version、kind 和资源名称：

```java
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;

@Data
@EqualsAndHashCode(callSuper = true)
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
        @Schema(maxLength = 100)
        private String name;

        @Schema(minimum = "0", maximum = "150")
        private Integer age;
    }
}
```

- `group` 应使用插件或组织控制的域名形式，避免与其他插件冲突。
- `version` 与 group 组成 `apiVersion`。
- `kind` 是资源类型名。
- `plural` 和 `singular` 必须小写，并用于 API 路径。

`apiVersion`、`kind` 和 `metadata` 已由 `AbstractExtension` 提供。插件通常定义 `spec` 表示期望状态，并在需要时定义 `status` 表示控制器维护的实际状态。

## 注册模型 {#create-extension}

在插件启动时注册 Scheme，并在停止时对称注销：

```java
@Override
public void start() {
    schemeManager.register(Person.class);
}

@Override
public void stop() {
    schemeManager.unregister(Scheme.buildFromType(Person.class));
}
```

注册 Scheme 不会自动实现业务状态维护。需要响应资源变化时，另行注册[自定义模型控制器](../../../core/framework.md#controller)。

## 声明预置对象 {#declare-extension-object}

插件可以在 `src/main/resources/extensions` 中提供 YAML 对象。插件启动后，Halo 会按 `apiVersion`、`kind` 和 `metadata.name` 创建或更新资源：

```yaml
apiVersion: my-plugin.halo.run/v1alpha1
kind: Person
metadata:
  name: halo
spec:
  name: Halo
  age: 18
```

文件名可以自定义，也可以使用 `---` 在同一文件中声明多个对象。

默认情况下，同名对象会在插件再次启动时更新。需要保留用户修改时，可以添加：

```yaml
metadata:
  labels:
    halo.run/do-not-overwrite: "true"
```

带该标签的预置资源不会被启动流程覆盖，也不会在插件停止时按普通预置资源清理。完整边界见[插件生命周期](../../basics/server/lifecycle.md#插件停止)。

## 校验对象 {#validate-extension-object}

Halo 根据模型生成 OpenAPI Schema，并在写入对象时校验结构和约束。使用 `@Schema` 声明必填、长度和数值范围等约束：

```java
@Schema(requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 100)
private String name;

@Schema(minimum = "0", maximum = "150")
private Integer age;
```

`description` 和 `example` 主要用于 API 文档；是否形成运行时约束取决于对应 OpenAPI Schema 关键字。

## 配置索引 {#using-indexes}

查询或排序的字段必须注册为索引。Halo 2.22.0 起应使用 `IndexSpecs.single()` 或 `IndexSpecs.multi()`：

```java
@Override
public void start() {
    schemeManager.register(Person.class, indexSpecs ->
        indexSpecs.add(IndexSpecs
            .<Person, String>single("spec.name", String.class)
            .indexFunc(person -> person.getSpec().getName()))
    );
}
```

- 单值索引可以返回 `null`。
- 多值索引返回 `Set<keyType>`。
- `keyType` 必须实现 `Comparable`。
- 同一模型中的索引名称必须唯一。

Halo 已为以下字段建立索引，不要重复声明：

- `metadata.name`，唯一索引
- `metadata.labels`
- `metadata.creationTimestamp`
- `metadata.deletionTimestamp`

索引会增加写入和存储成本，只为实际查询或排序的字段创建。

## 元数据命名

### metadata.name {#naming-spec-for-metadata-name}

`metadata.name` 是同一资源类型中的唯一标识：

- 不超过 253 个字符。
- 只能包含小写字母、数字和 `-`。
- 以字母或数字开头和结尾。

### labels {#naming-spec-for-labels}

labels 用于标识和查询对象，因此会自动建立索引。插件应使用自己控制的 DNS 子域名前缀，例如 `example.com/category`，不能使用 Halo 保留的 `halo.run` 等前缀。

名称部分最多 63 个字符，可包含字母、数字、`-`、`.` 和 `_`，并以字母或数字开头和结尾。不要在 labels 中存放凭据或个人敏感信息；不需要查询的数据应放在 annotations 中。

### annotations {#naming-spec-for-annotations}

annotations 与 labels 使用相同的 `<prefix>/<name>` 键格式，但不会自动建立索引。它适合保存不参与查询的附加信息；仍然不能用于存放凭据或个人敏感信息。

## 使用自动生成的 API {#extension-apis}

注册模型后，Halo 自动提供以下资源 API：

```text
GET    /apis/<group>/<version>/<plural>
GET    /apis/<group>/<version>/<plural>/{name}
POST   /apis/<group>/<version>/<plural>
PUT    /apis/<group>/<version>/<plural>/{name}
DELETE /apis/<group>/<version>/<plural>/{name}
```

列表 API 支持 `page`、`size`、`sort`、`labelSelector` 和 `fieldSelector`。排序与字段选择器只能使用已建立索引的字段：

```http
GET /apis/my-plugin.halo.run/v1alpha1/persons?page=1&size=10&sort=metadata.name,desc&labelSelector=type=staff&fieldSelector=metadata.name=halo
```

该请求查询 label `type=staff` 且名称为 `halo` 的对象，并按 `metadata.name` 降序返回第一页。

### 标签选择器 {#label-selector-query-params}

- `labelSelector=type=staff`：值等于 `staff`
- `labelSelector=type!=staff`：值不等于 `staff`
- `labelSelector=!type`：不存在 `type`
- `labelSelector=type`：存在 `type`

### 字段选择器 {#field-selector-query-params}

- `fieldSelector=metadata.name=halo`：值等于 `halo`
- `fieldSelector=metadata.name!=halo`：值不等于 `halo`
- `fieldSelector=metadata.name=(halo,halo2)`：值在集合中

服务端代码中的响应式查询方式见 [ReactiveExtensionClient](./extension-client.md#query)。

## 自定义 API {#custom-api-group-spec}

自动生成的 CRUD API 不能覆盖聚合查询或业务动作时，使用[自定义 API](./custom-endpoints.md#custom-api-group-spec)。原有 `custom-api-group-spec` 锚点保留在本节，已有链接无需修改。

### 自定义 API 请求校验 {#using-java-bean-validation}

自定义 API 的 Bean Validation 内容已移至[校验请求体](./custom-endpoints.md#using-java-bean-validation)。本节保留原有锚点，已有链接无需修改。

## 源码参考

- [AbstractExtension](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/extension/AbstractExtension.java)
- [GVK](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/extension/GVK.java)
- [IndexSpecs](https://github.com/halo-dev/halo/blob/58fbb339d49511e221ec760478490e1c880f7d2a/api/src/main/java/run/halo/app/extension/index/IndexSpecs.java)
