/**
 * @file NMTD MOTAT architecture 1.0 <br>
 !!!!DO NOT open source, this is a CONFIDENTIAL PROGRAM <br>
 This is main controller, handling request from proxys,
 including shuffle request and handling request, applying shuffle policies, 
 redistributing clients and proxies, and inform proxies of the changes.
 @author Song Chengru created at 3/28/2019, 4:12:27 PM
 */

const Mappings = require('../models/proxyToClient');
const error = require('../config/errorCode');
const errorCode = error.errorCode;

const MAXCREDIT = require('../config/basics').basics.maxCredit;
const parameter = require('../config/basics').basics;

const service = require('../controllers/services');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
/**
 * Message sent to server about client to check if client is already in the map
 * If it does, do nothing. Else add the client to map.
 * @param {Object} req request obj
 * @param {Object} res respond obj
 * @param {Object} next middleware
 */
async function clientRegister(req, res, next) {
	// const ipArray = req.ip.split(':')
	// const proxyIP = ipArray[3]
	const clientID = req.body.clientID;
	const proxyIP = req.body.proxyIP;
	const type = req.body.type;
	// check if already registered
	try {
		const proxyAndClient = await Mappings.findOne({ 'client.ID': clientID });
		// save if not
		if (proxyAndClient) {
			console.log('client registered');
			res.send(errorCode.CLIENTEXIST);
		} else {
			const result = await Mappings.findOne({ proxy: proxyIP });
			// let num = Math.random()
			// let spy
			// num < 0.6 ? spy = false : spy = true
			if (result) {
				let client;
				if (type) {
					client = {
						ID: clientID,
						pass: '123456',
						credit: 0,
						block: false,
						attackFrequency: 0,
						attackStrength: 0,
						accessTime: new Date(),
						timeSlot: 0,
						spy: true
					};
				} else {
					client = {
						ID: clientID,
						pass: '123456',
						credit: 0,
						block: false,
						attackFrequency: 0,
						attackStrength: 0,
						accessTime: new Date(),
						timeSlot: 0,
						spy: false
					};
				}
				result.client.push(client);
				result.save(function(err) {
					if (err) {
						console.log(err);
						res.send(errorCode.DOCNOTFOUND);
					}
					res.send(errorCode.SENDSUCCESSFULLY);
				});
			} else {
				console.log(`Not found Proxy: ${proxyIP}, ClientID: ${clientID}`);
				res.send(errorCode.DOCNOTFOUND);
			}
		}
	} catch (err) {
		console.log(err);
		res.send(errorCode.DOCNOTFOUND);
	}
}

/**
 * Register a spy
 * @param {Object} req request obj
 * @param {Object} res respond obj
 * @param {Object} next middleware
 */
async function spyRegister(req, res, next) {
	// const ipArray = req.ip.split(':')
	// const proxyIP = ipArray[3]
	const clientID = req.body.clientID;
	const proxyIP = req.body.proxyIP;
	// check if already registered
	try {
		const proxyAndClient = await Mappings.findOne({ 'client.ID': clientID });
		// save if not
		if (proxyAndClient) {
			console.log('client registered');
			res.send(errorCode.CLIENTEXIST);
		} else {
			const result = await Mappings.findOne({ proxy: proxyIP });
			if (result) {
				const client = {
					ID: clientID,
					pass: '123456',
					credit: 0,
					block: false,
					attackFrequency: 0,
					attackStrength: 0,
					accessTime: new Date(),
					timeSlot: 0,
					spy: true
				};
				result.client.push(client);
				result.save(function(err) {
					if (err) {
						console.log(err);
						res.send(errorCode.DOCNOTFOUND);
					}
					res.send(errorCode.SENDSUCCESSFULLY);
				});
			} else {
				console.log(`Not found Proxy: ${proxyIP}, ClientID: ${clientID}`);
				res.send(errorCode.DOCNOTFOUND);
			}
		}
	} catch (err) {
		console.log(err);
		res.send(errorCode.DOCNOTFOUND);
	}
}

