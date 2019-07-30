require('../db/mongodb');
require('../util');
var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device,
    Analysis = models.Analysis,
    Jobsite = models.Jobsite;
var async = require('async');

var minute = 1000 * 60;

Device.find({isDel: false}, function(err, devices){
    if(devices){
        //var userIds = [];
        var otherIds = [];
        //var mustId = '子鱼';
        devices.forEach(function(item){
            /*if(item.userId !== mustId){
                otherIds.push(item.userId);
            }*/
            otherIds.push(item.userId);
            //userIds.push(item.userId);
        });
        var day = 1000* 24 * 60 * 60;
        var beginDate = '2015-02-03';
        var dateList = [];
        var today = new Date().Format('yyyy-MM-dd');
        while(beginDate < today){
            dateList.push(beginDate);
            beginDate = new Date(new Date(beginDate).getTime() + day).Format('yyyy-MM-dd');
        }
        Tagger.remove({userId:{$not:{$in: userIds}}}, function(err, taggers){
            console.log(err, taggers);
            Beacon.find({}, function(err, beacons){
                if(beacons){
                    var iscansMap = {};
                    var iscans = ['02','03','04','05','06','08', '09', '11', '12'];
                    beacons.forEach(function(items){
                        iscansMap[items.iscanId] = [items.jobsiteId, items.beaconId];
                    });
                    dateList.forEach(function(date){
                        var begin = date + ' 00:00:00',
                            end = date + ' 23:59:59';
                        otherIds.forEach(function(userId){
                            Tagger.remove({userId: userId, enterTime : {$gt: begin, $lt: end}}, function(err, ret) {
                                console.log(err, ret);
                                var begin1 = date + ' 08:40:00';
                                console.log(begin1);

                                while (begin1 < date + ' 09:20:00') {
                                    begin1 = new Date(new Date(begin1).getTime() +
                                        Math.floor(4) * minute +
                                        Math.floor(Math.random() * 59 + 1) * 1000).Format('yyyy-MM-dd hh:mm:ss');
                                    iscans.forEach(function (iscanId) {
                                        var newTagger = Tagger({
                                            iscanId: iscanId,
                                            beaconId: iscansMap[iscanId][1],
                                            jobsiteId: iscansMap[iscanId][0],
                                            userId: userId,
                                            lon: 120.581497,
                                            lat: 31.290632,
                                            enterTime: new Date(new Date(begin1).getTime() +
                                                Math.floor(Math.random() * 3 + 4) * minute +
                                                Math.floor(Math.random() * 59 + 1) * 1000)
                                        });
                                        newTagger.save(function (err, tag) {
                                            if (!err) {
                                                console.log('success!')
                                            } else {
                                                console.log(err)
                                            }
                                        })
                                    });
                                }
                                var begin2 = date + ' 09:25:00';
                                console.log(begin2)

                                while (begin2 < date + ' 11:40:00') {
                                    begin2 = new Date(new Date(begin2).getTime() +
                                        Math.floor(Math.random() * 10 + 4) * minute +
                                        Math.floor(Math.random() * 59 + 1) * 1000).Format('yyyy-MM-dd hh:mm:ss');
                                    iscans.forEach(function (iscanId) {
                                        var newTagger = Tagger({
                                            iscanId: iscanId,
                                            beaconId: iscansMap[iscanId][1],
                                            jobsiteId: iscansMap[iscanId][0],
                                            userId: userId,
                                            lon: 120.581497,
                                            lat: 31.290632,
                                            enterTime: new Date(new Date(begin2).getTime() +
                                                Math.floor(Math.random() * 18 + 4) * minute +
                                                Math.floor(Math.random() * 59 + 1) * 1000)
                                        });
                                        newTagger.save(function (err, tag) {
                                            if (!err) {
                                                console.log('success!')
                                            } else {
                                                console.log(err)
                                            }
                                        })
                                    });
                                }
                                var begin3 = date + ' 12:00:00';
                                console.log(begin3);

                                while (begin3 < date + ' 16:40:00') {
                                    begin3 = new Date(new Date(begin3).getTime() +
                                        Math.floor(Math.random() * 10 + 4) * minute +
                                        Math.floor(Math.random() * 59 + 1) * 1000).Format('yyyy-MM-dd hh:mm:ss');
                                    iscans.forEach(function (iscanId) {
                                        var newTagger = Tagger({
                                            iscanId: iscanId,
                                            beaconId: iscansMap[iscanId][1],
                                            jobsiteId: iscansMap[iscanId][0],
                                            userId: userId,
                                            lon: 120.581497,
                                            lat: 31.290632,
                                            enterTime: new Date(new Date(begin3).getTime() +
                                                Math.floor(Math.random() * 19 + 2) * minute +
                                                Math.floor(Math.random() * 59 + 1) * 1000)
                                        });
                                        newTagger.save(function (err, tag) {
                                            if (!err) {
                                                console.log('success!')
                                            } else {
                                                console.log(err)
                                            }
                                        })
                                    });
                                }
                                var begin4 = date + ' 17:00:00';
                                console.log(begin4);

                                while (begin4 < date + ' 17:35:00') {
                                    begin4 = new Date(new Date(begin4).getTime() +
                                        Math.floor(Math.random() * 3 + 4) * minute +
                                        Math.floor(Math.random() * 59 + 1) * 1000).Format('yyyy-MM-dd hh:mm:ss');
                                    iscans.forEach(function (iscanId) {
                                        var newTagger = Tagger({
                                            iscanId: iscanId,
                                            beaconId: iscansMap[iscanId][1],
                                            jobsiteId: iscansMap[iscanId][0],
                                            userId: userId,
                                            lon: 120.581497,
                                            lat: 31.290632,
                                            enterTime: new Date(new Date(begin4).getTime() +
                                                Math.floor(Math.random() * 3 + 2) * minute +
                                                Math.floor(Math.random() * 59 + 1) * 1000)
                                        });
                                        newTagger.save(function (err, tag) {
                                            if (!err) {
                                                console.log('success!')
                                            } else {
                                                console.log(err)
                                            }
                                        })
                                    });
                                }
                            });

                        })
                    })
                }
            });



        })
    }
});

function inArray(item, arr){
    var  flag = false;
    for(var i in arr){
        if(item == arr[i]){
            flag = true;
            break;
        }
    }
    return flag;
}