var express = require('express');
var router = express.Router();
/**
 * Created by qiepei on 14-6-10.
 */
var server_options={'auto_reconnect':true, poolSize:1};
var db_options={
    w:-1,// 设置w=-1是mongodb 1.2后的强制要求，写入安全
    logger:{
        doDebug:true,
        debug:function(msg,obj){
            console.log('[debug]',msg);
        },
        log:function(msg,obj){
            console.log('[log]',msg);
        },
        error:function(msg,obj){
            console.log('[error]',msg);
        }
    }
};

var  mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var mongoServer = {};

var  server  = new mongodb.Server('localhost', 27017, server_options);
var  db = new mongodb.Db('library', server, db_options);

if(!db.openCalled){
    db.open(function(err, db){
        if(err)throw err;
        console.info('mongodb connected');
    });
}

mongoServer.getList = function(res){
    //db.open(function(err, db){
    // if(err)throw err;

    db.collection('books', {safe:true}, function(err, collection){
        if(err){
            console.log(err);
        }else{
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
                //db.close();
            });
        }

    });
    //});



}

mongoServer.updateList = function(res, param){
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
            console.log(newBook._id+","+typeof newBook._id);
            //var _id = new ObjectID(newBook._id);
            collection.update({_id:newBook._id}, newBook, {safe:true}, function(err, result){
                var result = {
                    "status": 0
                };
                result = JSON.stringify(result, null, 4);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(result);
            });
        }

    });
}

mongoServer.addList = function(res, param){
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
            });

        }

    });
}

/* GET users listing. */
router.get('/', function(req, res) {

    console.log("req.params.name="+req.originalUrl);

    var urlPart = req.originalUrl.split('?');
    var param = urlPart[1];
    var queryArray = urlPart[0].split('/');
    var action = queryArray[queryArray.length-1];


    console.log("action="+action);

    switch(action){
        case 'getlist':
            mongoServer.getList(res);
            break;
        case 'addlist':
            mongoServer.addList(res, param);
            break;
        case 'updatelist':
            mongoServer.updateList(res, param);
            break;
        default:
            res.send('respond with a resource');
    }


});

module.exports = router;
