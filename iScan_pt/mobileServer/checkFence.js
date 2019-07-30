/**
 * Created by zhaop on 2017/11/27.
 */
var models = require('../model');
var Poi = models.OakPoi;
var Monitor = models.Monitor;

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

var checkFence = function(tag){
    var floorId = tag && tag['floorId'];
    var coord = tag && tag['coord'];
    if(floorId && coord){
        Poi.findOne({_id: floorId})
            .select('fences')
            .exec(function(err, ret){
                if(ret && ret.fences){
                    var fences = ret.fences,
                        fenceIds = fences.fids;

                    var proxy = {};
                    if(fences.data){
                        for(var i in fences.data){
                            if(fenceIds[i]){
                                var temp = fences.data[i];
                                proxy[i] = [];
                                temp.forEach(function(item){
                                    if(item.directive !== 'Z'){
                                        proxy[i].push(item.point)
                                    }
                                })
                            }
                        }
                        for(var i in proxy){
                            if(pointInPolygon(coord, proxy[i])){
                                var cameraAttr = fenceIds[i].split('~');
                                var monitor = {
                                    jobsiteId: tag['jobsiteId'],
                                    userId: tag['userId'],
                                    cameraId: cameraAttr[0],
                                    cameraName: cameraAttr[1]
                                };
                                new Monitor(monitor).save(function(err){
                                    if(err){
                                        console.log('monitor save err:',err);
                                    }
                                })
                            }
                        }
                    }
                }
            })
    }
};

exports.checkFence = checkFence;

//checkFence({
//    coord: {x: 484, y: 119},
//    floorId: '5821774ed425d9b80d6b6a8c',
//    jobsiteId: '58217b7bb7f302c20dc38ed5',
//    userId: 'zhaop'
//})