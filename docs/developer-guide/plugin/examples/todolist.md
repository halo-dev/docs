---
title: Todo List
description: 从自定义模型、自动生成的 API Client 到 Console 页面，开发一个可持久化的 Halo Todo List 插件
---

本案例从一个带 UI 的插件模板开始，最终实现一个可持久化的 Todo List。你将完成以下功能：

- 创建、完成和删除 Todo。
- 按全部、未完成和已完成筛选 Todo。
- 将数据保存为 Halo 自定义模型，重启后不会丢失。
- 在 Console 中通过自动生成的 API Client 访问数据。

案例基于 Halo 2.26 和当前 `create-halo-plugin` 模板编写。自定义模型和 CRUD API 从 Halo 2.0 起可用；本案例使用的脚手架、Java 21 和 ESM UI 构建要求以 Halo 2.26 为准。

## 准备项目

先按照[创建插件项目](../hello-world.md#创建插件项目)生成一个包含 UI 的插件。本文使用以下名称：

| 项目 | 值 |
| --- | --- |
| 项目名 | `plugin-todolist` |
| Java 包名 | `com.example.tutorial` |
| 插件主类 | `TodoListPlugin` |
| API group | `todo.plugin.halo.run` |

如果你的项目使用了其他名称，请同步替换后续示例中的包名和主类名。

本案例只修改以下源码和配置：

```tree
plugin-todolist/
├── build.gradle
├── src/main/java/com/example/tutorial/
│   ├── Todo.java
│   └── TodoListPlugin.java
├── src/test/java/com/example/tutorial/TodoListPluginTest.java
└── ui/src/
    ├── api/index.ts
    ├── index.ts
    └── views/HomeView.vue
```

`ui/src/api/generated/` 由 Gradle 任务维护，不要手动创建或修改其中的文件。

## 定义 Todo 模型

创建 `src/main/java/com/example/tutorial/Todo.java`：

```java title="src/main/java/com/example/tutorial/Todo.java"
package com.example.tutorial;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;

@Data
@EqualsAndHashCode(callSuper = true)
@GVK(
    group = "todo.plugin.halo.run",
    version = "v1alpha1",
    kind = "Todo",
    plural = "todos",
    singular = "todo"
)
public class Todo extends AbstractExtension {

    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    private TodoSpec spec;

    @Data
    @Schema(name = "TodoSpec")
    public static class TodoSpec {

        @Schema(requiredMode = Schema.RequiredMode.REQUIRED, minLength = 1)
        private String title;

        @Schema(defaultValue = "false")
        private Boolean done;
    }
}
```

`@GVK` 决定资源类型和 API 路径。注册后，Todo 的接口前缀为：

```text
/apis/todo.plugin.halo.run/v1alpha1/todos
```

`@Schema` 同时用于生成 OpenAPI Schema 和校验写入的数据。本例要求 `spec` 和 `title` 存在，并且标题不能为空字符串。

## 注册模型

用以下内容替换插件主类：

```java title="src/main/java/com/example/tutorial/TodoListPlugin.java"
package com.example.tutorial;

import org.springframework.stereotype.Component;
import run.halo.app.extension.Scheme;
import run.halo.app.extension.SchemeManager;
import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

@Component
public class TodoListPlugin extends BasePlugin {

    private final SchemeManager schemeManager;

    public TodoListPlugin(PluginContext pluginContext, SchemeManager schemeManager) {
        super(pluginContext);
        this.schemeManager = schemeManager;
    }

    @Override
    public void start() {
        schemeManager.register(Todo.class);
    }

    @Override
    public void stop() {
        schemeManager.unregister(Scheme.buildFromType(Todo.class));
    }
}
```

插件启动时注册模型，停止时注销对应的 Scheme。注销 Scheme 不会删除已经保存的 Todo；再次启用插件并注册模型后仍可读取这些数据。

脚手架自带的测试只适用于没有额外依赖的主类。加入 `SchemeManager` 后，将测试更新为：

```java title="src/test/java/com/example/tutorial/TodoListPluginTest.java"
package com.example.tutorial;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import run.halo.app.extension.Scheme;
import run.halo.app.extension.SchemeManager;
import run.halo.app.plugin.PluginContext;

@ExtendWith(MockitoExtension.class)
class TodoListPluginTest {

    @Mock
    PluginContext context;

    @Mock
    SchemeManager schemeManager;

    @InjectMocks
    TodoListPlugin plugin;

    @Test
    void registersAndUnregistersTodoScheme() {
        plugin.start();
        plugin.stop();

        verify(schemeManager).register(Todo.class);
        verify(schemeManager).unregister(any(Scheme.class));
    }
}
```

先确认服务端代码可以编译并通过测试：

```shell
./gradlew test
```

## 生成 API Client

Halo 会为已注册的自定义模型提供 CRUD API。UI 不需要手写请求路径和资源类型，而是从 OpenAPI 文档生成 TypeScript Client。

在根项目 `build.gradle` 末尾添加：

```groovy title="build.gradle"
haloPlugin {
    openApi {
        groupingRules {
            todoApi {
                displayName = 'Extension API for Todo List'
                pathsToMatch = ['/apis/todo.plugin.halo.run/v1alpha1/**']
            }
        }
        groupedApiMappings = [
            '/v3/api-docs/todoApi': 'todoApi.json'
        ]
        generator {
            outputDir = file("${projectDir}/ui/src/api/generated")
        }
    }
}
```

保持 UI 仍为脚手架初始代码，然后执行：

```shell
./gradlew generateApiClient
```

该任务会启动开发用 Halo、加载插件、读取 OpenAPI 文档，再生成 `Todo`、`TodoList` 和 `TodoV1alpha1Api` 等 TypeScript 代码。首次生成应在 UI 引用这些文件之前完成，否则 UI 构建会因为生成目录尚不存在而失败。

:::tip 使用已有的 Halo 服务
如果不希望任务启动临时容器，可以按照 [DevTools 文档](../basics/devtools.md#how-to-generate-api-client)配置 `openApi.useExistingServer`。无论使用哪种方式，生成目录都必须是专用目录。
:::

创建 `ui/src/api/index.ts`，让生成的 Client 复用 Halo Console 已配置认证和错误处理的 Axios 实例：

```ts title="ui/src/api/index.ts"
import { axiosInstance } from '@halo-dev/api-client'
import { TodoV1alpha1Api } from './generated'

const todoApiClient = new TodoV1alpha1Api(undefined, '', axiosInstance)

export { todoApiClient }
```

模型发生变化时，修改 Java 源码后重新运行 `./gradlew generateApiClient`，不要直接修补生成的 TypeScript 文件。

## 添加 Console 菜单

用以下内容替换 `ui/src/index.ts`：

```ts title="ui/src/index.ts"
import { IconPlug } from '@halo-dev/components'
import { definePlugin } from '@halo-dev/ui-shared'
import { markRaw } from 'vue'

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: 'Root',
      route: {
        path: '/todos',
        name: 'TodoList',
        component: () => import('./views/HomeView.vue'),
        meta: {
          title: 'Todo List',
          searchable: true,
          menu: {
            name: 'Todo List',
            group: '工具',
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {},
})
```

这里保留了脚手架的 `Root` 父路由，只替换页面路径、名称和菜单信息。页面组件继续使用异步导入，避免增加 Console 的初始加载体积。

## 实现 Todo 页面

用以下内容替换 `ui/src/views/HomeView.vue`：

```vue title="ui/src/views/HomeView.vue"
<script setup lang="ts">
import type { Todo } from '@/api/generated'
import { todoApiClient } from '@/api'
import { computed, onMounted, ref } from 'vue'

type Filter = 'all' | 'active' | 'completed'

const filters: Array<{ label: string; value: Filter }> = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' },
]

const todos = ref<Todo[]>([])
const title = ref('')
const filter = ref<Filter>('all')
const loading = ref(false)
const saving = ref(false)

const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter((todo) => !todo.spec.done)
  }
  if (filter.value === 'completed') {
    return todos.value.filter((todo) => todo.spec.done)
  }
  return todos.value
})

async function fetchTodos() {
  loading.value = true
  try {
    const { data } = await todoApiClient.listTodo({ page: 0, size: 0 })
    todos.value = data.items
  } finally {
    loading.value = false
  }
}

async function mutateAndReload(request: () => Promise<unknown>) {
  if (saving.value) {
    return
  }

  saving.value = true
  try {
    await request()
    await fetchTodos()
  } finally {
    saving.value = false
  }
}

async function createTodo() {
  const todoTitle = title.value.trim()
  if (!todoTitle) {
    return
  }

  await mutateAndReload(async () => {
    await todoApiClient.createTodo({
      todo: {
        apiVersion: 'todo.plugin.halo.run/v1alpha1',
        kind: 'Todo',
        metadata: {
          generateName: 'todo-',
          name: '',
        },
        spec: {
          title: todoTitle,
          done: false,
        },
      },
    })
    title.value = ''
  })
}

async function toggleTodo(todo: Todo) {
  await mutateAndReload(() =>
    todoApiClient.updateTodo({
      name: todo.metadata.name,
      todo: {
        ...todo,
        spec: {
          ...todo.spec,
          done: !todo.spec.done,
        },
      },
    }),
  )
}

async function deleteTodo(todo: Todo) {
  await mutateAndReload(() =>
    todoApiClient.deleteTodo({ name: todo.metadata.name }),
  )
}

onMounted(fetchTodos)
</script>

<template>
  <main class="todo-page">
    <header class="todo-header">
      <p class="eyebrow">Halo Plugin Example</p>
      <h1>Todo List</h1>
      <p>创建任务，并将进度保存在 Halo 中。</p>
    </header>

    <form class="todo-form" @submit.prevent="createTodo">
      <label for="todo-title">新任务</label>
      <div class="todo-form-row">
        <input
          id="todo-title"
          v-model="title"
          :disabled="saving"
          maxlength="120"
          placeholder="例如：完成第一个 Halo 插件"
          required
        />
        <button :disabled="saving || !title.trim()" type="submit">添加</button>
      </div>
    </form>

    <nav class="filters" aria-label="筛选 Todo">
      <button
        v-for="item in filters"
        :key="item.value"
        :aria-pressed="filter === item.value"
        :class="{ active: filter === item.value }"
        type="button"
        @click="filter = item.value"
      >
        {{ item.label }}
      </button>
    </nav>

    <p v-if="loading" class="state" aria-live="polite">正在加载…</p>
    <p v-else-if="filteredTodos.length === 0" class="state">
      当前筛选条件下没有 Todo。
    </p>
    <ul v-else class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.metadata.name">
        <label class="todo-item">
          <input
            :checked="Boolean(todo.spec.done)"
            :disabled="saving"
            type="checkbox"
            @change="toggleTodo(todo)"
          />
          <span :class="{ completed: todo.spec.done }">{{ todo.spec.title }}</span>
        </label>
        <button
          class="delete-button"
          :aria-label="`删除 ${todo.spec.title}`"
          :disabled="saving"
          type="button"
          @click="deleteTodo(todo)"
        >
          删除
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.todo-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  color: #172033;
}

.todo-header {
  margin-bottom: 2rem;
}

.todo-header h1 {
  margin: 0.25rem 0 0.5rem;
  font-size: 2rem;
}

.todo-header p {
  margin: 0;
  color: #667085;
}

.eyebrow {
  color: #4f46e5 !important;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.todo-form {
  display: grid;
  gap: 0.5rem;
}

.todo-form > label {
  font-weight: 600;
}

.todo-form-row {
  display: flex;
  gap: 0.75rem;
}

.todo-form-row input {
  min-width: 0;
  flex: 1;
  padding: 0.75rem 0.875rem;
  border: 1px solid #d0d5dd;
  border-radius: 0.5rem;
}

button {
  padding: 0.65rem 0.9rem;
  border: 0;
  border-radius: 0.5rem;
  background: #4f46e5;
  color: white;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

button:focus-visible,
input:focus-visible {
  outline: 3px solid rgb(79 70 229 / 25%);
  outline-offset: 2px;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0 1rem;
}

.filters button {
  background: #eef2ff;
  color: #3730a3;
}

.filters button.active {
  background: #4f46e5;
  color: white;
}

.state {
  padding: 2rem;
  border: 1px dashed #d0d5dd;
  border-radius: 0.75rem;
  color: #667085;
  text-align: center;
}

.todo-list {
  margin: 0;
  padding: 0;
  border: 1px solid #e4e7ec;
  border-radius: 0.75rem;
  background: white;
  list-style: none;
  overflow: hidden;
}

.todo-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
}

.todo-list li + li {
  border-top: 1px solid #e4e7ec;
}

.todo-item {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.75rem;
}

.todo-item span {
  overflow-wrap: anywhere;
}

.todo-item .completed {
  color: #98a2b3;
  text-decoration: line-through;
}

.delete-button {
  flex: none;
  background: transparent;
  color: #b42318;
}

@media (max-width: 36rem) {
  .todo-form-row {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
```

页面只使用 Vue 的 `ref`、`computed` 和原生表单控件，不需要安装 TodoMVC 或额外样式依赖。筛选在已加载的数据上计算；创建、更新和删除成功后统一重新获取列表，确保页面与服务端状态一致。

本案例用 `page: 0, size: 0` 读取全部 Todo，适合少量示例数据。真实插件的数据量可能持续增长时，应改为分页列表。

## 运行并验证

启动开发环境：

```shell
./gradlew haloServer
```

使用任务输出的管理员账号登录 Console，然后按顺序验证：

1. 左侧“工具”分组中出现“Todo List”。
2. 创建一个 Todo 后，刷新页面仍能看到它。
3. 勾选 Todo 后，可在“已完成”和“未完成”之间正确筛选。
4. 删除 Todo 后，刷新页面不会再次出现。
5. 停止并重新执行 `haloServer`，已有 Todo 仍然存在。

开发过程中修改服务端代码后，可以运行 `./gradlew reloadPlugin` 重新加载插件。修改 UI 后按照脚手架提供的 UI 开发任务重新构建；提交前至少执行：

```shell
./gradlew test
./gradlew build
```

至此，数据流只有一条：`HomeView.vue` 调用生成的 `TodoV1alpha1Api`，Halo 的自定义模型 API 负责校验和持久化 `Todo`。后续如果要增加截止时间、优先级或分页，应先修改 `TodoSpec`，重新生成 API Client，再调整页面。
