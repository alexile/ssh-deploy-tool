const express = require('express');
const router = express.Router();
router
  .route('/')
    .get((req, res) => {
      console.log(req.session);
      res.json(req.session.user);
    })
    .delete((req, res) => {
      req.session.destroy((err) => {
        console.log(req.session);
        res.json(err || {});
      });
    })

module.exports = router;
