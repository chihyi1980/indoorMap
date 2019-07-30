/**
 * Created by zhaop on 2015/11/13.
 */
var models = require('../model');
var Track = models.Track;
var Tagger = models.Tagger;
var Beacon = models.Beacon;
var async = require('async');

var getNestRssiTag = function(tag){
    var  proxy = [];
    for(var i in tag){
        var tempArr = tag[i];
        var averageRssi = getAverageRssi(tempArr);
        var tempObj = tempArr[0];
        tempObj.rssi = averageRssi || -1000;
        proxy.push(tempObj);
    }
    proxy.sort(function(a, b){
        return b.rssi - a.rssi;
    })
    return proxy[0] || null;
}

var  getAverageRssi = function(arr){
    var count = arr.length;
    var sum = 0;
    var  threshold = -71;
    for(var i = 0,len=arr.length; i < len; ++i){
        if(arr[i].rssi){
            var tempRssi = arr[i].rssi.trim().match(/^-[0-9]+$/g)
            if(tempRssi){
                tempRssi = +tempRssi[0];
                threshold = Math.max(tempRssi, -71);
                sum += tempRssi;
            }else{
                count --;
            }
        }else{
            count --;
        }
    }
    if(count <=0){
        return null;
    }
    return threshold > -71? threshold : Math.round(sum / count);
}

exports.getByJobsiteRightNow = function(req, res){
    var jobsiteId = req.query.jobsiteId;
    var timeStr = req.query.time;
    var endTime = new Date(timeStr).getTime(),
        startTime = endTime - 30 * 1000;
    if(!timeStr || !jobsiteId){
        return res.jsonp(500, 'Params lost.');
    }
    Tagger.find({jobsiteId: jobsiteId, enterTime:{$gt: new Date(startTime), $lte: new Date(endTime)}, userId: {$ne: null}})
        .distinct('userId')
        .exec(function(err, users){
            if(err || !users || !users.length){
                res.jsonp(200, []);
            }else{
                var result = [];
                async.eachSeries(users
                    ,function(user, callback){
                        if(user == 'FF:FF:FF:FF:FF:FF'){
                            callback(null, 0);
                        }else{
                            Tagger.find({jobsiteId: jobsiteId,
                                    enterTime:{$gt: new Date(startTime), $lte: new Date(endTime)},
                                    userId: user,
                                    rssi: {$exists: true}}
                                ).sort({ enterTime : -1 })
                                .limit(10)
                                .exec(function(err, tags){
                                    if(tags){
                                        var temp = {};
                                        for(var i=0,len=tags.length; i<len; ++i ){
                                            if(!temp[tags[i].iscanId]){
                                                temp[tags[i].iscanId] = [];
                                            }
                                            temp[tags[i].iscanId].push(tags[i])
                                        }
                                        var proxy = getNestRssiTag(temp);
                                        if(proxy){
                                            var record = {
                                                userId: proxy.userId,
                                                iscanId: proxy.iscanId,
                                                flag: +proxy.rssi >= -70 ? 1 : 0,
                                                enterTime: timeStr
                                            };
                                            Beacon.findOne({iscanId: proxy.iscanId})
                                                .exec(function(err, beacon){
                                                    if(beacon){
                                                        record.mapFloorId = beacon.floorId;
                                                        if(beacon.x != undefined && beacon.y != undefined)
                                                            record.coordinate = [+beacon.x, +beacon.y];
                                                        result.push(record);
                                                    }
                                                    callback(null, 1)
                                                }
                                            )
                                        }else{
                                            callback(null, 0);
                                        }
                                    }else{
                                        callback(null, 0);
                                    }
                                })
                        }
                    }, function(err, ret){
                        if(err){
                            res.jsonp(500, {message: err.toString()});
                        }else{
                            res.jsonp(200, result);
                        }
                    })
            }
        })
};

exports.getByJobsiteIdInPeriod = function(req, res){
    var timeStr = req.query.time,
        jobsiteId = req.query.jobsiteId;

    if(timeStr && jobsiteId){
        var endTime, beginTime;
        
        if(timeStr.indexOf('-') != -1)
        {
            endTime = new Date(timeStr);
        }
        else
        {
            endTime = new Date(parseInt(timeStr));
        }

        beginTime = new Date(endTime.getTime() - 10 * 60 * 1000);

        Tagger.aggregate([
            {$sort : { createAt : -1}},
            {$match: {createAt:{$gte: beginTime, $lte: endTime}, jobsiteId: jobsiteId}},
            {$group: {_id: '$userId',
                val: {
                    $first:{
                        userId: '$userId',
                        floorId: '$floorId',
                        coord: '$coord',
                        ownerId: '$ownerId',
                        jobsiteId: '$jobsiteId',
                        createAt: '$createAt',
                        blt_status: '$blt_status',
                    }
                }
            }}
        ], function(err, ret){
            if(!err && ret){
                var result = [];
                ret.forEach(function(item){
                    result.push(item.val)
                });
                res.jsonp(200, result);
            }else{
                res.jsonp(500, {message: err.toString()});
            }
        });
    }else{
        res.jsonp(500, 'Params lost.')
    }
};

