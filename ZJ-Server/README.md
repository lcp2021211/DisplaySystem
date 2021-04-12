# 系统安装

1. 进入项目根目录, 执行`mongod --dbpath=data/db --logpath=data/log --fork`启动数据库
2. 修改`config/proxies.js`文件中的反向代理集群IP地址
3. 运行`start.sh`项目
4. 每次测试完成后, 执行`pm2 reload Server`清空信息
