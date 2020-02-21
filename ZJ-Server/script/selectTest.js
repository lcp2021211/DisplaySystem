// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/Mappings')

// const Mappings = require('../models/proxyToClient')
// const aggregate = Mappings.aggregate([
//   {$project: {
//     client: {
//       $filter: {
//           input: "$client",
//           as: "client",
//           cond: { $eq: [ "$$client.spy", true ] }
//         }
//       }
//     }
//   }
// ])
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)
client.connect((err, client) => {
  assert.equal(null, err)
  console.log('connected')
  const db = client.db('Mappings')
  const collection = db.collection('mapping')
  collection.aggregate([
    {'$project':{
        client: {
          $filter: {
              input: "$client",
              as: "client",
              cond: { $eq: [ "$$client.spy", true ] }
            }
          }
        }
    }
  ], (err, cursor) => {
    assert.equal(err, null)
    cursor.toArray((err, doc) => {
      console.log(doc)
    })
  })
})