const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const teamSchema = new Schema({
	name: {
		type: String,
		required: true,
		min: 6,
		max: 30,
		index: {
			unique: true
		}
	},
	description: {
		type: String,
		required: false,
		default: 'Just another team...'
	},
	ssh_user: {
		type: String,
		required: true
	},
	ssh_password: {
		type: String,
		required: true
	},
	ssh_host: {
		type: String,
		required: true,
	},
	ssh_port: {
		type: String,
		required: true
	},
	git_login: {
		type: String,
		required: false
	},
	git_token: {
		type: String,
		required: false
	},
	user: {
		type: String,
		required: true
	},
	users: {
		type: Array,
		required: true
	}
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
