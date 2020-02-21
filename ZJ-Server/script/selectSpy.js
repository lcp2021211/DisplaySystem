const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Mappings')

const Mappings = require('../models/proxyToClient')
const spyNum = parseInt(process.argv.slice(2)[0])
Mappings.find({}, (err, doc) => {
  if(err){
    console.error(err)
  }
  if(doc){
    console.log(doc)
    doc.forEach(proxy => {
      if(proxy.client.length !== 0){
        proxy.client.forEach(client => {
          client.spy = false
        })
      }
    })
    for(let i=0; i<spyNum; i++){
      let idx = Math.floor(Math.random() * doc.length) % doc.length
      let idx2 = Math.floor(Math.random() * doc[idx].client.length) % doc[idx].client.length
      doc[idx].client[idx2].spy = true
    }
    let mapping = new Mappings()
    mapping = doc
    mapping.forEach(element => {
      element.save()
    })
  }
})