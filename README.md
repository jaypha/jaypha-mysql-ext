# Jaypha MySQL Ext

Written by Jason den Dulk

A set of convenience functions to extend the functionality of your mysql
connection. These functions reflect very common database related tasks, and
can help reduce code overhead.

This module comes in two versions.

The first uses monkey patching (by adding functions to the mysql2 object,
no functions are overriden).

The second wraps the mysql2 object in another object contining the provided
functions.

## Requirements

Node (v7.7.3), mysql2

Makes use of promises, so use mysql2/promise.

## Install with NPM

```
npm install --save jaypha-mysql-ext
```

## Usage

For monkeypatch version

```javascript
const mysql2 = require('mysql2/promise');  
const mysqlExt = require('jaypha-mysql-ext');  

async function setup(config) {  
  let db = await mysql2.createConnection(config);  
  mysqlExt(db);  
  return db;  
}
```

For non-monkeypatch version

```javascript
const mysql2 = require('mysql2/promise');  
const mysqlExt = require('jaypha-mysql-ext/nomonkey');  

async function setup(config) {  
  let db = await mysql2.createConnection(config);  
  return mysqlExt(db);  
}
```
##API

### connection

In the non-monkeypatch version, the mysql2 object can be accessed through
the `connection` property.

### `queryValue(sql, values)`

Calls query with `sql` and `values` and returns a single value. The first value of
the first row.

```javascript
let n = db.queryValue("select name from sometable where id=?",[someId]);  
console.log("name is "+n);
```

### `queryRow(sql, values)`

Calls query with `sql` and `values` and returns the first row.

```js
let row = db.queryRow("select * from sometable where id=?",[someId]);  
console.log("row is "+row);
```

### `queryData(sql, values)`

Calls query with `sql` and `values` and returns the whole data set. Basically the
same as query except does not include field info.

```js
let data = db.queryData("select * from sometable");  
console.log("data is "+data);
```

### `queryColumn(sql, values)`

Calls query with `sql` and `values` and returns a single column. If the sql selects
one field, then `queryColumn` returns an array containing the values. If the sql
selects two or more, then an object is returned with the contents of the first
column as the keys and the contents of the second columns as the values.

```javascript
let column = db.queryColumns("select name from sometable");
console.log("array of names is "+column);

let obj = db.queryColumns("select id,name from sometable");
console.log("object mapping ids to names is "+obj);
```

If a key is repeated, it will overwrite any existing value.

### `insert(tableName, columns, values)`

A shortcut for insert statements. There are three cases

- If `columns` is an object (that is, not an array), then it is inserted to the database
using key/valus pairs. `values` is ignored.
- `columns` is an array and `values` is an array. Inserts a single row using `columns` and
`values`.
- `columns` is an array and `values` is a two dimensional array. Inserts multiple rows.
Each element of the `values` array is a row.

Returns the value of InsertId.

```javascript
let  id = db.insert("sometable", { id : 1, name : "john" });  
console.log("insert into sometable set id=1, name='john'");  
console.log("new row ID is "+id);

db.insert("sometable", [ "id", "name"], [1, "john"]);  
console.log("insert into sometable (id,name) values (1,'john')");

db.insert("sometable", [ "id", "name"], [[1, "john"]. [2, "jane"]]);  
console.log("insert into sometable (id,name) values (1,'john'), (2,'jane')");
```

### `update(tableName, values, wheres)`

A shortcut for update statements.

```js
db.update("sometable", { name : "john" }, { id : 1 });  
console.log("update into sometable set name='john' where id=1");
```

### `get(tableName, id)`

Selects a row where column 'id' is of value `id`. A column called 'id' must exist.

```js
let row = db.get("sometable", id);  
console.log("row is "+row);
```

### `set(tableName, values, id)`

Updates a table row where column 'id' is of value `id`. If no id is provided,
performs an insert instead. A column called 'id' must exist.

Returns the row's id.

```js
db.set("sometable", { name : "john" }, 1);  
let id = db.set("sometable", { name : "jane" });
```

### `delete(tableName, id)`

Deletes row `id` from the table. A column called 'id' must exist.

```js
db.delete("sometable", 1);
```

## License

Copyright (C) 2017 Jaypha.  
Distributed under the Boost Software License, Version 1.0.  
See http://www.boost.org/LICENSE_1_0.txt

