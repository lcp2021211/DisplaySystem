const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProxySchema = new Schema({
	proxy: {
		type: String,
		index: {
			unique: true,
		},
	},
	size: {
		type: Number,
		default: 0,
	},
	capacity: {
		type: Number,
		default: 10,
	},
	level: {
		type: Number,
		default: 0,
	},
	attackStrength: {
		type: Number,
		default: 0,
	},
	attackFrequency: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model('Proxy', ProxySchema);
