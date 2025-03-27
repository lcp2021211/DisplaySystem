const axios = require('axios');
const config = require('../config/config');

// while detecting ddos attacks
exports.sendShuffleRequest = function(proxy) {
	return axios.post(`http://${config.serverIP}/requestShuffle`, { proxy: proxy });
};

// Client is online
exports.clientOnline = function(clientID, spy) {
	return axios.post(`http://${config.serverIP}/clientOnline`, {
		clientID: clientID,
		// proxy: `${config.ip}:${config.port}`,
		proxy: `${global.ip}`,
		spy: spy
	});
};

// Client is offline
exports.clientOffline = function(clientID) {
	return axios.post(`http://${config.serverIP}/clientOffline`, {
		clientID: clientID,
		// proxy: `${config.ip}:${config.port}`
		proxy: `${global.ip}`,
	});
}

/**
 * Send the attack message to server
 * @param {integer} attackFrequency frequency of attack
 * @param {integer} attackStrength Strength of attack
 */
exports.sendAttackMessage = function(attackFrequency, attackStrength) {
	return axios.post(`http://${config.serverIP}/attacked`, {
		proxy: `${global.ip}`,
		attackFrequency: attackFrequency,
		attackStrength: attackStrength
	});
};
