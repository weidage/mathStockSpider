var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var http = require('http');
var fs = require('fs'); 
var BufferHelper = require('bufferhelper');
var events = require("events");
var md5 = require("./md5.js");
var dateFormat = require("./DateUtil.js");
var stockNews = require('../dao/StockNews.js');
var url = require('url').parse('http://finance.sina.com.cn/');
var keywords=["定增","预增","重组","复牌","定向增发","合并","并购","借壳","影子股票","非公开发行A股","重大合同","业绩剧增","收购","利好","上涨","下滑","停牌"];
//var portals=["http://finance.sina.com.cn/","http://money.163.com/","http://news.baidu.com/","http://finance.baidu.com/","http://finance.ifeng.com/","http://www.hexun.com/","http://finance.qq.com/","http://www.sse.com.cn/"];

var portals=[
{url:"http://finance.sina.com.cn/",
encode:"UTF-8"
},
{url:"http://money.163.com/",
encode:"GBK"
},
{url:"http://news.baidu.com/",
encode:"GB2312"
},
{url:"http://finance.baidu.com/",
encode:"UTF-8"
},
{url:"http://finance.ifeng.com/",
encode:"UTF-8"
},
{url:"http://www.hexun.com/",
encode:"UTF-8"
},
{url:"http://finance.qq.com/",
encode:"GB2312"
},
{url:"http://www.sse.com.cn/",
encode:"UTF-8"
},
];
var counter = portals.length;

function fetch(portal){
console.log(portal.url);
http.get(portal.url,function(res){
      var bufferHelper = new BufferHelper();
      res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
      });
      res.on('end',function(){ 
             var n=0;
             var body = iconv.decode(bufferHelper.toBuffer(),portal.encode);
             $ = cheerio.load(body);
             var links = $("a");
             for(var i = 0;i<links.length;i++){
             	var link = $(links[i]);
             	var title = link.text();
             	var href = link.attr("href");
             	var newsObject={};
             	 for(var j = 0;j<keywords.length;j++){
             	 	
             	 	if(title.indexOf(keywords[j])>=0){
             	 		newsObject.title= title;
             	 		newsObject.url =  nomalUrl(href,portal.url);
             	 		newsObject.md5 = md5.hex_md5(title+href); 
             	 		newsObject.createTime = dateFormat.formatNow('yyyy-MM-dd hh:mm'); 
             	 		stockNews.insert(newsObject);   

             	 		break;
             	 	}
             	 }

             }
            console.log(portal.url+"--done");
           counter--;
           if(counter==0){
                  stockNews.closeConnection();
           }
            
       });
  });

}

function fetchNews(){
		for(var x = 0;x<portals.length;x++){
				fetch(portals[x]);
		}

}


function nomalUrl(url,site){
	if(url.indexOf("/")){
		url = site+url;
	}
	return url;
}
fetchNews();