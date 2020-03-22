/**
 * @file Services that are non-block actions and should be running background.
 * @author Song Chengru
 * created at 3/28/2019, 3:45:49 PM
 */
const axios = require('axios');
const proxies = require('../config/proxies');
const Mappings = require('../models/proxyToClient');

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
exports.informClient = client2Proxy => {
	// console.log(client2Proxy);
	proxies.forEach(proxy => {
		axios.post(`http://${proxy}/reconnect`, client2Proxy, (err, res) => {
			if (err) {
				console.error(err);
			} else {
				console.log('Inform Client Success');
			}
		})
	});
};

exports.getRuntime = () => {
	return new Promise((resolve, reject) => {
		Mappings.find({}, async (err, doc) => {
			if (err) {
				console.error(err);
			}
			if (doc) {
				let resultArr = [];
				for (let item in doc) {
					let length = doc[item].proxy.length;
					if (doc[item].proxy.substr(length - 4, length - 1) === '3000') {
						try {
							let result = await axios.post('http://' + doc[item].proxy + '/getSysInfo');
							result.data['proxy'] = doc[item].proxy;
							resultArr.push(result.data);
						} catch (err) {
							reject(err);
						}
					}
				}
				resolve(resultArr);
			}
		});
	});
};
