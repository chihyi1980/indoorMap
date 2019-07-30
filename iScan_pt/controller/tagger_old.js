var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device;
var async = require('async');
var fs = require('fs');
var http = require('http');
var Rf = require('./reflect');
var ObjectId = require('mongodb').ObjectID;
var config = require('../config');

var setEvents = function(beacon, tagger,  callback){
    var tagEvents = models.tagEvents;
    new tagEvents({
        loc: {floorId: beacon.floorId, x: beacon.x, y: beacon.y},
        loc_desc: beacon.desc,
        userId: tagger.userId,
        iscanId: tagger.iscanId,
        ownerId: tagger.ownerId
    }).save(function(err, ret){
            callback(err, ret)
        })
};
var handleData = function(data){
    var temp = data;
}
exports.multiAddTagger1 = function(req, res){
    var  data = req.body.data;
    if(typeof data == 'string'){
        try{
            data = JSON.parse(data);
        }catch (e){
            console.log(e);
            data = JSON.parse(data.replace(/'/g, '\"'));
        }
    }
    console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + '__>>>:', data);
    var wifiIds = Rf.getRfCache();
    if(!wifiIds){
        var rfUrl = 'http://' + (req.headers.host || 'localhost:3000') + '/updateRf';
        http.get(rfUrl, function (response){
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function(data){
                body += data;
            }).on('end', function(){
                console.log(body)
            })
        });
    }
    if(!wifiIds || JSON.stringify(wifiIds) == '{}'){
        return res.json(500, 'Rf not find.');
    }
    if(data instanceof Array || typeof data == 'object'){
        var iscanId;
        for(var i=0,len=data.length; i<len; ++i){
            var item = data[i];
            var key = item.ble_mac || item.wifiId || item.beaconId;
            var keyUpper = key.toUpperCase(),
                keyLower = key.toLowerCase();
            iscanId = wifiIds[keyUpper] || wifiIds[keyLower];
            if(iscanId){
                break;
            }
        }
        Beacon.findOneByIscanId(iscanId, function(error, beacon){
            if(beacon && beacon.jobsiteId){
                var jobsiteId = beacon.jobsiteId;
                async.eachSeries(data,
                    function(t, callback){
                        if(t.scanned_ble_mac){
                            Device.findOneBySerialId(t.scanned_ble_mac, function(err, device){
                                var tagger = {
                                    iscanId: iscanId,
                                    jobsiteId: jobsiteId,
                                    deviceId: (t.deviceId || t.scanned_ble_mac),
                                    beaconId: t.beaconId || '',
                                    wifiId: (t.ble_mac || t.wifiId || '').toUpperCase(),
                                    lon: 120.744395,//120.581497,//t.lon,
                                    lat: 31.273917,//31.290632,//t.lat,
                                    rssi: t.rssi,
                                    extra: t.extra || null,
                                    uuid: t.uuid || '',
                                    major: t.major || '',
                                    minor: t.minor || '',
                                    enterTime: new Date(),
                                    sentTime: new Date()
                                };
                                if(device && device.userId){
                                    tagger.ownerId = device.ownerId;
                                    tagger.userId = t.userId || device.userId;
                                    if(beacon.ownerId && (beacon.ownerId.toString().trim() == tagger.ownerId.toString().trim()) && tagger.userId){
                                        var newTagger = new Tagger(tagger);
                                        newTagger.save(function(err, ret){
                                            callback(err, ret);
                                        });
                                        if(tagger.minor == '0x0001'){
                                            setEvents(beacon, tagger, function(e){
                                                if(e) console.log(e.toString());
                                            });
                                        }
                                    }else{
                                        callback(null, -1)
                                    }
                                }else if(t.scanned_ble_mac.trim().toUpperCase() == 'FF:FF:FF:FF:FF:FF'){
                                    tagger.ownerId = beacon.ownerId;
                                    tagger.userId = t.userId || t.scanned_ble_mac;
                                    var newTagger = new Tagger(tagger);
                                    newTagger.save(function(err, ret){
                                        callback(err, ret);
                                    });
                                }else{
                                    callback(null, -1);
                                }
                            })
                        }else{
                            callback(null, 0);
                        }
                    },function(err, ret) {
                        if(err){
                            res.json(500, {message: err.toString()});
                        }else{
                            res.json(201, {message: 'ok'});
                        }
                    });
            }else{
                if(!beacon){
                    res.json(500, {message: 'Invalid iScan. check the wifiId.'});
                }else{
                    res.json(500, {message: 'iScan need jobsite.'});
                }
            }
        });
    }else{
        res.json(500, {message: 'Invalid arg data:' + JSON.stringify(data)});
    }
};

