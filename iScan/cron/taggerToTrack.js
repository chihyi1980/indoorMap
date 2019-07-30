/**
 * Created by zhaop on 2015/11/11.
 */
require('../db/mongodb');
require('../util');
var async = require('async');
var cronJob = require('cron').CronJob;
var models = require('../model');
var crypto = require('crypto');
var Tagger = models.Tagger,
    Track = models.Track,
    Beacon = models.Beacon;

//每隔30秒执行一次
//注意：tagger表中的数据，如果enterTime和createAt之间误差比较大，就会导致无法生成数据到Track表中
exports.job = new cronJob({
    cronTime:'* * * * * *',
    onTick:function(){
        initTimeSpan(30);//默认 30秒产生一次数据
    },
    start:false
});
var initTimeSpan = function(num){
    num = (num === undefined)? 30: Math.min(Math.max(10, num),60);
    var currentDate = new Date();
    var seconds = currentDate.getSeconds();
    if(seconds % num == 0){
        var currentTime = currentDate.getTime();
        //var currentTime = currentDate.getTime() - num * 2 * 1000;
        var  startTime = currentTime -  num * 2 *  1000;
        var enterTimeList = [];
        while(startTime < currentTime){
            var tempObj = {
                begin: new Date(startTime - num * 1000),
                end:  new Date(startTime + 1)
            };
            enterTimeList.push(tempObj);
            startTime += num * 1000;
        }
        enterTimeList.forEach(function(time){
            myJob(time.begin,time.end);
        })
    }
};

var myJob = function(beginTime, endTime){
    Tagger.aggregate([
        {$sort : {createAt : -1 }},
        {$match: {createAt:{$gte: beginTime, $lte: endTime}, coord: {$ne: null}}},
        {$group: {_id: '$userId',
            val: {
                $first:{
                    userId: '$userId',
                    floorId: '$floorId',
                    coord: '$coord',
                    ownerId: '$ownerId',
                    jobsiteId: '$jobsiteId',
                    createAt: '$createAt'
                }
            }
        }}
    ], function(err, ret){
        if(err || !(ret && ret.length)){
            console.log(err, ret, endTime, 'no data')
        }else{
            var result = [];
            async.each(ret
                ,function(tag, callback){
                    var timeStr = new Date(tag.val.createAt).Format('yyyy-MM-dd hh:mm:ss');
                    var record ={
                        userId: tag._id,
                        enterTime: timeStr,
                        jobsiteId: tag.val.jobsiteId,
                        coordinate: [tag.val.coord.x, tag.val.coord.y],
                        trackId: getMd5Str(timeStr + tag._id), // enterTime + userId的md5字符串
                        ownerId: tag.val.ownerId,
                        mapFloorId: tag.val.floorId
                    };
                    Track.findOne({trackId: record.trackId}, function(err, ret){
                        if(err){
                            console.log(err.toString());
                            callback(err, 0)
                        }else{
                            if(ret){
                                console.log('已存在');
                            }else{
                                result.push(record);
                            }
                            callback(null, 0)
                        }
                    })
                },function(er, ret){
                    if(er){
                        console.log(er.toString());
                    }else{
                        if(result.length == 0){
                            console.log('没有数据！')
                        }else{
                            Track.create(result, function(e, r){
                                if(e){
                                    console.log(e.toString());
                                }else{
                                    console.log('执行成功' + result.length);
                                }
                            })
                        }
                    }
                }
            )
        }
    })
};

var getMd5Str = function(str){
    var md5 = crypto.createHash('md5');
    return md5.update(str.trim()).digest('hex');
};