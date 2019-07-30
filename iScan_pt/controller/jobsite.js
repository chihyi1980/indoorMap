var models = require('../model');
var Jobsite = models.Jobsite;
var Beacon = models.Beacon;
var oakPoi = models.OakPoi;
var EventProxy = require('eventproxy');
var async = require('async');
var fs = require('fs');
var csv = require('csv');
var iconv = require('iconv-lite');

exports.addJobsite = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var ownerId = loginUser._id;
    var newJobsite = new Jobsite({
        name: req.body.name,
        area: req.body.area  || '',
        address: req.body.address || '',
        ownerId: ownerId
    });
    newJobsite.save(function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(201, ret);
        }
    })
};

exports.setJobsiteId = function(req, res){
    var iscanId = req.body.iscanId;
    var jobsiteId = req.body.jobsiteId;
    Beacon.update({iscanId: iscanId}, {$set:{jobsiteId: jobsiteId}}, function(err, ret){
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

exports.removeJobsite = function(req, res){
    var jobsiteId = req.param('jobsiteId');
    Beacon.findOne({jobsiteId: jobsiteId}, function(err, result){
        if(!err && result){
            res.json(200, {message: "in use"});
        }else{
            Jobsite.remove({_id: jobsiteId}, function(err, ret){
                if (err) {
                    res.json(500, {message: err.toString()});
                    return;
                }
                res.json(200, {message: "OK"});
            });
        }
    })
};

exports.updateJobsite = function(req, res){
    var jobsite = req.body.jobsite;
    var _id = jobsite.id;
    delete jobsite.id;
    if(jobsite.mapId){
        checkMapId(jobsite.mapId.trim(), function(e){
            if(e){
                return  res.json(500, e);
            }
            Jobsite.update({_id: _id},{$set: jobsite}, function(err, ret){
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
        })
    }else{
        delete jobsite.mapId;
        Jobsite.update({_id: _id},{$set: jobsite}, function(err, ret){
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
    }
};

var checkMapId = function(mapId, callback){
    var proxy = new EventProxy();
    oakPoi.findOne({_id: mapId})
        .select('poi_type')
        .exec(proxy.done('Poi'));
    Jobsite.findOne({mapId: mapId})
        .exec(proxy.done('Jobsite'));
    proxy.assign('Poi','Jobsite', function (poi, jobsite) {
        if(!poi){
            return callback({msg: 'MapId not found'}, null);
        }
        if(poi.poi_type != 'building'){
            return callback({msg: 'MapId type need "building"'}, null);
        }
        if(jobsite){
            return callback({msg: 'MapId used'}, null);
        }
        callback(null, null);
    })
}

exports.getAllJobsites = function(req, res) {
    var limit = req.query['l'] || null,
        skip = req.query['s'] || null,
        kw = req.query['kw'] || null,
        area = req.query['area'] || null;

    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var ownerId = loginUser._id;

    var condition = {isDel: false, ownerId: ownerId};
    if(kw){
        condition.name = {$regex: kw, $options: 'ig'};
    }
    if(area){
        area = area.replace(/\|/g, '\\|');
        condition.area = {$regex: area, $options: 'ig'};
    }
    async.series([
        function(callback){
            Jobsite.count(condition,function(err,nums){
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
            Jobsite.getAll(limit, skip, condition, function (err, ret) {
                callback(err, ret)
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

exports.getOneJobsite = function(req, res){
    var id = req.param('jobsiteId');
    Jobsite.getOneById(id, function(err, ret){
        if (err) {
            res.jsonp(500, {message: err.toString()});
        } else {
            res.jsonp(200, ret);
        }
    })
};

exports.uploadJobsite = function(req, res){
    var file = req.files && req.files.myFile;
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.jsonp(500, {message: 'Invalid user.'});
    }
    var ownerId = loginUser._id;
    if(!file || file.size == 0){
        return res.jsonp(500, 'no file');
    }else{
        var path = file.path;
        if(file.originalFilename.indexOf('.csv') == -1){
            fs.unlink(path, function(err, ret){
                if(!err){
                    console.log(path + ' delete ok')
                }
            });
            return res.jsonp(500, 'Invalid file. Need *.csv file.');
        }
        var fileStr = fs.readFileSync(path, {encoding:'binary'});
        var buf = new Buffer(fileStr, 'binary');
        var str = iconv.decode(buf, 'GBK');
        csv().from.string(str).to.array(function(data){
            fs.unlink(path, function(err, ret){
                if(!err){
                    console.log(path + ' delete ok')
                }
                var fileData = data;
                if(fileData[0][0] == '工地名称'
                    && fileData[0][1] == '所在地区'
                    && fileData[0][2] == '详细地址'
                    && fileData[0][3] == 'iscanID'){
                    fileData.splice(0,1);
                }
                var needSaveData = [];
                try{
                    fileData.forEach(function(row){
                        var  areaList, area, obj;
                        areaList = row[1].split(/省|市/);
                        if(row[1].indexOf('省') > -1){
                            area = areaList[0] + '省|' + areaList[1] + '市|' + areaList[2];
                        }else{
                            if(areaList.length == 2){
                                area =  areaList[0] + '市|' + areaList[0] + '市|' + areaList[1];
                            }else if(areaList.length == 3){
                                area =  areaList[0] + '市|' + areaList[1] + '市|' + areaList[2];
                            }
                        }
                        row[3].split(',');
                        obj = {
                            name: row[0],
                            area: area,
                            address: row[2],
                            iscanIds:row[3].split(',')
                        };
                        needSaveData.push(obj);
                    });
                }catch (e){
                    console.log(e);
                    return  res.json(500, {message: '文件数据格式不正确，无法解析'});
                }
                async.eachSeries(needSaveData,
                    function(item, callback){
                        var newJobsite = new Jobsite({
                            name: item.name,
                            area: item.area,
                            address: item.address,
                            ownerId: ownerId
                        });
                        var _id = JSON.parse(JSON.stringify(newJobsite._id));
                        newJobsite.save(function(err, ret){
                            if(err){
                                if(err.code == 11000){
                                    newJobsite.name += ('_' + new Date().getTime());
                                    newJobsite.save(function(error, result){
                                        if(error){
                                            callback(error, result);
                                        }else{
                                            Beacon.update({jobsiteId:null,iscanId: {$in:item.iscanIds}}, {$set:{jobsiteId: _id}}, {multi: true}, function(err, ret){
                                                callback(err, ret);
                                            });
                                        }
                                    })
                                }else{
                                    callback(err, ret);
                                }
                            }else{
                                Beacon.update({iscanId: {jobsiteId:null, $in:item.iscanIds}}, {$set:{jobsiteId: _id}}, {multi: true}, function(err, ret){
                                    callback(err, ret);
                                });
                            }
                        })
                    },
                    function(err, ret){
                        if (err) {
                            res.jsonp(500, {message: err.toString()});
                        } else {
                            res.jsonp(200, 'ok');
                        }
                    }
                );
            });
        });
    }
};
