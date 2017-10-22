const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('./../config.js')();
const _ = require('lodash');
const Schema = mongoose.Schema;

class UserClass {
	set password(v) {
		this.salt = this.makeSalt();
		this._password = v;
		this.hashed_password = this.encryptPassword(v);
	}
	set sameUser(v) {
		this._sameUser = v;
	}
	set isExist(v) {
		this._isExist = v;
	}
	get isExist() {
		return this._isExist;
	}
	get sameUser() {
		return this._sameUser;
	}
	get realPassword() {
		return this._password;
	}
	encryptPassword(password, salt) {
		return crypto.createHmac('sha1', salt || this.salt)
			.update(password)
			.digest('hex') + config.ps_salt2;
	}
	makeSalt() {
		return Math.round(new Date().valueOf() * Math.random()) + '' + config.ps_salt1;
	}
}

const userSchema = new Schema({
	login: {
		type: String,
		required: true,
		min: 6,
		max: 30
	},
	hashed_password: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	teams: {
		type: Array,
		required: false
	}
});

userSchema.pre('find', function(next) {
	this._conditions = {login: this._conditions.login};
	next();
});

userSchema.pre('save', function(next) {
	if (_.get(this, 'sameUser.length') === 1) {
		this.isExist = this.encryptPassword(this.realPassword, this.sameUser[0].salt) === this.sameUser[0].hashed_password;
		const msg = this.isExist ? {error: {message: 'User already exist'}} : {error: {message: 'Wrong password or login'}};
		const err = new Error(msg.error.message);
		return next(err);
	} else if(_.get(this, 'sameUser.length') > 1) {
		const msg = {error: {message: 'Fatal error: multiple users'}};
		const err = new Error(msg.error.message);
		return next(err);
	} else {
		return next();
	}
});

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);



module.exports = User;
