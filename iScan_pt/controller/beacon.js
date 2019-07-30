var models = require('../model');
var Beacon = models.Beacon;
var async = require('async');
var http = require('http');
var querystring = require('querystring');
var iconv = require('iconv-lite');
var fs = require("fs");
var Rf = require('./reflect');
var config = require('../config');

var httpRequest = function(apiName,params,callback){
    var contents = querystring.stringify(params);
    var options = {
        hostname: config.mapHost,//http://iscan.atlasyun.com/iscan
        port: 80,
        path: apiName,
        method: 'POST',
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    };
    var req = http.request(options,function(res){
        res.setEncoding('utf8');
        res.on('data',function(data){
            callback(data);
        });
    });
    req.write(contents);
    req.end();
};

var getRequest = function(apiName, callback){
    var options = {
        hostname: config.mapHost,
        port: 80,
        path: apiName,
        method: 'get'
    };
    var req = http.request(options,function(resp){
        resp.setEncoding('utf8');
        var body = '';
        resp.on('data', function (data) {
            body += data;
        }).on('end', function () {
            callback(body)
        });
    });
    req.end();
};

exports.addBeacon = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var ownerId = loginUser._id;
    var newBeacon = {
        iscanId: req.body.iscanId.trim(),
        beaconId: req.body.beaconId,
        wifiId: (req.body.beaconId || req.body.wifiId).trim().toUpperCase(),
        company: req.body.company || '',
        area: req.body.area  || '',
        address: req.body.address || '',
        desc: req.body.desc  || '',
        ownerId: ownerId
    }
    if(req.body.seekcyId != null){
        newBeacon.seekcyId = req.body.seekcyId;
    }
    if(!newBeacon.iscanId || !newBeacon.wifiId){
        return res.json(500, {message: 'Param "wifiId" must'});
    }
    Beacon.findOne({wifiId: {$regex: newBeacon.wifiId, $options: 'gi'}})
        .exec(function(err, ret){
            if(ret){
                return res.json(500, {message: 'Iscan already exist, check ' + JSON.stringify(ret)});
            }
            new Beacon(newBeacon).save(function(err, ret){
                if(err){
                    res.json(500, {message: err.toString()});
                }else{
                    res.json(201, ret);
                }
            })
        })
};

exports.removeBeacon = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var beaconId = req.param('beaconId');
    Beacon.removeByBeaconId(beaconId, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(204, {message: 'No Content'});
        }
    })
};

exports.updateBeacon = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var ownerId = loginUser._id;
    var beaconId =  req.param('beaconId'),
        newBeacon = {
            company: req.body.company || '',
            area: req.body.area  || '',
            address: req.body.address || '',
            desc: req.body.desc || ''
            //updateAt: Date.now()
        };
    if(req.body.seekcyId != null){
        newBeacon.seekcyId = req.body.seekcyId;
    }
    Beacon.update({beaconId: beaconId}, {$set: newBeacon}, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
            return;
        }
        if (!ret) {
            res.json(404, {message: "Not found."});
            return;
        }
        res.json(200, {message: "OK"});
    })
};

exports.getOneBeacon = function(req, res){
    var  beaconId = req.param('beaconId');
    Beacon.findOneByBeaconId(beaconId, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
            return;
        }
        if (!ret) {
            res.json(404, {message: "Not found."});
            return;
        }
        res.json(200, ret);
    })
};

exports.getAllBeacons = function(req, res){
    var limit = req.query['l'] || null,
        skip = req.query['s'] || null,
        kw = req.query['kw'] || null,
        area = req.query['area'] || null;
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var ownerId = loginUser._id;
    var condition = {ownerId: ownerId};
    if(kw){
        condition.$or = [
            {iscanId: {$regex: kw, $options: 'i'}},
            {desc: {$regex: kw, $options: 'i'}},
            {address: {$regex: kw, $options: 'i'}}
        ];
    }
    async.series([
        function(callback){
            Beacon.count(condition,function(err,nums){
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
            Beacon.getAll(limit, skip, condition, function(err, ret){
                callback(err, ret);
            });
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });
};

exports.getSimpleList = function(req, res){
    Beacon.simpleList({},function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, ret);
        }
    })
};

