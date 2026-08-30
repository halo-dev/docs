---
title: 日志
description: 在 Halo 插件中使用 SLF4J 输出参数化日志，选择合适的日志级别，并通过 application.yaml、Docker 或面板调整和查看生产日志
---

## 使用 SLF4J

插件应通过 SLF4J 门面记录日志，不要引入自己的日志实现（如 Logback、Log4j2 的实现包），日志输出由 Halo 主程序统一管理：

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LinkService {

    public void sync() {
        log.info("Start syncing links");
        try {
            // do something
        } catch (Exception e) {
            log.error("Failed to sync links", e);
        }
    }
}
```

不使用 Lombok 时可以手动创建：

```java
private static final Logger log = LoggerFactory.getLogger(LinkService.class);
```

## 日志级别约定

- `error`：功能执行失败，需要用户或管理员关注。
- `warn`：可恢复的异常或不符合预期的状态。
- `info`：关键业务节点（如任务开始/完成），不要在高频路径上使用。
- `debug`/`trace`：排查用的详细信息，默认级别下不输出。

## 调整插件日志级别

Halo 使用 Spring Boot 的日志配置，插件的 logger 名称即类的全限定名，因此可以通过 Halo 的配置调整插件包的日志级别：

```yaml
# Halo 的 application.yaml
logging:
  level:
    com.example.myplugin: DEBUG
```

使用 [DevTools](../devtools.md) 开发时，可以在 `workplace/config/application.yaml` 中做同样的配置，重启 `haloServer` 后生效。

生产环境中，日志随 Halo 进程输出：Docker 部署通过 `docker logs` 查看，1Panel 等面板部署可在面板的日志页面查看。
