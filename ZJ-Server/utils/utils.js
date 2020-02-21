const Mappings = require('../models/proxyToClient')

exports.changeProxy = async function(oldProxy, newProxy, clientID) {
  const oldDoc = await Mappings.findOne({proxy, oldProxy, client: clientID})
  if(oldDoc){
    const newDoc = await Mappings.findOne({proxy: newProxy})
    
  }
}