var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator')
var bodyParser = require('cookie-parser')
var session = require('express-session')
var mongo = require('mongodb')
var db = require('monk')('localhost/nodeblog')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var flash = require('connect-flash');
var multer = require('multer');
var posts = require('./routes/posts')
var categories = require('./routes/categories')

var app = express();

app.locals.moment = require('moment');

app.locals.truncateText = (text, length) => {
  let truncateText = text.substring(0, length);
  return truncateText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Handle upload file 
app.use(multer({ dest: './public/images/uploads'}).any())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'secret', 
  saveUninitialized: true,
  resave: true
}))

// Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Connect flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  req.db = db;
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', posts);
app.use('/categories', categories)

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

module.exports = app;
