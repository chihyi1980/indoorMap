require('../db/mongodb');
require('../util');
var cronJob = require('cron').CronJob;
var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device,
    Analysis = models.Analysis,
    Jobsite = models.Jobsite;

var job = new cronJob({
    cronTime:'00 05 00 * * 1-6',//00 05 00 * * 1-6
    onTick:function(){
        copy();
    },
    start:false
});
var day = 1000* 24 * 60 * 60;
var yesterday = new Date(new Date().getTime() - day).Format('yyyy-MM-dd');
Beacon.find({}).exec(function(err, beacons){
    if(!err){
        beacons.forEach(function(item){
            if(item.lat && item.lon && item.lat > 0 && item.lon > 0){
                var latStr = JSON.stringify(+item.lat),
                    lonStr = JSON.stringify(+item.lon);
                if(latStr.length >= 9 && lonStr.length >= 9){
                    var iscanId = item.iscanId;
                    var begin = new Date(yesterday + ' 00:00:00'),
                        end = new Date(yesterday + ' 23:59:59');
                    Tagger.update({iscanId: iscanId, enterTime:{$gte: begin, $lte: end}},
                        {$set:{lat: +item.lat, lon: +item.lon}}, {multi: true}, function(err, ret){
                            if(!err){
                                console.log(ret + ':' + iscanId);
                            }else{
                                console.log(err)
                            }
                        })
                }
            }
        })
    }
});