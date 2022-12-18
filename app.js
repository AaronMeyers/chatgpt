var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();


// require('./thing.mjs');
// import( './thing.mjs');
// require('./stuff/chat')
// import('./stuff/chat');
// import {example} from './stuff/chat'

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist/')));

app.use('/', indexRouter);
// app.use('/send_message', indexRouter );
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// example();

var api;
var apiInitialized = false;

async function example() {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI, getOpenAIAuth } = await import('chatgpt')

  const openAIAuth = await getOpenAIAuth({
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD
  })

  api = new ChatGPTAPI({ ...openAIAuth })
  await api.initSession()

  apiInitialized = true;

  const result = await api.sendMessage('Hello World!')
  console.log(result)
}

module.exports = app;