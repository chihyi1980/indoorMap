/**
 * Created by zhaop on 2016/3/3.
 */
var EventProxy = require('eventproxy');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var models = require('../model');
var oakBeacon = models.OakBeacon,
    oakMall = models.OakMall,
    iscanBeacon = models.Beacon,
    iscanJobsite = models.Jobsite;

var fields ={
    oakBeacon: 'floorId wifiId matched coordinate',
    iscanBeacon: 'iscanId beaconId',
    iscanJobsite: '_id name mapId'
}

var listIscansByJname = function(name, callback){
    var jname = name;
    if(jname == undefined || !jname){
        return callback(500, {error: 'Param lost：\'name\' required.'})
    }
    jname = jname.replace(/^\s*|\s*$/g, '');
    var jnExp = new RegExp('^\s*' + jname + '\s*$', 'g');
    iscanJobsite.findOne({name: jnExp})
        .select(fields.iscanJobsite)
        .exec(function (ijerr, ijret) {
            if(ijerr){
                return callback(500, {error: ijerr.toString()});
            }
            if(!ijret){
                return callback(500, {error: JSON.stringify(jname) + 'not found.'});
            }
            if(!ijret.mapId){
                return callback(500, {error: JSON.stringify(jname) + 'not match any indoorMap.'});
            }else if(ijret.mapId.length !== 24){
                return callback(500, {error: JSON.stringify(jname) + 'match indoorMap failed.'});
            }else{
                oakMall.findOne({$or:[{'buildings.poi_id': ObjectId(ijret.mapId)},{'buildings.floors.poi_id': ObjectId(ijret.mapId)}]})
                    .exec(function(mlerr, mlret){
                        if(mlerr || !mlret){
                            return callback(500, {error: JSON.stringify(jname) + 'match indoorMap failed.'});
                        }
                        var floors = [];
                        mlret.buildings[0].floors.forEach(function(fl){
                            floors.push(fl.poi_id);
                        })

                        var proxy = new EventProxy();
                        iscanBeacon.find({jobsiteId: ijret._id})
                            .select(fields.iscanBeacon)
                            .exec(proxy.done('iscanBeacon'));
                        oakBeacon.find({floorId: {$in: floors}})
                            .select(fields.oakBeacon)
                            .exec(proxy.done('oakBeacon'));
                        proxy.assign('iscanBeacon','oakBeacon', function (iBcns, oBcns) {
                            if(!iBcns || !oBcns){
                                return callback(500, {error: 'iscan not found.'})
                            }
                            var result = [];
                            console.log(iBcns.length)
                            for(var j= 0, ln=iBcns.length; j < ln; ++j){
                                if(!iBcns[j].iscanId || !iBcns[j].beaconId) continue;
                                var temp = {
                                    iscanId : iBcns[j].iscanId,
                                    wifiId: iBcns[j].beaconId.replace(/^\s*|\s*$/g, '').toUpperCase()
                                }
                                for(var i= 0, len=oBcns.length; i < len; ++i){
                                    if(oBcns[i].wifiId && oBcns[i].wifiId.match(new RegExp(temp.wifiId, 'g'))){
                                        temp['floorId'] = oBcns[i].floorId;
                                        if(oBcns[i].matched){
                                            temp['x'] = oBcns[i].coordinate.x;
                                            temp['y'] = oBcns[i].coordinate.y;
                                        }else{
                                            //temp['floorId'] = null;
                                            temp['x'] = null;
                                            temp['y'] = null;
                                        }
                                        break;
                                    }
                                }
                                if(!temp['floorId']){
                                    temp['floorId'] = null;
                                    temp['x'] = null;
                                    temp['y'] = null;
                                }
                                result.push(temp);
                            }
                            return callback(null, result);
                        })
                    })
            }
        })
}

var updater = function(name){
    listIscansByJname(name, function(err, ret){
        if(!err){
            ret.forEach(function(iscan){
                if(iscan.floorId){
                    var obj = {
                        floorId: iscan.floorId,
                        x: iscan.x && true ? +iscan.x : -1,
                        y: iscan.y && true ? +iscan.y : -1
                    }
                    iscanBeacon.update({iscanId: iscan.iscanId},{$set: obj},function(er, rt){
                        if(er){
                            console.log(er.toString);
                        }else{
                            console.log(iscan.iscanId + '_' + rt);
                        }
                    })
                }

            })

        }else{
            console.log(err, ret)
        }
    })
}

var list = ['中興保全','司圖科技'];
list.forEach(function(name){
    updater(name);
})
