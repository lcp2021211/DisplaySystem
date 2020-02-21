let externalip = require('externalip');
let fs = require('fs');
let axios = require('axios');
function getip() {
	return new Promise((resolve, reject) => {
		externalip((err, ip) => {
			if (ip) {
				resolve(ip);
			} else {
				reject(err);
			}
		});
	});
}

async function writeConfig() {
	try {
		let ip = await getip();
		fs.writeFile(
			`${__dirname}/../config/config.js`,
			`exports.ip = '${ip}';\n` +
				`exports.port = '3000';\n` +
				`exports.serverIP = '39.98.223.98';\n` +
				`exports.interval = 3000;`,
			err => {
				if (err) {
					console.error(err);
				}
			}
		);
		registerProxy(ip);
	} catch (err) {
		console.error(err);
	}
}

function registerProxy(ip) {
	axios.post('http://39.98.223.98:5000/proxyRegister', { proxy: ip + ':3000' }).then(data => {
		fs.writeFile(`${__dirname}/../log/else.log`, data.data.message + '\n', { flag: 'a' }, err => {
			if (err) {
				console.error(err);
			}
		});
	});
}

writeConfig();
