const domain = window.location.host
let videoURL = 'http://' + domain
var globalMedia
let videoTag2 = document.getElementById('mse')
let id
let ws = null
let startTime, endTime
let interval = 1000
let count = 0
let totalTimePerSecond = 0
const CHUNKSIZE = 1024 * 10
console.log(domain)
function downloadVideo() {
  const videoTag = document.getElementById('mse')
  const mediaSource = new MediaSource()
  const url = URL.createObjectURL(mediaSource)
  videoTag.src = url
  
  function sendRequest(url, start, end, initial) {
    return new Promise((resolve, reject) => {
      if(initial) {
        const req = new XMLHttpRequest()
        req.open('GET', url, true)
        req.onreadystatechange = function() {
          if(req.readyState == 4){
            if(req.status == 200){
              resolve(JSON.parse(req.response).fileSize)
            }
            else{
              reject({
                code: req.status,
                message: 'error sending message'
              })
            }
          }
        }
        req.send()
      }else{
        const req = new XMLHttpRequest()
        req.open('GET', `${url}?range=${start}-${end}`, true)
        req.responseType = 'arraybuffer'
        req.onreadystatechange = function() {
          if(req.readyState == 4){
            if(req.status == 206) {
              resolve(req.response)
            }else{
              reject({
                code: req.status,
                message: 'error getting buffer'
              })
            }
          }
        }
        req.send()
      }
    })
  }
  mediaSource.addEventListener('sourceopen', async function() {
    console.log('media source opened')
    const media = this
    globalMedia = media
    let videoSourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001e"')
    try{
      const fileSize = await sendRequest(`${videoURL}/getVideoByRange`,0, 0, true)
      let start = 0
      let end = start + CHUNKSIZE
      videoSourceBuffer.addEventListener('updateend', function() {
        
      })
      // added 2019.3.22, the control module
      // when switchControl are set to false, this round doesn't need to change proxy
      document.addEventListener('switch', function(message){
        console.log(message.detail)
        videoURL = message.detail
      })
      while(end < fileSize) {
        startTime = performance.now()
        let buffer = await sendRequest(`${videoURL}/getVideoByRange`, start, end, false)
        endTime = performance.now()
        let bufferChunkTime = endTime - startTime
        totalTimePerSecond += bufferChunkTime
        count++
        videoSourceBuffer.appendBuffer(buffer)
        start = end
        end = end + CHUNKSIZE
      }
      let finalBuffer = await sendRequest(`${videoURL}/getVideoByRange`,start, fileSize, false)
      videoSourceBuffer.addEventListener('updateend', function() {
        media.endOfStream()
        console.log('end buffering')
        downloadVideo()
      })
      videoSourceBuffer.appendBuffer(finalBuffer)
      
    }catch(error) {
      console.log(error)
    }
  })
}
// test websocket
function WebSocketTest() {
  if ("WebSocket" in window) {
    console.log("您的浏览器支持 WebSocket!")
    // 打开一个 web socket
    var ws = new WebSocket("ws://localhost:3000/", 'echo-protocol')
    ws.onopen = function(){
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.send("发送数据")
        console.log("数据发送中...")
    }
      
    ws.onmessage = function (evt) { 
        var received_msg = evt.data;
        console.log(evt.data)
    }
      
    ws.onclose = function(){ 
        // 关闭 websocket
        console.log("连接已关闭...")
    };
  }else{
    // 浏览器不支持 WebSocket
    alert("您的浏览器不支持 WebSocket!");
  }
}

function initialize(url) {
  return new Promise((resolve, reject) => {
    if("WebSocket" in window){
      const ws = new WebSocket(url, 'echo-protocol')
      resolve(ws)
    } else {
      reject('websocket not supported')
    }
  })
}
/**
 * Execute the websocket part.
 * @param {string} clientID the specific client ID
 */
async function main(clientID, wsURL) {
  let url = null
  try{
    ws = await initialize(`ws://${wsURL}/${clientID}/0`)
    ws.id = clientID
  } catch(err) {
    console.error(err)
  }
  if(ws){
    ws.onopen = function() {
      console.log('已连接，正在和服务器通信')
    }
    ws.onmessage = function(event) {
      const message = JSON.parse(event.data.toString())
      console.log(message)
      switch(message.type){
        case 'switch':
          if(message.block){
            alert('you are blocked!!!')
            ws.close()
            globalMedia.endOfStream()
            setTimeout(() => {
              videoTag2.pause()
            }, 3000);
            
          }
          url = message.content
          // send event
          let switchEvent = new CustomEvent('switch', {detail: `http://${message.content}`})
          console.log(switchEvent.detail)
          document.dispatchEvent(switchEvent)
          ws.close()
          break
        default: 
          console.log(message.content)

      }
    }
    ws.onclose = async function() {
      if(url){
        console.log('切换到新的代理服务器: ' + url)
        console.log(ws.id)
        main(ws.id, url)
        ws = null
        console.log(ws)
      }
      
    }
  }
}
// execute main function
// main()

