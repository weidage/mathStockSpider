var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var url = require('url').parse('http://quote.eastmoney.com/stocklist.html');
var http = require('http')
var fs = require('fs'); 
var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'stock',
    port: 3306
});
conn.connect();
var BufferHelper = require('bufferhelper');

http.get(url,function(res){
  var bufferHelper = new BufferHelper();
  res.on('data', function (chunk) {
    bufferHelper.concat(chunk);
  });
  res.on('end',function(){ 
  	var n=0;
    var body = iconv.decode(bufferHelper.toBuffer(),'GBK');
    $ = cheerio.load(body);
    var stockList = $('ul li a[href]');
    var bufferHelper2 = new BufferHelper();
    for (var i = 0; i < stockList.length; i++) {
    	var stockNode = stockList[i];
        var stockValue = stockNode.children[0].data;
        if(typeof stockValue == "string"){
       	var chinaname = stockValue.substring(0,stockValue.indexOf("("));
    	var digname = stockValue.substring((stockValue.indexOf("(")+1),stockValue.indexOf(")"));
        if(digname==null||digname==''||digname==undefined){
        	continue;
        }
    	var sql = "insert into stock(code,name) values('"+digname+"','"+chinaname+"')";
    	conn.query(sql, function(err, rows, fields) {
   						 if (err) throw err;
   							 n++;
				});
        }
  	
    };
console.log(n);
conn.end();

  });
});

