const express = require('express');
const router = express.Router();
const Stand = require(`${__dirname}/../../models/stand.js`);
const Team = require(`${__dirname}/../../models/team.js`);
const _ = require('lodash');
const nodeSsh = require('node-ssh');

router
	.route('/command')
	.post((req, res) => {
		const {team, standId, commandId} = req.body;
		if (!_.get(req, 'session.user.teams', []).includes(team)) {
			return res.json({error: {message: 'You are not signed'}});
		}
		Team.findOne({name: team}, (err, teamSettings) => {
			if (err) {
				return res.json({error: {message: err.message}});
			} else {
				const settings = teamSettings;

				Stand.findById(standId, (err, stand) => {
					if (err) {
						return res.json({error: {message: err.message}});
					} else {
						let command = _.get(stand, `commands[${commandId}]`);
						const variables = {};
						stand.variables.forEach(s => {
							variables[s.key] = s.value;
						});
						command = command.value.replace(/\{\{(.+?)\}\}/g, (v) => {
							return variables[v.replace(/[{}]/g, '')];
						});
						const ssh = new nodeSsh();

						if (!command || !settings.ssh_host) {
							return res.json({error: {message: 'Smth went wrong'}});
						}

						ssh.connect({
							host: settings.ssh_host,
							username: settings.ssh_user,
							port: settings.ssh_port,
							password: settings.ssh_password
						})
							.then(() => {
								ssh.execCommand(command)
									.then((result) => {
										res.json({response: result});
									});
							});
					}
				});
			}
		});

	});

router
	.route('/')
	.post((req, res) => {
		const stand = new Stand();
		Object.assign(stand, req.body);
		if (!_.get(req, 'session.user.login')) {
			return res.json({error: {message: 'You are not signed'}});
		}
		stand.save((err) => {
			if (err) {
				res.json({error: err});
			} else {
				res.json({response: 'Success', status: 0, message: 'New stand created'});
			}
		});
	})
	.get((req, res) => {
		const teams = _.get(req, 'session.user.teams');
		Stand.find({
			team: {$in: teams}
		})
			.exec((err, data) => {
				const output = {};

				data = data || [];
				data.forEach(d => {
					if (!output[d.team]) {
						output[d.team] = [];
					}
					output[d.team].push(d);
				});
				res.json({response: output});
			});

	})
	.put((req, res) => {
		const data = req.body || {};
		if (!data._id) {
			res.json({error: {message: 'You haven`t ID'}});
		}
		const userTeamsInSession = _.get(req, 'session.user.teams', []);
		if (!userTeamsInSession.length || !userTeamsInSession.includes(data.team)) {
			res.json({error: {message: 'You haven`t access'}});
		}
		Stand.findById(data._id, (err, stand) => {
			if (err) {
				res.json({error: {message: err.message}});
			} else {
				Object.assign(stand, data);
				stand.save((err) => {
					if (err) {
						res.json({error: {message: err.message}});
					} else {
						res.json({response: {message: 'Stand updated'}});
					}
				});
			}
		});
	});

router.route('/:_id')
	.delete((req, res) => {
		Stand.findById(req.params._id, (err, st) => {
			if (_.get(req, 'session.user.teams', []).includes(st.team)) {
				if (err) {
					res.json({error: {message: err.message}});
				} else {
					Stand.remove({_id: req.params._id}, (err) => {
						if (err) {
							res.json({error: {message: err.message}});
						} else {
							res.json({response: {message: 'Stand removed'}});
						}
					});
				}
			} else {
				res.json({error: {message: 'No access'}});
			}
		});
	});

router
	.route('/copy')
	.post((req, res) => {
		const data = req.body;
		const userTeamsInSession = _.get(req, 'session.user.teams', []);
		if (!userTeamsInSession.length || !userTeamsInSession.includes(data.team)) {
			res.json({error: {message: 'You haven`t access'}});
		}
		if (!_.get(req, 'session.user.login')) {
			return res.json({error: {message: 'You are not signed'}});
		}
		const stand = new Stand({
			name: data.name + '_copy',
			team: userTeamsInSession.find(v => data.team),
			status: data.status,
			description: data.description,
			variables: data.variables,
			commands: data.commands
		});
		stand.save((err) => {
			if (err) {
				res.json({error: {message: err.message}});
			} else {
				res.json({response: 'Success', status: 0, message: 'New stand created'});
			}
		});
	});

module.exports = router;
