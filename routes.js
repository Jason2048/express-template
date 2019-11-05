var
  log = require('log4js').getLogger(),
  ctl_index = require('./controllers/index'),
  ctl_user = require('./controllers/user');

module.exports = function (app) {
  app.get('/', ctl_index.index);

  //以下api接口作为服务使用。
  app.post('/api/register', ctl_user.register);
  // app.post('/api/registerVistor', ctl_user.registerVistor);
  app.post('/api/login', ctl_user.login);
  app.get('/api/logout', ctl_user.logout);
  app.get('/api/getUserInfo', ctl_user.getUserInfo);
  app.get('/api/getUserById', ctl_user.getOneById);


};


// // 打印内存占用情况
// function printMemoryUsage() {
//   var info = process.memoryUsage();

//   function mb(v) {
//     return (v / 1024 / 1024).toFixed(2) + 'MB';
//   }

//   //process.memoryUsage()，返回值包括heapTotal代表已申请到的堆内存，heapUsed当前使用的内存，rss(resident set size)进程的常驻内存。
//   console.log('rss=%s, heapTotal=%s, heapUsed=%s', mb(info.rss), mb(info.heapTotal), mb(info.heapUsed));
// }
// setInterval(printMemoryUsage, 1000);

// /*
//  * 初始化程序
//  */
// var initProgram = function(type) {
// }
// initProgram();

// //重置缓存数据
// var resetData = function() {
// }
// resetData();

// //每小时检查一次
// setInterval(function() {
//   resetData();
// }, 3600000); //per hour

log.info('routes loaded.');