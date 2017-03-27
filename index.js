// Node.js
//----------------------------------------------------------------------------
// Database wrapper providing convenience functions.
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function wrap(mysql) {

//----------------------------------------------------------------------------
// Returns full dataset, discards fields.

mysql.queryData = async function(x,y) {
  let [results, fields] = await this.query(x,y);
  return results;
};

//----------------------------------------------------------------------------
// Returns a single value

mysql.queryValue = async function(x,y) {
  let [results, fields] = await this.query(x,y);
  return results[0][fields[0].name];
};

//----------------------------------------------------------------------------
// Returns a single row.

mysql.queryRow = async function(x,y) {
  let [results, fields] = await this.query(x,y);
  return results[0];
};

//----------------------------------------------------------------------------
// Returns a column of data in asingle array/object

mysql.queryColumn = async function(x,y) {
  let [results, fields] = await this.query(x,y);
  let r;
  if (fields.length >= 2) {
    r = {};
    for (let i = 0; i<results.length; ++i) {
      r[results[i][fields[0].name]] = results[i][fields[1].name];
    }
  }
  else {
    r = [];
    for (let i = 0; i<results.length; ++i) {
      r[i] = results[i][fields[0].name];
    }
  }
  return r;
};

//----------------------------------------------------------------------------

mysql.insert = async function(table, columns, values) {
  let results, fields;
  // Three possibilities
  // string[string] columns, null
  // string[] columns, string[] values
  // string[] columns, string[][] values

  if (typeof values == "undefined") {
    [results, fields] = await this.query(
      "insert into "+table+" set ?",
      columns
    );
  }
  else {
    if (Array.isArray(values[0])) {
      [results, fields] = await this.query(
        "insert into "+table+" (??) values ?",
        [columns, values]
      );
    }
    else {
      [results, fields] = await this.query(
        "insert into "+table+" (??) values (?)",
        [columns, values]
      );
    }
  }

  return results.insertId;
}

//----------------------------------------------------------------------------

mysql.update = async function(table, values, wheres) {
  let v = [];
  for (i in wheres) {
    v.push(i+"="+this.escape(wheres[i]));
  }
  await this.query(
    "update "+table+" set ? where "+v.join(' and '),
    values
  );
}

//----------------------------------------------------------------------------

mysql.get = async function(table, id) {
  let row = await this.queryRow("select * from "+table+" where id="+id);
  return row;
}

//----------------------------------------------------------------------------

mysql.set = async function(table, values, id) {
  if (id) {
    await this.query("update "+table+" set ? where id="+id, values);
  }
  else {
    let [results, fields] = await this.query(
     "insert into "+table+" set ?", values
    );
    id = results.insertId;
  }
  return id;
}

//----------------------------------------------------------------------------

mysql.delete = function(table, id) {
  this.query("delete from "+table+" where id="+id);
}

}

//----------------------------------------------------------------------------

module.exports = wrap;

//----------------------------------------------------------------------------
// Copyright (C) Jaypha.
// Released under the Boost license.
// Authors: Jason den Dulk
//
