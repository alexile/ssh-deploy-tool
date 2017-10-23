const express = require('express');
const router = express.Router();
const Team = require(`${__dirname}/../../models/team.js`);
const User = require(`${__dirname}/../../models/user.js`);
const _ = require('lodash');

router
	.route('/')
	.post((req, res) => {
		const team = new Team();
		Object.assign(team, req.body);
		if (!_.get(req, 'session.user.login')) {
			return res.json({error: {message: 'You are not signed: access denied'}});
		}
		const currentUserName = _.get(req, 'session.user.login');
		Object.assign(team, {user: currentUserName, users: [currentUserName]});
		team.save((err) => {
			if (err) {
				res.json({error: {message: `Team is not saved. Whats wrong: ${err.message}`}});
			} else {
				User.findOne({login: currentUserName}, (err, currentUser) => {
					if (err) {
						res.json({error: {message: `You update a wrong user: ${err.message}`}});
					} else {
						const teamList = currentUser.teams || [];
						teamList.push(req.body.name);
						Object.assign(currentUser, {teams: teamList});
						currentUser.save((err) => {
							if (err) {
								res.json({error: {message: `You can\`t assign a team to ${currentUserName}: ${err.message}`}});
							} else {
								req.session.user.teams = teamList;
								res.json({
									response: 'Success',
									status: 0,
									message: 'Team created. Now you have to choose users in dashboard',
									session: req.session.user
								});
							}
						});
					}
				});
			}
		});
	})
	.get((req, res) => {
		const currentUserName = _.get(req, 'session.user.login', null);
		const currentUsers = _.get(req, 'session.user.teams', null);

		if (!(currentUserName && currentUsers )) {
			return res.json({error: {message: 'You are not signed: access denied'}});
		}
		Team.find({user: currentUserName}, (err, arrayOfTeams) => {
			if (err) {
				res.json({error: {message: `Teams select error: ${err.message}`}});
			} else {
				res.json({
					response: arrayOfTeams,
					message: 'Your coworkers list loaded'
				});
			}
		});
	})
	.put((req, res) => {
		const data = req.body;
		const users = _.get(req, 'body.users', []);

		if (!req.session.user.teams.includes(data.name)) {
			return res.json({error: {message: 'You have not access to update this team'}});
		}
		Team.findOne({name: data.name}, (err, results) => {
			if (err) {
				res.json({error: {message: `Teams select error: ${err.message}`}});
			} else {
				Object.assign(results, data);
				results.save((err) => {
					if (err) {
						res.json({error: {message: `Team update error: ${err.message}`}});
					} else {
						users.forEach((us, i) => {
							User.findOne({login: us}, (err, usData) => {
								if (usData) {
									if (err) {
										return res.json({error: {message: `Team update error: ${err.message}`}});
									}
									const teams = usData.teams || [];

									if (!teams.find(v => (v === data.name))) {
										teams.push(data.name);
										usData.save((err) => {
											if (err) {
												res.json({error: {message: `Team update error: ${err.message}`}});
											} else {
												if (i === users.length - 1) {
													res.json({
														message: 'Team structure updated'
													});
												}
											}
										});
									} else {
										if (i === users.length - 1) {
											res.json({
												message: 'Team structure updated'
											});
										}
									}
								} else {
									if (i === users.length - 1) {
										res.json({
											message: 'Team structure updated'
										});
									}
								}
							});
						});

					}
				});
			}
		});
	});

module.exports = router;
