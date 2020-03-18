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
	await Mappings.updateMany({}, { client: [], maxSize: 5 });

	for (let i = 0; i < 10; ++i) {
		let client = {
			ID: i,
			pass: '123456',
			spy: true,
			networkSpeed: parseInt(Math.random() * 1000),
			networkDelay: parseInt(Math.random() * 1000)
		};
		await Mappings.updateOne({ $where: 'this.client.length < this.maxSize' }, { $push: { client: client } });
	}
}

async function updateClient() {
	let doc = await Mappings.update(
		{ 'client.ID': 0 },
		{ $set: { 'client.$.networkSpeed': 2000, 'client.$.networkDelay': 4000 } }
	);
}

// addProxy();
// addClient();
// updateClient();
// 