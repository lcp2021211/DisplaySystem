/**
 * @file NMTD MOTAT architecture 1.0 <br>
 !!!!DO NOT open source, this is a CONFIDENTIAL PROGRAM <br>
 This is the view controller that handles all events related to presentation.
 @author Song Chengru created at 2019-06-06 16:29:30
 */

const Users = require('../models/users');
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const os = require('os');
const service = require('./services');
// global.realTime = new Map();
/**
 * Login with username and password
 * @param {string, string} req Username and password of user
 * @param {string} res token that maintain session
 * @param {function} next middleware
 */
function LoginByUsername(req, res, next) {
	const { username, password } = req.body;
	console.log(username, password);
	Users.findOne({ username: username }, (err, user) => {
		if (err) {
			res.send({
				code: 50001,
				message: 'User not found'
			});
			console.error(err);
		}
		if (user) {
			if (user.password === password) {
				const token = crypto
					.createHash('sha256')
					.update(username + password + new Date())
					.digest('hex');
				Users.updateOne({ username: username }, { $set: { token: token } }, (err, doc) => {
					if (err) {
						res.send({
							code: 50002,
							message: 'Error while updating token!'
						});
					}
					if (doc) {
						res.send({
							code: 20000,
							message: token
						});
					}
				});
			} else {
				res.send({
					code: 50002,
					message: 'Wrong password!'
				});
			}
		}
	});
}

/**
 * Get detailed user info through query parameters
 * @param {token} req from query parameters, the token of user
 * @param {JSON} res a JSON object contains the information of the user
 * @param {function} next middleware
 */
function getUserInfo(req, res, next) {
	const { token } = req.query;
	console.log(token);
	Users.findOne({ token: token }, (err, userInfo) => {
		if (err) {
			res.send({
				code: 50001,
				message: 'Error while finding user!'
			});
		}
		if (userInfo) {
			res.send({
				code: 20000,
				data: {
					roles: userInfo.roles,
					introduction: userInfo.introduction,
					avatar: userInfo.avatar,
					name: userInfo.name
				}
			});
		} else {
			res.send({
				code: 50002,
				message: 'token expired!'
			});
		}
	});
}

/**
 * Written for autonomous attackers to obtain spies.
 * @param {} req nothing in there
 * @param {JSON} res json containing the map of proxy and spy
 * @param {function} next middleware
 */
function getSpy(req, res, next) {
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
					res.send({
						code: 20000,
						data: doc
					});
				});
			}
		);
	});
}

/**
 * The client request in 1s interval to get system information, this is the
 * @param {none} req request body is empty
 * @param {integer, integer} res cpu usage and memory usage of the current reverse proxy
 * @param {function} next middleware
 */
function getSysInfo(req, res, next) {
	const cpuUsage = os.loadavg()[0];
	const totalmem = os.totalmem();
	const freemem = os.freemem();
	const memUsage = (totalmem - freemem) / totalmem;
	res.send({
		code: 20000,
		data: {
			cpuUsage: cpuUsage,
			memUsage: memUsage
		}
	});
}

/**
 * get all system information from every reverse proxy
 * @param {} req plain post request
 * @param {array} res an array contains usage
 * @param {function} next middleware
 */
function getSysUsage(req, res, next) {
	service
		.getRuntime()
		.then(resultArr => {
			res.send({
				code: 20000,
				data: {
					usage: resultArr
				}
			});
		})
		.catch(err => {
			console.error(err);
			res.send({
				code: 50000,
				data: {
					message: 'error while sending messages'
				}
			});
		});
}

/**
 * set client network information
 * @param {string} req clientID, delay time for a chunk and the current client download speed
 * @param {none} res response code
 * @param {function} next middleware
 */
function setClientNetworkInfo(req, res, next) {
	// const { clientID, delayTime, networkSpeed } = req.body
	// global.realTime.set(clientID, {'delayTime': delayTime, 'networkSpeed': networkSpeed})
	// res.send({
	//   code: 20000,
	//   message: 'update successfully!'
	// })
	const { clientID, proxy, delayTime, networkSpeed } = req.body;
	global.realTime.set(clientID, { proxy: proxy, delayTime: delayTime, networkSpeed: networkSpeed });
	res.send({
		code: 20000,
		message: 'update successfully!'
	});
}
/**
 * return the information of all clients
 * @param {none} req
 * @param {map} res a map of all network information of current clients
 * @param {function} next middleware
 */
function getClientNetworkInfo(req, res, next) {
	const clientArr = [];
	global.realTime.forEach((elem, key) => {
		elem['clientID'] = key;
		clientArr.push(elem);
	});
	res.send({
		code: 20000,
		data: clientArr
	});
}

/**
 * Clear all clients in the view
 * @param {none} req
 * @param {JSON} res indication whether succefully updated real time global obj
 * @param {function} next middleware
 */
function clearClient(req, res, next) {
	global.realTime = new Map();
	res.send({
		code: 20000,
		data: {
			message: 'clear succefully'
		}
	});
}

module.exports = {
	LoginByUsername: LoginByUsername,
	getUserInfo: getUserInfo,
	getSpy: getSpy,
	getSysInfo: getSysInfo,
	getSysUsage: getSysUsage,
	setClientNetworkInfo: setClientNetworkInfo,
	getClientNetworkInfo: getClientNetworkInfo,
	clearClient: clearClient
};
