/**
 * Created by qiepei on 14-6-10.
 */

var  mongodb = require('mongodb');
var  ObjectID = require('mongodb').ObjectID;

var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('library', server, {safe:true});

exports.getList = function(res){
    db.open(function(err,client){//数据库
        if(!err){
            console.log('connect db');
            db.collection('books', {safe:true}, function(err, collection){
                if(err){
                    console.log(err);
                }else{
                    //新增数据
                    // var tmp1 = {id:'1',title:'hello',number:1};
                    //          collection.insert(tmp1,{safe:true},function(err, result){
                    //              console.log(result);
                    //          });
                    //更新数据
                    // collection.update({title:'hello'}, {$set:{number:3}}, {safe:true}, function(err, result){
                    //     console.log(result);
                    // });
                    // 删除数据
                    // collection.remove({title:'hello'},{safe:true},function(err,result){
                    //                   console.log(result);
                    //               });

                    // console.log(collection);
                    // 查询数据
                    collection.find().toArray(function(err,docs){
                        var result = {
                            "status": 0,
                            "total" :docs.length,
                            "books":docs
                        };
                        result = JSON.stringify(result, null, 4);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(result);
                        db.close();
                    });
                }

            });
        }
    });
}

exports.updateList = function(res, param){
    console.log('in');
    db.open(function(err,client){//数据库
        if(!err){
            console.log('connect db');
            db.collection('books', {safe:true}, function(err, collection){
                if(err){
                    console.log(err);
                }else{
                    //新增数据
                    var newBook={};
                    var query = param.split('&');
                    for(var i= 0, l = query.length; i<l ;i++){
                        var obj = query[i].split('=');
                        var key = obj[0];
                        var value = obj[1];
                        newBook[ key ] = decodeURIComponent(value);
                    }
console.log("newBook._id=" + newBook._id);
                    console.log(newBook);

                    collection.update({_id:newBook._id}, newBook, {safe:true}, function(err, result){
                        var result = {
                            "status": 0
                        };
                        result = JSON.stringify(result, null, 4);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(result);
                        db.close();
                    });
                }

            });
        }
    });
}

exports.addList = function(res, param){
    console.log('in');
    db.open(function(err,client){//数据库
        if(!err){
            console.log('connect db');
            db.collection('books', {safe:true}, function(err, collection){
                if(err){
                    console.log(err);
                }else{
                    //新增数据
                    var newBook={};
                    var query = param.split('&');
                    for(var i= 0, l = query.length; i<l ;i++){
                        var obj = query[i].split('=');
                        var key = obj[0];
                        var value = obj[1];
                        newBook[ key ] = decodeURIComponent(value);
                    }

                    newBook._id = (1e4*(Date.now()+Math.random())).toString(16);

                    collection.insert(newBook,{safe:true},function(err, result){
                        var result = {
                            "status": 0
                        };
                        result = JSON.stringify(result, null, 4);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(result);
                        db.close();
                    });

                }

            });
        }
    });
}