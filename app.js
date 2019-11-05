var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var sassMiddleware = require('node-sass-middleware');

//We won't need this.
//var logger = require('morgan');
var log4js = require('log4js');
var log = log4js.getLogger("app");

var config = require('./lib/config');
var Util = require('./lib/util')

var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// replace this with the log4js connect-logger
// app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger("http"), {
  level: 'auto'
}));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));

app.use(session({
  secret: config.session_secret, //设置签名秘钥  
  cookie: {
    // maxAge: 10000 //设置cookie的过期时间，例：10s后session和相应的cookie失效过期
    maxAge: 2592000000 //1000 * 60 * 60 * 24 * 30;
  },
  resave: false, //true强制保存，如果session没有被修改也要重新保存
  saveUninitialized: false //如果原先没有session那么就设置，否则不设置
}));
app.use(express.static(path.join(__dirname, 'public')));

//res.locals对象会被传递至页面，在模板中可以直接引用该对象的属性，也可以通过该对象引用
//req.session 可以用来做服务端验证
// app.use(function (req, res, next) {
//   res.locals.config = config;
//   res.locals.user = req.session.user;

//   next();
// });

app.use(function (req, res, next) {
  // console.log('isLogin: ', req.session.isLogin)
  if (req.originalUrl.indexOf('/admin/') >= 0) {
    res.send(Util.getResultJSON(900, 'Access denied!'))
  } else {
    next();
  }
})

routes(app); //此句代码要放在配置之后 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  log.error("Something went wrong:", err);
  res.status(err.status || 500);

  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });

});

module.exports = app;