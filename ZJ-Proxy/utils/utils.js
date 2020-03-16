const axios = require('axios');
const config = require('../config/config');
const serverURL = `http://${config.serverIP}:5000`;

// while detecting ddos attacks
exports.sendShuffleRequest = function(proxy) {
	return axios.post(`${serverURL}/requestShuffle`, { proxy: proxy });
};

// Client is online
exports.clientOnline = function(clientID, type) {
	return axios.post(`${serverURL}/clientOnline`, {
		clientID: clientID,
		proxy: `${config.ip}:${config.port}`,
		type: type
	});
};

// Client is offline
exports.clientOffline = function(clientID) {
	return axios.post(`${serverURL}/clientOffline`, {
		clientID: clientID,
		proxy: `${config.ip}:${config.port}`
	});
}

/**
 * Send the attack message to server
 * @param {integer} attackFrequency frequency of attack
 * @param {integer} attackStrength Strength of attack
 */
exports.sendAttackMessage = function(attackFrequency, attackStrength) {
	let proxy = `${config.serverIP}:${config.port}`;
	return axios.post(`${serverURL}/attacked`, {
		proxy: proxy,
		attackFrequency: attackFrequency,
		attackStrength: attackStrength
	});
};
