```json title="UserVo"
{
  "metadata": {
    "name": "string",                                   // 唯一标识
    "labels": {
      "additionalProp1": "string"
    },
    "annotations": {
      "additionalProp1": "string"
    },
    "creationTimestamp": "2022-11-20T13:06:38.512Z"     // 创建时间
  },
  "spec": {
    "displayName": "string",                            // 显示名称
    "avatar": "string",                                 // 头像链接
    "email": "string",                                  // 邮箱地址
    "phone": "string",                                  // 电话号码
    "bio": 0,                                           // 描述
    "registeredAt": "2022-11-20T13:06:38.512Z",         // 注册时间
    "twoFactorAuthEnabled": false,                      // 是否启用二次验证
    "disabled": false                                   // 是否禁用
  },
  "status": {
    "lastLoginAt": "2022-11-20T13:06:38.512Z",          // 最后登录时间
    "permalink": "string"                               // 作者的文章归档页面链接
  }
}
```
