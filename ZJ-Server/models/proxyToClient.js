const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MappingSchema = new Schema({
	client: [
		{
			ID: Number,
			pass: String,
			credit: {
				type: Number,
				default: 0
			},
			block: {
				type: Boolean,
				default: 0
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
			}
		}
	],
	proxy: {
		type: String,
		required: true,
		unique: true
	},
	maxSize: {
		type: Number,
		default: 5
	},
	level: {
		type: Number,
		default: 0
	}
});

// // 获取整个映射map
// MappingSchema.virtual('mappings').get(function() {
// 	const map = new Map();
// 	map.set(this.proxy, this.client);
// 	return map;
// });

// MappingSchema.virtual('saveMap').set(function(map) {
// 	map.forEach((value, key) => {
// 		this.client = value;
// 		this.proxy = key;
// 	});
// });

// MappingSchema.virtual('saveAll').set(function(array) {
// 	array.forEach(element => {
// 		this.proxy = element.proxy;
// 		this.client = element.client;
// 	});
// });

module.exports = mongoose.model('Mappings', MappingSchema);
