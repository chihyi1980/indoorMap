var models = require('../model');
var Device = models.Device;
var async = require('async');

exports.addDevice = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var newDevice = new Device({
        area: req.body.area || '',
        userId: req.body.userId || '',
        serialId: req.body.serialId || '',
        note: req.body.note || '',
        createAt:  Date.now(),
        updateAt:  Date.now(),
        ownerId: loginUser._id
    });

    newDevice.save(function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(201, ret);
        }
    })
};

exports.removeDevice = function(req, res){
    var id = req.param('id');
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    Device.removeById(id, function(err, ret){
        console.log(ret)
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(204, {message: ret});
        }
    })
};

exports.updateDevice = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var serialId =  req.param('serialId'),
        newDevice = {
            userId: req.body.userId || '',
            serialId: req.body.serialId || '',
            area: req.body.area || '',
            note: req.body.note || '',
            updateAt: Date.now()
    };
    console.log(req.body.id)
    Device.update({_id: req.body.id}, {$set: newDevice}, function(err, ret){
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

exports.getOneDevice = function(req, res){
    var  serialId = req.param('serialId');
    Device.findOneBySerialId(serialId, function(err, ret){
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

exports.getAllDevices = function(req, res){
    var limit = req.query['l'] || null,
        skip = req.query['s'] || null,
        kw = req.query['kw'] || null,
        area = req.query['area'] || null;
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var condition = {isDel: false, ownerId: loginUser._id};
    if(kw){
        condition.userId = {$regex: kw, $options: 'ig'};
    }
    if(area){
        area = area.replace(/\|/g, '\\|');
        condition.area = {$regex: area, $options: 'ig'};
    }
    async.series([
        function(callback){
            Device.count(condition,function(err,nums){
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
            Device.getAll(limit, skip, condition, function(err, ret){
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

exports.getDevicesByArea = function(req, res){
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        return res.json(500, {message: 'Invalid user.'});
    }
    var area = req.body.area;
    var ownerId = loginUser._id;
    Device.getByArea(area, ownerId, function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, ret);
        }
    })
};

exports.getAllDevices2 = function(req, res){
    Device.getAll2( function(err, ret){

        console.log('ret' + ret.toString() );

        if (err) {
            res.json(500, {message: err.toString()});
            return;
        }
        if (!ret) {
            res.json(404, {message: "Not found."});
            return;
        }
        res.json(200, ret);
    });
};

exports.getWorkInfo = function(req, res){
    var deviceId = req.body.deviceId;
    if(!deviceId){
        return res.json(500,{message: 'DeviceId invalid, deviceId="'+deviceId + '".'});
    }
    Device.findOneBySerialId(deviceId, function(err, device){
        if(err){
            return res.json(500, {message: err.toString()});
        }
        if(!device){
            res.json(200, {userId: null});
        }else{
            res.json(200, {userId: device.userId})
        }
    })
};

exports.updateBltDevices = function(req, res){
    var infos = req.body.infos;
    if(infos){
        var arr = infos instanceof  Array ? infos : JSON.parse(infos);
        async.eachSeries(arr
            , function(item, callback){
                var bltInfo = {
                    status: item.status,
                    battery : item.battery,
                    timestamp: item.time
                };
                Device.update({serialId: item.mac}, {$set: {blt: bltInfo}}, function(err, ret){
                    callback(null, 1)
                })
            }, function(){
                res.json(200, {msg: 'ok'})
            }
        )
    }else{
        res.json(500, {msg: 'Invalid param.'})
    }
}
