const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Mappings');
const proxies = [
	'39.99.199.31',
	'39.99.198.165',
	'39.99.197.209',
	'39.99.197.65',
	'39.99.191.150',
	'39.99.197.255',
	'39.99.195.208',
	'39.99.188.152',
	'39.99.189.65',
	'39.99.199.4',
	'39.99.199.84',
	'39.99.197.61',
	'47.92.23.148',
	'39.99.183.131',
	'39.99.197.217',
	'39.98.35.100'
];

const Mappings = require('../models/proxyToClient');
Mappings.remove({}, err => {
	if (err) {
		console.error('error removing old:', err);
	} else {
		let count = 0;
		proxies.forEach(proxy => {
			let tempArr = [];
			for (let i = 0; i < 10; i++) {
				let tempClient = {
					ID: count,
					pass: '123456',
					credit: 0,
					block: false,
					attackFrequency: 0,
					attackStrength: 0,
					accessTime: new Date(),
					timeSlot: 0,
					spy: false
				};
				tempArr.push(tempClient);
				count++;
			}
			// let temp = new Mappings({
			//   client: tempArr,
			//   proxy: `${proxy}:3000`
			// })
			let temp = new Mappings({
				client: [],
				proxy: `${proxy}:3000`
			});
			temp.save();
		});
	}
});

// const errorcode = require('../config/errorCode')
// Mappings.findOne({proxy: '10.8.108.254'}, (err, doc) => {
//   if(err){
//     console.log(err)
//   }if(doc){
//     console.log(doc.mappings)
//   }
// })

// Mappings.findOne({client:'123445'}, (err, doc) => {
//   if(err){
//     console.log(err)
//   }
//   if(doc){
//     console.log(doc)
//   }
// })
// Mappings.findOneAndUpdate({proxy: '10.8.108.254'},
// {'$push': {client: '120998'}}, (err, doc) => {
//   if(err)
//     console.log(err)
//   else{
//     console.log(doc)
//   }
// })
// console.log(errorcode.errorCode.DOCNOTFOUND)
// const clientController = require('../controllers/clientController')
// clientController.redistribute('229.90.171.129').then(client => {
//   console.log(client[2])
// }).catch(err => {
//   console.log(err)
// })
// clientController.informClient('229.90.171.129')

/**
 * Initialize with 100000 clients and 100 proxys
 */
// let clientID = 0
// let clientPass = 12345
// let credit = 0
// let count = 0
// for(let i=0; i<20; i++){
//   let first = Math.floor(Math.random() * 1000 % 256)
//   let second = Math.floor(Math.random() * 1000 % 256)
//   let third = Math.floor(Math.random() * 1000 % 256)
//   let fourth = Math.floor(Math.random() * 1000 % 256)
//   let randomProxyIP = `10.108.${third}.${fourth}`
//   if(i === 1){
//     randomProxyIP = '10.108.87.131:3000'
//   }
//   let proxy = randomProxyIP
//   let clientArray = []
//   for(let j=0; j<10; j++){
//     let client = {ID:clientID, pass: clientPass, credit: credit, block: false}
//     clientID++
//     clientPass++
//     clientArray.push(client)
//   }
//   proxy = `10.108.87.131:${3000+count}`
//   count++
//   let mapping = new Mappings()
//   let result = new Map([[proxy, clientArray]])
//   mapping.saveMap = result
//   mapping.save(function(err, doc) {
//     if(err)
//       console.error(err)
//     if(doc)
//       console.log(doc)
//   })
// }
// clientController.shuffle('219.169.111.97')
// Mappings.find({'client.credit': 1}, (err, doc) => {
//   if(err){
//     console.error(err)
//   }
//   if(doc){
//     doc.forEach(element => {
//       // console.log(element.client)
//       // element.client.forEach(clients => {
//       //   if(clients.credit === 1){
//       //     console.log(clients)
//       //   }
//       // })
//       console.log(element.client.find(function(val){return val.credit === 1}))
//     })
//   }
// })
