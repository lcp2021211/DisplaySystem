const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
	ID: {
		type: Number,
		index: {
			unique: true
		}
	},
	proxy: String,
	pass: String,
	credit: {
		type: Number,
		default: 0
	},
	block: {
		type: Boolean,
		default: false
	},
	attackFrequency: {
		type: Number,
		default: 0
	},
	attackStrength: {
		type: Number,
		default: 0
	},
	accessTime: Date,
	logoutTime: Date,
	timeSlot: {
		type: Number,
		default: 0
	},
	spy: {
		type: Boolean,
		default: false
	},
	networkSpeed: {
		type: Number,
		default: 0
	},
	networkDelay: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Client', ClientSchema);
