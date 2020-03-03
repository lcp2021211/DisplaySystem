const config = require('../config/basics');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Mappings');
const Mappings = require('../models/proxyToClient');

setInterval(() => {
	Mappings.find({}, (err, doc) => {
		if (err) {
			console.error(err);
		}
		if (doc) {
			console.log(`decreasing credit by ${config.beta} at ${config.interval / 1000}s`);
			doc.forEach(element => {
				element.client.forEach(singleClient => {
					singleClient.credit = singleClient.credit - config.beta;
					singleClient.timeSlot++;
				});
				Mappings.updateOne({ proxy: element.proxy }, { client: element.client }, (err, doc) => {
					if (err) {
						console.error('error while updating docs: ', err);
					}
				});
			});
		}
	});
}, config.interval);