/**
 * Get proxy ip from req.ip and add the proxy ip to trusted proxys,
 * Update database with empty clients array and proxy ip
 * @todo Authentication of the request ip address
 * @param {Obj} req request
 * @param {Obj} res respond
 * @param {function} next middleware
 */
async function proxyRegister(req, res, next) {
	const { proxy } = req.body;
	try {
		const proxyObj = await Mappings.findOne({ proxy: proxy });
		if (proxyObj) {
			res.send({
				code: 50000,
				message: 'already exists proxy'
			});
		} else {
			const map = new Mappings({
				proxy: proxy,
				client: []
			});
			const result = await map.save();
			if (result) {
				res.send({
					code: 20000,
					message: 'succefully inserted proxy: ' + proxy
				});
			} else {
				res.send({
					code: 50000,
					message: 'failed inserting proxy'
				});
			}
		}
	} catch (err) {
		console.error(err);
		res.send({
			code: 50000,
			message: 'failed'
		});
	}
}

/**
 * when a proxy request to shuffle because it is under attack
 * @param {Obj} req request: req.ip for proxy ip address
 * @param {Obj} res respond: respond to request
 * @param {function} next middleware
 */
async function requestShuffle(req, res, next) {
	// get the proxy ID
	// const ipArray = req.ip.split(':')
	// const proxyIP = ipArray[3]
	console.log(req.body);
	const proxyIP = req.body.proxy;
	try {
		const result = await Mappings.findOne({ proxy: proxyIP });
		if (result) {
			// if proxy exists
			// invoke shuffle algorithm
			const resultJson = await shuffle(proxyIP, result.client);
			// after shuffle, send the results to every client so that they switch to anothor proxy
			console.log(resultJson);
			res.send(resultJson);
		} else {
			res.send(errorCode.DOCNOTFOUND);
		}
	} catch (err) {
		console.error(err);
		res.send(errorCode.DOCNOTFOUND);
	}
}
/**
 * delete client from database, because of client offline
 * @param {Obj} req request
 * @param {Obj} res respond
 * @param {function} next middleware
 */
async function deleteClient(req, res, next) {
	const clientID = req.body.clientID;
	// const proxyIP = req.body.proxyIP
	try {
		// const result = await Mappings.findOne({ "client.ID": clientID, proxy: proxyIP })
		const result = await Mappings.findOne({ 'client.ID': clientID });
		// if the mappings are found in the database
		if (result) {
			const index = result.client.indexOf(clientID);
			result.client.splice(index, 1);
			result.save();
			res.send({
				code: 200,
				message: 'delete user successfully'
			});
		} else {
			res.send(errorCode.DOCNOTFOUND);
		}
	} catch (err) {
		console.error(err);
		res.send(errorCode.DOCNOTFOUND);
	}
}

/**
 * 1.For each client, if the credit is already over the top, block it.
 * 2.Add credit scoring to all clients in this proxy
 * 3.Randomly redistribute through all proxys and inform clients
 * @param {String} proxy ip address of proxy
 */
