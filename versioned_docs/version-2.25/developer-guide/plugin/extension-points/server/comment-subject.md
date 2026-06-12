---
title: 评论主体展示
description: 用于在管理端评论列表中展示评论的主体内容。
---

评论主体扩展点用于在管理端评论列表中展示评论的主体内容，评论自定义模型是 Halo 主应用提供的，如果你需要使用评论自定义模型，那么评论会统一
展示在管理后台的评论列表中，这时就需要通过评论主体扩展点来展示评论的主体内容便于跳转到对应的页面，如果没有实现该扩展点，那么评论列表中对应的评论的主体会显示为“未知”。

```java
public interface CommentSubject<T extends Extension> extends ExtensionPoint {

    Mono<T> get(String name);

    default Mono<SubjectDisplay> getSubjectDisplay(String name) {
        return Mono.empty();
    }

    boolean supports(Ref ref);

    record SubjectDisplay(String title, String url, String kindName) {
    }
}
```

- `get` 方法用于获取评论主体，参数 `name` 是评论主体的自定义模型对象的名称，返回值为 `Mono<T>`，其中 `T` 为评论主体对象，它是使用评论的那个自定义模型。
- `getSubjectDisplay` 方法用于获取评论主体的展示信息，返回值为 `Mono<SubjectDisplay>`，其中 `SubjectDisplay` 为评论主体的展示信息，包含标题、链接和类型名称，用于在主题端展示评论主体的信息。
- `supports` 方法用于判断是否支持该评论主体，返回值为 `boolean`，如果支持则返回 `true`，否则返回 `false`。

实现该扩展点后，评论列表会通过 `get` 方法将主体的自定义模型对象带到评论列表中，可以配置前端的扩展点来决定如何展示评论主体的信息，参考：[UI 评论来源显示](../ui/comment-subject-ref-create.md)

例如对于文章是支持评论的，所以文章的评论主体扩展点实现如下：

```java
public class PostCommentSubject implements CommentSubject<Post> {

    private final ReactiveExtensionClient client;
    private final ExternalLinkProcessor externalLinkProcessor;

    @Override
    public Mono<Post> get(String name) {
        return client.fetch(Post.class, name);
    }

    @Override
    public Mono<SubjectDisplay> getSubjectDisplay(String name) {
        return get(name)
            .map(post -> {
                var url = externalLinkProcessor
                    .processLink(post.getStatusOrDefault().getPermalink());
                return new SubjectDisplay(post.getSpec().getTitle(), url, "文章");
            });
    }

    @Override
    public boolean supports(Ref ref) {
        Assert.notNull(ref, "Subject ref must not be null.");
        GroupVersionKind groupVersionKind =
            new GroupVersionKind(ref.getGroup(), ref.getVersion(), ref.getKind());
        return GroupVersionKind.fromExtension(Post.class).equals(groupVersionKind);
    }
}
```

`CommentSubject` 对应的 `ExtensionPointDefinition` 如下：

```yaml
apiVersion: plugin.halo.run/v1alpha1
kind: ExtensionPointDefinition
metadata:
  name: comment-subject
spec:
  className: run.halo.app.content.comment.CommentSubject
  displayName: CommentSubject
  type: MULTI_INSTANCE
  description: "Provide extension points for comment subject display"
```

即声明 `ExtensionDefinition` 自定义模型对象时对应的 `extensionPointName` 为 `comment-subject`。

可以参考其他使用该扩展点的项目示例：

- [Halo 自定义页面评论主体](https://github.com/halo-dev/halo/blob/main/application/src/main/java/run/halo/app/content/comment/SinglePageCommentSubject.java)
- [瞬间的评论主体](https://github.com/halo-sigs/plugin-moments/blob/096b1b3e4a2ca44b6f858ba1181b62eeff64a139/src/main/java/run/halo/moments/MomentCommentSubject.java#L25)
