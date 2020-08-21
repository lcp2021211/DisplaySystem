/**
 * @file NMTD MOTAT architecture 1.0 <br>
 !!!!DO NOT open source, this is a CONFIDENTIAL PROGRAM <br>
 This is main controller, handling request from proxys,
 including shuffle request and handling request, applying shuffle policies, 
 redistributing clients and proxies, and inform proxies of the changes.
 @author Song Chengru created at 3/28/2019, 4:12:27 PM
 */

const errorCode = require('../config/errorCode');
const parameter = require('../config/basics');
const service = require('./service');

const ProxyModel = require('../models/proxy');
const ClientModel = require('../models/client');

/**
 * TODO(=====================Model 2=====================)
 */
exports.attacked = async (req, res, next) => {
	let { attackVector } = req.body;

	try {
		if (typeof attackVector === 'string') {
			attackVector = attackVector.replace(/\'/g, '"');
			attackVector = JSON.parse(attackVector);
		}

		console.log(attackVector);

		for (let v of attackVector) {
			await ProxyModel.findOneAndUpdate(
				{ proxy: v.proxy },
				{ $inc: { attackFrequency: v.attackFrequency, attackStrength: v.attackStrength } }
			);
		}

		let clients = await ClientModel.find({});

		clients.forEach(async (client) => {
			for (let v of attackVector) {
				if (client.proxy === v.proxy) {
					client.attackStrength += v.attackStrength;
					client.attackFrequency += v.attackFrequency;
					client.credit += parameter.alpha * v.attackFrequency + parameter.gamma * v.attackStrength;
					if (client.timeSlot >= parameter.waitSlot && client.credit >= parameter.maxCredit) {
						client.block = true;
					}
					break;
				}
			}
			client.timeSlot++;
			if (client.block === false) {
				client.credit = Math.max(client.credit - parameter.beta, 0);
			}
			await client.save();
		});

		let proxies = [];
		(await ProxyModel.find({})).forEach((e) => {
			proxies.push(e.proxy);
		});

		let client2Proxy = [];
		clients.forEach((client) => {
			client2Proxy.push([client.ID, proxies[Math.floor(Math.random() * proxies.length)]]);
		});

		// TODO(不切换)
		service.informClient(client2Proxy);
		res.send(errorCode.SUCCESS);
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};

/**
 * TODO(=====================Model 2=====================)
 */
exports.distributeClient = async (req, res, next) => {
	let clientID = global.ids++;

	try {
		// let doc = await ProxyModel.find({ $where: 'this.size < this.capacity' });
		let doc = await ProxyModel.find({});
		if (doc) {
			proxy = doc[Math.floor(Math.random() * doc.length)].proxy;
		}
		res.send({
			code: 200,
			clientID: clientID,
			proxy: proxy,
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
	try {
		// let doc = await ProxyModel.find({ $where: 'this.size < this.capacity' });
		let doc = await ProxyModel.find({});
		if (doc) {
			let proxy = doc[Math.floor(Math.random() * doc.length)].proxy;
			res.send({
				code: 200,
				proxy: proxy,
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
				spy: spy,
			}).save();
		}
		// let doc = await ProxyModel.findOneAndUpdate({ proxy: proxy }, { $inc: { size: 1 } }, { new: true });
		await ClientModel.updateOne({ ID: clientID }, { proxy: proxy });
		res.send(errorCode.SUCCESS);
		// if (doc.size <= doc.capacity) {
		// 	await ClientModel.updateOne({ ID: clientID }, { proxy: proxy });
		// 	// console.log('ClientOnline Success: ' + clientID + ', ' + proxy);
		// 	res.send(errorCode.SUCCESS);
		// } else {
		// 	// console.log('ClientOnline Failed: ' + clientID + ', ' + proxy);
		// 	await ClientModel.updateOne({ ID: clientID }, { proxy: 'null' });
		// 	res.send(errorCode.FAILURE);
		// }
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
		// await ClientModel.updateOne({ ID: clientID }, { proxy: 'null' });
		// await ProxyModel.updateOne({ proxy: proxy }, { $inc: { size: -1 } });
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
	try {
		let clients = await ClientModel.find({});
		let proxies = [];
		(await ProxyModel.find({})).forEach((e) => {
			proxies.push(e.proxy);
		});

		let client2Proxy = [];
		clients.forEach((client) => {
			client2Proxy.push([client.ID, proxies[Math.floor(Math.random() * proxies.length)]]);
		});
		// (await ProxyModel.find({})).forEach(e => {
		// 	proxies[e.proxy] = { size: 0, capacity: e.capacity, level: e.level };
		// });

		// clients.forEach(client => {
		// 	let level = client.ID % 2;
		// 	let proxy = 'null';
		// 	for (let i in proxies) {
		// 		if (proxies[i].level === level && proxies[i].size < proxies[i].capacity) {
		// 			proxy = i;
		// 			proxies[i].size++;
		// 			break;
		// 		}
		// 	}
		// 	client2Proxy.push([client.ID, proxy]);
		// });

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
	let { clientID } = req.body;

	try {
		let doc = await ClientModel.findOne({ ID: clientID });
		if (doc) {
			res.send({
				code: 200,
				block: doc.block,
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
 * @param {
 	JSON
 }
 res data indicate whether successfully initialized
 * @param {function} next middleware
 */
exports.initializeBeforeAttack = async (req, res, next) => {
	try {
		let doc = await ClientModel.updateMany(
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
