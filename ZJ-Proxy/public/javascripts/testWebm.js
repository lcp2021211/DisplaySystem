const videoTag = document.getElementById('mse')
const mediaSource = new MediaSource()
const url = URL.createObjectURL(mediaSource)
videoTag.src = url
const CHUNKSIZE = 1024 * 1024
function sendRequest(start, end, initial) {
  return new Promise((resolve, reject) => {
    if(initial) {
      const req = new XMLHttpRequest()
      req.open('GET', 'http://47.92.118.15:3000/getWebmVideo', true)
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
      req.open('GET', `http://47.92.118.15:3000/getWebmVideo?range=${start}-${end}`, true)
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
  let videoSourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="opus, vp09.00.10.08"')
  console.log(mediaSource)
  try{
    const fileSize = await sendRequest(0, 0, true)
    let start = 0
    let end = start + CHUNKSIZE
    videoSourceBuffer.addEventListener('updateend', function() {
      console.log('buffer added')
    })
    while(end < fileSize) {
      let buffer = await sendRequest(start, end, false)
      console.log(buffer)
      console.log(videoSourceBuffer)
      videoSourceBuffer.appendBuffer(buffer)
      start = end
      end = end + CHUNKSIZE
    }
    let finalBuffer = await sendRequest(start, fileSize, false)
    videoSourceBuffer.addEventListener('updateend', function() {
      media.endOfStream()
      console.log('end buffering')
    })
    videoSourceBuffer.appendBuffer(finalBuffer)
    
  }catch(error) {
    console.log(error)
  }
})