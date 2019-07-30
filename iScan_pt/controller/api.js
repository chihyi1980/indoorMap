/**
 * Created by zhaop on 2016/1/26.
 */
var EventProxy = require('eventproxy');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var models = require('../model');
var oakBeacon = models.OakBeacon,
    oakMall = models.OakMall,
    iscanBeacon = models.Beacon,
    iscanJobsite = models.Jobsite,
    User = models.User,
    Device = models.Device,
    Tagger =  models.Tagger,
    OakPoi = models.OakPoi;

var fields ={
    iscanBeacon: 'iscanId wifiId floorId x y',
    iscanJobsite: '_id name mapId'
}

exports.listIscansByJname = function(req, res){
    var jname = req.query.name;
    if(jname == undefined || !jname){
        return res.jsonp(500, {error: 'Param lost：\'name\' required.'})
    }
    jname = jname.replace(/^\s*|\s*$/g, '');
    var jnExp = new RegExp('^\s*' + jname + '\s*$', 'g');
    iscanJobsite.findOne({name: jnExp})
        .select(fields.iscanJobsite)
        .exec(function (ijerr, ijret) {
            if(ijerr){
                return res.jsonp(500, {error: ijerr.toString()});
            }
            if(!ijret){
                return res.jsonp(500, {error: JSON.stringify(jname) + 'not found.'});
            }
            if(!ijret.mapId){
                return res.jsonp(500, {error: JSON.stringify(jname) + 'not match any indoorMap.'});
            }else if(ijret.mapId.length !== 24){
                return res.jsonp(500, {error: JSON.stringify(jname) + 'match indoorMap failed.'});
            }else{
                iscanBeacon.find({jobsiteId: ijret._id})
                    .select(fields.iscanBeacon)
                    .exec(function(err, beacons){
                        if(!err){
                            res.jsonp(200, beacons);
                        }else{
                            res.jsonp(500, {error: err.toString()});
                        }

                    })
            }
        })
};

exports.listIscansByFloor = function(req, res){
    var floorId = req.body.floorId,
        jId = req.body.jId;
    if(!floorId || !jId){
        return res.json(500, {error: 'Params lost.' })
    }
    iscanBeacon.find({floorId: floorId, jobsiteId: jId})
        .select('-updateAt -createAt')
        .exec(function(err, ret){
            if(err){
                return res.json(500, {error: err.toString() })
            }
            res.json(200, ret);
        })
};

exports.setIscanToMap = function(req, res){
    var  iscanId =  req.body.iscanId,
        floorId = req.body.floorId || null,
        jId = req.body.jId || null,
        x = req.body.x || -1,
        y = req.body. y || -1;
    if(!iscanId){
        return res.json(500, {error: 'Params lost.' })
    }
    if(jId) jId = ObjectId(jId);
    iscanBeacon.update({iscanId: iscanId}
        , {$set: {floorId: floorId, jobsiteId: jId, x: +x, y: +y}}
        , function(err, ret){
        if(err){
            return res.json(500, {error: err.toString() })
        }
        res.json(200, {msg: 'ok'});
    })
};

exports.getIscanStatus = function(req, res){
    var list = req.body.list;
    var time = req.body.time;
    var endTime;
    if(time !== undefined && new Date(time) != 'Invalid Date'){
        endTime = new Date(time);
    }else{
        endTime = new Date();
    }
    var result = {};
    if(list instanceof  Array && list.length > 0){
        var startTime = new Date(endTime.getTime() - 60 * 1000);
        models.Tagger.aggregate([
            {$match: {enterTime: {$gte: startTime}, iscanId :{$in: list}}},
            {$group:{_id: '$iscanId',
                taggers:{$last:{
                    iscanId: '$iscanId',
                    enterTime: '$enterTime'
                }}}}
        ], function(err, ret){
            if(err){
                res.json(500, {msg: err.toString()})
            }else{
                list.forEach(function(id){
                    result[id] = false;
                })
                ret.forEach(function(tag){
                    result[tag._id] = true;
                })
                res.json(200, result)
            }
        })
    }else{
        res.json(500, {msg: 'Invalid param'})
    }
};


// touchAir
exports.getUsersByAccount =  function(req, res){
    var  account = req.body['uId'],
        password = req.body['password'];
    account = (account || '').trim();
    password = (password || '').trim();

    if(account && password.length == 32){
        User.findOne({name: account, password: password})
            .exec(function(err, ret){
                if(ret && ret._id){
                    var ownerId = ret._id;
                    Device.find({ownerId: ownerId}).
                        select('userId')
                        .exec(function(e, users){
                            var response = { userIds: [] };
                            if(users){
                                users.forEach(function(item){
                                    if(item && item.userId) response.userIds.push(item.userId);
                                })
                            }
                            res.json(200, response);
                        })
                }else{
                    res.json(500, {msg: account + 'not found.'})
                }
            })
    }else{
        res.json(500, {msg: 'Invalid param uId or password.'})
    }
};

var getFloorName = function(fid, callback){
    OakPoi.findOne({_id: fid})
        .select('ch_name')
        .exec(function(err, ret){
            if(err && !ret){
                callback(null)
            }else{
                callback({floorName: ret.ch_name})
            }
        })
};

exports.getTagsInPeriodByUser = function(req, res){
    var userId = req.body.userId,
        st = new Date(req.body.startTime).getTime(),
        et = new Date(req.body.endTime).getTime();
    if(st && et){
        et = Math.min(et, st + 24 * 60 * 60 * 1000);
        Tagger.find({createAt: {$gte: new Date(st), $lte: new Date(et)}, userId: userId})
            .select('blt_status createAt floorId coord')
            .lean()
            .exec(function(err, tags){
                var response = {coords: []};
                var status = {
                    1: 'error',
                    2: 'dormant',
                    0: 'normal'
                };
                if(tags){
                    async.eachSeries(tags,
                        function(tag, callback){
                            getFloorName(tag.floorId,function(ret){
                                if(ret){
                                    response.coords.push({
                                        status: status[tag.blt_status],
                                        created: new Date(tag.createAt).Format("yyyy-MM-dd hh:mm:ss"),
					floorId: tag.floorId,
                                        floorName: ret.floorName,
                                        coord: tag.coord
                                    })
                                }
                                callback(null, 1);
                            })
                    }, function(){
                            res.json(200, response)
                    })

                }else{
                    res.json(200, response)
                }
            })
    }else{
        res.json(500, {msg: 'Invalid date string.'})
    }
};
