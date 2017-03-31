// Node.js
//----------------------------------------------------------------------------
// Database wrapper providing convenience functions.
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function wrap(mysql) {
  return new JayphaDB(mysql);
}

//----------------------------------------------------------------------------

function JayphaDB(connection) {
  this.connection = connection;
}

//----------------------------------------------------------------------------
// Alias for jayphaDb.connection.query

JayphaDB.prototype.query = async function(x,y) {
  let [results, fields] = await this.connection.query(x,y);
  return [results, fields];
};

//----------------------------------------------------------------------------
// Returns full dataset, discards fields.

JayphaDB.prototype.queryData = async function(x,y) {
  let [results, fields] = await this.connection.query(x,y);
  return results;
};

//----------------------------------------------------------------------------
// Returns a single value

JayphaDB.prototype.queryValue = async function(x,y) {
  let [results, fields] = await this.connection.query(x,y);
  return results[0][fields[0].name];
};

//----------------------------------------------------------------------------
// Returns a single row.

JayphaDB.prototype.queryRow = async function(x,y) {
  let [results, fields] = await this.connection.query(x,y);
  return results[0];
};

//----------------------------------------------------------------------------
// Returns a column of data in asingle array/object

JayphaDB.prototype.queryColumn = async function(x,y) {
  let [results, fields] = await this.connection.query(x,y);
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
// Shortcut for INSERT

JayphaDB.prototype.insert = async function(table, columns, values) {
  let results, fields;
  // Three possibilities
  // columns: object, values: ignored
  // columns: array, values: array
  // columns: array, values: 2D array

  if (!Array.isArray(columns)) {
    [results, fields] = await this.connection.query(
      "insert into "+table+" set ?",
      columns
    );
  }
  else {
    if (Array.isArray(values[0])) {
      [results, fields] = await this.connection.query(
        "insert into "+table+" (??) values ?",
        [columns, values]
      );
    }
    else {
      [results, fields] = await this.connection.query(
        "insert into "+table+" (??) values (?)",
        [columns, values]
      );
    }
  }

  return results.insertId;
}

//----------------------------------------------------------------------------
// Shortcut for UPDATE

JayphaDB.prototype.update = async function(table, values, wheres) {
  let v = [];
  for (i in wheres) {
    v.push(i+"="+this.connection.escape(wheres[i]));
  }
  await this.connection.query(
    "update "+table+" set ? where "+v.join(' and '),
    values
  );
}

//----------------------------------------------------------------------------
// Selects a row using an ID

JayphaDB.prototype.get = async function(table, id) {
  let row = await this.queryRow("select * from "+table+" where id="+id);
  return row;
}

//----------------------------------------------------------------------------
// Updates/inserts a row using an ID

JayphaDB.prototype.set = async function(table, values, id) {
  if (id) {
    await this.connection.query("update "+table+" set ? where id="+id, values);
  }
  else {
    let [results, fields] = await this.connection.query(
     "insert into "+table+" set ?", values
    );
    id = results.insertId;
  }
  return id;
}

//----------------------------------------------------------------------------
// Deletes a row using an ID

JayphaDB.prototype.delete = function(table, id) {
  this.connection.query("delete from "+table+" where id="+id);
}

//----------------------------------------------------------------------------

module.exports = wrap;

//----------------------------------------------------------------------------
// Copyright (C) Jaypha.
// Released under the Boost license.
// Authors: Jason den Dulk
//
