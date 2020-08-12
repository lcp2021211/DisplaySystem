/**
 * @file Services that are non-block actions and should be running background.
 * @author Song Chengru
 * created at 3/28/2019, 3:45:49 PM
 */

// const os = require('os');
// const assert = require('assert');
// const ProxyModel = require('../models/proxy');
// const Mappings = require('../models/proxyToClient');
const axios = require('axios');
const crypto = require('crypto');
const si = require('systeminformation');
const Users = require('../models/users');
const proxies = require('../config/proxies');
const ClientModel = require('../models/client');
const errorCode = require('../config/errorCode');

/**
 * inform all clients that's connected to old proxy
 * @param {Map} proxy2Clients old proxy->(client, new proxy)
 * @function informClient(proxy2Clients)
 */
// exports.informClient = (proxy2Clients, client2Proxy) => {
// 	let content = [];
// 	client2Proxy.forEach((proxy, client) => {
// 		content.push([client, proxy]);
// 	});
// 	console.log(client2Proxy);
// 	proxy2Clients.forEach((value, key) => {
// 		axios.post('http://' + key + '/reconnect', content, (err, res) => {
// 			if (err) console.error(err);
// 			else console.log(res.body);
// 		});
// 	});
// };

exports.informClient = (client2Proxy) => {
	proxies.forEach((proxy) => {
		axios.post(`http://${proxy}/reconnect`, client2Proxy, (err, res) => {
			if (err) {
				console.error(err);
			} else {
				console.log('Inform Client Success');
			}
		});
	});
};

/**
 * Login with username and password
 * @param {string, string} req Username and password of user
 * @param {string} res token that maintain session
 * @param {function} next middleware
 */
// exports.LoginByUsername = (req, res, next) => {
// 	let { username, password } = req.body;
// 	console.log(username, password);
// 	Users.findOne({ username: username }, (err, user) => {
// 		if (err) {
// 			res.send({
// 				code: 50001,
// 				message: 'User not found',
// 			});
// 			console.error(err);
// 		}
// 		if (user) {
// 			if (user.password === password) {
// 				let token = crypto
// 					.createHash('sha256')
// 					.update(username + password + new Date())
// 					.digest('hex');
// 				Users.updateOne({ username: username }, { $set: { token: token } }, (err, doc) => {
// 					if (err) {
// 						res.send({
// 							code: 50002,
// 							message: 'Error while updating token!',
// 						});
// 					}
// 					if (doc) {
// 						res.send({
// 							code: 20000,
// 							message: token,
// 						});
// 					}
// 				});
// 			} else {
// 				res.send({
// 					code: 50002,
// 					message: 'Wrong password!',
// 				});
// 			}
// 		}
// 	});
// };

/**
 * Get detailed user info through query parameters
 * @param {token} req from query parameters, the token of user
 * @param {JSON} res a JSON object contains the information of the user
 * @param {function} next middleware
 */
// exports.getUserInfo = (req, res, next) => {
// 	let { token } = req.query;
// 	console.log(token);
// 	Users.findOne({ token: token }, (err, userInfo) => {
// 		if (err) {
// 			res.send({
// 				code: 50001,
// 				message: 'Error while finding user!',
// 			});
// 		}
// 		if (userInfo) {
// 			res.send({
// 				code: 20000,
// 				data: {
// 					roles: userInfo.roles,
// 					introduction: userInfo.introduction,
// 					avatar: userInfo.avatar,
// 					name: userInfo.name,
// 				},
// 			});
// 		} else {
// 			res.send({
// 				code: 50002,
// 				message: 'token expired!',
// 			});
// 		}
// 	});
// };

/**
 * TODO(=====================Model 2=====================)
 * Written for autonomous attackers to obtain spies.
 * @param {} req nothing in there
 * @param {JSON} res json containing the map of proxy and spy
 * @param {function} next middleware
 */
