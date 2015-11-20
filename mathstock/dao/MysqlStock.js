
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'stock',
    port: 3306
});
conn.connect();


exports.insert = function(stock){
var sql = "insert into stock_comment(code,name,readCount,commentCount,articleCount,createDate,lastDate,weekday) values('"+stock.code+"','"+stock.name+"',"+stock.readCount+","+stock.commetCount+","+stock.articleCount+",'"+stock.createDate+"','"+stock.lastDate+"','"+stock.weekday+"')";

conn.query(sql, function(err, rows, fields) {
   						 if (err) throw err;
				});      
}
function closeConnection(){
	conn.end();
}