exports.multiAddTaggerForPhone = function(req, res){
    var  data = req.body.data;
    if(typeof data == 'string'){
        try{
            data = JSON.parse(data);
        }catch (e){
            console.log(e);
            data = JSON.parse(data.replace(/'/g, '\"'));
        }
    }
    console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + '__byPhone>>>:', data);
    var wifiIds = Rf.getRfCache();
    if(!wifiIds){
        var rfUrl = 'http://' + (req.headers.host || 'localhost:3000') + '/updateRf';
        http.get(rfUrl, function (response){
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function(data){
                body += data;
            }).on('end', function(){
                console.log(body)
            })
        });
    }
    if(!wifiIds || JSON.stringify(wifiIds) == '{}'){
        return res.json(500, {message: 'Rf not find.'});
    }
    if(data instanceof Array || typeof data == 'object'){
        var proxy = [];
        for(var i=0,len=data.length; i<len; ++i){
            var iscanId;
            var item = data[i];
            var key = item.wifiId || item.beaconId;
            var keyUpper = key.toUpperCase(),
                keyLower = key.toLowerCase();
            iscanId = wifiIds[keyUpper] || wifiIds[keyLower];
            if(iscanId){
                item.iscanId = iscanId;
                proxy.push(item);
            }
        }
        async.eachSeries(proxy,
            function(t, callback){
                Beacon.findOneByIscanId(t.iscanId, function(error, beacon){
                    if(beacon && beacon.jobsiteId){
                        var jobsiteId = beacon.jobsiteId;
                        if(t.deviceId){
                            Device.findOneBySerialId(t.deviceId, function(err, device){
                                if(!device){
                                    callback()
                                }
                                var tagger = {
                                    iscanId: t.iscanId,
                                    jobsiteId: jobsiteId,
                                    deviceId: t.deviceId,
                                    beaconId: t.beaconId || '',
                                    wifiId: (t.wifiId || '').toUpperCase(),
                                    rssi: t.rssi,
                                    extra: t.extra || null,
                                    uuid: t.uuid || '',
                                    major: t.major || '',
                                    minor: t.minor || '',
                                    enterTime: new Date(t.enterTime),
                                    sentTime: new Date(t.sentTime)
                                };
                                if(device && device.userId){
                                    tagger.ownerId = device.ownerId;
                                    tagger.userId = t.userId || device.userId;
                                    if(beacon.ownerId && (beacon.ownerId.toString().trim() == tagger.ownerId.toString().trim()) && tagger.userId){
                                        var newTagger = new Tagger(tagger);
                                        newTagger.save(function(err, ret){
                                            callback(err, ret);
                                        });
                                        if(tagger.minor == '0x0001'){
                                            setEvents(beacon, tagger, function(e){
                                                if(e) console.log(e.toString());
                                            });
                                        }
                                    }else{
                                        callback(null, -1)
                                    }
                                }else if(t.deviceId.trim().toUpperCase() == 'FF:FF:FF:FF:FF:FF'){
                                    tagger.ownerId = beacon.ownerId;
                                    tagger.userId = t.userId || t.deviceId;
                                    var newTagger = new Tagger(tagger);
                                    newTagger.save(function(err, ret){
                                        callback(err, ret);
                                    });
                                }else{
                                    callback(null, -1);
                                }
                            })
                        }else{
                            callback(null, 0);
                        }
                    }else{
                        if(!beacon){
                            //res.json(500, {message: 'Invalid iScan. check the wifiId.'});
                        }else{
                            //res.json(500, {message: 'iScan need jobsite.'});
                        }
                        callback(null, 0)
                    }
                });
            },function(err, ret) {
                if(err){
                    res.json(500, {message: err.toString()});
                }else{
                    res.json(201, {message: 'ok'});
                }
            });
    }else{
        res.json(500, {message: 'Invalid arg data:' + JSON.stringify(data)});
    }
}

