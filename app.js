// import basic modules
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('./middleware/flash');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session')

// main app
const app = express();

// set session
const sess = {
    secret: 'Hold fast',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/admin',
        sameSite: 'strict',
        maxAge: 1800000 // 30 min - in milliseconds
    }
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use('/admin', session(sess)); // only for admin
app.use('/admin', flash); // only for admin

// passport middleware
app.use('/admin', passport.initialize());
app.use('/admin', passport.session());

// globals

app.use('/admin', (req, res, next) => {
    res.locals.user = req.user || null;

    next();
});

// import routes
const indexRouter = require('./apps/index/route');
const adminRouter = require('./apps/admin/route');

// passport config
require('./config/passport')(passport);

// view engine setup
app.use(expressLayouts)
app.set('layout', './layouts/tmp')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// connect to mongo
mongoose.connect('mongodb://127.0.0.1:27017/mpk', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// load basic modules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public/css'),
    prefix: '/css',
    outputStyle: 'compressed',
    // debug: app.get('env') === 'development',
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));

// cache control
app.set('etag', false);
app.get('/*', function (req, res, next) {
    console.log(req.url);
    if (req.url.indexOf('/images/') === 0 || req.url.indexOf('/css/' ) === 0 || req.url.indexOf('/js/' ) === 0) {
        console.log(req.url);
        res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    next();
});

// static files
app.use(express.static(path.join(__dirname, 'public'), {etag: false}));

// load routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//export
module.exports = app;
