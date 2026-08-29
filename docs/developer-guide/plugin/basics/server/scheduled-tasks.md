---
title: 定时任务
description: 在 Halo 插件中使用 Spring 的 @Scheduled 执行定时任务，并了解其与插件生命周期、Reconciler 的关系
---

Halo 插件运行在独立的 Spring 应用上下文中，因此可以直接使用 Spring 的调度能力执行周期性任务，例如定时同步外部数据、生成站点地图、清理过期记录等。

## 启用调度

在插件启动类上添加 `@EnableScheduling`，然后在任意 Spring Bean 的方法上使用 `@Scheduled`：

```java
@EnableScheduling
public class MyPlugin extends BasePlugin {
    // ...
}
```

```java
@Component
public class SitemapScheduler {

    // 每小时执行一次
    @Scheduled(fixedDelay = 60 * 60 * 1000L, initialDelay = 60 * 1000L)
    public void regenerate() {
        // do something
    }

    // 或使用 cron 表达式，每天凌晨 3:30 执行
    @Scheduled(cron = "0 30 3 * * *")
    public void dailyCleanup() {
        // do something
    }
}
```

`@Scheduled` 支持 `fixedRate`、`fixedDelay`、`initialDelay` 和 `cron` 等方式，完整说明参考 [Spring 调度文档](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)。

## 生命周期

定时任务注册在插件自己的应用上下文中，因此：

- 插件启动后任务才开始调度，插件停止或卸载时上下文关闭，任务随之取消，无需手动清理。
- 已注册的任务会暴露给 Halo 的 Actuator，可以通过 `/actuator/scheduledtasks` 端点查看（需要相应的 Actuator 访问权限）。

## 注意事项

- **避免阻塞调度线程**：Spring 默认使用单线程调度器，长时间运行的任务会拖延同插件内其他任务的执行；耗时操作应切换到弹性线程执行（参考[响应式服务端开发](./reactive-development.md)中的阻塞隔离方式）。
- **任务应是幂等的**：Halo 可能运行在多个副本或被重启，任务逻辑应能安全地重复执行，不要依赖上一次运行的内存状态。
- **与 Reconciler 的分工**：如果是「让资源持续符合期望状态」的场景（如资源变更后重建索引），优先使用 [Reconciler](../../api-reference/server/reconciler.md) 的事件驱动调谐，而不是定时轮询；定时任务适合与资源变更无关的周期性工作，例如按时间触发的数据同步或清理。
