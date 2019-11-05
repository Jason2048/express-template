var
  log = require('log4js').getLogger("controllers/user"),
  Util = require("../lib/util"),
  model_user = require('../model/user')

resultJSON = null;

exports.getList = async function (req, res, next) {
  try {
    let result = await model_user.getList();
    res.send(Util.getResultJSON(200, result))
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
}
exports.getOneById = async function (req, res, next) {
  // console.log(req.params,req.query,req.body)
  try {
    let id = +req.query.id;
    if (isNaN(id)) {
      res.send(Util.getResultJSON(300, null, 'id is invalid.'))
      return;
    }
    let result = await model_user.getOneById(id);
    let userId = req.session.user_id;
    if (result.length && userId) {
      result[0].cur_user_watch_id = data[0].id;
    }
    res.send(Util.getResultJSON(200, result[0]))
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
}
exports.getUserInfo = async function (req, res, next) {
  try {
    console.log('getUserInfo:', req.session)
    let userId = req.session.user_id;
    if (!userId) {
      res.send(Util.getResultJSON(499, 'User is not logined'))
      return;
    }
    let result = await model_user.getOneById(userId);
    if (result.length) {
      let user = result[0];
      req.session.user_name = user.user_name;
      res.send(Util.getResultJSON(200, user))
      // } else if (req.session.isNew !== true) {

    } else {
      // req.session.destroy();
      res.send()
    }
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }

}

exports.add = async function (req, res, next) {
  try {
    let params = req.body;
    let result = await model_user.insert(params);
    res.send(Util.getResultJSON(200, result))
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
}
exports.update = async function (req, res, next) {
  try {
    let params = req.body;
    let result = await model_user.update(params);
    res.send(Util.getResultJSON(200, result))
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
}

exports.login = async function (req, res, next) {
  try {
    var params = req.body;
    var data = await model_user.checkUserByAccountAndPwd(params.account, params.password);
    if (data.length === 0) {
      resultJSON = Util.getResultJSON(201, 'Account or password is wrong.');
    } else {
      data = data[0];
      delete data.password;

      resultJSON = Util.getResultJSON(200);
      req.session.user_id = data.id;
    }
    res.send(resultJSON);

  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
};

exports.register = async function (req, res, next) {
  try {
    var params = {
      'user_name': req.body.user_name,
      'nickname': req.body.user_name,
      'email': req.body.email,
      'password': req.body.password,
      'avatar': '/upload/avatar/default.png'
    };

    if (!params.user_name || !params.password) {
      res.send(Util.getResultJSON(209, 'params is wrong'));
      return;
    }
    var data = await model_user.checkUserByUsername(params.user_name);
    if (data.length) {
      res.send(Util.getResultJSON(201, 'User name is exist.'));
      return;
    }

    if (params.email) {
      data = await model_user.checkUserByEmail(params.email);
      if (data.length > 0) {
        res.send(Util.getResultJSON(202, 'Email is exist.'));
        return;
      }
    }

    let result = await model_user.insert(params);
    req.session.user_id = result.insertId;

    res.send(Util.getResultJSON(200, result));
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
};

//注册游客 todo
exports.registerVistor = async function (req, res, next) {
  try {
    var params = {
      user_name: Util.randomStr(9),
      is_vistor: 1,
      password: Util.randomStr(),
    }
    var data = await model_user.insert(params);
    res.send(Util.getResultJSON(200));
  } catch (e) {
    log.error(e)
    res.send(Util.getResultJSON(500, null, e))
  }
};

exports.logout = async function (req, res, next) {
  // req.session.destroy()
  // res.send(Util.getResultJSON(200))

  req.session.destroy(function () {
    res.send(Util.getResultJSON(200))
  });
}