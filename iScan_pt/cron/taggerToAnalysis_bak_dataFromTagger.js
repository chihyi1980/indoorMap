require('../db/mongodb');
require('../util');
var cronJob = require('cron').CronJob;
var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device,
    Analysis = models.Analysis,
    Jobsite = models.Jobsite;


exports.job = new cronJob({
    cronTime:'00 30 00 * * *', //00 30 00 * * *,每天晚上12点半，把最近分析表的前3天的数据分析，app的缓存数据最多3天
    onTick:function(){
        var  curDate = new Date().Format('yyyy-MM-dd');
        var day = 1000* 24 * 60 * 60;
        Analysis.findOne()
            .sort({date: -1})
            .exec(function(err, ret){
                if(!err && ret){
                    var beginDate = ret.date;
                    beginDate = new Date(new Date(beginDate).getTime() - 3 * day).Format('yyyy-MM-dd');
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
                }
            });
    },
    start:false
});

function myCron(dateList){
    Jobsite.getAll(null,null, {isDel: false}, function(err, ret){
        var jMap = {};
        if(ret){
            ret.forEach(function(item){
                jMap[item._id] = item.name;
            });
            dateList.forEach(function(curDate){
                var beginTime = new Date(curDate + ' 00:01:00'),
                    endTime = new Date(curDate + ' 23:59:00');
                Tagger.aggregate([
                    {$match: {enterTime:{'$gte': beginTime, '$lt': endTime}, jobsiteId:{$ne: null}}},
                    {$group:{_id: '$jobsiteId',
                        taggers:{$push:{
                            deviceId: '$deviceId',
                            wifiId:'$wifiId',
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
                            var data15 = groupByUserId(item.taggers, 15, jMap);
                            var data20 = groupByUserId(item.taggers, 20, jMap);
                            var data30 = groupByUserId(item.taggers, 30, jMap);
                            var newAnalysis = new Analysis({
                                date: curDate,
                                record:{
                                    30: data30,
                                    20: data20,
                                    15: data15
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
                            wifiId:'$wifiId',
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
                            var data15 = groupByJobsiteId(item.taggers, 15, jMap);
                            var data20 = groupByJobsiteId(item.taggers, 20, jMap);
                            var data30 = groupByJobsiteId(item.taggers, 30, jMap);
                            var newAnalysis = new Analysis({
                                date: curDate,
                                record:{
                                    30: data30,
                                    20: data20,
                                    15: data15
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