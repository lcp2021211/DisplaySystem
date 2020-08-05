/**
 * @file NMTD MOTAT architecture 1.0 <br>
 !!!!DO NOT open source, this is a CONFIDENTIAL PROGRAM <br>
 This is main controller, handling request from proxys,
 including shuffle request and handling request, applying shuffle policies, 
 redistributing clients and proxies, and inform proxies of the changes.
 @author Song Chengru created at 3/28/2019, 4:12:27 PM
 */

const Mappings = require('../models/proxyToClient');
const errorCode = require('../config/errorCode');
const parameter = require('../config/basics');
const service = require('./service');

const ProxyModel = require('../models/proxy');
const ClientModel = require('../models/client');

/**
 * TODO(=====================Model 1=====================)
 * Distribute clients for the first time
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// exports.distributeClient = async (req, res, next) => {
// 	let clientID = global.ids++;
// 	let proxy = 'null';
// 	let spy = req.body.spy;
//
// 	try {
// 		let client = {
// 			ID: clientID,
// 			pass: '123456',
// 			credit: 0,
// 			block: false,
// 			attackFrequency: 0,
// 			attackStrength: 0,
// 			accessTime: new Date(),
// 			timeSlot: 0,
// 			spy: spy
// 		};
// 		// Find proxy which isn't full
// 		let doc = await Mappings.findOneAndUpdate(
// 			{ $where: 'this.client.length < this.maxSize' },
// 			{ $push: { client: client } },
// 			{ new: true }
// 		);
// 		// If find, set the proxy value
// 		if (doc) {
// 			console.log('Length: ' + doc.client.length);
// 			proxy = doc.proxy;
// 		}
// 		res.send({
// 			code: 200,
// 			clientID: clientID,
// 			proxy: proxy
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 1=====================)
 * Redistribute proxy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
// exports.redistributeClient = async (req, res, next) => {
// 	let { clientID, proxy } = req.body;
// 	res.send({
// 		code: 200,
// 		proxy: randomProxy()
// 	});
// };

/**
 * TODO(=====================Model 1=====================)
 * When client is online, push it into the corresponding proxy
 * @param {Object} req request obj
 * @param {Object} res respond obj
 * @param {Object} next middleware
 */
// exports.clientOnline = async (req, res, next) => {
// 	let { clientID, proxy, spy } = req.body;

// 	try {
// 		let client = {
// 			ID: clientID,
// 			pass: '123456',
// 			credit: 0,
// 			block: false,
// 			attackFrequency: 0,
// 			attackStrength: 0,
// 			accessTime: new Date(),
// 			timeSlot: 0,
// 			spy: Boolean(spy)
// 		};
// 		let doc = await Mappings.findOneAndUpdate(
// 			{ proxy: proxy, $where: 'this.client.length < this.maxSize' },
// 			{ $push: { client: client } },
// 			{ new: true }
// 		);
// 		if (doc) {
// 			console.log('Length: ' + doc.client.length);
// 			res.send(errorCode.SUCCESS);
// 		} else {
// 			res.send(errorCode.DOCNOTFOUND);
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 1=====================)
 * When client is offline, pull it from the corresponding proxy
 * @param {Object} req request obj
 * @param {Object} res respond obj
 * @param {Object} next middleware
 */
// exports.clientOffline = async (req, res, next) => {
// 	let { clientID, proxy } = req.body;

// 	try {
// 		if (await Mappings.updateOne({ proxy: proxy }, { $pull: { client: { ID: clientID } } })) {
// 			res.send(errorCode.SUCCESS);
// 		} else {
// 			res.send(errorCode.DOCNOTFOUND);
// 		}
// 	} catch (err) {
// 		console.log(err);
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 1=====================)
 * Get proxy ip from req.ip and add the proxy ip to trusted proxys,
 * Update database with empty clients array and proxy ip
 * TODO(Authentication of the request ip address)
 * @param {Obj} req request
 * @param {Obj} res respond
 * @param {function} next middleware
 */
