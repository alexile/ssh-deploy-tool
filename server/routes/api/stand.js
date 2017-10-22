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
						command = command.value.replace(/{{.+}}/g, (v) => {
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
		console.log(stand);
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
		res.json({});
	})

module.exports = router;
