| 变量名                                         | 描述                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `SPRING_R2DBC_URL`                             | 数据库连接地址，详细可查阅下方的 `数据库配置`                                    |
| `SPRING_R2DBC_USERNAME`                        | 数据库用户名                                                                     |
| `SPRING_R2DBC_PASSWORD`                        | 数据库密码                                                                       |
| `SPRING_SQL_INIT_PLATFORM`                     | 数据库平台名称，支持 `postgresql`、`mysql`、`h2`，需要与 `SPRING_R2DBC_URL` 对应 |
| `HALO_EXTERNAL_URL`                            | 外部访问链接，如果需要在公网访问，需要配置为实际访问地址                         |
| `HALO_SECURITY_INITIALIZER_SUPERADMINUSERNAME` | 初始超级管理员用户名                                                             |
| `HALO_SECURITY_INITIALIZER_SUPERADMINPASSWORD` | 初始超级管理员密码                                                               |

数据库配置：

| 链接方式    | 链接地址格式                                                                       | `SPRING_SQL_INIT_PLATFORM` |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------- |
| PostgreSQL  | `r2dbc:pool:postgresql://{HOST}:{PORT}/{DATABASE}`                                 | postgresql                 |
| MySQL       | `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`                                      | mysql                      |
| H2 Database | `r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE` | h2                         |
