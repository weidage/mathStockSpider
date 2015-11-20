var mongoose = require('mongoose');    //引用mongoose模块
var db = mongoose.createConnection('127.0.0.1','mathopinion'); //创建一个数据库连接


var StockSchema = new mongoose.Schema({
      code:String,
      name:String
    });
var 	StockModel = db.model('stock',StockSchema);

exports.insert = function (stock){
 var stock = new StockModel(stock);
 stock.save();
}

exports.loadAllStock = function (callback){
StockModel.find({},callback);

}
