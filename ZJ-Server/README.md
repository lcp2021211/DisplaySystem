# 日志

## 2020-02-25
- 对原有的MOTAG进行如下修改:
    - 第一次proxy分配从本地随机分配转移至server端分配
    - 超时自动分配也从本地随机分配转移至server端分配
    - proxy增加属性:最大可接入数量maxSize

## TODO
- 在server端分配过程中进行maxSize检测
- 在client连接至proxy后,由proxy发送通知给server进行实际映射表的刷新
- 解决Mongoose在高并发下的ACID问题


# 注意

1. 第一次部署server的时候要运行: `mongod --dbpath data/db`
