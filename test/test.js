// Node.js
//----------------------------------------------------------------------------
// Test script
//----------------------------------------------------------------------------

console.log("Testing jaypha-mysql-plus");

const mysql2 = require('mysql2/promise');

const myWrap = require('../index.js');

const tableName = "__TestTable__";
const tableDef = "CREATE TABLE `"+tableName+"` (`id` int(11) NOT NULL AUTO_INCREMENT,  `name` varchar(255) NOT NULL DEFAULT '',  `age` int(11) DEFAULT NULL,  PRIMARY KEY (`id`)) ENGINE=MEMORY DEFAULT CHARSET=utf8mb4;";

(async function(){

  let db = await mysql2.createConnection
  (
    {
      host:'localhost',
      user: 'root',
      password: '',
      database: 'mysql'
    }
  );

  myWrap(db);

  await db.query("drop table  if exists `"+tableName+"`");
  await db.query(tableDef);
  let data = await db.queryValue("show tables like '"+tableName+"'");
  console.log(data);

  let id = await db.insert(tableName, ['name', 'age'], ['blue', 36 ]);
  console.log("id = "+id);
  let row = await db.get(tableName, id);
  console.log(row);

  id = await db.insert(tableName, { name: 'john', age: 13 });
  console.log("id = "+id);
  row = await db.get(tableName, id);
  console.log(row);

  id = await db.insert(tableName, ['name', 'age'], [['max', 12], ['wren', 24], ['jill', 18]]);
  console.log("id = "+id);

  id = await db.set(tableName, { name: 'will' }, 1);
  console.log("id = "+id);
  row = await db.get(tableName, 1);
  console.log(row);

  id = await db.set(tableName, { age: 100 });
  console.log("id = "+id);
  row = await db.get(tableName, id);
  console.log(row);

  await db.delete(tableName, 2);

  row = await db.queryData("select * from "+tableName);
  console.log(row);

  await db.query("drop table  if exists `"+tableName+"`");
  
})().then(
function(){
  console.log("Testing finished");
  process.exit(0);
});


//----------------------------------------------------------------------------
// Copyright (C) Jaypha.
// Released under the Boost license.
// Authors: Jason den Dulk
//
