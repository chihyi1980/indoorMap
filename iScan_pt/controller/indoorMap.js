/**
 * Created by zhaop on 2016/1/13.
 */
var async = require('async');
var models = require('../model');
var Poi = models.OakPoi;
var Mall = models.OakMall;
var ObjectID = require('mongoose').Types.ObjectId;
var encryptJson = require('../atlas_crypto.js').encode;

exports.getBuildDetail = function(req, res){
    var id = req.query.id || req.body.id;
    if(id){
        Mall.findOne({$or:[{'buildings.poi_id': new ObjectID(id)},{'buildings.floors.poi_id': new ObjectID(id)}]}, {buildings:true}, function(err, ret){
            if(err || !ret){
                res.jsonp(500, {error: 'building not find'});
            }else{
                var floors = ret.buildings[0].floors || [];
                var tempFloors = [];
                async.each(floors,
                    function(floor, callback){
                        Poi.findOne({_id: floor.poi_id}, function(err, poi){
                            if(poi && !poi.deleted){
                                var tempObj = {};
                                tempObj[poi.displayName] = poi._id;
                                tempFloors.push(tempObj)
                            }
                            callback(err, poi)
                        })
                    },function(e, pois){
                        if(e){
                            res.jsonp(500, {error: e.toString()});
                        }else{
                            tempFloors.sort(function(a, b){
                                var keyA = Object.keys(a)[0],
                                    keyB = Object.keys(b)[0],
                                    numA = parseInt(keyA.match(/\d+/g)[0]),
                                    numB = parseInt(keyB.match(/\d+/g)[0]);
                                if(keyA.indexOf('B') > -1){
                                    numA = -numA;
                                }
                                if(keyB.indexOf('B') > -1){
                                    numB = -numB;
                                }
                                return numA - numB;
                            });
                            Resp.jsonpSucceedResp(res, {floors : tempFloors});
                        }
                    }
                )
            }
        })
    }else{
        res.jsonp(500, {error: 'Parameter lost: id.'})
    }
};

exports.getFloorSimple = function(req, res){
    var id = req.query.id;
    if(id){
        Mall.findOne({'buildings.floors.poi_id': new ObjectID(id)}, {buildings:true}, function(err, ret){
            if(err || !ret){
                Resp.jsonpErrResp(res, 'building not find');
            }else{
                var tempFloor;
                ret.buildings.forEach(function(build){
                    build.floors.forEach(function(floor){
                        if(floor.poi_id == id){
                            tempFloor = floor.frame;
                            tempFloor.id = id;
                            tempFloor.shops = [];
                            floor.shops.forEach(function(shop){
                                if(shop.matched){
                                    tempFloor.shops.push(shop.path);
                                }
                            })
                        }
                    })
                })
                if(tempFloor && tempFloor.id){
                    var mapArray = [];
                    mapArray[0] = tempFloor.id;
                    mapArray[1] = tempFloor.name;
                    mapArray[2] = tempFloor.minLon;
                    mapArray[3] = tempFloor.minLat;
                    mapArray[4] = tempFloor.width;
                    mapArray[5] = tempFloor.height;
                    mapArray[6] = [tempFloor.shape, (tempFloor.type || 'path'), (!!tempFloor.style ? convertStyle(tempFloor.style) : '')];
                    mapArray[7] = [];
                    if(!tempFloor.shopShapes){
                        tempFloor.shopShapes = []
                    }
                    tempFloor.shopShapes.forEach(function(shopShape){
                        if(shopShape){
                            var domType = shopShape.type || 'path',
                                domStyle = !!shopShape.style ? convertStyle(shopShape.style) : '';
                            var item = [shopShape.shapeType, shopShape.shape, domType, domStyle];
                            mapArray[7].push(item);
                        }
                    });
                    mapArray[8] = [];
                    tempFloor.shops.forEach(function(shop){
                        if(shop){
                            var item = [shop.x, shop.y, shop.saz, shop.id, shop.name, shop.prodId];
                            mapArray[8].push(item);
                        }
                    });
                    mapArray[9] = [];
                    if(!tempFloor.fac){
                        tempFloor.fac = [];
                    }
                    tempFloor.fac.forEach(function(fc){
                        if(fc){
                            var item = [fc.x, fc.y, fc.saz, fc.type, fc.text];
                            mapArray[9].push(item);
                        }
                    });
                    mapArray[10] = [];
                    if(!tempFloor.text){
                        tempFloor.text = [];
                    }
                    tempFloor.text.forEach(function(t){
                        if(t){
                            var item = [(t.x || t.centerX), (t.y || t.centerY), t.saz, (t.txt || t.text)];
                            mapArray[10].push(item);
                        }
                    });
                    mapArray[11] = tempFloor.geoInfo || {};
                    //var mapData = mapArray;
                    var mapData = encryptJson(req, mapArray);
                    Resp.jsonpSucceedResp(res, mapData);
                }else{
                    Resp.jsonpErrResp(res, 'no map data');
                }

            }
        })
    }else{
        Resp.jsonpErrResp(res, 'Parameter lost: id.')
    }
};
exports.getFloorFence2 = function(req, res){
    var floorId = req.body.floorId || req.query.floorId;
    if(!floorId || floorId === undefined){
        Resp.jsonpErrResp(res, {msg:'Param lost.'});
    }else{
        Poi.findOne({_id: floorId})
            .select('fences')
            .exec(function(err, ret){
                if(err){
                    Resp.jsonpErrResp(res, {msg: err.toString()});
                }else{
                    if(ret && ret.fences){
                        var fences = ret.fences;
                        var result = {};
                        if(fences.data){
                            for(var i in fences.data){
                                var temp = fences.data[i];
                                result[i] = [];
                                temp.forEach(function(item){
                                    if(item.directive !== 'Z'){
                                        result[i].push(item.point)
                                    }
                                })
                            }
                        }
                        Resp.jsonpSucceedResp(res,{ fences: result, fenceIds: fences.fids})
                    }else{
                        Resp.jsonpSucceedResp(res,{})
                    }
                }
            })
    }
}