async function shuffle(attackVector) {
	return new Promise(async (resolve, reject) => {
		try {
			// first remove
			const result = await redistribute(attackVector);
			console.log('redistribution over');
			const proxy2Clients = result[1];
			const resultMap = result[2];
			const client2Proxy = result[3];
			console.log(client2Proxy);
			informClient(proxy2Clients, client2Proxy);

			saveNewMap(proxy2Clients);
			const resultJson = {};
			resultMap.forEach((value, key) => {
				resultJson[key] = value;
			});

			resolve(JSON.stringify(resultJson));
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
}

/**
 * Add credit to client, now it's only a most simplified version,
 * implementing y = x model
 * @todo When to block the client
 * @param {Obj} client Object {ID, Pass, credit, block, attackTime, attackStrength}
 * @returns {Obj} returns object after adding credit and determine whether should block
 */
function addCredit(client, attackFrequency, attackStrength) {
	if (parseInt(attackStrength) !== 0) {
		client.attackFrequency += 1;
		client.attackStrength += parseInt(attackStrength);
		// client.credit = parameter.alpha * client.attackFrequency + parameter.gamma * client.attackStrength + client.credit
		client.credit = parameter.alpha * attackFrequency + parameter.gamma * attackStrength + parseInt(client.credit);
		// client.credit < 0? client.credit = 0: client.credit = client.credit;
		if (client.timeSlot >= parameter.waitSlot) {
			if (client.credit > 10000) {
				client.block = true;
			}
		}
	}
}

/**
 * Redistribute all client through proxys.
 * This is done by randomly redistribute through all clients.
 * @param {JSON} the mappings of attacked proxy, attack strength and attack frequency
 * @returns {Array} [old proxy->old clients[], new proxy->new clients[], old proxy->[(old clients, new proxy)]]
 */
async function redistribute(attackVector) {
	// console.log('input vector type: ', typeof (attackVector))

	if (typeof attackVector === 'string') {
		attackVector = attackVector.replace(/\'/g, '"');
		attackVector = JSON.parse(attackVector);
	}

	// attackVector = JSON.parse(attackVector)
	// console.log(typeof(attackVector))
	return new Promise(async (resolve, reject) => {
		const clientArray = [];
		let proxyArray = [];
		// proxy->new clients[]
		let proxy2Clients = new Map();
		// client->proxy
		let client2Proxy = new Map();
		try {
			let before = await Mappings.find({});
			before.forEach(element => {
				// if(element.proxy === proxyIP){
				//   element.client.forEach(singleClient => {
				//     addCredit(singleClient, attackFrequency, attackStrength)
				//   })
				// }
				element.client.forEach(singleClient => {
					attackVector.forEach(vector => {
						if (vector.proxy === element.proxy) {
							addCredit(singleClient, vector.attackFrequency, vector.attackStrength);
						}
					});
					singleClient.timeSlot++;
					singleClient.credit -= parameter.beta;
					if (singleClient.credit < 0) {
						singleClient.credit = 0;
					}
				});
				proxyArray.push(element.proxy);
				element.client.forEach(client2 => {
					clientArray.push(client2);
				});
			});
			clientArray.sort(randomSort);
			const evenly = Math.round(clientArray.length / proxyArray.length);
			let clientCount = 0;
			proxyArray.forEach(proxy => {
				let tempClient = [];
				for (let i = 0; i < evenly; i++) {
					if (clientCount < clientArray.length) {
						tempClient.push(clientArray[clientCount]);
						client2Proxy.set(clientArray[clientCount].ID, proxy);
						clientCount++;
					} else break;
				}
				proxy2Clients.set(proxy, tempClient);
			});
			// for those remaining clients
			while (clientCount < clientArray.length) {
				proxy2Clients.get(proxyArray[proxyArray.length - 1]).push(clientArray[clientCount]);
				client2Proxy.set(clientArray[clientCount].ID, proxyArray[proxyArray.length - 1]);
				clientCount++;
			}
			// old proxy->(clientID, newProxy)
			const resultMap = new Map();
			before.forEach(element => {
				let tempClient = [];
				element.client.forEach(client => {
					let newProxy = client2Proxy.get(client.ID);
					tempClient.push({ clientID: client.ID, newProxy: newProxy, block: client.block });
				});
				resultMap.set(element.proxy, tempClient);
			});

			resolve([before, proxy2Clients, resultMap, client2Proxy]);
		} catch (err) {
			console.error('redistributing error: ' + err);
			reject(err);
		}
	});
}
/**
 * For sort method that returns random input value
 * @param {int} a Just a hint for comparing method
 * @param {int} b Just a hint for comparing method
 */
function randomSort(a, b) {
	return Math.random() > 0.5 ? -1 : 1;
}
/**
 * inform all client that connects to proxy to switch
 * @param {Map} proxy2Clients map old proxy->([(old client, new proxy)])
 */
function informClient(proxy2Clients, client2Proxy) {
	return service.informClient(proxy2Clients, client2Proxy);
}

/**
 * Save new mappings
 * @param {Map} newMap new proxy->clients[]
 */
function saveNewMap(newMap) {
	newMap.forEach((value, key) => {
		Mappings.updateOne({ proxy: key }, { client: value }, (err, doc) => {
			if (err) {
				console.error('error updating database: ', err);
			}
			if (doc) {
				// console.log('updating database succefully!')
			}
		});
	});
}

/**
 * Receives attack frequency and strength from proxy
 * save it to all clients that shares the same proxy
 * @param {Obj} req req obj contains attack frequency, attack strength
 * @param {Obj} res response obj contains reaction to proxy
 * @param {next} next middleware
 */
async function attacked(req, res, next) {
	// const proxy = req.body.proxy
	// const attackFrequency = req.body.attackFrequency
	// const attackStrength = req.body.attackStrength
	const { attackVector } = req.body;
	// Mappings.findOne({proxy: proxy}, async (err, doc) => {
	//   if(err){
	//     console.error(err)
	//     res.send(errorCode.DOCNOTFOUND)
	//   }
	//   if(doc){
	//     try {
	//       const result = await Mappings.findOne({proxy: proxy})
	//       if(result) {
	//         // if proxy exists
	//         // invoke shuffle algorithm
	//         const resultJson = await shuffle(proxy, attackFrequency, attackStrength)
	//         console.log('after shuffle')
	//         // after shuffle, send the results to every client so that they switch to anothor proxy
	//         res.send(resultJson)
	//       }else {
	//         res.send(errorCode.DOCNOTFOUND)
	//       }
	//     } catch(err) {
	//       console.error(err)
	//       res.send(errorCode.DOCNOTFOUND)
	//     }
	//   }
	// })
	try {
		console.time('redistribute');
		const resultJson = await shuffle(attackVector);
		if (resultJson) {
			res.send(resultJson);
		} else {
			res.send(errorCode.DOCNOTFOUND);
		}
		console.timeEnd('redistribute');
	} catch (err) {
		console.error(err);
	}
}
/**
 * Distribute client id to client, this is a temporary function that receives client request and distribute a id
 * @todo should be deleted further, or receive from proxy
 * @param {Obj} req Request from client that request client id
 * @param {Obj} res Respond an ID distinguished from previous one
 * @param {Function} next Middleware function
 */
function distributeClientID(req, res, next) {
	let temp = global.ids;
	res.send({
		code: 200,
		message: temp
	});
	global.ids++;
}

/**
 * Written for autonomous attackers to obtain spies.
 * @param {} req nothing in there
 * @param {JSON} res json containing the map of proxy and spy
 * @param {function} next middleware
 */
function getSpy(req, res, next) {
	// Mappings.find({'client.spy': true})
	// .select('proxy client')
	// .select({'client': {$elemMatch: {'spy': true}}})
	// .exec((err, doc) => {
	//   if(err){
	//     console.error('error occurred while finding spies: ', err)
	//     res.send(JSON.stringify({
	//       code: 403,
	//       message: 'error while finding spies'
	//     }))
	//   }
	//   if(doc){
	//     res.send(JSON.stringify(doc))
	//   }
	// })
	client.connect((err, client) => {
		assert.equal(null, err);
		// console.log('connected')
		const db = client.db('Mappings');
		const collection = db.collection('mapping');
		collection.aggregate(
			[
				{
					$project: {
						client: {
							$filter: {
								input: '$client',
								as: 'client',
								cond: { $eq: ['$$client.spy', true] }
							}
						},
						proxy: true
					}
				}
			],
			(err, cursor) => {
				if (err) {
					res.send({
						code: 403,
						message: 'error while finding spies'
					});
				}
				cursor.toArray((err, doc) => {
					// console.log(doc)
					res.send(JSON.stringify(doc));
				});
			}
		);
	});
}

/**
 * another get spy using mongoose
 * @param {none} req get request
 * @param {JSON} res JSON string containing all clients
 * @param {function } next middleware
 */
function getSpy2(req, res, next) {
	Mappings.aggregate([
		{
			$project: {
				client: {
					$filter: {
						input: '$client',
						as: 'client',
						cond: { $eq: ['$$client.spy', true] }
					}
				},
				proxy: true
			}
		}
	]).exec((err, doc) => {
		if (err) {
			res.send({
				code: 403,
				message: 'error while finding spies'
			});
		}
		if (doc) {
			res.send(JSON.stringify(doc));
		}
	});
}
/**
 * This is a test function.
 * This is used to initialize before attack happened
 * @param {none} req plenty request object
 * @param {JSON} res data indicate whether successfully initialized
 * @param {function} next middleware
 */
function initializeBeforeAttack(req, res, next) {
	Mappings.updateMany(
		{},
		{
			$set: {
				'client.$[].credit': 0,
				'client.$[].block': false,
				'client.$[].attackFrequency': 0,
				'client.$[].attackStrength': 0,
				'client.$[].timeSlot': 0
			}
		}
	).exec((err, doc) => {
		if (err) {
			console.error(err);
			res.send({
				code: 50000,
				message: 'error occurred when updating'
			});
		}
		if (doc) {
			res.send({
				code: 20000,
				message: 'update successfully'
			});
		}
	});
}

/**
 * long poll request from client to resume wss connections
 * @param {int} req the id of client
 * @param {JSON} res the json document contains proxy and client
 * @param {function} next middleware
 */
function getProxy(req, res, next) {
	let { id } = req.query;
	id = parseInt(id);
	Mappings.findOne({ 'client.ID': id })
		.select('proxy client')
		.select({ client: { $elemMatch: { ID: id } } })
		.exec((err, doc) => {
			if (err) {
				console.error('error while getting proxy: ', err);
			}
			if (doc) {
				res.send({
					code: 200,
					proxy: doc.proxy,
					client: doc.client[0].ID
				});
			}
		});
}

/**
 * Request from client to acquire the information about whether the client is blocked
 * @param {string} req client id
 * @param {json} res the information about the client
 * @param {function } next middleware
 */
function whetherBlock(req, res, next) {
	const { clientID } = req.body;
	Mappings.findOne({ 'client.ID': clientID })
		.select('client proxy')
		.select({ client: { $elemMatch: { ID: clientID } } })
		.exec((err, client) => {
			if (err) {
				console.error(err);
				res.send({
					code: 50000,
					message: "I don't know what the fuck is happening but it failed!"
				});
			}
			if (client) {
				res.send({
					code: 20000,
					message: client
				});
			}
		});
}

/**
 * function perform the same thing of add domain and select spy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function addDomain(req, res, next) {
	const proxies = [
		'39.98.156.204',
		'39.98.148.77',
		'39.100.106.44',
		'47.92.172.18',
		'39.100.144.204',
		'39.100.255.8',
		'39.100.84.98',
		'39.100.248.86',
		'39.98.155.31',
		'39.98.154.223',
		'39.100.120.192',
		'39.100.247.214',
		'39.100.84.4',
		'39.100.144.98',
		'47.92.222.154',
		'39.98.146.117'
	];
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
				let temp = new Mappings({
					client: tempArr,
					proxy: `${proxy}:3000`
				});
				temp.save();
			});
		}
	});

	Mappings.find({}, (err, doc) => {
		if (err) {
			console.error(err);
		}
		if (doc) {
			console.log(doc);
			doc.forEach(proxy => {
				if (proxy.client.length !== 0) {
					proxy.client.forEach(client => {
						client.spy = false;
					});
				}
			});
			for (let i = 0; i < 70; i++) {
				let idx = Math.floor(Math.random() * doc.length) % doc.length;
				let idx2 = Math.floor(Math.random() * doc[idx].client.length) % doc[idx].client.length;
				doc[idx].client[idx2].spy = true;
			}
			let mapping = new Mappings();
			mapping = doc;
			mapping.forEach(element => {
				element.save();
			});
		}
	});
}
module.exports = {
	clientRegister: clientRegister,
	proxyRegister: proxyRegister,
	requestShuffle: requestShuffle,
	deleteClient: deleteClient,
	redistribute: redistribute,
	shuffle: shuffle,
	attacked: attacked,
	distributeClientID: distributeClientID,
	getSpy: getSpy,
	getSpy2: getSpy2,
	initializeBeforeAttack: initializeBeforeAttack,
	getProxy: getProxy,
	whetherBlock: whetherBlock,
	addDomain: addDomain,
	spyRegister: spyRegister
};
