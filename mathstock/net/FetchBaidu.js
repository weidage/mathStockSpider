var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var url = require('url').parse('http://guba.eastmoney.com/list,600067.html');
var http = require('http')
var fs = require('fs'); 
var mysql = require('mysql');
var BufferHelper = require('bufferhelper');
var forumArtic = require('../dao/ForumArtic.js');

http.get(url,function(res){
  var bufferHelper =
 new BufferHelper();
  res.on('data', function (chunk) {
    bufferHelper.concat(chunk);
  });
  res.on('end',function(){ 
  	var n=0;
    var body = iconv.decode(bufferHelper.toBuffer(),'UTF-8');
    $ = cheerio.load(body);
    var articleList =  $('.articleh');
    var articleObjectList = [];
    for (var i = 0; i < articleList.length; i++) {
    		var articleObject  = {};
			var articleNode = articleList[i];
			articleObject.readCount=$(articleNode).find('.l1').html();
			articleObject.commetCount=$(articleNode).find('.l2').html();
			articleObject.createDate=$(articleNode).find('.l6').html();
			articleObject.lastDate=$(articleNode).find('.l5').html();	
			forumArtic.insert(articleObject);
    }
	
  });
});

