const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Motag');

const Mappings = require('../models/proxyToClient');
const proxies = require('../config/proxies');

async function addProxy() {
	proxies.forEach((value, index) => {
		new Mappings({
			client: [],
			proxy: value,
			level: index,
			maxSize: 10
		}).save();
	});
}
async function addClient() {
	await Mappings.updateMany({}, { client: [] });

	for (let i = 0; i < 5; ++i) {
		let client = {
			ID: i,
			pass: '123456',
			spy: true
		};
		await Mappings.updateOne({ proxy: '39.100.130.220:3000' }, { $push: { client: client } });
	}
}

async function findClient() {
	let doc = await Mappings.update(
		{ 'client.ID': 0 },
		{ $set: { 'client.$.networkSpeed': 2000, 'client.$.networkDelay': 4000 } }
	);
}

// addProxy();
// addClient();
findClient();
