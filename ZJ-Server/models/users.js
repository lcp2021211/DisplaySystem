const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		username: String,
		password: String,
		token: String,
		role: Number,
		roles: [String],
		introduction: String,
		avatar: String,
		name: String
	},
	{ collection: 'users' }
);

module.exports = mongoose.model('User', User);
