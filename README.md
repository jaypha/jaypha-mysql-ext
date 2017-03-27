# Jaypha MySQL Ext

Written by Jason den Dulk

A set of convenience functions to extend the functionality of your mysql
connection.

queryValue  
queryRow  
queryData  
queryColumn  
insert  
update  
get  
set  
delete  

## Requirements

Node (v7.7.3), mysql2

Makes use of promises, so use mysql2/promise.

## Use

require('jaypha-mysql-ext')

This uses monkey patching. If you prefer not to, use require('jaypha-mysql-ext/nomonkey')

## License

Copyright (C) 2017 Jaypha.  
Distributed under the Boost Software License, Version 1.0.  
See http://www.boost.org/LICENSE_1_0.txt

