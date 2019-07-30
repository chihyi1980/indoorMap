require('../db/mongodb');
require('../util');
var models = require('../model');
var async = require('async');
var Track = models.Track,
    Beacon = models.Beacon,
    Device = models.Device,
    Analysis = models.Analysis,
    Jobsite = models.Jobsite;

var build = function(dateList){
    Analysis.remove({date: {$in: dateList}}, function(err, ret){
        console.log(err, ret);
        myCron(dateList)
    });
}

function myCron(dateList){
    Jobsite.getAll(null,null, {isDel: false}, function(err, ret){
        var jMap = {};//jobsite
        if(ret){
            ret.forEach(function(item){
                jMap[item._id] = item.name;
            });
            dateList.forEach(function(curDate){
                creataData(curDate, jMap);
            });
        }
    });
}
function creataData(curDate, jMap){
    var start = curDate + ' 00:00:30',
        end = curDate + ' 23:59:30';
    Track.find({ enterTime:{'$gte': start, '$lt': end}, jobsiteId: {$ne: null}})
        .distinct('jobsiteId')
        .exec(function(err, jobsites){
            if(err || !(jobsites && jobsites.length)){
                console.log(err|| 'not found jobsites')
            }else{
                async.eachSeries(jobsites
                    , function(jid, callback){
                        Track.find({enterTime:{'$gte': start, '$lt': end}, jobsiteId: jid})
                            .select('enterTime userId jobsiteId')
                            .batchSize(1000)
                            .sort({enterTime: 1})
                            .exec(function(err, tracks){
                                if(err || !(tracks && tracks.length)){
                                    console.log(err|| 'not found tracks')
                                }else{
                                    var data15 = groupByUserId(tracks, 15, jMap);
                                    var data20 = groupByUserId(tracks, 20, jMap);
                                    var data30 = groupByUserId(tracks, 30, jMap);
                                    var newAnalysis = new Analysis({
                                        date: curDate,
                                        record: {
                                            30: data30,
                                            20: data20,
                                            15: data15
                                        },
                                        recordId: jid,
                                        type: 'byJobsite'
                                    });
                                    newAnalysis.save(function (err, ret) {
                                        if (!err) {
                                            console.log('success!')
                                        } else {
                                            console.log(err);
                                            console.log('failed!!!!!!!!!!!!!');
                                        }
                                        callback(null, 1);
                                    })
                                }
                            })
                    }, function(){
                        console.log('byJobsite created!!')
                    })
            }
        })
    Track.find({ enterTime:{'$gte': start, '$lt': end}, userId: {$exists: true}})
        .distinct('userId')
        .exec(function(err, users){
            if(err || !(users && users.length)){
                console.log(err|| 'not found users')
            }else{
                async.eachSeries(users
                    , function(userId, callback){
                        Track.find({enterTime:{'$gte': start, '$lt': end}, userId: userId})
                            .select('enterTime userId jobsiteId')
                            .batchSize(1000)
                            .sort({enterTime: 1})
                            .exec(function(err, tracks){
                                if(err || !(tracks && tracks.length)){
                                    console.log(err|| 'not found tracks byUser')
                                }else{
                                    var data15 = groupByJobsiteId(tracks, 15, jMap);
                                    var data20 = groupByJobsiteId(tracks, 20, jMap);
                                    var data30 = groupByJobsiteId(tracks, 30, jMap);
                                    var newAnalysis = new Analysis({
                                        date: curDate,
                                        record: {
                                            30: data30,
                                            20: data20,
                                            15: data15
                                        },
                                        recordId: userId,
                                        type: 'byUser'
                                    });
                                    newAnalysis.save(function (err, ret) {
                                        if (!err) {
                                            console.log('success!')
                                        } else {
                                            console.log('failed!!!!!!!!!!!!!');
                                        }
                                        callback(null, 1);
                                    })
                                }
                            })
                    }, function(){
                        console.log('byUser created!!')
                    })
            }
        })
}


