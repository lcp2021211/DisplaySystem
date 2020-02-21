const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Mappings');

const Mappings = require('../models/proxyToClient');

Mappings.find({}, (err, doc) => {
	if (err) {
		console.error(err);
	}
	if (doc) {
		doc.forEach(element => {
			element.client.forEach(client => {
				client.credit = 0;
			});
		});
		Mappings.remove({}, err => {
			const result = new Mappings(doc);
			result.save(err => {
				if (err) {
					console.log(err);
				} else {
					console.log('done');
				}
			});
		});
	}
});
// Mappings.updateMany({}, {'$set': 'client.$.credit'})
// db.mapping.updateMany({}, {'$set': {'client.$.credit': 0}})