var Resp = {
    jsonpErrResp : function(res, msg) {
        res.jsonp({
            result: 'failed',
            msg   : msg
        });
    }
    ,jsonpSucceedResp: function(res, data) {
        res.jsonp({
            result: 'succeed',
            data  : data
        });
    }
}

var convertStyle = function(str){
    var tempArr = str.replace(/^\s+|\s+$|"/g, '').split(/\s+/g );
    var res = '';
    tempArr.forEach(function(item){
        var tempStr = item.replace('=', ':');
        res += tempStr + ';'
    })
    return res;
}

exports.getFloorImg = function(req, res){
    var floorId = req.param('floorId');
    var defaultImg = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAC0lEQVR42mNgQAcAABIAAeRVjecAAAAASUVORK5CYII=';
    Poi.findOne({_id: floorId})
        .select('baseImg')
        .exec(function(err, poi){
            var img;
            if(poi && poi.baseImg){
                img = new Buffer( poi.baseImg, 'base64');
            }else{
                img = new Buffer( defaultImg, 'base64');
            }
            res.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
            res.write(img);
            res.end();
        })
}

exports.getFloorFence3 = function(req, res){
    var floorId = req.body.floorId || req.query.floorId;
    if(!floorId || floorId === undefined){
        Resp.jsonpErrResp(res, {msg:'Param lost.'});
    }else{
        Poi.findOne({_id: floorId})
            .select('fences')
            .exec(function(err, ret){
                if(err){
                    Resp.jsonpErrResp(res, {msg: err.toString()});
                }else{
                    if(ret && ret.fences){
                        var fences = ret.fences;
                        var result = {};
                        if(fences.data){
                            /*
                            for(var i in fences.data){
                                var temp = fences.data[i];
                                result[i] = [];
                                temp.forEach(function(item){
                                    if(item.directive !== 'Z'){
                                        result[i].push(item.point)
                                    }
                                })
                            }
                            */
                            var result2 = {};
                            for(var key in fences.fids)
                            {
                                var tmp = fences.fids[key];
                                var t1 = tmp.split('~')[0];
                                var t2 = tmp.split('~')[1];   
                                result2[t1] = t2;
                            }
                        }
                        Resp.jsonpSucceedResp(res, result2)
                    }else{
                        Resp.jsonpSucceedResp(res,{})
                    }
                }
            })
    }
}

