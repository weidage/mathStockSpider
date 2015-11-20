var mongoose = require('mongoose');    //引用mongoose模块
var db = mongoose.createConnection('127.0.0.1','mathopinion'); //创建一个数据库连接


var ArticSchema = new mongoose.Schema({
	  code:String,
	  name:String,
      readCount:Number,
      commetCount:Number,
      createDate:String,
      lastDate:String
    });
var ArticleModel = db.model('article',ArticSchema);

exports.insert = function (article){
 var article = new ArticleModel({code:article.code,name:article.name,readCount:article.readCount,commetCount:article.commetCount,createDate:article.createDate,lastDate:article.lastDate});
 article.save();
}

exports.queryByConditon = function (){
 
}
function closeConnection(){
	conn.end();
}

