// 服务器的主动行为，发送信息进行代理切换
// 在这里我们给所有服务器发送代理转接的消息，发送不同的Map进行转接
const mongoose = require('mongoose')
const request = require('request')


mongoose.connect('mongodb://localhost:27017/Mappings')
const Mappings = require('../models/proxyToClient')
console.log('in action.js')
const execute = function() {
  setInterval(sendMessage, 3000, 'localhost')
}

// 向某个特定的Proxy IP发送切换指令，同时带着其他proxy的IP地址
const sendMessage = async function(proxyIP) {
  try {
    const allProxy = await Mappings.find({})
    const proxyClientMapping = new Map()
    allProxy.forEach(element => {
      proxyClientMapping.set(element.proxy, element.client)
    })
    delete allProxy[proxyIP]
    const postResult = await postProxy('http://'+ proxyIP + ':3001/getOtherProxy', allProxy)
    console.log(postResult)
  } catch(err) {
    console.log(err)
  }
}

// 发送函数
const postProxy = function(proxyIP, others) {
  return new Promise((resolve, reject) => {
    request({
      url: proxyIP,
      method: 'POST',
      body: {others},
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
    }, (err, response, body) => {
      if(err){
        reject(err)
      }
      if(response.statusCode === 200){
        resolve(body)
      }
    })
  })
}
execute()
exports.execute