const express = require('express');
const router = express.Router();
const Team = require(`${__dirname}/../../models/team.js`);
const _ = require('lodash');

router
  .route('/')
    .post((req, res) => {
      const team = new Team();
      Object.assign(team, req.body);
      if (!_.get(req, 'session.user.login')) {
        return res.json({error: {message: 'You are not signed'}});
      }
      team.save((err) => {
        if (err) {
          res.json({error: err});
        } else {
          res.json({response: 'Success', status: 0});
        }
      })
    })
    .get((req, res) => {
      res.json(err || {});
    })
    .put((req, res) => {
      res.json(err || {});
    })

module.exports = router;
