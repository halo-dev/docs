---
title: Todo List
description: 这个例子展示了如何开发 Todo List 插件
---

本示例用于展示如何从插件模板创建一个插件并写一个 Todo List：

首先参考 [入门 - 创建插件项目](../hello-world.md#创建插件项目) 文档创建一个新的插件项目并运行。

如果能在插件列表中看到插件已经被正确启用，则说明插件已经运行成功。

![plugin-todolist-in-list-view](/img/todolist-in-list.png)

## 创建一个自定义模型

我们希望 TodoList 能够被持久化以避免重启后数据丢失，因此需要创建一个自定义模型来进行数据持久化。

首先创建一个 `class` 名为 `Todo` 并写入如下内容：

```java
package run.halo.tutorial;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;

@Data
@EqualsAndHashCode(callSuper = true)
@GVK(kind = "Todo", group = "todo.plugin.halo.run",
    version = "v1alpha1", singular = "todo", plural = "todos")
public class Todo extends AbstractExtension {

    @Schema(requiredMode = REQUIRED)
    private TodoSpec spec;

    @Data
    public static class TodoSpec {

        @Schema(requiredMode = REQUIRED, minLength = 1)
        private String title;

        @Schema(defaultValue = "false")
        private Boolean done;
    }
}
```

然后在 `TodoListPlugin` 的 `start` 生命周期方法中注册此自定义模型到 Halo 中。

```diff
// ...
+ import run.halo.app.extension.SchemeManager;

@Component
public class TodoListPlugin extends BasePlugin {
+   private final SchemeManager schemeManager;

-    public TodoListPlugin(PluginContext pluginContext) {
+    public TodoListPlugin(PluginContext pluginContext, SchemeManager schemeManager) {
        super(pluginContext);
+       this.schemeManager = schemeManager;
    }

    @Override
    public void start() {
+       // 插件启动时注册自定义模型
+       schemeManager.register(Todo.class);
        System.out.println("Hello world 插件启动了!");
    }

     @Override
    public void stop() {
+      // 插件停用时取消注册自定义模型
+      Scheme todoScheme = schemeManager.get(Todo.class);
+      schemeManager.unregister(todoScheme);
      System.out.println("Hello world 被停止!");
    }
    // ....
}
```

然后 build 项目，重启 Halo，访问 `http://localhost:8090/swagger-ui.html`，
可以找到如下 Todo APIs：

![hello world plugin swagger api for toto](/img/halo-plugin-hello-world-todo-swagger-api.png)

由于所有以 `/api` 和 `/apis` 开头的 APIs 都需要认证才能访问，因此先在 Swagger UI 界面顶部点击 `Authorize` 认证，然后尝试访问
`GET /apis/todo.plugin.halo.run/v1alpha1/todos` 可以看到如下结果：

```json
{
  "page": 0,
  "size": 0,
  "total": 0,
  "items": [],
  "first": true,
  "last": true,
  "hasNext": false,
  "hasPrevious": false,
  "totalPages": 1
}
```

至此我们完成了一个自定义模型的创建和使用插件生命周期方法实现了自定义模型的注册和删除，下一步我们将编写用户界面，使用这些 APIs 完成 TodoList 功能。

## 编写用户界面

### 目标

我们希望实现如下的用户界面：

- 在左侧菜单添加一个名为 `Todo List` 的菜单项，它属于一个`工具`的组。
- 内容页为一个简单的 Todo List，它实现以下功能：
  - 添加 `Todo item`
  - 将一个 `Todo item` 标记为完成，也可以取消完成状态
  - 列表有三个 `Tab` 可供切换，用于过滤数据展示

![todo user interface](/img/todo-ui.png)

### 实现

使用模板仓库创建的项目中与 `src` 目录同级有一个 `ui` 目录，它即为用户界面的源码目录。

打开 `ui/src/index.ts` 文件，修改如下：

```diff
export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
-       path: "/example",
+       path: "/todos", // TodoList 的路由 path
-       name: "Example",
+       name: "TodoList",// 菜单标识名
        component: HomeView,
        meta: {
-         title: "示例页面",
+         title: "Todo List",//菜单页的浏览器 tab 标题
          searchable: true,
          menu: {
-           name: "示例页面",
+           name: "Todo List",// TODO 菜单显示名称
-           group: "示例分组",
=           group: "工具",// 所在组名
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {},
});
```

完成此步骤后 Console 左侧菜单多了一个名 `工具` 的组，其下有 `Todo List`，浏览器标签页名称也是 `Todo List`。

接来下我们需要在右侧内容区域实现 [目标](#目标) 中图示的 Todo 样式，为了快速上手，我们使用 [todomvc](https://todomvc.com/examples/vue/) 提供的 Vue 标准实现。
编辑 `ui/src/views/HomeView.vue` 文件，清空它的内容，并拷贝 [examples/#todomvc](https://vuejs.org/examples/#todomvc) 的所有代码粘贴到此文件中，并执行以下步骤：

1. `cd ui` 切换到 `ui` 目录。
2. ` pnpm install todomvc-app-css `。
3. 修改 `ui/src/views/HomeView.vue` 最底部的 `style` 标签。

   ```diff
   - <style>
   + <style scoped>
   -  @import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
   +  @import "todomvc-app-css/index.css";
     </style>
   ```

4. 重新 Build 后刷新页面，便能看到目标图所示效果。

通过以上步骤就实现了一个 Todo List 的用户界面功能，但 `Todo` 数据只是被临时存放到了 `LocalStorage` 中，下一步我们将通过自定义模型生成的 APIs 来让用户界面与服务端交互。

### 与服务端数据交互

本章节我们将通过使用 `Axios` 来完成与插件后端 APIs 进行数据交互，文档参考 [axios-http](https://axios-http.com/docs)。

首先需要安装 `Axios`，在 ui 目录下执行命令：

```shell
pnpm install axios
```

为了符合最佳实践，将用 TypeScript 改造之前的 todomvc 示例：

创建 types 文件 `ui/src/types/index.ts`

```typescript
export interface Metadata {
  name: string;
  labels?: {
    [key: string]: string;
  } | null;
  annotations?: {
    [key: string]: string;
  } | null;
  version?: number | null;
  creationTimestamp?: string | null;
  deletionTimestamp?: string | null;
}

export interface TodoSpec {
  title: string;
  done?: boolean;
}

/**
 * 与自定义模型 Todo 对应
 */
export interface Todo {
  spec: TodoSpec;
  apiVersion: "todo.plugin.halo.run/v1alpha1"; // apiVersion=自定义模型的 group/version
  kind: "Todo"; // Todo 自定义模型中 @GVK 注解中的 kind
  metadata: Metadata;
}

/**
 * Todo 自定义模型生成 list API 所对应的类型
 */
export interface TodoList {
  page: number;
  size: number;
  total: number;
  items: Array<Todo>;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
}
```

编辑 `ui/src/views/HomeView.vue` 文件，将所有内容替换为如下写法：

```typescript
<script setup lang="ts">
import axios from "axios";
import type { Todo, TodoList } from "../types";
import { computed, onMounted, ref } from "vue";

const http = axios.create({
  baseURL: "/",
  timeout: 1000,
});

interface Tab {
  label: string;
}

const todos = ref<TodoList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
  totalPages: 0,
});

const tabs = [
  {
    label: "All",
  },
  {
    label: "Active",
  },
  {
    label: "Completed",
  },
];

const activeTab = ref("All");

/**
 * 列表展示的数据
 */
const todoList = computed(() => {
  if (activeTab.value === "All") {
    return todos.value.items;
  }
  if (activeTab.value === "Active") {
    return filterByDone(false);
  }
  if (activeTab.value === "Completed") {
    return filterByDone(true);
  }
  return [];
});

const filterByDone = (done: boolean) => {
  return todos.value.items.filter((todo) => todo.spec.done === done);
};

// 查看 http://localhost:8090/swagger-ui.html
function handleFetchTodos() {
  http
    .get<TodoList>("/apis/todo.plugin.halo.run/v1alpha1/todos")
    .then((response) => {
      todos.value = response.data;
    });
}

onMounted(handleFetchTodos);

// 创建的逻辑

const title = ref("");

function handleCreate(e: Event) {
  http
    .post<Todo>("/apis/todo.plugin.halo.run/v1alpha1/todos", {
      metadata: {
        // 根据 'todo-' 前缀自动生成 todo 的名称作为唯一标识，可以理解为数据库自动生成主键 id
        generateName: "todo-",
      },
      spec: {
        title: title.value,
        done: false,
      },
      kind: "Todo",
      apiVersion: "todo.plugin.halo.run/v1alpha1",
    })
    .then((response) => {
      title.value = "";
      handleFetchTodos();
    });
}

// 更新的逻辑
const selectedTodo = ref<Todo | undefined>();
const handleUpdate = () => {
  http
    .put<Todo>(
      `/apis/todo.plugin.halo.run/v1alpha1/todos/${selectedTodo.value?.metadata.name}`,
      selectedTodo.value
    )
    .then((response) => {
      handleFetchTodos();
    });
};

function handleDoneChange(todo: Todo) {
  todo.spec.done = !todo.spec.done;
  http
    .put<Todo>(
      `/apis/todo.plugin.halo.run/v1alpha1/todos/${todo.metadata.name}`,
      todo
    )
    .then((response) => {
      handleFetchTodos();
    });
}

// 删除
const handleDelete = (todo: Todo) => {
  http
    .delete(`/apis/todo.plugin.halo.run/v1alpha1/todos/${todo.metadata.name}`)
    .then((response) => {
      handleFetchTodos();
    });
};
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        v-model="title"
        placeholder="What needs to be done?"
        @keyup.enter="handleCreate"
      />
    </header>
    <section class="main" v-show="todos.items.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="filterByDone(false).length > 0"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="(todo, index) in todoList"
          class="todo"
          :key="index"
          :class="{ completed: todo.spec.done, editing: todo === selectedTodo }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              :checked="todo.spec.done"
              @click="handleDoneChange(todo)"
            />
            <label @dblclick="selectedTodo = todo">{{ todo.spec.title }}</label>
            <button class="destroy" @click="handleDelete(todo)"></button>
          </div>
          <input
            v-if="selectedTodo"
            class="edit"
            type="text"
            v-model="selectedTodo.spec.title"
            @vnode-mounted="({ el }) => el.focus()"
            @blur="handleUpdate()"
            @keyup.enter="handleUpdate()"
            @keyup.escape="selectedTodo = undefined"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.total">
      <span class="todo-count">
        <strong>{{ filterByDone(false).length }}</strong>
        <span>
          {{ filterByDone(false).length === 1 ? " item" : " items" }} left</span
        >
      </span>
      <ul class="filters">
        <li v-for="(tab, index) in tabs" :key="index">
          <a
            href="javascript:void(0);"
            @click="activeTab = tab.label"
            :class="{ selected: activeTab === tab.label }"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="() => filterByDone(true).map((todo) => handleDelete(todo))"
        v-show="todos.items.length > filterByDone(false).length"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<style scoped>
@import "todomvc-app-css/index.css";
</style>
```

这在原先的基础上替换为了 `TypeScript` 写法，并去除了数据保存到 `LocalStorage` 的逻辑，这也是我们推荐的方式，可读性更强，且有 `TypeScript` 提供类型提示。

至此我们就完成了与插件后端 APIs 实现 Todo List 数据交互的部分。

### 用户界面使用静态资源

如果你想在用户界面中使用图片，你可以放到 `ui/src/assets` 中，例如 `logo.svg`，并将其作为 Todo 的 Logo 放到标题旁边。

需要修改 `ui/src/views/HomeView.vue` 示例如下：

```diff
+ import Logo from "@/assets/logo.svg";
// ...
<template>
  <section class="todoapp">
    <header class="header">
      <h1>
+        <img :src="Logo" alt="logo" style="display: inline; width: 64px" />
        todos
      </h1>
//...
```

至此，我们完成了从零开始创建一个 TodoList 插件的所有步骤，希望可以帮助你对 Halo 的插件开发有一个整体的了解。
