/**
 * Created by zhaop on 2015/12/10.
 */
/*
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449669600000), $lte: new Date(1449673200000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151209_22-23.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449673200000), $lte: new Date(1449676800000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151209_23-24.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449676800000), $lte: new Date(1449680400000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_00-01.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449680400000), $lte: new Date(1449684000000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_01-02.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449684000000), $lte: new Date(1449687600000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_02-03.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449687600000), $lte: new Date(1449691200000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_03-04.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449691200000), $lte: new Date(1449694800000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_04-05.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449694800000), $lte: new Date(1449698400000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_05-06.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449698400000), $lte: new Date(1449702000000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_06-07.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449702000000), $lte: new Date(1449705600000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_07-08.csv
mongoexport -d iscan -c tagger -q '{enterTime: { $gte:new Date(1449705600000), $lte: new Date(1449709200000)},jobsiteId: ObjectId("563a06bd8b0251390b7cba4b")}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_08-09.csv
mongoexport -d iscan -c tagger -q '{iscanId: '88',enterTime: { $gte:new Date(1449709200000), $lte: new Date(1466172000000)}}' -f 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,' --csv -o zxbq20151210_09-10.csv
console.log(1,new Date('2016-06-17 22:00:00').getTime())
console.log(2,new Date('2015-12-09 23:00:00').getTime())
console.log(3,new Date('2015-12-10 00:00:00').getTime())
console.log(4,new Date('2015-12-10 01:00:00').getTime())
console.log(5,new Date('2015-12-10 02:00:00').getTime())
console.log(6,new Date('2015-12-10 03:00:00').getTime())
console.log(7,new Date('2015-12-10 04:00:00').getTime())
console.log(8,new Date('2015-12-10 05:00:00').getTime())
console.log(9,new Date('2015-12-10 06:00:00').getTime())
console.log(10,new Date('2015-12-10 07:00:00').getTime())
console.log(11,new Date('2015-12-10 08:00:00').getTime())
console.log(12,new Date('2015-12-10 09:00:00').getTime())
console.log(13,new Date('2015-12-10 10:00:00').getTime())
*/
require('../util');
var c_p = require('child_process');
var fs = require('fs');
var path = require('path');
var util = require('util');
var cronJob = require('cron').CronJob;

//csv 存储目录
var csv_dir = '/root/csv_storage/zxbq/';

var getFilename = function(dateStr){
    var date = new Date(dateStr);
    return [
        date.getFullYear(),
        (date.getMonth() + 1).toString().length == 1 ?  '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate(),
        date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours()
    ].join('_');
}
/**
 *@params (Int, Int,String)
 */
var getExportCMD = function(sTimestamp, eTimestamp, fname){
    var jobsiteId = '563a06bd8b0251390b7cba4b',
        fields = 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,createAt,jobsiteId,uuid,major,minor';
    return util.format(
        'mongoexport -d iscan -c tagger -q \'{enterTime: { $gt:new Date(%d), $lte: new Date(%d)},jobsiteId: ObjectId("%s")}\' -f \'%s\' --csv -o %s.csv'
        ,sTimestamp
        ,eTimestamp
        ,jobsiteId
        ,fields
        ,fname
    );
}

var csvExport = function(dateStr){
    var endTime = new Date(dateStr).getTime(),
        startTime = endTime - 3600 * 1000;
    var fname = path.join(csv_dir, getFilename(dateStr));
    var cmdStr = getExportCMD(startTime, endTime, fname);
    console.log(cmdStr)
    fs.exists(csv_dir, function(isExist){
        if(!isExist){
            c_p.exec('mkdir -p ' + csv_dir, function(err){
                if(!err){
                    c_p.exec(cmdStr, function(e,r){
                        if(e){
                            console.log(e.toString())
                        }else{
                            console.log(fname + '.csv created!')
                        }

                    })
                }else{
                    console.error('Error: Create dir failed!')
                }
            })
        }else{
            c_p.exec(cmdStr, function(e,r){
                if(e){
                    console.log(e.toString())
                }else{
                    console.log(fname + '.csv created!')
                }
            })
        }
    })
}

var deleteCsv48HourAgo = function(dateStr){
    var oldTime = new Date(dateStr).getTime() - 48 * 3600 * 1000;
    var tempFname = getFilename(oldTime);
    fs.exists(csv_dir, function(isExist){
        if(isExist){
            var fileList = fs.readdirSync(csv_dir);
            var delList = [];
            if(fileList){
                fileList.forEach(function(fname){
                    if(fname < tempFname){
                        delList.push(path.join(csv_dir,fname));
                    }
                })
                delList.forEach(function(delFile){
                    fs.unlinkSync(delFile, function(e){
                        console.log(e)
                    });
                    console.log(delFile + 'deleted!')
                })
            }
        }
    })
}

exports.job = new cronJob({
    cronTime:'00 40 * * * *',
    onTick:function(){
        var currentDate = new Date().Format('yyyy-MM-dd hh:00:00');
        deleteCsv48HourAgo(currentDate);
        csvExport(currentDate);
    },
    start:false
});

//deleteCsv48HourAgo('2015-12-13 13:45:00')
//csvExport('2015-12-11 13:45:00')

console.log(1,new Date('2016-06-17 22:00:00').getTime())
