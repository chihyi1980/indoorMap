require('../db/mongodb');
require('../util');
var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device,
    Analysis = models.Analysis,
    Jobsite = models.Jobsite;

var  curDate = new Date().Format('yyyy-MM-dd');
var day = 1000* 24 * 60 * 60;
Analysis.findOne()
    .sort({date: -1})
    .exec(function(err, ret){
        var beginDate;
        if(!err && ret){
            beginDate = ret.date;
            beginDate = new Date(new Date(beginDate).getTime() - 1 * day).Format('yyyy-MM-dd');
        }else{
            beginDate = new Date(new Date().getTime() - 2 * day).Format('yyyy-MM-dd');
        }
        var dateList = [];
        while(beginDate < curDate ){
            dateList.push(beginDate);
            beginDate = new Date(new Date(beginDate).getTime() + day).Format('yyyy-MM-dd');
        }
        //console.log(dateList)
        Analysis.remove({date: {$in: dateList}}, function(err, ret){
            console.log(err, ret);
            myCron(dateList)
        });
    });

function myCron(dateList){
    Jobsite.getAll(null,null, {isDel: false}, function(err, ret){
        var jMap = {};
        if(ret){
            ret.forEach(function(item){
                jMap[item._id] = item.name;
            });
            dateList.forEach(function(curDate){
                var beginTime = new Date(curDate + ' 00:00:00'),
                    endTime = new Date(curDate + ' 23:59:59');
                Tagger.aggregate([
                    {$match: {enterTime:{'$gte': beginTime, '$lt': endTime}, jobsiteId:{$ne: null}}},
                    {$group:{_id: '$jobsiteId',
                        taggers:{$push:{
                            deviceId: '$deviceId',
                            beaconId:'$beaconId',
                            enterTime:'$enterTime',
                            userId: '$userId',
                            jobsiteId: '$jobsiteId',
                            lat:'$lat',
                            lon: '$lon'
                        }}}}
                ], function(err, ret){
                    if(err || !(ret && ret.length)){
                        console.log(err)
                    }else{
                        ret.forEach(function(item){
                            var dataSix = groupByUserId(item.taggers, 6, jMap);
                            var dataFifteen = groupByUserId(item.taggers, 15, jMap);
                            var newAnalysis = new Analysis({
                                date: curDate,
                                record:{
                                    six: dataSix,
                                    fifteen: dataFifteen
                                },
                                recordId: item._id,
                                type: 'byJobsite'
                            });
                            newAnalysis.save(function(err, ret){
                                if(!err){
                                    console.log('success!')
                                }else{
                                    console.log(err);
                                    console.log('failed!!!!!!!!!!!!!');
                                }
                            })
                        });
                    }
                });

                Tagger.aggregate([
                    {$match: {enterTime:{'$gte': beginTime, '$lt': endTime}, jobsiteId:{$ne: null}}},
                    {$group:{_id: '$userId',
                        taggers:{$push:{
                            deviceId: '$deviceId',
                            beaconId:'$beaconId',
                            enterTime:'$enterTime',
                            userId: '$userId',
                            jobsiteId: '$jobsiteId',
                            lat:'$lat',
                            lon: '$lon'
                        }}}}
                ], function(err, ret){
                    if(err || !(ret && ret.length)){
                        console.log(err)
                    }else{
                        ret.forEach(function(item){
                            var dataSix = groupByJobsiteId(item.taggers, 6, jMap);
                            var dataFifteen = groupByJobsiteId(item.taggers, 15, jMap)
                            var newAnalysis = new Analysis({
                                date: curDate,
                                record:{
                                    six: dataSix,
                                    fifteen: dataFifteen
                                },
                                recordId: item._id,
                                type: 'byUser'
                            });
                            newAnalysis.save(function(err, ret){
                                if(!err){
                                    console.log('success!')
                                }else{
                                    console.log('failed!!!!!!!!!!!!!');
                                }
                            })
                        });
                    }
                });
            });
        }
    });
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
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
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
        for(var j = 1; j < list.length -1; ++j) {
            if(list[j].time - list[j-1].time > ms * second){
                var item1 = JSON.parse(JSON.stringify(list[j-1]));
                var item2 = JSON.parse(JSON.stringify(list[j]));
                tempDate = new Date(item1.time + ms * second);
                item1.type = 1 ;
                item1.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
                item1.time = tempDate.getTime();
                item2.type = 0;
                res.data[i].push(item1);
                res.data[i].push(item2);
            }
        }
        if(res.data[i].length % 2  == 1){
            var temp = JSON.parse(JSON.stringify(list[list.length - 1]));
            tempDate = new Date(temp.time + ms * second);
            temp.type = 1;
            temp.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
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
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
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
        for(var j = 1; j < list.length -1; ++j) {
            if(list[j].time - list[j-1].time > ms * second){
                var item1 = JSON.parse(JSON.stringify(list[j-1]));
                var item2 = JSON.parse(JSON.stringify(list[j]));
                tempDate = new Date(item1.time + ms * second);
                item1.type = 1 ;
                item1.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
                item1.time = tempDate.getTime();
                item2.type = 0;
                res.data[i].push(item1);
                res.data[i].push(item2);
            }
        }
        if(res.data[i].length % 2  == 1){
            var temp = JSON.parse(JSON.stringify(list[list.length - 1]));
            tempDate = new Date(temp.time + ms * second);
            temp.type = 1;
            temp.value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
            temp.time = tempDate.getTime();
            res.data[i].push(temp);
        }
    }
    return res;
}