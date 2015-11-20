
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'stock',
    port: 3306
});
conn.connect();


exports.insert = function(stockNews){
var sql = "insert into stock_news(title,url,md5,creaetTime) values('"+stockNews.title+"','"+stockNews.url+"','"+stockNews.md5+"','"+stockNews.createTime+"')";

conn.query(sql, function(err, rows, fields) {
   						 if (err) console.log(err);
				});      
}
exports.closeConnection = function (){
	conn.end();
}