//接受iscan数据的主要方法.
exports.multiAddTagger = function(req, res){
    var  data = req.body.data;
    if(typeof data == 'string'){
        try{
            data = JSON.parse(data);
        }catch (e){
            console.log(e);
            data = JSON.parse(data.replace(/'/g, '\"'));
        }
    }
    console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + '__>>>:', data);
    var wifiIds = Rf.getRfCache();
    if(!wifiIds){
        var rfUrl = 'http://' + (req.headers.host || 'localhost:3000') + '/updateRf';
        http.get(rfUrl, function (response){
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function(data){
                body += data;
            }).on('end', function(){
                console.log(body)
            })
        });
    }
    if(!wifiIds || JSON.stringify(wifiIds) == '{}'){
       return res.json(500, 'Rf not find.');
    }
    if(data instanceof Array || typeof data == 'object'){
        var iscanId;
        for(var i=0,len=data.length; i<len; ++i){
            var item = data[i];
            var key = item.wifiId || item.beaconId;
            var keyUpper = key.toUpperCase(),
                keyLower = key.toLowerCase();
            iscanId = wifiIds[keyUpper] || wifiIds[keyLower];
            if(iscanId){
                break;
            }
        }
        Beacon.findOneByIscanId(iscanId, function(error, beacon){
            if(beacon && beacon.jobsiteId){
                var jobsiteId = beacon.jobsiteId;
                async.eachSeries(data,
                    function(t, callback){
                        if(t.deviceId){
                            Device.findOneBySerialId(t.deviceId, function(err, device){
                                var tagger = {
                                    iscanId: iscanId,
                                    jobsiteId: jobsiteId,
                                    deviceId: t.deviceId,
                                    beaconId: t.beaconId || '',
                                    wifiId: (t.wifiId || '').toUpperCase(),
                                    lon: 120.744395,//120.581497,//t.lon,
                                    lat: 31.273917,//31.290632,//t.lat,
                                    rssi: t.rssi,
                                    extra: t.extra || null,
                                    uuid: t.uuid || '',
                                    major: t.major || '',
                                    minor: t.minor || '',
                                    enterTime: new Date(t.enterTime),
                                    sentTime: new Date(t.sentTime)
                                };
                                if(device && device.userId){
                                    tagger.ownerId = device.ownerId;
                                    tagger.userId = t.userId || device.userId;
                                    if(beacon.ownerId && (beacon.ownerId.toString().trim() == tagger.ownerId.toString().trim()) && tagger.userId){
                                        var newTagger = new Tagger(tagger);
                                        newTagger.save(function(err, ret){
                                            callback(err, ret);
                                        });
                                        if(tagger.minor == '0x0001'){
                                            setEvents(beacon, tagger, function(e){
                                                if(e) console.log(e.toString());
                                            });
                                        }
                                    }else{
                                        callback(null, -1)
                                    }
                                }else if(t.deviceId.trim().toUpperCase() == 'FF:FF:FF:FF:FF:FF'){
                                    tagger.ownerId = beacon.ownerId;
                                    tagger.userId = t.userId || t.deviceId;
                                    var newTagger = new Tagger(tagger);
                                    newTagger.save(function(err, ret){
                                        callback(err, ret);
                                    });
                                }else{
                                    callback(null, -1);
                                }
                            })
                        }else{
                            callback(null, 0);
                        }
                    },function(err, ret) {
                        if(err){
                            res.json(500, {message: err.toString()});
                        }else{
                            res.json(201, {message: 'ok'});
                        }
                    });
            }else{
                if(!beacon){
                    res.json(500, {message: 'Invalid iScan. check the wifiId.'});
                }else{
                    res.json(500, {message: 'iScan need jobsite.'});
                }
            }
        });
    }else{
        res.json(500, {message: 'Invalid arg data:' + JSON.stringify(data)});
    }
};

