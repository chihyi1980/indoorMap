/**
 * Created by zhaop on 2015/11/11.
 */
require('../db/mongodb');
require('../util');
var async = require('async');
var cronJob = require('cron').CronJob;
var models = require('../model');
var crypto = require('crypto');
var ObjectId = require('mongoose').Types.ObjectId;
var Location = models.Location,
    Device = models.Device,
    Jobiste = models.Jobsite,
    OakMall = models.OakMall,
    Track = models.Track;

//每隔30秒执行一次
//注意：tagger表中的数据，如果enterTime和createAt之间误差比较大，就会导致无法生成数据到Track表中
exports.job = new cronJob({
    cronTime:'* * * * * *',
    onTick:function(){
        var currentDate = new Date();
        var seconds = currentDate.getSeconds();
        if(seconds == 0 || seconds == 30){
            var currentTime = currentDate.getTime();
            var  startTime = currentTime -  60 * 1000;
            var enterTimeList = [];
            while(startTime < currentTime){
                var tempObj = {
                    enter: new Date(startTime).Format('yyyy-MM-dd hh:mm:ss'),
                    begin: new Date(startTime - 30 * 1000).Format('yyyy-MM-dd hh:mm:ss'),
                    end:  new Date(startTime).Format('yyyy-MM-dd hh:mm:ss')
                }
                enterTimeList.push(tempObj)
                startTime += 30 * 1000;
            }
            enterTimeList.forEach(function(time){
                myJob(time.enter, time.begin,time.end);
            })
        }
    },
    start:false
});

var usersCache = {};
var jobsitesCache = {};

var myJob = function(enterTime, beginTime, endTime){
    Location.aggregate([
        {$sort : { time : -1 }},
        {$match: {time:{$gt: beginTime, $lte: endTime}}},
        {$group: {_id: '$deviceId',
            val: {
                $first:{
                    deviceId: '$deviceId',
                    floorId: '$floorId',
                    time: '$time',
                    x: '$x',
                    y: '$y'
                }
            }
        }}
    ], function(err, ret){
        if(err || !(ret && ret.length)){
            console.log(err, ret, beginTime + ' ~ ' + endTime + ': Location no data!');
        }else{
            var proxy = [];
            async.eachSeries(ret
                ,function(loc, callback){
                    dataHandle(loc.val, function(data){
                        if(data){
                            Track.findOne({trackId: data.trackId}, function(err, track){
                                if(!err && track){
                                    console.log('已存在：' + data.trackId);
                                }else{
                                    proxy.push(data)
                                }
                                callback(null)
                            })
                        }else{
                            callback(null)
                        }
                    })
                },function(){
                    if(proxy.length == 0){
                        console.log('没有数据！')
                    }else {
                        Track.create(proxy, function(e, r){
                            if(e){
                                console.log(e.toString());
                            }else{
                                console.log('执行成功' + proxy.length);
                            }
                        })
                    }
                }
            )
        }
    })
}
var getMd5Str = function(str){
    var md5 = crypto.createHash('md5');
    return md5.update(str.trim()).digest('hex');
};
var getUserId = function(deviceId, callback){
    Device.findOne({serialId:  new RegExp('^\s*' + deviceId + '\s*$', 'gi')})
        .exec(function(err, device){
            if(!err && device){
                callback(device)
            }else{
                callback(null)
            }
        })
}
var getJobsiteId = function(floorId, callback){
   Jobiste.findOne({mapId:  new RegExp('^\s*' + floorId + '\s*$', 'gi')})
       .exec(function(err, ret){
           if(!err && ret){
               callback(ret)
           }else{
               OakMall.findOne({'buildings.floors.poi_id': ObjectId(floorId)})
                   .exec(function(e, r){
                       if(!e && r){
                           var buildId = r.buildings[0].poi_id;
                           Jobiste.findOne({mapId:  new RegExp('^\s*' + buildId + '\s*$', 'gi')})
                               .exec(function(error, jt){
                                   if(!error && jt){
                                       callback(jt)
                                   }else{
                                       callback(null)
                                   }
                               })
                       }else{
                           callback(null)
                       }
                   })
           }
       })
}
var dataHandle = function(loc, callback){
    var deviceId = loc.deviceId,
        floorId = loc.floorId;
    if(!deviceId || !floorId){
        return callback(null);
    }
    var res = {
        mapFloorId: loc.floorId,
        flag:1,
        enterTime: loc.time,
        trackId: getMd5Str(loc.time + loc.deviceId),
        coordinate: isNaN(+loc.x) || isNaN(+loc.y) ? null :[+loc.x, +loc.y],
        userId: null,
        jobsiteId: null
    };
    async.waterfall([
        function(cback){
            if(usersCache[deviceId]){
                res.userId = usersCache[deviceId]
                cback(null)
            }else{
                getUserId(deviceId, function(data){
                    if(data){
                        res.userId = data.userId;
                        usersCache[deviceId] = data.userId;
                        cback(null)
                    }else{
                        cback(null)
                    }
                })
            }
        }
        ,function(cback){
            if(jobsitesCache[floorId]){
                res.jobsiteId = jobsitesCache[floorId];
                cback(null);
            }else{
                getJobsiteId(floorId, function(data){
                    if(data){
                        res.jobsiteId = data._id;
                        jobsitesCache[floorId] = data._id;
                        cback(null);
                    }else{
                        cback(null);
                    }
                })
            }
        }
    ],function(){
        if(!res.userId || !res.jobsiteId){
            callback(null)
        }else{
            callback(res);
        }
    })
}

/*
var loc = { deviceId: '78:A5:04:8F:75:72',
    floorId: '5639d0d265b8ff5a024e86bc',
    time: '2016-01-28 16:00:30',
    x: 100,
    y: 100 };

myJob('2016-01-28 16:00:30', '2016-01-28 16:00:00','2016-01-28 16:00:30')
*/
//exports.job.start();