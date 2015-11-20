var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var http = require('http');
var fs = require('fs'); 
var BufferHelper = require('bufferhelper');
var mysqlstock = require('../dao/StockComment.js');
var events = require("events");
var dateFormat = require("./DateUtil.js");



Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

//抓取论坛内容，解析内容
function fetchStockForum(url,forumFetchEvent,isEnd){
 http.get(url,function(res){
    console.log(url);
    console.log("fetch back。。。");
      var bufferHelper =
      new BufferHelper();
      res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
      });
      res.on('end',function(){ 
        console.log("fetch process。。。");
             var n=0;
             var body = iconv.decode(bufferHelper.toBuffer(),'UTF-8');
             $ = cheerio.load(body);
             var articleList =  $('.articleh');
             var articleObjectList = [];
             var nowdate = new Date();
             for (var i = 0; i < articleList.length; i++) {
                    var articleObject  = {};
                    var articleNode = articleList[i];
                    articleObject.readCount=$(articleNode).find('.l1').html();
                    articleObject.commetCount=$(articleNode).find('.l2').html();
                    articleObject.createDate=$(articleNode).find('.l6').html();
                    articleObject.articleCount=0;
                    articleObject.lastDate=$(articleNode).find('.l5').html(); 

                    articleObject.weekday=dateFormat.getWeeDay(nowdate.getFullYear()+"-"+articleObject.createDate);
                    articleObjectList.push(articleObject);
                    
             }
             if(isEnd){
                  forumFetchEvent.emit("forumPageFetchDone",articleObjectList,true);
             }else{
                  forumFetchEvent.emit("forumPageFetchDone",articleObjectList,false);
             }
            
       });
  });
 
}
//生成抓取url
function generateFetchUrl(stockCode,page){
    var fetchUrl = "http://guba.eastmoney.com/list,"+stockCode+"_"+page+".html"
    return fetchUrl;
} 
//单个抓取分发
function fetchStock (stock,pagesize){
   console.log("fetch stcok : "+stock.code);
    var pageCount;
    if(pagesize){
        pageCount = pagesize;
    }else{
        pageCount = 2;
    }

var forumFetchEvent = new events.EventEmitter();
var articleList =[];
var today = new Date();
var todaySimple = today.Format("MM-dd");
var todayString = today.Format("yyyy-MM-dd");
    //定义抓取返回内容处理事件
forumFetchEvent.on("forumPageFetchDone",function(articles,isEnd){
  console.log("fetch page done!!!");
        if(articles&&articles.length>0){
              for (var i = 0; i < articles.length; i++) {
                  var readCount2 = parseInt(articles[i].readCount);
                   if(readCount2>50000){
                          continue;
                   }
                   if(articles[i].lastDate.indexOf(articles[i].createDate)<0){
                          continue;
                   }
                articles[i].code = stock.code;
                    articles[i].name = stock.name;
                    mysqlstock.insert(articles[i]);
              };
        }
        
});




    for (var j = 0; j <= pageCount; j++) {
        var url = generateFetchUrl(stock.code,j);
        fetchStockForum(url,forumFetchEvent,j==(pageCount-1)?true:false);
        var now = new Date();
        var nowTime = now.getTime();
        var end = nowTime+1000;
        
    };
}
//pgm csvoiceserver 'grep "邮件发送" logs/csvoive/exp.log'
fetchStock({code:'600186',name:'莲花味精'},190);