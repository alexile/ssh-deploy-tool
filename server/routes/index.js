const express = require('express');
const router = express.Router();

router
  .get('/', (req, res) => {
    res.render('index', {title: 'Teraflops of content: generator for SMM'});
  })

module.exports = router;
