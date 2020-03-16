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
const service = require('../controllers/services');
const proxies = require('../config/proxies');

// exports.distributeClient = async (req, res, next) => {
// 	let clientID = global.ids++;
// 	let proxy = randomProxy();

// 	try {
// 		if (!(await Mappings.findOne({proxy: proxy, $where: 'this.client.length < this.maxSize'}))) {
// 			proxy = null;
// 		}
// 		res.send({
// 			code: 200,
// 			clientID: clientID,
// 			proxy: proxy
// 		});
// 	} catch (err) {
// 		res.send(errorCode.FAILURE);
// 	}
// };
exports.distributeClient = async (req, res, next) => {
	let clientID = global.ids++;
	let proxy = randomProxy();
	let spy = req.body.spy;

	try {
		let client = {
			ID: clientID,
			pass: '123456',
			credit: 0,
			block: false,
			attackFrequency: 0,
			attackStrength: 0,
			accessTime: new Date(),
			timeSlot: 0,
			spy: spy
		};
		let doc = await Mappings.findOneAndUpdate(
			{ proxy: proxy, $where: 'this.client.length < this.maxSize' },
			{ $push: { client: client } },
			{ new: true }
		);
		if (doc) {
			console.log('Length: ' + doc.client.length);
			res.send({
				code: 200,
				clientID: clientID,
				proxy: proxy
			});
		} else {
			res.send({
				code: 200,
				clientID: clientID,
				proxy: 'null'g
			});
		}
	} catch (err) {
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO()
 * Redistribute proxy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.redistributeClient = async (req, res, next) => {
	// let { clientID, proxy } = req.body;
	// res.send({
	// 	code: 200,
	// 	proxy: randomProxy()
	// });
};

/**
 * TODO(Should be replaced by other algorithm)
 * Get proxy by random
 */
function randomProxy() {
	return proxies[Math.floor(Math.random() * proxies.length)];
}

/**
 * When client is online, push it into the corresponding proxy
 * @param {Object} req request obj
 * @param {Object} res respond obj
 * @param {Object} next middleware
 */
// exports.clientOnline = async (req, res, next) => {
// 	let { clientID, proxy, type } = req.body;

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
// 			spy: Boolean(type)
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
 * When client is offline, pull it from the corresponding proxy
 * @param {Object} req request obj
 * @param {Object} res respond obj
 * @param {Object} next middleware
 */
exports.clientOffline = async (req, res, next) => {
	let { clientID, proxy } = req.body;

	try {
		if (await Mappings.findOneAndUpdate({ proxy: proxy }, { $pull: { client: { ID: clientID } } })) {
			res.send(errorCode.SUCCESS);
		} else {
			res.send(errorCode.DOCNOTFOUND);
		}
	} catch (err) {
		console.log(err);
		res.send(errorCode.FAILURE);
	}
};

/**
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
 * 1.For each client, if the credit is already over the top, block it.
 * 2.Add credit scoring to all clients in this proxy
 * 3.Randomly redistribute through all proxys and inform clients
 * @param {String} proxy ip address of proxy
 */
exports.shuffle = async attackVector => {
	return new Promise(async (resolve, reject) => {
		try {
			// first remove
			let result = await redistribute(attackVector);
			console.log('redistribution over');
			let proxy2Clients = result[1];
			let resultMap = result[2];
			let client2Proxy = result[3];
			console.log(client2Proxy);
			service.informClient(proxy2Clients, client2Proxy);

			saveNewMap(proxy2Clients);
			let resultJson = {};
			resultMap.forEach((value, key) => {
				resultJson[key] = value;
			});

			resolve(JSON.stringify(resultJson));
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
};

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
 * TODO()
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
// exports.attacked = async (req, res, next) => {
// 	let { attackVector } = req.body;

// 	try {
// 		console.time('redistribute');
// 		let resultJson = await this.shuffle(attackVector);
// 		if (resultJson) {
// 			res.send(resultJson);
// 		} else {
// 			res.send(errorCode.DOCNOTFOUND);
// 		}
// 		console.timeEnd('redistribute');
// 	} catch (err) {
// 		console.error(err);
// 	}
// };
exports.attacked = async (req, res, next) => {
	try {
		let clients = [];
		proxies.forEach(async proxy => {
			let doc = await Mappings.findOneAndUpdate({ proxy: proxy }, { client: [] });
			console.log(doc.client);
			clients.push(...doc.client);
		});
		console.log('Number of Clients is: ' + clients.length);

		// let client2Proxy = [];
		// clients.forEach(async client => {
		// 	let level = client.ID % 2;
		// 	let doc = await Mappings.findOneAndUpdate(
		// 		{ level: level, $where: 'this.client.length < this.maxSize' },
		// 		{ $push: { client: client } }
		// 	);
		// 	if (doc) {
		// 		client2Proxy.push([client.ID, proxy]);
		// 	} else {
		// 		client2Proxy.push([client.ID, null]);
		// 	}
		// });
		// console.log('Attack')
		// console.log(client2Proxy);
		res.send(errorCode.SUCCESS);
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * Written for autonomous attackers to obtain spies.
 * @param {} req nothing in there
 * @param {JSON} res json containing the map of proxy and spy
 * @param {function} next middleware
 */
exports.getSpy = (req, res, next) => {
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
};

/**
 * This is a test function.
 * This is used to initialize before attack happened
 * @param {none} req plenty request object
 * @param {JSON} res data indicate whether successfully initialized
 * @param {function} next middleware
 */
exports.initializeBeforeAttack = (req, res, next) => {
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
};

/**
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
 * Request from client to acquire the information about whether the client is blocked
 * @param {string} req client id
 * @param {json} res the information about the client
 * @param {function } next middleware
 */
exports.whetherBlock = (req, res, next) => {
	let { clientID } = req.body;
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
};

/**
 * TODO(Remove)
 * function perform the same thing of add domain and select spy
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.addDomain = (req, res, next) => {
	// let proxies = [
	// 	'39.98.156.204',
	// 	'39.98.148.77',
	// 	'39.100.106.44',
	// 	'47.92.172.18',
	// 	'39.100.144.204',
	// 	'39.100.255.8',
	// 	'39.100.84.98',
	// 	'39.100.248.86',
	// 	'39.98.155.31',
	// 	'39.98.154.223',
	// 	'39.100.120.192',
	// 	'39.100.247.214',
	// 	'39.100.84.4',
	// 	'39.100.144.98',
	// 	'47.92.222.154',
	// 	'39.98.146.117'
	// ];
	Mappings.remove({}, err => {
		if (err) {
			console.error('error removing old:', err);
		} else {
			// let count = 0;
			proxies.forEach(proxy => {
				new Mappings({
					client: [],
					proxy: `${proxy}`
				}).save();
				// let tempArr = [];
				// for (let i = 0; i < 10; i++) {
				// 	let tempClient = {
				// 		ID: count,
				// 		pass: '123456',
				// 		credit: 0,
				// 		block: false,
				// 		attackFrequency: 0,
				// 		attackStrength: 0,
				// 		accessTime: new Date(),
				// 		timeSlot: 0,
				// 		spy: false
				// 	};
				// 	tempArr.push(tempClient);
				// 	count++;
				// }
				// let temp = new Mappings({
				// 	client: tempArr,
				// 	proxy: `${proxy}:3000`
				// });
				// temp.save();
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
};
