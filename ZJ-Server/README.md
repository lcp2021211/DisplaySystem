# 日志

## 2020-02-25
- 对原有的MOTAG进行如下修改:
    - 第一次proxy分配从本地随机分配转移至server端分配
    - 超时自动分配也从本地随机分配转移至server端分配
    - proxy增加属性:最大可接入数量maxSize

## 2020-03-05
- 修改项目架构, 在分配clientID和proxy时进行maxSize检测并更新数据库
- 解决高并发下的Mongoose问题
- 根据评分将client进行分级


## TODO
- 


# 注意

1. 第一次部署server的时候要运行: `mongod --dbpath data/db`