exports.getBeaconByJobsite = function(req, res){
    var id = req.param('jobsiteId');
    Beacon.getByJobsite(id, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        } else {
            res.json(200, ret);
        }
    })
};

exports.getSimpleBeaconByJobsite = function(req, res){
    var id = req.param('jobsiteId');
    Beacon.simpleList({jobsiteId: id}, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        } else {
            var beacons = [];
            async.each(ret,
                function(b, callback){
                    var wifiId = b.wifiId || b.beaconId;
                    wifiId = wifiId.toUpperCase();
                    var temp = JSON.parse(JSON.stringify(b)) || {};
                    httpRequest('/poi/beacon/getByWifiId',{wifiId: wifiId}, function(data){
                        data = JSON.parse(data);
                        if(data.result == 'succeed' && data.data){
                            temp.floorId = data.data.floorId;
                            temp.coords = {x: data.data.x, y: data.data.y}
                        }
                        beacons.push(temp);
                        callback(null);
                    })
                },function(err) {
                    if(err){
                        res.json(500, {message: err.toString()});
                    }else{
                        res.json(200, beacons);
                    }
            });
        }
    })
};

exports.getBeaconsByArea = function(req,res){
    var area = req.body.area;
    Beacon.getByArea(area, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, ret);
        }
    })
};

exports.getLatAndLon = function(req, res){
    var iscanId = req.body.iscanId;
    Beacon.getLatAndLonByIscanId(iscanId, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, ret);
        }
    })
};
exports.setLatAndLon = function(req, res){
    var iscanId = req.body.iscanId;
    var newBeacon = {
        lat : req.body.lat,
        lon : req.body.lon,
        updateAt : new Date(req.body.updateAt)
    };
    Beacon.update({iscanId: iscanId}, {$set: newBeacon}, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
            return;
        }
        if (!ret) {
            res.json(404, {message: "Not found."});
            return;
        }
        res.json(200, {message: "OK"});
    })
};

exports.getRate = function(req, res){
    var result = {
        data:
            [
                {
                    "scanTime": 30,
                    "sendTime": 30
                }
        ]
    };
    res.jsonp(200, result);
};

exports.getNextSendTime = function(req, res){
    var result = {
        data:
            [
                {
                    "sendDate": new Date(new Date().getTime() + 1 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")  //当日排程发送时间
                }
            ]
    };
    res.jsonp(200, result);
};

exports.getNowTime = function(req, res){
    var result = {
        "now": new Date(new Date().getTime() - 1 * 1000).Format("yyyy-MM-dd hh:mm:ss")  //当日排程发送时间
    };
    res.jsonp(200, result);
};

exports.updateLocalIScanFile = function(req, res){
    Beacon.find({})
        .select('iscanId beaconId wifiId')
        .exec(function(err, iscans){
            if(err){
                return res.jsonp(500, {message: err.toString()});
            }
            var obj = {};
            iscans.forEach(function(iscan){
                var key = iscan.beaconId || iscan.wifiId;
                if(key){
                    obj[key] = iscan.iscanId
                }
            });
            Rf.cacheRf(obj);
            res.jsonp(200, obj)
        })
};
exports.getNewIscanId = function(req, res){
    var iscans = {},
        tempId = 0;
    if(Rf.getRfCache()){
        iscans = Rf.getRfCache();
        for(var i in iscans){
            var val = +iscans[i];
            tempId = Math.max(tempId, val);
        }
        tempId++;
        res.jsonp(200, {id: tempId.toString()})
    }else{
        Beacon.find({})
            .select('iscanId beaconId')
            .exec(function(err, iscans){
                if(err){
                    return res.jsonp(500, {message: err.toString()});
                }
                var obj = {};
                iscans.forEach(function(iscan){
                    if(iscan.iscanId){
                        var val = +iscan.iscanId;
                        tempId = Math.max(tempId, val);
                    }
                })
                tempId++;
                res.jsonp(200, {id: tempId.toString()})
            })
    }
}
