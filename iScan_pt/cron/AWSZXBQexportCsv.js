require('../util');
var c_p = require('child_process');
var fs = require('fs');
var path = require('path');
var util = require('util');
var cronJob = require('cron').CronJob;

//csv 存储目录
var csv_dir = '/home/ec2-user/csv_storage/zxbq/';
//mg目录
var mgExport = '/usr/local/bin/mongoexport'

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
        'sudo s% -d iscan -c tagger -q \'{enterTime: { $gt:new Date(%d), $lte: new Date(%d)},jobsiteId: ObjectId("%s")}\' -f \'%s\' --csv -o %s.csv'
        ,mgExport
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
    fs.exists(csv_dir, function(isExist){
        if(!isExist){
            c_p.exec('sudo mkdir -p ' + csv_dir, function(err){
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