function groupByUserId(taggers, ms, jMap){
    taggers = JSON.parse(JSON.stringify(taggers));
    var second = 60 * 1000;
    var proxy = {},
        users = [],
        res = {},
        list,
        tempDate;
    for(var i=0; i< taggers.length; ++i){
        var index = taggers[i].userId.replace(/\./g,'_');
        if(proxy[index] == undefined){
            proxy[index] = [];
            users.push(index);
        }
        tempDate = new Date(taggers[i].enterTime);
        taggers[i].time = new Date(taggers[i].enterTime).getTime();
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
        taggers[i].jobsite = jMap[taggers[i].jobsiteId];
        delete taggers[i].enterTime;
        proxy[index].push(taggers[i]);
    }
    users = users.sort(function(a,b){
        return a > b;
    });
    res.YList = users;
    res.data = {};
    for(var i in proxy){
        list = proxy[i];
        if(res.data[i] == undefined){
            res.data[i] = [];
        }
        list[0].type = 0;
        res.data[i].push(list[0]);
        for(var j = 1; j < list.length; ++j) {
            if(list[j].time - list[j-1].time > ms * second){
                var item1 = JSON.parse(JSON.stringify(list[j-1]));
                var item2 = JSON.parse(JSON.stringify(list[j]));
                tempDate = new Date(item1.time + 0.5 * second);
                item1.type = 1 ;
                item1.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
                item1.time = tempDate.getTime();
                item2.type = 0;
                res.data[i].push(item1);
                res.data[i].push(item2);
            }
        }
        if(res.data[i].length % 2  == 1){
            var temp = JSON.parse(JSON.stringify(list[list.length - 1]));
            tempDate = new Date(temp.time + 0.5 * second);
            temp.type = 1;
            temp.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
            temp.time = tempDate.getTime();
            res.data[i].push(temp);
        }
    }
    return res;
}

function groupByJobsiteId(taggers, ms, jMap){
    taggers = JSON.parse(JSON.stringify(taggers));
    var second = 60 * 1000;
    var proxy = {},
        jobs = [],
        res = {},
        list,
        tempDate;
    for(var i=0; i< taggers.length; ++i){
        var index = jMap[taggers[i].jobsiteId].replace(/\./g,'_');
        if(proxy[index] == undefined){
            proxy[index] = [];
            jobs.push(index);
        }
        tempDate = new Date(taggers[i].enterTime);
        taggers[i].time = new Date(taggers[i].enterTime).getTime();
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
        taggers[i].jobsite = jMap[taggers[i].jobsiteId];
        delete taggers[i].enterTime;
        proxy[index].push(taggers[i]);
    }

    jobs = jobs.sort(function(a,b){
        return a > b;
    });
    res.YList = jobs;
    res.data = {};
    for(var i in proxy){
        list = proxy[i];
        if(res.data[i] == undefined){
            res.data[i] = [];
        }
        list[0].type = 0;
        res.data[i].push(list[0]);
        for(var j = 1; j < list.length; ++j) {
            if(list[j].time - list[j-1].time > ms * second){
                var item1 = JSON.parse(JSON.stringify(list[j-1]));
                var item2 = JSON.parse(JSON.stringify(list[j]));
                tempDate = new Date(item1.time + 0.5 * second);
                item1.type = 1 ;
                item1.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
                item1.time = tempDate.getTime();
                item2.type = 0;
                res.data[i].push(item1);
                res.data[i].push(item2);
            }
        }
        if(res.data[i].length % 2  == 1){
            var temp = JSON.parse(JSON.stringify(list[list.length - 1]));
            tempDate = new Date(temp.time + 0.5 * second);
            temp.type = 1;
            temp.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60) + (+tempDate.getSeconds() / 3600);
            temp.time = tempDate.getTime();
            res.data[i].push(temp);
        }
    }
    return res;
}
build(['2016-07-30','2016-07-31']);
//console.log(getTimeList('2016-07-30'));
