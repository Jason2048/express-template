/**
 *内置util方法：http://www.apihome.cn/api/nodejs/util.html
 */

var https = require('https');
var http = require('http');
var request = require('request');
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');

var Util = {};
module.exports = Util;

Util.doRequest = function(url, callback) {
  try {
    console.log('request url==: ', url);
    request(url, function(error, response, body) {
      console.log('request back==: ', error);
      if (!error && response.statusCode == 200) {
        callback(body, response.statusCode);
      }
    })
  } catch (e) {
    console.log(e);
  }
}

//get 请求
Util.doGet = function(url, cb) {
  http.get(url, function(res) {
    console.log("====get statusCode: ", res.statusCode);
    var size = 0;
    var chunks = [];
    //监听data事件。
    res.on('data', function(chunk) {
      size += chunk.length;
      chunks.push(chunk);
    });
    //数据获取完毕事件。
    res.on('end', function() {
      var data = Buffer.concat(chunks, size); //连接多次data的buff。
      // console.log(data.toString())//将data二进制数据转换成utf-8的字符串
      cb(data.toString(), res);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

//post 请求
Util.doPost = function(urlStr, params, cb) {
  var urlStr = url.parse(urlStr);
  var appId = params.appId || '';
  var appKey = params.appKey || '';

  var params = querystring.stringify(params);
  var options = {
    host: urlStr.hostname,
    method: 'POST',
    path: urlStr.path,
    headers: {
      'Content-Length': params.length,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-APICloud-AppId': appId,
      'X-APICloud-AppKey': appKey
    }
  };
  var req = http.request(options, function(res) {
    // console.log('status = ' + res.statusCode);
    var resBody = '';
    res.on('data', function(chunk) {
      resBody += chunk;
    });

    res.on('end', function() {
      console.log('res header = ');
      // console.log('res body:======== ' + resBody);

      try {
        // var jsonObj = JSON.parse(resBody);
        cb(resBody)
      } catch (e) {
        cb && cb(e);
        return;
      }
    });
  });

  req.on('error', function(e) {
    console.log('error : ', e);
  });

  req.write(params);
  // console.log('req:====', req)
  req.end();
}

Util.getResultJSON = function(code = 200, body = null, msg = 'success') {
  if (typeof body === 'string') {
    msg = body;
    body = null;
  };

  return {
    'code': code,
    'body': body,
    'msg': msg
  }
}

Util.urlencode = function(str) {
  str = (str + '').toString();
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}


//加密
Util.encrypt = function(str, secretKey) {
  var cipher, enc;
  cipher = crypto.createCipher('aes192', secretKey);
  enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};

//解密
Util.decrypt = function(str, secretKey) {
  var dec, decipher;
  decipher = crypto.createDecipher('aes192', secretKey);
  dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

Util.md5 = function(str) {
  var md5 = crypto.createHash('md5');
  md5.update(str);
  var d = md5.digest('hex'); //MD5值是5f4dcc3b5aa765d61d8327deb882cf99

  // obj.digest('hex');
  return d;
}

Util.sha1 = function(str) {
  var shasum = crypto.createHash('sha1');
  shasum.update(str);
  var d = shasum.digest('hex');

  return d;
}

/**
 * 将对象转成sql可用的字符串 ，如修改操作
 * @param  {[type]} data     [description]
 * @param  {Array}  exclude  要排除的key
 * @param  {String} splitStr 分隔符
 * @return {[type]}          [description]
 */
Util.arstr = function arstr(data,exclude=[], splitStr=',') {
  exclude.forEach(function(v){
    delete data[v]
  })

  let arr=[];
  for (let key in data) {
    arr.push(`${key}="${data[key]}"`);
  }

  return arr.join(splitStr);
};

/*
 * num: 数字
 * return '000,000,000'
 */
Util.formatNum = function(num) {
  var a = Math.floor(num),
    arr = [],
    t; //整数部分
  function func(n) {
    if (a <= 0) return;
    t = a % 1000;
    a = Math.floor(a / 1000);

    if (a >= 1) {
      t = t >= 100 ? t : (t >= 10 ? '0' + t : '00' + t);
    };
    arr.unshift(t + '');
    func(a)
  }
  func(a)
  return arr.join(',').replace(',.', '.');
}

//生成随机字符串
Util.randomStr = function(size) {
  size = size || 6;
  // var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var code_string = '0123456789';
  var max_num = code_string.length + 1;
  var str = '';
  while (size > 0) {
    str += code_string.charAt(Math.floor(Math.random() * max_num));
    size--;
  }
  return str;
};

//生成 不同的 n个min到max间的随机数(不包括max)  的数组
Util.randomArr = function(min, max, n) {
  function compare(a, b) {
    return a > b;
  }

  var obj = {},
    arr = [];
  var num = Math.floor(Math.random() * (max - min)) + min;
  arr.push(num);
  obj[num] = 1;
  n--;
  for (var i = 0; i < n; i++) {
    num = Math.floor(Math.random() * (max - min)) + min;
    if (!obj[num]) {
      obj[num] = 1;
      arr.push(num);
    } else {
      i--;
    }
  }

  // var a = arr.sort(compare).join(',');
  return arr.sort(compare);
}

/*
 * n的阶乘
 */
Util.math_factorial = function(n) {
  if (n <= 0) return 0;
  if (n <= 2) return n;

  return n * arguments.callee(n - 1);
}

/*
 * n个数中取r个数的组合数
 */
Util.math_combination = function(n, r) {
  if (n <= 0 || r == 0) return 0;
  if (n == r) return 1;
  if (r == 1) return n;

  var n1 = this.math_factorial(r),
    n2 = this.math_factorial(n),
    n3 = this.math_factorial(n - r);

  return n2 / (n1 * n3);
}

/*
 * n个数中取r个数的排列数
 */
Util.math_arrange = function(n, r) {
  if (n <= 0 || r == 0) return 0;
  if (r == 1) return n;

  var n1 = this.math_factorial(n - r),
    n2 = this.math_factorial(n);

  return n2 / n1;
}

//复制对象
Util.extend = function(dest, source) {
  if (Object.assign) {
    Object.assign(dest, source);
    return;
  };

  var props = Object.getOwnPropertyNames(source),
    destination;

  props.forEach(function(name) {
    if (typeof source[name] === 'object') {
      if (typeof dest[name] !== 'object') {
        dest[name] = {}
      }
      extend(dest[name], source[name]);
    } else {
      destination = Object.getOwnPropertyDescriptor(source, name);
      Object.defineProperty(dest, name, destination);
    }
  });
}

//手机验证
Util.checkMobile = function(mobile) {
  if (/^(130|131|132|133|134|135|136|137|138|139|147|150|151|152|153|155|156|157|158|159|180|182|183|185|186|187|188|189)\d{8}/.test(mobile)) {
    return true;
  }
  return false;
}

Util.toExcel = function() {
  var nodeExcel = require('excel-export');

  var conf = {};
  conf.cols = [{
    caption: 'string',
    type: 'string'
  }, {
    caption: 'date',
    type: 'date'
  }, {
    caption: 'bool',
    type: 'bool'
  }, {
    caption: 'number 2',
    type: 'number'
  }];
  conf.rows = [
    ['pi', (new Date(Date.UTC(2013, 4, 1))).oaDate(), true, 3.14],
    ["e", (new Date(2012, 4, 1)).oaDate(), false, 2.7182],
    ["M&M<>'", (new Date(Date.UTC(2013, 6, 9))).oaDate(), false, 1.2],
    ["null", null, null, null]
  ];

  var result = nodeExcel.execute(conf);
  fs.writeFileSync('d.xlsx', result, 'binary');
}