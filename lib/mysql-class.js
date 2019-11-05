/*
 * 数据库操作 类
 * mysql使用参考：https://github.com/mysqljs/mysql
 */
var config, pool, db, sql_query, sql_count, sql_insert, sql_select, sql_select_simple, sql_update, sql;

db = require('mysql');
config = require('./config');

pool = db.createPool({
  host: config.db_server,
  port: config.db_port,
  user: config.db_user,
  password: config.db_passwd,
  database: config.db_database,
  connectionLimit: config.db_connectionLimit, // 连接池中可以存放的最大连接数量
  // charset: "UTF8_GENERAL_CI", // 字符编码 ( 必须大写 )
  // supportBigNumbers: true, // 处理大数字 (bigint, decimal), 需要开启 ( 结合 bigNumberStrings 使用 )
  // bigNumberStrings: true, // 大数字 (bigint, decimal) 值转换为javascript字符对象串
});

sql_query = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      // err='getConnection error.';
      if (err) {
        console.log("Mysql connection fail. err:", err);
        return reject(err);
      }

      console.log('-----------------------------')
      console.log(`query sql:"${sql}"; params: ${JSON.stringify(params)}`)
      console.log('-----------------------------')

      conn.query(sql, params, (err, result) => {
        conn.release(); // 释放连接资源 | 跟 conn.destroy() 不同，它是销毁

        if (err) {
          console.log('query err: ', err)
          return reject(err);
        }

        console.log('-----------------------------')
        console.log(`query result:${JSON.stringify(result)}`)
        console.log('-----------------------------')

        resolve(result);
      });

    });
  });
};

sql_select = function (options) {
  var $fields, $limit, $orderby, $sort, $tbname, $where;
  if (options.tbname) {
    $tbname = options.tbname;
  } else {
    $tbname = "test";
  }
  if (options.where) {
    $where = " WHERE " + options.where;
  } else {
    $where = '';
  }
  if (options.limit) {
    $limit = "limit " + options.limit;
  } else {
    $limit = '';
  }
  if (options.fields) {
    $fields = options.fields;
  } else {
    $fields = "*";
  }
  if (options.orderby) {
    $orderby = options.orderby;
  } else {
    $orderby = "id";
  }
  if (options.sorts) {
    $sort = options.sorts;
  } else {
    $sort = "DESC";
  }
  sql = ("SELECT " + $fields + " FROM `" + $tbname + "` ") + $where + (" ORDER BY " + $orderby + " " + $sort + " ") + $limit;

  // console.log(sql);
  return sql;
};

sql_select_simple = function (tbname) {
  sql = "SELECT * FROM " + tbname;
  // console.info(sql);
  return sql;
}

sql_insert = function (tbname) {
  sql = "INSERT INTO `" + tbname + "` SET ?";
  // console.info(sql);
  return sql;
};

sql_update = function (tbname, where, data) {
  sql = ("UPDATE " + tbname + " SET " + data) + (where ? " WHERE " + where : "");

  // console.log(sql);
  return sql;
};

sql_delete = function (tbname, where) {
  if (where) {
    sql = ("DELETE FROM " + tbname) + (" WHERE " + where);
  } else {
    sql = ("TRUNCATE TABLE " + tbname);
  }

  // console.log(sql);
  return sql;
};

sql_count = function (tbname, where) {
  sql = ("SELECT count(id) as count FROM `" + tbname + "` ") + (where ? " WHERE " + where : "");

  // console.log(sql);
  return sql;
};

exports.sql_query = async function (sql, params) {
  // console.log(sql);
  return await sql_query(sql, params);
};

exports.sql_select = async function (options) {
  return await sql_query(sql_select(options));
};

exports.sql_select_simple = async function (tbname) {
  return await sql_query(sql_select_simple(tbname));
};

exports.sql_insert = async function (tbname, params) {
  return await sql_query(sql_insert(tbname), params);
};

exports.sql_update = async function (tbname, data, where) {
  return await sql_query(sql_update(tbname, where, data));
};

exports.sql_delete = async function (tbname, where) {
  return await sql_query(sql_delete(tbname, where));
};

exports.sql_count = async function (tbname, where) {
  return await sql_query(sql_count(tbname, where));
};