| 参数名                     | 描述                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| `spring.r2dbc.url`         | 数据库连接地址，详细可查阅下方的 `数据库配置`                         |
| `spring.r2dbc.username`    | 数据库用户名                                                          |
| `spring.r2dbc.password`    | 数据库密码                                                            |
| `spring.sql.init.platform` | 数据库平台名称，支持 `postgresql`、`mysql`、`mariadb`、`oracle`、`h2` |
| `halo.external-url`        | 外部访问链接，如果需要在公网访问，需要配置为实际访问地址              |

数据库配置：

| 链接方式           | 链接地址格式                                                                       | `spring.sql.init.platform` |
| ------------------ | ---------------------------------------------------------------------------------- | -------------------------- |
| PostgreSQL（推荐） | `r2dbc:pool:postgresql://{HOST}:{PORT}/{DATABASE}`                                 | postgresql                 |
| MySQL              | `r2dbc:pool:mysql://{HOST}:{PORT}/{DATABASE}`                                      | mysql                      |
| MariaDB            | `r2dbc:pool:mariadb://{HOST}:{PORT}/{DATABASE}`                                    | mariadb                    |
| Oracle（付费版）   | `r2dbc:pool:oracle://{HOST}:{PORT}/{DATABASE}`                                     | oracle                     |
| H2 Database        | `r2dbc:h2:file:///${halo.work-dir}/db/halo-next?MODE=MySQL&DB_CLOSE_ON_EXIT=FALSE` | h2                         |

:::warning 商业版需要注意
由于商业版的数据结构与 Halo 其他版本不同，所以暂时仅支持 PostgreSQL、MySQL、MariaDB、H2。
:::

<details>
  <summary>Oracle 用户需要注意</summary>

由于 Oracle 数据库各个版本的差异，目前很难统一提供自动执行的 SQL 脚本，所以配置 Oracle 数据库连接之前，需要先手动创建数据库以及执行表创建脚本。以下是具体步骤：

1. 在 Oracle 数据库中创建数据库，比如 `halo`。
2. 添加 Halo 的启动参数 `--spring.sql.init.mode=never`。
3. 执行创建表的 SQL 脚本，下面提供两种脚本，可以按照 Oracle 数据库的版本自行选择：

   如果你的 Oracle 数据库不支持 `IF NOT EXISTS` 语法：

   ```sql
    DECLARE 
        table_count INTEGER;
    BEGIN
        SELECT COUNT(*)
        INTO table_count
        FROM all_tables
        WHERE table_name = 'EXTENSIONS';
    
        IF table_count = 0 THEN
            EXECUTE IMMEDIATE '
                CREATE TABLE extensions
                (
                    name    VARCHAR2(255) NOT NULL,
                    data    BLOB,
                    version NUMBER,
                    CONSTRAINT pk_name PRIMARY KEY (name)
                )';
        END IF;
    END;
    /
   ```

   如果你的 Oracle 数据库支持 `IF NOT EXISTS` 语法：

   ```sql
    CREATE TABLE IF NOT EXISTS EXTENSIONS (
        NAME    VARCHAR2(255) NOT NULL,
        DATA    BLOB,
        VERSION NUMBER,
        CONSTRAINT PK_NAME PRIMARY KEY ( NAME )
    );
   ```

</details>
