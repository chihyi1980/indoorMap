/**
 * Created by zhaop on 2017/11/27.
 */
var models = require('../model');
var Monitor = models.Monitor;
var Jobsite = models.Jobsite;
var Poi = models.OakPoi;
var async = require('async');

exports.getInPeriod = function(req, res){
    var start = req.body.start,
        end = req.body.end;
    var limit = req.body['limit'] || 10,
        skip = req.body['skip'] || 0;
    var condition = {
        createAt: {'$gte': new Date(start), '$lt': new Date(end)}
    };
    if(req.body.cameraId){
        condition.cameraId = req.body.cameraId;
    }
    if(req.body.jobsiteId){
        condition.jobsiteId = req.body.jobsiteId;
    }
    if(req.body.userId){
        condition.userId = req.body.userId;
    }
    async.series([
        function(callback){
            Monitor.count(condition)
                .exec(function(err,nums){
                    if(err){
                        callback(err, 1);
                    }else{
                        if(!limit){
                            callback(null ,1)
                        }else{
                            var total = Math.ceil(parseInt(nums)/parseInt(limit));
                            callback(null, total);
                        }
                    }
                });
        },
        function(callback){
            Monitor.getAll(limit, skip, condition, function(err, ret){
                callback(err, ret);
            });
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, {total: values[0], data: values[1]});
        }
    });
};

exports.getInPeriod2 = function(req, res){
    var start = req.body.start||req.query.start,
        end = req.body.end||req.query.end;
    var limit = req.body['limit'] || req.query.limit || 1000,
        skip = req.body['skip'] || req.query.skip || 0;
    var fenceId = req.body.fenceId || req.query.fenceId;
    var jobsiteId = req.body.jobsiteId || req.query.jobsiteId;
    var userId = req.body.userId || req.query.userId;

    var condition = {
        createAt: {'$gte': new Date(parseInt(start)), '$lt': new Date(parseInt(end))}
    };
    if(fenceId){
        condition.cameraId = fenceId;
    }
    if(jobsiteId){
        condition.jobsiteId = jobsiteId;
    }
    if(userId){
        condition.userId = userId;
    }
    async.series([
        function(callback){
            Monitor.count(condition)
                .exec(function(err,nums){
                    if(err){
                        callback(err, 1);
                    }else{
                        if(!limit){
                            callback(null ,1)
                        }else{
                            var total = Math.ceil(parseInt(nums)/parseInt(limit));
                            callback(null, total);
                        }
                    }
                });
        },
        function(callback){
            Monitor.getAll(limit, skip, condition, function(err, ret){
                callback(err, ret);
            });
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, {data: values[1]});
        }
    });
};

exports.getByUserInPeriod = function(req, res){

};

exports.getCameraList = function(req, res){
    var loginUser = req.session.loginUser;
    var ownerId = loginUser._id;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    Monitor.find({cameraId: {$ne: null}})
        .distinct('cameraId')
        .exec(function(err, ret){
            if(ret){
                var list = [];
                async.each(ret, function(id, callback){
                    Monitor.findOne({cameraId: id})
                        .sort({createAt: -1})
                        .exec(function(err, ret2){
                            if(ret2){
                                var jobsiteId = ret2.jobsiteId;
                                Jobsite.findOne({_id: jobsiteId})
                                    .exec(function(err, site){
                                        if(site && site.ownerId == ownerId){
                                            list.push({
                                                id: id,
                                                name: ret2.cameraName
                                            })
                                        }
                                        callback(null)
                                    })
                            }else{
                                callback(null)
                            }
                        })
                }, function(){
                    res.jsonp(200, list)
                })

            }else{
                res.jsonp(200, [])
            }
        })
};

var pointInPolygon = function(point, vertex) {
    var i,
        polySides = vertex.length,
        j = polySides - 1,
        x = point.x,
        y = point.y,
        oddNodes = false,
        slope;
    for (i = 0; i < polySides; ++i) {
        if (((vertex[i][1] < y && vertex[j][1] >= y) || (vertex[j][1] < y && vertex[i][1] >= y)) && (vertex[i][0] <= x || vertex[j][0] <= x)) {
            slope = (vertex[j][0] - vertex[i][0]) / (vertex[j][1] - vertex[i][1]);
            if (vertex[i][0] + (y - vertex[i][1]) * slope < x) {
                oddNodes = !oddNodes
            }
        }
        j = i
    }
    return oddNodes
};

exports.getFence = function(req, res){
    var floorId = req.params.floorId,
        x = req.params.x,
        y = req.params.y;
    if(floorId && !isNaN(+x) && !isNaN(+y)){
        Poi.findOne({_id: floorId})
            .select('fences')
            .exec(function(err, ret) {
                if (ret && ret.fences) {
                    var fences = ret.fences,
                        fenceIds = fences.fids;
                    var proxy = {};
                    if(fences.data) {
                        for (var i in fences.data) {
                            if (fenceIds[i]) {
                                var temp = fences.data[i];
                                proxy[i] = [];
                                temp.forEach(function (item) {
                                    if (item.directive !== 'Z') {
                                        proxy[i].push(item.point)
                                    }
                                })
                            }
                        }
                        for(var i in proxy){
                            if(pointInPolygon({x: x, y: y}, proxy[i])){
                                var cameraAttr = fenceIds[i].split('~');
                                var camera = {
                                    id: cameraAttr[0],
                                    name: cameraAttr[1]
                                };
                                return res.jsonp(200, {exists:true, camera: camera, points: proxy[i] });
                            }
                        }
                        res.jsonp(200, {exists: false})
                    }
                }
            })
    }else{
        res.jsonp(200, {msg: 'Invalid params.'})
    }
};