require('../db/mongodb');
require('../util');
var cronJob = require('cron').CronJob;
var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device,
    Analysis = models.Analysis,
    Jobsite = models.Jobsite;

//简单生成模拟数据，暂时废弃未运行。
var job = new cronJob({
    cronTime:'00 05 00 * * 1-6',//00 05 00 * * 1-6
    onTick:function(){
        build();
    },
    start:false
});

job.start();

function build(){
    Device.find({isDel: false}, function(err, devices){
        if(devices){
            var otherIds = [];
            devices.forEach(function(item){
                otherIds.push(item.userId);
            });
            var day = 1000* 24 * 60 * 60;
            var yesterday = new Date(new Date().getTime() - day).Format('yyyy-MM-dd');
            var dateList = [yesterday];
            Tagger.remove({userId:{$not:{$in: otherIds}}}, function(err, taggers){
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

                                    buildTaggers(date + ' 08:40:00',date + ' 09:20:00', 10, userId, iscans, iscansMap);

                                    buildTaggers(date + ' 09:25:00',date + ' 11:40:00', 20, userId, iscans, iscansMap);

                                    buildTaggers(date + ' 12:00:00',date + ' 16:40:00', 20, userId, iscans, iscansMap);

                                    buildTaggers(date + ' 17:00:00',date + ' 17:35:00', 10, userId, iscans, iscansMap);

                                });

                            })
                        })
                    }
                });
            })
        }
    });
}

/**
 * begin,end: String ‘yyyy-mm-dd hh:mm:ss’
 * range: int  时间跨度，设5～20之间
 * userId: string 需要生成数据的用户
 * iscans: array iscanId的数组
 * iscansMap : object
 */
function buildTaggers(begin, end, range, userId, iscans, iscansMap){
    var minute = 1000 * 60;
    while (begin < end) {
        begin = new Date(new Date(begin).getTime() +
            Math.floor(Math.random() * 5 + 4) * minute +
            Math.floor(Math.random() * 59 + 1) * 1000).Format('yyyy-MM-dd hh:mm:ss');
        iscans.forEach(function (iscanId) {
            var newTagger = Tagger({
                iscanId: iscanId,
                beaconId: iscansMap[iscanId][1],
                jobsiteId: iscansMap[iscanId][0],
                userId: userId,
                lon: 120.581497,
                lat: 31.290632,
                enterTime: new Date(new Date(begin).getTime() +
                    Math.floor(Math.random() * range + 4) * minute +
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
    console.log('break!')
}