exports.getSpy = async (req, res, next) => {
	try {
		let doc = await ClientModel.find({ spy: true, proxy: { $ne: 'null' } });
		if (doc) {
			res.send({
				code: 200,
				data: doc,
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
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getSpyPercent = async (req, res, next) => {
	try {
		let total = await ClientModel.find({ proxy: { $ne: 'null' } });
		let spy = await ClientModel.find({ spy: true, proxy: { $ne: 'null' } });
		if (total && spy) {
			res.send({
				code: 200,
				data: (100 * spy.length) / total.length,
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
 * The client request in 1s interval to get system information, this is the
 * @param {none} req request body is empty
 * @param {integer, integer} res cpu usage and memory usage of the current reverse proxy
 * @param {function} next middleware
 */
exports.getServerInfo = (req, res, next) => {
	si.getDynamicData().then((data) => {
		res.send({
			code: 200,
			cpuSpeed: data.cpuCurrentspeed.avg,
			cpuLoad: data.currentLoad.currentload,
			memUsed: data.mem.used / 1073741824,
			memActive: data.mem.active / 1073741824,
			memFree: data.mem.free / 1073741824,
			fsRX: data.fsStats.rx_sec / 1048576,
			fsWX: data.fsStats.wx_sec / 1048576,
			fsTX: data.fsStats.tx_sec / 1048576,
			netRX: data.networkStats[0].rx_sec / 1048576,
			netTX: data.networkStats[0].tx_sec / 1048576,
		});
	});
};

/**
 * get all system information from every reverse proxy
 * @param {} req plain post request
 * @param {array} res an array contains usage
 * @param {function} next middleware
 */
exports.getProxyInfo = (req, res, next) => {
	let requests = [];
	for (let proxy of proxies) {
		requests.push(axios.get(`http://${proxy}/getSysInfo`));
	}
	axios.all(requests).then(
		axios.spread((...responses) => {
			let data = {};
			for (let i in proxies) {
				data[proxies[i]] = responses[i].data;
			}
			res.send({
				code: 200,
				data: data,
			});
		})
	);
};

/**
 * TODO(=====================Model 1=====================)
 * set client network information
 * @param {string} req clientID, delay time for a chunk and the current client download speed
 * @param {none} res response code
 * @param {function} next middleware
 */
// exports.setClientNetworkInfo = async (req, res, next) => {
// 	let { clientID, networkSpeed, networkDelay } = req.body;
// 	if (
// 		await Mappings.updateOne(
// 			{ 'client.ID': clientID },
// 			{ $set: { 'client.$.networkSpeed': networkSpeed, 'client.$.networkDelay': networkDelay } }
// 		)
// 	) {
// 		res.send(errorCode.SUCCESS);
// 	} else {
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 1=====================)
 * return the information of all clients
 * @param {none} req
 * @param {map} res a map of all network information of current clients
 * @param {function} next middleware
 */
// exports.getClientNetworkInfo = async (req, res, next) => {
// 	let doc = await Mappings.find({});
// 	if (doc) {
// 		res.send({
// 			code: 200,
// 			data: doc
// 		});
// 	} else {
// 		res.send(errorCode.FAILURE);
// 	}
// };

/**
 * TODO(=====================Model 2=====================)
 * set client network information
 * @param {string} req clientID, delay time for a chunk and the current client download speed
 * @param {none} res response code
 * @param {function} next middleware
 */
exports.setClientNetworkInfo = async (req, res, next) => {
	let { clientID, networkSpeed, networkDelay } = req.body;

	try {
		if (await ClientModel.updateOne({ ID: clientID }, { networkSpeed: networkSpeed, networkDelay: networkDelay })) {
			res.send(errorCode.SUCCESS);
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
 * return the information of all clients
 * @param {none} req
 * @param {map} res a map of all network information of current clients
 * @param {function} next middleware
 */
exports.getClientNetworkInfo = async (req, res, next) => {
	try {
		let doc = await ClientModel.find({ proxy: { $ne: 'null' } });
		if (doc) {
			res.send({
				code: 200,
				data: doc,
			});
		} else {
			res.send(errorCode.FAILURE);
		}
	} catch (err) {
		console.error(err);
		res.send(errorCode.FAILURE);
	}
};
