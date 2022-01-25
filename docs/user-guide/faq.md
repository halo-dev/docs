---
title: 常见问题
description: 使用上的常见问题
---

### Q1. Halo 是什么？

### Q2. 没有提供 SQL 脚本，是否需要手动建表？

得益于我们使用的 ORM 框架，Halo 在首次启动的时候会自动根据实体类创建表结构，无需通过 SQL 脚本自行创建，也不会提供所谓的 SQL 脚本。所以仅需配置好数据库连接地址和用户名密码即可。注意，H2 无需手动创建数据库，MySQL 需要。

详情可见：[配置参考](/getting-started/config#数据库)

### Q3. 为什么百度无法搜索到我的站点？

### Q4. 忘记了管理员密码，如何重置？

### Q5. 附件上传提示 `413 Request Entity Too Large` 如何解决？

这可能是由于 Nginx 的上传大小限制所导致的。可以在 Nginx 的配置文件下的 server 节点加入 `client_max_body_size 1024m;` 即可解决，如果 1024m 还不够，请自行断定，详细配置参考如下：

```nginx {4}
server {
    listen       80;
    server_name  localhost;
    client_max_body_size 1024m;
}
```

### Q6. 开启了两步验证但丢失了验证设备或 APP，如何取消两步验证？

### Q7. 网站加载速度慢，是什么问题导致的？

### Q8. 如何一台服务器上部署多个站点？

### Q9. 