/*
 *配置文件
 */
module.exports = {
  debug: true,
  name: '',
  description: '',
  version: '1.0.0',
  uploadDir: './public/uploadDir',
  host: 'http://www.xxx.cn',
  cdn: '',
  site_logo: '',

  db_server: '0.0.0.0',
  db_port: 3306,
  db_user: 'root',
  db_passwd: 'xxx',
  db_database: 'xxx',
  db_connectionLimit: 10,

  MD5_SUFFIX: 'xxx',
  secretKey: 'xxx', //密钥
  session_secret: 'xxx',
  auth_cookie_name: 'xxx',

  isTest: 1,
  available: 1, // 标志系统是否可用

  mail_opts: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'test@126.com',
      pass: 'test'
    }
  },

};