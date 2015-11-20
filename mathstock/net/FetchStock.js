var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var url = require('url').parse('http://quote.eastmoney.com/stocklist.html');
var http = require('http');
var stock = require('../dao/Stock.js');
var BufferHelper = require('bufferhelper');

http.get(url,function(res){
  
	console.log("fetch stock begin..");
  var bufferHelper = new BufferHelper();
  res.on('data', function (chunk) {
        bufferHelper.concat(chunk);
  });
  res.on('end',function(){ 
  	     console.log("fetch stock over..");
  	     var n=0;
         var body = iconv.decode(bufferHelper.toBuffer(),'GBK');
         $ = cheerio.load(body);
         var stockList = $('ul li a[href]');
         var bufferHelper2 = new BufferHelper();
         console.log("save stock begin..");
         for (var i = 0; i < stockList.length; i++) {
    	   var stockObject={};
    	   var stockNode = stockList[i];
         var stockValue = stockNode.children[0].data;
         if(typeof stockValue == "string"){
       	          var chinaname = stockValue.substring(0,stockValue.indexOf("("));
    	            var digname = stockValue.substring((stockValue.indexOf("(")+1),stockValue.indexOf(")"));
                  if(digname==null||digname==''||digname==undefined){
        	              continue;
                   }
		              stockObject.code=digname;
		              stockObject.name=chinaname;
  		            stock.insert(stockObject);
  	}
  	
    };
    console.log("save stock over..");
  });
});

