const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Mappings')
const Mappings = require('../models/proxyToClient')
Mappings
.aggregate([
  {'$project':{
    client: {
      $filter: {
          input: "$client",
          as: "client",
          cond: { $eq: [ "$$client.spy", true ] }
        }
      },
      proxy: true
      }
  }
])
.exec((err, doc) => {
  if(err) {
    console.log(err)
  }
  if(doc) {
    let count = 0
    doc.forEach(element => {
      element.client.forEach(client => {
        console.log(client)
        count++
      })
    })
    console.log('count: ', count)
  }
})