const express = require('express');
const router = express.Router();

const User = require(`${__dirname}/../../models/user.js`);

// router
//   .route('/create/user')
//   .post((req, res) => {
//     console.log(req.body);
//     res.json('Hello');
//   })

module.exports = router;