exports.getByUserId = function(req, res){
    var timeStr = req.query.time,
        userId = req.query.userId,
        timeArr;
    if(timeStr && userId){
        var tempDate, tempDate2;
        if(timeStr.indexOf('~') > -1){
            timeArr = timeStr.split(/\s*~\s*/)
        }else{
            timeArr = [timeStr, timeStr];
        }
        var start = new Date(timeArr[0]),
            startTime = start.getTime(),
            end = new Date(timeArr[1]),
            endTime = end.getTime();
        if(endTime - startTime < 30 * 1000){
            tempDate = new Date(endTime - 11 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
            tempDate2 = timeArr[1];
        }else{
            tempDate = timeArr[0];
            tempDate2 = timeArr[1];
        }
        Track.find({enterTime: {$gte: tempDate, $lte: tempDate2}, userId: userId})
            .select('enterTime userId coordinate mapFloorId')
            .sort({enterTime : -1})
            .batchSize(1000)
            .lean()
            .exec(function(err, tk){
                if(err){
                    res.jsonp(500, {message: err.toString()});
                }else{
                    console.log(tk.length);
                    res.jsonp(200, tk);
                }
            })
    }else{
        res.jsonp( 500, 'Params lost.')
    }
};

exports.getHistoryByUserId = function(req, res){
    var startP = req.query.start;
    var endP = req.query.end;
    var userId = req.query.userId;

    if(startP && endP && userId){
        var tempDate, tempDate2;
        var start = new Date(parseInt(startP)),
            startTime = start.getTime(),
            end = new Date(parseInt(endP)),
            endTime = end.getTime();
        if(endTime - startTime < 30 * 1000){
            tempDate = new Date(endTime - 11 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
            tempDate2 = end.Format("yyyy-MM-dd hh:mm:ss");
        }else{
            tempDate = start.Format("yyyy-MM-dd hh:mm:ss");
            tempDate2 = end.Format("yyyy-MM-dd hh:mm:ss");;
        }
        Track.find({enterTime: {$gte: tempDate, $lte: tempDate2}, userId: userId})
            .select('enterTime userId coordinate mapFloorId')
            .sort({enterTime : -1})
            .batchSize(1000)
            .lean()
            .exec(function(err, tk){
                if(err){
                    res.jsonp(500, {message: err.toString()});
                }else{
                    console.log(tk.length);
                    res.jsonp(200, tk);
                }
            })
    }else{
        res.jsonp( 500, 'Params lost.')
    }
};

exports.getUsersByJobsite = function(req, res){
    var jobsiteId = req.query.jobsiteId;
    var timeStr = req.query.time;
    var loginUser = req.session.loginUser;
    var ownerId, condition;
    if(loginUser){
        ownerId = loginUser._id;
    }
    if(timeStr && jobsiteId){
        var date = new Date(timeStr),
            time = date.getTime();
        var begin = new Date(time - 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss");
        if(ownerId){
            condition = {
                enterTime: {$gte: begin ,$lte: timeStr},
                jobsiteId: jobsiteId,
                ownerId: ownerId
            }
        }else{
            condition = {
                enterTime: {$gte: begin ,$lte: timeStr},
                jobsiteId: jobsiteId
            }
        }
        Track.aggregate([
            {$sort : { enterTime : 1 }},
            {$match: condition
            },
            {$group:
                {_id : '$userId'}
            }
        ], function(err, ret){
            res.jsonp(200, ret)
        })
    }else{
        res.jsonp( 500, 'Params lost.')
    }
};

var testCoord = models.testCoord;

exports.getCoord = function(req, res){
    testCoord.findOne({blt: req.params.blt})
        .lean()
        .exec(function(err, ret){
            if (err || !ret){
                res.jsonp(200, null);
            }else{
                var data = {
                    blt: ret.blt,
                    coord: ret.coord,
                    _coord: ret._coord,
                    list: ret.list.sort(function(a,b){
                        return a.rssi < b.rssi
                    }),
                    time: ret.time
                };
                res.jsonp(200, data);
            }
        })
};

