| 参数名                                         | 描述                                                                                                                                                                                                                  |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spring.r2dbc.url`                             | 数据库连接地址，详细可查阅下方的 `数据库配置`                                                                                                                                                                         |
| `spring.r2dbc.username`                        | 数据库用户名                                                                                                                                                                                                          |
| `spring.r2dbc.password`                        | 数据库密码                                                                                                                                                                                                            |
| `spring.sql.init.platform`                     | 数据库平台名称，支持 `postgresql`、`mysql`、`h2`                                                                                                                                                                      |
| `halo.external-url`                            | 外部访问链接，如果需要在公网访问，需要配置为实际访问地址                                                                                                                                                              |
| `halo.cache.page.disabled`                     | 是否禁用页面缓存，默认为禁用，如需页面缓存可以手动添加此配置，并设置为 `false`。<br />开启缓存之后，在登录的情况下不会经过缓存，且默认一个小时会清理掉不活跃的缓存，也可以在 Console 仪表盘的快捷访问中手动清理缓存。 |

数据库配置：

| 链接方式    | 链接地址格式                                                                       | `spring.sql.init.platform` |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------- |
| PostgreSQL  | `r2dbc:pool:postgresql://{HOST}:{PORT}/{DATABASE}`                                 | postgresql                 |
| MySQL       | `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`                                      | mysql                      |
| MariaDB     | `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`                                    | mysql                      |
| H2 Database | `r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE` | h2                         |

:::warning
由于 MariaDB 数据库驱动目前存在问题，使用 MariaDB 数据库时也选择使用 MySQL 驱动，即链接地址格式为 `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`。

详情可见：[https://github.com/halo-dev/halo/issues/5534](https://github.com/halo-dev/halo/issues/5534)
:::
