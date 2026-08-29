---
title: 数据存储
description: 根据数据用途为 Halo 插件选择自定义模型、插件配置、本地文件或缓存
---

插件应根据数据用途、查询方式和生命周期选择存储方式，避免为少量配置自行维护数据库，也不要把不可恢复的业务数据当作缓存。

## 选择存储方式

| 数据类型 | 建议方式 |
| --- | --- |
| 需要通过 Halo API 查询、授权或与其他插件交互的业务数据 | 自定义模型和 `ReactiveExtensionClient` |
| 由用户在插件设置页面维护的少量配置 | `Setting`、`ConfigMap` 和 `ReactiveSettingFetcher` |
| 插件专用数据库、索引或无法表示为自定义模型的文件 | `PluginsRootGetter` 下的插件命名空间 |
| 可以重新生成的临时结果 | 明确标识的缓存目录，并允许安全删除和重建 |

配置读取参考[获取插件配置](../../api-reference/server/setting-fetcher.md)，自定义模型参考[自定义模型](/developer-guide/plugin/api-reference/server/extension.md)。
