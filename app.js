// import basic modules
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

// main app
const app = express();

// import routes
const indexRouter = require('./apps/index/route');
const adminRouter = require('./apps/admin/route');

// view engine setup
app.use(expressLayouts)
app.set('layout', './layouts/tmp')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// load basic modules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'scss'),
  dest: path.join(__dirname, 'public/css'),
  prefix:  '/css',
  outputStyle: 'compressed',
  // debug: app.get('env') === 'development',
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// load routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);

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

//export
module.exports = app;