exports.proxyRegister = async (req, res, next) => {
	let proxy = req.body;
	try {
		if (await Mappings.findOne({ proxy: proxy })) {
			res.send({
				code: 50000,
				message: 'already exists proxy'
			});
		} else {
			if (await new Mappings({ proxy: proxy, client: [] }).save()) {
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
};

/**
 * TODO(=====================Model 1=====================)
 * when a proxy request to shuffle because it is under attack
 * @param {Obj} req request: req.ip for proxy ip address
 * @param {Obj} res respond: respond to request
 * @param {function} next middleware
 */
exports.requestShuffle = async (req, res, next) => {
	let proxy = req.body.proxy;
	try {
		if (await Mappings.findOne({ proxy: proxy })) {
			// If proxy exists, invoke shuffle algorithm
			let resultJson = await shuffle(proxy, result.client);
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
};

/**
 * TODO(=====================Model 1=====================)
 * 1.For each client, if the credit is already over the top, block it.
 * 2.Add credit scoring to all clients in this proxy
 * 3.Randomly redistribute through all proxys and inform clients
 * @param {String} proxy ip address of proxy
 */
// exports.shuffle = async attackVector => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			// first remove
// 			let result = await redistribute(attackVector);
// 			console.log('redistribution over');
// 			let proxy2Clients = result[1];
// 			let resultMap = result[2];
// 			let client2Proxy = result[3];
// 			console.log(client2Proxy);
// 			service.informClient(proxy2Clients, client2Proxy);

// 			saveNewMap(proxy2Clients);
// 			let resultJson = {};
// 			resultMap.forEach((value, key) => {
// 				resultJson[key] = value;
// 			});

// 			resolve(JSON.stringify(resultJson));
// 		} catch (err) {
// 			console.error(err);
// 			reject(err);
// 		}
// 	});
// };

/**
 * TODO(=====================Model 1=====================)
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
 * TODO(=====================Model 1=====================)
 * Redistribute all client through proxys.
 * This is done by randomly redistribute through all clients.
 * @param {JSON} the mappings of attacked proxy, attack strength and attack frequency
 * @returns {Array} [old proxy->old clients[], new proxy->new clients[], old proxy->[(old clients, new proxy)]]
 */
exports.redistribute = async attackVector => {
	// console.log('input vector type: ', typeof (attackVector))

	if (typeof attackVector === 'string') {
		attackVector = attackVector.replace(/\'/g, '"');
		attackVector = JSON.parse(attackVector);
	}

	// attackVector = JSON.parse(attackVector)
	// console.log(typeof(attackVector))
	return new Promise(async (resolve, reject) => {
		let clientArray = [];
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
			clientArray.sort((a, b) => {
				return Math.random() > 0.5 ? -1 : 1;
			});
			let evenly = Math.round(clientArray.length / proxyArray.length);
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
			let resultMap = new Map();
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
};

/**
 * TODO(=====================Model 1=====================)
 * Save new mappings
 * @param {Map} newMap new proxy->clients[]
 */
// function saveNewMap(newMap) {
// 	newMap.forEach((value, key) => {
// 		Mappings.updateOne({ proxy: key }, { client: value }, (err, doc) => {
// 			if (err) {
// 				console.error('error updating database: ', err);
// 			}
// 			if (doc) {
// 				// console.log('updating database succefully!')
// 			}
// 		});
// 	});
// }

/**
 * TODO(=====================Model 1=====================)
 * Receives attack frequency and strength from proxy
 * save it to all clients that shares the same proxy
 * @param {Obj} req req obj contains attack frequency, attack strength
 * @param {Obj} res response obj contains reaction to proxy
 * @param {next} next middleware
 */
exports.attacked = async (req, res, next) => {
	let { attackVector } = req.body;

	try {
		console.time('redistribute');
		let resultJson = await this.shuffle(attackVector);
		if (resultJson) {
			res.send(resultJson);
		} else {
			res.send(errorCode.DOCNOTFOUND);
		}
		console.timeEnd('redistribute');
	} catch (err) {
		console.error(err);
	}
};

/**
 * TODO(=====================Model 1=====================)
 */
// exports.shuffle = async (req, res, next) => {
// 	try {
// 		let clients = [];
// 		for (let proxy of proxyPool) {
// 			let doc = await Mappings.findOneAndUpdate({ proxy: proxy }, { client: [] });
// 			clients.push(...doc.client);
// 		}

// 		let client2Proxy = [];
// 		for (let client of clients) {
// 			// TODO(Change the computation of level)
// 			let level = client.ID % 2;
// 			let doc = await Mappings.findOneAndUpdate(
// 				{ level: level, $where: 'this.client.length < this.maxSize' },
// 				{ $push: { client: client } }
// 			);
// 			if (doc) {
// 				client2Proxy.push([client.ID, doc.proxy]);
// 			} else {
// 				client2Proxy.push([client.ID, 'null']);
// 			}
// 		}
// 		service.informClient(client2Proxy);
// 		res.send(errorCode.SUCCESS);
// 	} catch (err) {
// 		console.error(err);
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 1=====================)
 * Written for autonomous attackers to obtain spies.
 * @param {} req nothing in there
 * @param {JSON} res json containing the map of proxy and spy
 * @param {function} next middleware
 */
// exports.getSpy = (req, res, next) => {
// 	Mappings.aggregate([
// 		{
// 			$project: {
// 				client: {
// 					$filter: {
// 						input: '$client',
// 						as: 'client',
// 						cond: { $eq: ['$$client.spy', true] }
// 					}
// 				},
// 				proxy: true
// 			}
// 		}
// 	]).exec((err, doc) => {
// 		if (err) {
// 			res.send({
// 				code: 403,
// 				message: 'error while finding spies'
// 			});
// 		}
// 		if (doc) {
// 			res.send(JSON.stringify(doc));
// 		}
// 	});
// };

/**
 * TODO(=====================Model 1=====================)
 * This is a test function.
 * This is used to initialize before attack happened
 * @param {none} req plenty request object
 * @param {JSON} res data indicate whether successfully initialized
 * @param {function} next middleware
 */
// exports.initializeBeforeAttack = (req, res, next) => {
// 	Mappings.updateMany(
// 		{},
// 		{
// 			$set: {
// 				'client.$[].credit': 0,
// 				'client.$[].block': false,
// 				'client.$[].attackFrequency': 0,
// 				'client.$[].attackStrength': 0,
// 				'client.$[].timeSlot': 0
// 			}
// 		}
// 	).exec((err, doc) => {
// 		if (err) {
// 			console.error(err);
// 			res.send({
// 				code: 50000,
// 				message: 'error occurred when updating'
// 			});
// 		}
// 		if (doc) {
// 			res.send({
// 				code: 20000,
// 				message: 'update successfully'
// 			});
// 		}
// 	});
// };

/**
 * TODO(=====================Model 1=====================)
 * long poll request from client to resume wss connections
 * @param {int} req the id of client
 * @param {JSON} res the json document contains proxy and client
 * @param {function} next middleware
 */
exports.getProxy = (req, res, next) => {
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
};

/**
 * TODO(=====================Model 1=====================)
 * Request from client to acquire the information about whether the client is blocked
 * @param {string} req client id
 * @param {json} res the information about the client
 * @param {function } next middleware
 */
// exports.whetherBlock = async (req, res, next) => {
// 	let { clientID } = req.body;
// 	let doc = await Mappings.findOne({ 'client.ID': clientID }).select({ client: { $elemMatch: { ID: clientID } } });
// 	if (doc) {
// 		res.send({
// 			code: 200,
// 			message: doc[0].block
// 		});
// 	} else {
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 2=====================)
 */
exports.distributeClient = async (req, res, next) => {
	let clientID = global.ids++;
	let proxy = 'null';

	try {
		let doc = await ProxyModel.find({ $where: 'this.size < this.capacity' });
		if (doc) {
			proxy = doc[Math.floor(Math.random() * doc.length)].proxy;
		}
		res.send({
			code: 200,
			clientID: clientID,
			proxy: proxy
		});
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 * Redistribute proxy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.redistributeClient = async (req, res, next) => {
	let proxy = 'null';

	try {
		let doc = await ProxyModel.find({ $where: 'this.size < this.capacity' });
		if (doc) {
			proxy = doc[Math.floor(Math.random() * doc.length)].proxy;
		}
		res.send({
			code: 200,
			proxy: proxy
		});
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 */
exports.clientOnline = async (req, res, next) => {
	let { clientID, proxy, spy } = req.body;

	try {
		if (!(await ClientModel.findOne({ ID: clientID }))) {
			await ClientModel({
				ID: clientID,
				proxy: proxy,
				pass: '123456',
				accessTime: new Date(),
				spy: spy
			}).save();
		}
		let doc = await ProxyModel.findOneAndUpdate({ proxy: proxy }, { $inc: { size: 1 } }, { new: true });
		if (doc.size <= doc.capacity) {
			await ClientModel.updateOne({ ID: clientID }, { proxy: proxy });
			// console.log('ClientOnline Success: ' + clientID + ', ' + proxy);
			res.send(errorCode.SUCCESS);
		} else {
			// console.log('ClientOnline Failed: ' + clientID + ', ' + proxy);
			await ClientModel.updateOne({ ID: clientID }, { proxy: 'null' });
			res.send(errorCode.FAILURE);
		}
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 */
exports.clientOffline = async (req, res, next) => {
	let { clientID, proxy } = req.body;
	try {
		await ClientModel.updateOne({ ID: clientID }, { proxy: 'null' });
		await ProxyModel.updateOne({ proxy: proxy }, { $inc: { size: -1 } });
		// console.log('ClientOffline Success: ' + clientID + ', ' + proxy);
		res.send(errorCode.SUCCESS);
	} catch (err) {
		console.log(err);
		// console.log('ClientOffline Failed: ' + clientID + ', ' + proxy);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 */
exports.shuffle = async (req, res, next) => {
	let client2Proxy = [];
	let proxies = {};

	try {
		let clients = await ClientModel.find({ proxy: { $ne: 'null' } });
		(await ProxyModel.find({})).forEach(e => {
			proxies[e.proxy] = { size: 0, capacity: e.capacity, level: e.level };
		});

		clients.forEach(client => {
			let level = client.ID % 2;
			let proxy = 'null';
			for (let i in proxies) {
				if (proxies[i].level === level && proxies[i].size < proxies[i].capacity) {
					proxy = i;
					proxies[i].size++;
					break;
				}
			}
			client2Proxy.push([client.ID, proxy]);
		});

		console.log(client2Proxy);
		service.informClient(client2Proxy);
		res.send(errorCode.SUCCESS);
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 * Request from client to acquire the information about whether the client is blocked
 * @param {string} req client id
 * @param {json} res the information about the client
 * @param {function } next middleware
 */
exports.whetherBlock = async (req, res, next) => {
	let clientID = req.body;

	try {
		let doc = await ClientModel.findOne({ ID: clientID });
		if (doc) {
			res.send({
				code: 200,
				message: doc.block
			});
		} else {
			res.send(errorCode.FAILURE);
		}
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 * This is a test function.
 * This is used to initialize before attack happened
 * @param {none} req plenty request object
 * @param {JSON} res data indicate whether successfully initialized
 * @param {function} next middleware
 */
exports.initializeBeforeAttack = async (req, res, next) => {
	try {
		let doc = ClientModel.updateMany(
			{},
			{ credit: 0, block: false, attackFrequency: 0, attackStrength: 0, timeSlot: 0 }
		);
		if (doc) {
			res.send(errorCode.SUCCESS);
		} else {
			res.send(errorCode.FAILURE);
		}
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};
