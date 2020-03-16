const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProxySchema = new Schema({
	proxy: {
		type: String,
		require: true,
		unique: true
	},
	size: {
		type: Number,
		default: 0
	},
	capacity: {
		type: Number,
		default: 5
	},
	level: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Proxy', ProxySchema);
