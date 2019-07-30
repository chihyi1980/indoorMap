/**
 * Created by zhaop on 2015/12/15.
 */
require('../db/mongodb');
require('../util');
var cronJob = require('cron').CronJob;
var models = require('../model');
var Tagger = models.Tagger;

exports.job = new cronJob({
    cronTime:'00 00 00 * * *', //00 00 00 * * *,每天晚上0点
    onTick:function(){
        var  curTime = new Date().getTime();
        var day = 1000* 24 * 60 * 60;
        var tempDate = new Date(curTime - 5 * day);
        Tagger.remove({enterTime: {$lt: tempDate}})
            .batchSize(1000)
            .exec(function(err, ret){
            console.log(err, ret)
        })
    },
    start:false
});