function registerClient() {
  console.log('this is register client')
  const clientTag = document.getElementById('clientID')
  const clientID = clientTag.value
  // ajax post to register the client
  const req = new XMLHttpRequest()
  req.open('POST', 'http://47.92.235.31:5000/distributeID')
  req.setRequestHeader("Content-type","application/json")
  req.onreadystatechange = function() {
    if(req.readyState === 4){
      if(req.status === 200){
        let responseObj = JSON.parse(req.responseText)
        console.log(responseObj)
        id = responseObj.message
        document.getElementById('clientText').innerHTML = '用户ID： ' + id
        return main(responseObj.message, domain)
        // return main(clientID)
      }
    }
  }
  req.send()
  // req.send(JSON.stringify({clientID:clientID, proxyIP: "localhost:3000"}))
  // return main(clientID, domain)
}
registerClient()
let attackURL = 'http://'+ domain + '/test?attackFrequency=5&attackStrength=8&clientID=abc&proxyIP=10.108.87.131'
async function attack(){
  // let req = new XMLHttpRequest()
  // req.onreadystatechange = function(){
  //   if(req.readyState === 4){
  //     if(req.status === 200){
  //       console.log('attack OK')
  //       console.log(req.getAllResponseHeaders())
  //     }
  //     else{
  //       console.log('something wrong!')
  //     }
  //   }
  // }
  // req.open('GET', attackURL)
  // req.send(null)
  // setInterval(() => {
  //   let req = new XMLHttpRequest()
  //   req.onreadystatechange = function(){
  //     if(req.readyState === 4){
  //       if(req.status === 200){
  //         console.log('attack OK')
  //       }
  //       else{
  //         console.log('something wrong!')
  //       }
  //     }
  //   }
  //   req.open('GET', attackURL)
  //   req.send(null)
  // }, 0);
  try{
    let start = performance.now()
    await request('get', attackURL)
    let end = performance.now()
    console.log('time elapsed: ', end - start, 'ms')
  }catch(err){
    console.error(err)
  }
}

function request(method, url){
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = function(){
      if(req.readyState === 4){
        if(req.status === 200){
          console.log('attack OK')
          console.log(req.getAllResponseHeaders())
          resolve('attack ok')
        }
        else{
          console.log('something wrong!')
          reject('not ok')
        }
      }
    }
    req.open('GET', url)
    req.send(null)
  })
}
downloadVideo()
// keep alive heart packets
// setInterval(() => {
//   if(ws){
    
//   } else {
//     console.log('reconnection')
//     let req = new XMLHttpRequest()
//     req.onreadystatechange = function(){
//       if(req.readyState === 4){
//         if(req.status === 200){
//           let response = req.responseText
          
//           return main(response.client, response.proxy)
//         }
//         else{
//           console.log('something wrong!')
//         }
//       }
//     }
//     req.open('GET', 'http://39.100.5.81:5000/getProxy?id=' + id)
//     req.send(null)
//   }
// }, 1500)

/**
 * display and send interval message to view controller
 */
setInterval(() => {
  let delayTime = interval / count
  let speed = CHUNKSIZE * count / 1024
  count = 0
  document.getElementById('elapsedTime').innerHTML = '下载时延：' + delayTime + 'ms'
  document.getElementById('networkSpeed').innerHTML = '实时网速：' + speed + 'kb/s'
  let req = new XMLHttpRequest()
  req.onreadystatechange = function() {
    if(req.readyState === 4) {
      if(req.status === 200) {
        let response = JSON.parse(req.responseText)
        if(response.code !== 20000) {
          console.log(response.message)
        }
      }
    }
  }
  req.open('POST', 'http://47.92.235.31:5000/users/setClientNetworkInfo')
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  req.send(`clientID=${id}&delayTime=${delayTime}&networkSpeed=${speed}`)
}, interval);

/**
 * post every second to judge whether it is blocked
 */
setInterval(() => {
  let req = new XMLHttpRequest()
  req.onreadystatechange = function() {
    if(req.readyState === 4) {
      if(req.status === 200) {
        const response = JSON.parse(req.responseText)
        if(response.code === 20000) {
          if(response.message.client[0].block) {
            document.getElementById('blockOrNot').innerHTML = '是否封禁：是'
          }
        }
      }
    }
  }
  req.open('POST', 'http://47.92.235.31:5000/whetherBlock')
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  req.send('clientID='+id)
}, interval);