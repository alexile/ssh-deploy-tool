'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const config = require('./config.js')();
const crud = require('./routes/crud.js');
const index = require('./routes/index.js');
const io = require('socket.io');
const session = require('express-session');

app.set('trust proxy', 1);

app.use(session({
  key: 'ssid',
  secret: 'wtfisit',
  cookie: {
    maxAge: 600000
  },
  saveUninitialized: true,
  resave: false,
}));

app.use((req, res, next) => {
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

/**
 * Custom API
 * @type {Array}
 */
const api = require('require-all')({
  dirname: __dirname + '/routes/api/'
});

Object.keys(api).forEach((module, i, arr) => {
  /**
   * This is a full route. Don`t add it to router
   */
  app.use(`/api/${module}`, api[module]);
});


app.use('/', index);
app.use('/api', crud);


mongoose.connect(config.db_address, {useMongoClient: true});

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
