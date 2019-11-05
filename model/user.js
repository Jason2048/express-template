let
  Util = require('../lib/util'),
  db = require('../lib/mysql-class');

let tb = 'tb_user';

exports.getList = async function () {
  return await db.sql_select_simple(tb);
};

exports.getOneById = async function (id) {
  return await db.sql_select({
    tbname: tb,
    where: "id = " + id
  });
};

exports.getUserByAccountAndPwd = async function (account, password) {
  return await db.sql_select({
    tbname: tb,
    where: "(`user_name` = '" + account + "' or `email` = '" + account + "' ) and `password` = '" + password + "'"
  });
};

exports.getUserByUsername = async function (user_name) {
  return await db.sql_select({
    tbname: tb,
    where: "user_name = '" + user_name + "'"
  });
};
exports.getUserByEmail = async function (email) {
  return await db.sql_select({
    tbname: tb,
    where: "email = '" + email + "'"
  });
};

exports.checkUserByAccountAndPwd = async function (account, password) {
  return await db.sql_select({
    tbname: tb,
    fields: 'id',
    where: "(`user_name` = '" + account + "' or `email` = '" + account + "' ) and `password` = '" + password + "'"
  });
};
exports.checkUserByUsername = async function (user_name) {
  return await db.sql_select({
    tbname: tb,
    fields: 'id',
    where: "user_name = '" + user_name + "'"
  });
};
exports.checkUserByEmail = async function (email) {
  return await db.sql_select({
    tbname: tb,
    fields: 'id',
    where: "email = '" + email + "'"
  });
};

exports.insert = async function (params) {
  return await db.sql_insert(tb, params);
};

exports.update = async function (params) {
  let id = params.id;
  return await db.sql_update(tb, Util.arstr(params, ['id']), 'id = ' + id);
};

//更新某个数字字段的值
exports.update_field_count = async function (field, n = 1, whereStr) {
  let sql = `update ${tb} set ${field}=${field}+${n} where ${whereStr}`;
  return await db.sql_query(sql);
};