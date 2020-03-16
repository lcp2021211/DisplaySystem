const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Motag');

const Mappings = require('../models/proxyToClient');
// const proxies = require('../config/proxies');

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
	// Clear
	await Mappings.findOneAndUpdate(
		{ proxy: '39.100.130.220:3000' },
		{ client: [] },
		{
			maxSize: 5
		}
	);
	// Add
	for (let i = 0; i < 2; ++i) {
		console.log(i);
		let client = {
			ID: i,
			pass: '123456',
			credit: 0,
			block: false,
			attackFrequency: 0,
			attackStrength: 0,
			accessTime: new Date(),
			timeSlot: 0,
			spy: true
		};
		await Mappings.findOneAndUpdate(
			{
				proxy: '39.100.130.220:3000'
				// $lte: ["$client.length", "$maxSize"]
				// maxSize: {
				// 	$gt: 0
				// }
			},
			{
				$push: {
					client: client
				}
				// $inc: {
				// 	maxSize: -1
				// }
			}
		);
	}

	console.log('finish');
	let doc = await Mappings.findOne({
		proxy: '39.100.130.220:3000',
		$where: 'this.client.length <= this.maxSize'
	});
	if (doc) {
		console.log('length: ' + doc.client.length);
	} else {
		console.log('fuck');
	}
}

function test() {
	Mappings.findOne({ proxy: '127.0.0.1' }, (err, doc) => {
		if (err) {
			console.log('err');
		} else {
			if (doc) {
				console.log(doc);
			} else {
				console.log('good');
			}
		}
	});
}

async function shuffle() {
	// Generate mock data
	try {
		await Mappings.remove({});

		for (let i = 0; i < 3; ++i) {
			let clients = [];
			for (let j = 0; j < 5; ++j) {
				clients.push({
					ID: i * 5 + j,
					pass: '123456',
					credit: Math.floor(Math.random() * 300)
				});
			}
			await new Mappings({
				client: clients,
				proxy: 'proxy' + i,
				maxSize: 5,
				level: i
			}).save();
		}

		let clients = [];
		for (let i = 0; i < 3; ++i) {
			let doc = await Mappings.findOneAndUpdate({ proxy: 'proxy' + i }, { client: [] });
			console.log('========================');
			clients.push(...doc.client);
		}
		console.log('Length: ' + clients.length);

		clients.forEach(async client => {
			let level = parseInt(client.credit / 100);
			if (
				await Mappings.findOneAndUpdate(
					{ level: level, $where: 'this.client.length < this.maxSize' },
					{ $push: { client: client } }
				)
			) {
			} else {
				console.log(client.ID + ' No proxy');
			}
		});
	} catch (err) {
		console.error(err);
	}
}

// addProxy();
// addClient();
// test();
shuffle();

// mongoose.disconnect();
