// const serverURL = 'http://localhost:5000/'
// const clientID = 'abcdefg'
// const axios = require('axios')
// axios.post(serverURL + 'clientRegister', {clientID: clientID}).then(res => {console.log(res.data)})
const utils = require('../utils/utils');
// utils.sendShuffleRequest(json => {
//   console.log(json)
//   json.forEach(element => {
//     let conn = wsConnections.get(element.client)
//     const message = JSON.stringify({
//       type: 'switch',
//       content: element.proxy
//     })
//     conn.on('close', function() {
//       wsConnections.delete(element.client)
//       utils.deleteUser(element.client).then(res => {
//         console.log('deleted user: ', element.client)
//         console.log(res.data)
//       }).catch(err => {
//         console.error(err)
//       })
//     })
//     conn.sendUTF(message)
//   })
// })
// utils.sendShuffleRequest('10.108.87.131:3000').then(res => {
//   console.log(res.data)
// })
const axios = require('axios');
const config = require('../config/config');
axios
	.post(`http://${config.serverIP}:5000/requestShuffle`, { proxy: `${config.ip}:${config.port}` })
	.then(res => {
		console.log(res.data);
	})
	.catch(err => {
		console.error(err);
	});
