const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Motag');

const Mappings = require('../models/proxyToClient');
const proxies = require('../config/proxies');
const ProxyModel = require('../models/proxy');
const ClientModel = require('../models/client');

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

async function findClient() {
	// let doc = await Mappings.findOne({ 'client.ID': 0 }).select({ client: { $elemMatch: { ID: 0 } } });
	let doc = await Mappings.findOne({ client: { $elemMatch: { ID: 0 } } });
	console.log(doc.length);
}

async function test() {
	// let before = await ProxyModel.find({});

	// console.log('Before 1')
	// for (let doc of before) {
	// 	console.log(doc);
	// }

	// await ProxyModel.updateMany({}, { size: 10 });

	// console.log('Before 2')
	// for (let doc of before) {
	// 	console.log(doc);
	// 	await doc.save();
	// }

	// console.log('After')
	// let after = await ProxyModel.find({});
	// for (let doc of after) {
	// 	console.log(doc)
	// }
	// let proxies = await ProxyModel.find({});
	// console.log(proxies);
	let obj = { '0': 'a', '1': 'b', '2': 'c' };

	for (let i in obj) {
		console.log(i, ':', obj[i]);
	}
}

async function shuffle() {
	let client2Proxy = [];

	let clients = await ClientModel.find({});
	// console.log('Clients: ' + clients);
	let proxies = {};
	(await ProxyModel.find({})).forEach(e => {
		proxies[e.proxy] = { size: 0, capacity: e.capacity, level: e.level };
	});
	// console.log('Proxies: ' + proxies);

	clients.forEach(client => {
		let level = client.ID % 2;
		let proxy = 'null';
		for (let i in proxies) {
			if (proxies[i].level === level && proxies[i].size < proxies[i].capacity) {
				proxy = i;
				proxies[i].size++;
				break;
			}
		}
		client2Proxy.push([client.ID, proxy]);
	});
	console.log(client2Proxy);
}

// addProxy();
// addClient();
// updateClient();
// findClient();
// test();
shuffle();