exports.updateWorkerInfo = function(req, res){
    return res.jsonp(500, { msg: 'Api expired.'})
    var deviceId = req.body.deviceId,
        userId = req.body.userId;
    if(!deviceId || !userId){
        return res.json(500,{message: 'DeviceId or userId invalid, deviceId="'+deviceId + '",userId="'+ userId+'"'});
    }
    Device.findOne({userId:userId, serialId:deviceId}, function(err, ret){
        if(err){
            return res.json(500, {message: err.toString()});
        }
        if(ret){
            Device.update({userId:userId, serialId:deviceId}, {$set:{updateAt: Date.now()}},function(e, r){
                if(e){
                    return res.json(500, {message: e.toString()});
                }else{
                    res.json(201, {message: 'ok'});
                }
            })
        }else{
            var newDevice = new Device({
                userId: userId,
                serialId: deviceId,
                area: '',
                ownerId: "549cf65bebb8fb9d6c99f13d",
                createAt:  Date.now(),
                updateAt:  Date.now()
            });
            newDevice.save(function(err, ret){
                if(err){
                    res.json(500, {message: err.toString()});
                }else{
                    res.json(201, {message: 'ok'});
                }
            })
        }
    })
};

exports.getTaggersByDeviceId = function(req, res){
    var deviceId = req.param('deviceId');
    Device.findOneBySerialId(deviceId, function(err, device){
        if(err || !device){
            res.json(404, {message: 'Device of id('+ deviceId +')is not found'});
        }else{
            Tagger.aggregate([
                {$match: {deviceId: deviceId}},
                {$group:{_id: '$beaconId',
                    taggers:{$push:{
                        deviceId: '$deviceId',
                        beaconId:'$beaconId',
                        isEnter: '$isEnter',
                        createAt: '$createAt'
                    }}}}
            ], function(err, ret){
                if(err || !(ret && ret.length)){
                    res.json(500, {message: err.toString()});
                }else{
                    var  taggers = [];
                    ret.forEach(function(item){
                        taggers.push(item.taggers);
                    });
                    res.json(200, taggers);
                }
            })
        }
    })

};

exports.getTaggersByBeaconId = function(req, res){
    var beaconId = req.param('beaconId');
    Beacon.findOneByBeaconId(beaconId, function(err, beacon){
        if(err || !beacon){
            res.json(404, {message: 'Beacon of id('+ beaconId +')is not found'});
        }else{
            var beaconCreateAt = new Date(beacon.createAt).getTime();
            Tagger.aggregate([
                {$match: {beaconId: beaconId}},
                {$group:{_id: '$deviceId',
                    taggers:{$push:{
                        deviceId: '$deviceId',
                        beaconId:'$beaconId',
                        isEnter: '$isEnter',
                        createAt: '$createAt'
                    }}}}
            ], function(err, ret){
                if(err || !(ret && ret.length)){
                    res.json(500, {message: err.toString()});
                }else{
                    var  taggers = [];
                    ret.forEach(function(item){
                        taggers.push(item.taggers);
                    });
                    res.json(200, taggers);
                }
            })
        }
    })
};

