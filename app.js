var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var mongoStore = require('connect-mongo')(expressSession);

var databaseURL = "mongodb+srv://admin:admin123@protrasys-admin-raot8.mongodb.net/test?retryWrites=true&w=majority";
// var databaseURL = "mongodb://admin:admin123@ds127938.mlab.com:27938/doctorai_admin";


// Routes are imported here
var indexRouter = require('./routes/routes');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.engine('hbs',hbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(expressSession({
  secret: "UsersSignup",
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge: 100 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next(); 
});

app.use('/users',userRouter)
app.use('/', indexRouter);

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
  res.render('error',{title: 'DreamWorld'});
});

// Mongoose Connection
mongoose.connect(databaseURL,{useNewUrlParser: true},(err)=>{
  if(err){
    console.log("Error is Occured ! + "+err)
  }else{
    console.log("DB Connected")
  }
})
require('./config/passport');

module.exports = app;
