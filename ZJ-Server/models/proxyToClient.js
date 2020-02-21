const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MappingSchema = new Schema({
  client: [{
    ID: String,
    pass: String,
    credit: Number,
    block: Boolean,
    attackFrequency: Number,//客户端的累计攻击次数
    attackStrength: Number,//客户端的累计攻击劣度
    accessTime: Date,
    logoutTime: Date,
    timeSlot: Number,
    spy: Boolean
  }],
  proxy: {
    type: String,
    required: true,
    unique: true
  }
}, {collection: 'mapping'});
// 获取整个映射map
MappingSchema
.virtual('mappings')
.get(function() {
  const map = new Map()
  map.set(this.proxy, this.client);
  return map
})

MappingSchema
.virtual('saveMap')
.set(function(map) {
  map.forEach((value, key) => {
    this.client = value
    this.proxy = key
  })
})

MappingSchema
.virtual('saveAll')
.set(function(array){
  array.forEach(element => {
    this.proxy = element.proxy
    this.client = element.client
  })
})
module.exports = mongoose.model('Mappings', MappingSchema);