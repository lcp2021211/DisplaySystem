let axios = require('axios');
let config = require('../config/config');
let serverURL = `http://${config.serverIP}:5000`;

// while detecting ddos attacks
exports.sendShuffleRequest = function(proxy) {
	return axios.post(`${serverURL}/requestShuffle`, { proxy: proxy });
};

// Register client by clientID
exports.registerUser = function(clientID, type) {
	return axios.post(`${serverURL}/clientRegister`, {
		clientID: clientID,
		proxyIP: `${config.ip}:${config.port}`,
		type: type
	});
};

// Register a spy
exports.spyRegister = function(clientID, type) {
	return axios.post(`${serverURL}/spyRegister`, { clientID: clientID, proxyIP: `${config.ip}:${config.port}` });
};

// Unregister client by clientID
exports.deleteUser = function(clientID) {
	return axios.post(`${serverURL}/deleteClient`, { clientID: clientID, proxyIP: `${config.ip}:${config.port}` });
};

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
