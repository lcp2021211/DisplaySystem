const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Mappings');
const Mappings = require('../models/proxyToClient');
const proxies = require('../config/proxies');

async function addProxy() {
	Mappings.remove({}, err => {
		if (err) {
			console.error('error removing old:', err);
		} else {
			proxies.forEach(proxy => {
				new Mappings({
					client: [],
					proxy: proxy,
					maxSize: 10
				}).save();
			});
		}
	});
}

async function addClient() {
	for (let i = 0; i < 3; ++i) {
		let client = {
			ID: i,
			pass: '123456',
			credit: 0,
			block: false,
			attackFrequency: 0,
			attackStrength: 0,
			accessTime: new Date(),
			timeSlot: 0,
			spy: false
		};
		await Mappings.findOneAndUpdate({ proxy: '39.100.130.220:3000' }, { $push: { client: client } });
	}
}

async function removeClient() {
	await Mappings.findOneAndUpdate(
		{
			proxy: '39.100.130.220:3000'
		},
		{
			$pull: { client: { ID: 1 } }
		}
	);
}

// addProxy();
removeClient();

// mongoose.disconnect();
