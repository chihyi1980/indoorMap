/**
 * Created by zhaop on 2015/12/21.
 */

var c_p = require('child_process');
var fs = require('fs');
var path = require('path');
var util = require('util');

//var csv_dir_prefix = '/home/ec2-user/csv_storage/';
var csv_dir_prefix = '/root/csv_storage/';

var a = 'sudo zip /root/csv_storage/zxbq.zip -r /root/csv_storage/zxbq';

exports.getZip = function(req, res){
    var csv_dir = path.join(csv_dir_prefix, 'zxbq');
    var file_dir = path.join(csv_dir_prefix, 'zxbq.zip');
    var cmdStr = util.format(
        'zip  %s -r %s'
        , file_dir
        , csv_dir
    );
    fs.exists(csv_dir, function(isExist){
        if(!isExist){
            res.jsonp(200, {msg: 'no data!'})
        }else{
            c_p.exec(cmdStr, function(e,r){
                if(e){
                    res.jsonp(200, {msg: e.toString()})
                }else{
                    var zip = fs.createReadStream(file_dir);
                    res.writeHead(200, {
                        'Content-Type': 'application/force-download',
                        'Content-Disposition': 'attachment; filename=zxbq.zip'
                    });
                    zip.pipe(res);
                }
            })
        }
    })
}

var getExportCMD = function(sTimestamp, eTimestamp, iscanId){
    var fields = 'enterTime,iscanId,wifiId,lon,lat,rssi,deviceId,userId,createAt,jobsiteId,uuid,major,minor';
    return util.format(
        'mongoexport -d iscan -c tagger -q \'{enterTime: { $gt:new Date(%d), $lte: new Date(%d)},iscanId: "%s"}\' -f \'%s\' --csv -o /root/csv_storage/exportByIscan.csv'
        ,sTimestamp
        ,eTimestamp
        ,iscanId
        ,fields
    );
}

exports.getCsv = function(req, res){
    var iscanId = req.query.iscanId,
        start = req.query.start,
        end = req.query.end;
    if(iscanId === undefined ){
        return res.json(200, 'IscanId must.')
    }
    if(start === undefined){
        return res.json(200, 'Start must.')
    }
    if(end === undefined){
        return res.json(200, 'End must.')
    }
    if(new Date(start) == 'Invalid Date' || new Date(end) == 'Invalid Date'){
        return res.json(200, 'Invalid Date.')
    }
    var startTime = new Date(start).getTime(),
        endTime = new Date(end).getTime();
    var cmdStr = getExportCMD(startTime, endTime, iscanId);
    c_p.exec(cmdStr, function(e,r){
        if(e){
            res.json(500, {msg: e.toString()})
        }else{
            fs.readFile('/root/csv_storage/exportByIscan.csv', function(err, data){
                if(err){
                    res.json(500, {msg: e.toString()})
                }else{
                    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
                    res.send(data);
                }
            });
        }
    })

}