exports.getAllTaggers = function(req, res){
    var limit = req.query['l'] || null;
    var skip = req.query['s'] || null;
    async.series([
        function(callback){
            Tagger.count({},function(err,nums){
                if(err){
                    callback(err, 1);
                }else{
                    if(!limit){
                        callback(null ,1)
                    }else{
                        var total = Math.ceil(parseInt(nums)/parseInt(limit));
                        callback(null, total);
                    }
                }
            });
        },
        function(callback){
            Tagger.getAll(limit, skip,function(err, ret){
                callback(err, ret);
            })
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });
};

exports.jobsiteIdInPeriod = function(req, res){
    var begin = req.body.begin,
        end = req.body.end,
        jobsiteId = req.param('jobsiteId');
    var limit = req.body['l'] || null,
        skip = req.body['s'] || null;
    var loginUser = req.session.loginUser;
    var ownerId;
    if(loginUser){
        ownerId = loginUser._id;
    }
    async.series([
        function(callback){
            Tagger.countByJobsiteIdInPeriod(jobsiteId,ownerId,new Date(begin), new Date(end), function(err,nums){
                console.log(err, nums)
		if(err){
                    callback(err, 1);
                }else{
                    if(!limit){
                        callback(null ,1)
                    }else{
                        var total = Math.ceil(parseInt(nums)/parseInt(limit));
                        callback(null, total);
                    }
                }
            });
        },
        function(callback){
            Tagger.getByJobsiteIdInPeriod(jobsiteId, ownerId, new Date(begin), new Date(end), limit, skip,function(err, ret){
                callback(err, ret);
            })
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });
};

exports.userIdInPeriod = function(req, res){
    var begin = req.body.begin,
        end = req.body.end,
        userId = req.param('userId');
    var limit = req.body['l'] || null,
        skip = req.body['s'] || null;
    async.series([
        function(callback){
            Tagger.countByUserIdInPeriod(userId,new Date(begin), new Date(end), function(err,nums){
                if(err){
                    callback(err, 1);
                }else{
                    if(!limit){
                        callback(null ,1)
                    }else{
                        var total = Math.ceil(parseInt(nums)/parseInt(limit));
                        callback(null, total);
                    }
                }
            });
        },
        function(callback){
            Tagger.getByUserIdInPeriod(userId, new Date(begin), new Date(end), limit, skip, function(err, ret){
                callback(err, ret);
            })
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });
};

exports.analysisByBeacon = function(req, res){
    var date = req.body.date,
        ms = req.body.ms || 15,
        beaconId = req.param('beaconId');
    var begin = new Date(date + ' 00:00:00'),
        end = new Date(date + ' 23:59:59');
    Tagger.getByBeaconIdInPeriod(beaconId, begin, end, function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            var data = groupByUserId(ret, +ms);
            res.json(200, data);
        }
    })
};

exports.analysisByUser = function(req, res){
    var date = req.body.date,
        ms = req.body.ms || 15,
        userId = req.param('userId');
    var begin = new Date(date + ' 00:00:00'),
        end = new Date(date + ' 23:59:59');
    Tagger.getByUserIdInPeriod(userId, begin, end, function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            var data = groupByBeaconId(ret, +ms);
            res.json(200, data);
        }
    })
};

function groupByUserId(taggers, ms){
    taggers = JSON.parse(JSON.stringify(taggers));
    var second = 60 * 1000;
    var proxy = {},
        users = [],
        res = {},
        list,
        tempDate;
    for(var i=0; i< taggers.length; ++i){
        if(proxy[taggers[i].userId] == undefined){
            proxy[taggers[i].userId] = [];
            users.push(taggers[i].userId);
        }
        tempDate = new Date(taggers[i].enterTime);
        taggers[i].time = new Date(taggers[i].enterTime).getTime();
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
        proxy[taggers[i].userId].push(taggers[i]);
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
};

function groupByBeaconId(taggers, ms){
    taggers = JSON.parse(JSON.stringify(taggers));
    var second = 60 * 1000;
    var proxy = {},
        beacons = [],
        res = {},
        list,
        tempDate;
    for(var i=0; i< taggers.length; ++i){
        var index = taggers[i].iscanId;
        if(proxy[index] == undefined){
            proxy[index] = [];
            beacons.push(index);
        }
        tempDate = new Date(taggers[i].enterTime);
        taggers[i].time = new Date(taggers[i].enterTime).getTime();
        taggers[i].value = +tempDate.getHours() + (+tempDate.getMinutes() / 60);
        proxy[index].push(taggers[i]);
    }
    beacons = beacons.sort(function(a,b){
        return a > b;
    });
    res.YList = beacons;
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
};