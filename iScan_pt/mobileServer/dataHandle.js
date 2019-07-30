/**
 * Created by zhaop on 2016/10/14.
 */
var models = require('../model');
var Beacon = models.Beacon;
var Tagger = models.Tagger;
var TestCoord = models.testCoord;
var OakMall = models.OakMall;
var Device = models.Device;
var Jobsite = models.Jobsite;
var ObjectID =  require('mongoose').Types.ObjectId;

var macCache = {};
var mMapMacJobsite = {};
var sPoiMatchUrl = '127.0.0.1';


//保存上一次每個mac所定位出的座標
var mMapOldCoor = {};
//這次傳入的tag與上一次tag的時間間隔要小於此數，才能夠互相混合，否則無視
var mTimePeriod = 3500;

function mixCoor(mac, newPos)
{
    var ansPos = {};
    var oldPos = mMapOldCoor[mac];
    if(oldPos && newPos.coordinate && newPos.time - oldPos.time < mTimePeriod && newPos.floorId == oldPos.floorId)
    {
        ansPos.floorId = newPos.floorId;
        var x = (newPos.coordinate.x + oldPos.coordinate.x) / 2;
        var y = (newPos.coordinate.y + oldPos.coordinate.y) / 2;
        ansPos.coordinate = {};
        ansPos.coordinate.x = x;
        ansPos.coordinate.y = y;
    }else
    {
        ansPos = newPos;
    }
    mMapOldCoor[mac] = newPos;

    return ansPos;

}

//created chihyi 2017/10/25
//get coord by poiMatch API

var async = require('async');
var request = require('request');
function getCoord(tagData, callback)
{
    var options = {
	    url: 'http://' + sPoiMatchUrl + '/poi/map/beacon/getLocate',
        method: 'POST',
	    json: true,
        body: tagData,
    }

    request(options, callback);

}

var sBeaconLength = 4;  //beacons ary length 至少高於此數量，否則捨棄
var sSortAryLength = 2; //取前多少個數量來進行排名
var sTopPosVal = 1;  //排名第一的pos至少要出現多少次，否則捨棄

//在取得定位點列表之中，選取最有可能的pos
function selectPos(posAry)
{
    var temp = {};
    for (var i = 0; i < sSortAryLength ; i++) {
        if (temp[posAry[i]['id']])
            temp[posAry[i]['id']]++;
        else
            temp[posAry[i]['id']] = 1;
    }

    var topPosId = '';
    var topPosValue = 0;
    for (var key in temp) {
        if (temp[key] > topPosValue)
        {
            topPosValue = temp[key];
            topPosId = key;
        }
    }

    if (topPosValue < sTopPosVal)
    {
        return null;
    }else
    {
        for (var i = 0; i < sSortAryLength ; i++) 
        {
            if(posAry[i]['id'] == topPosId)
                return posAry[i];
        }
    } 
    
}

var checkFence = require('./checkFence.js').checkFence;

exports.saveData2 = function(data, blg_mac)
{
    data = data instanceof Array ? data : [];
    data.forEach(function(item){
        if(item['beacons'].length >= sBeaconLength){
            Device.findOneBySerialId(item.mac, function(err, device){
                if(device && device.ownerId && mMapMacJobsite[blg_mac]){
                    var tag = {
                        blt_status: item.workStatus,
                        blt_mac: item.mac,
                        userId: device.userId,
                        ownerId: device.ownerId,
                        jobsiteId: mMapMacJobsite[blg_mac]['jobsiteId'],
                    };

                    var newbeacons = {};
                    for (var i = 0; i < item.beacons.length; i++)
                    {
                        newbeacons[item.beacons[i]['beaconId']] = item.beacons[i]['rssi'];
                    }
                    var sendObj = 
                    {
                        'buildingId' : mMapMacJobsite[blg_mac]['buildingId'],
                        'blt_mac': item.mac,
                        'beacons': newbeacons,
                    }

                    getCoord(sendObj, function(err1, resp, data)
                    {
                        if(err1)
                        {
                            console.log(err1);
                        }
			            else
                        {
                            var pos = selectPos(data['data']);
                            if(pos)
                            {
                                pos.time = new Date().getTime();
                                pos = mixCoor(item.mac, pos);
                                tag['coord'] = pos['coordinate'];
                                tag['floorId'] = pos['floorId'];
                                checkFence(tag);
                                new Tagger(tag).save(function(err2, ret)
                                {
                                    if(err2)
                                    {
                                        console.log(err2);
                                    }
                                });
                            }                        
                        }
                    })
                }
            });
        }
    });
}



exports.updateBlt = function(data){
    data = data instanceof Array ? data : [];
    async.eachSeries(data
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
            console.log('Battery: 1');
        }
    )
};

//created by chihyi 2017/10/26
//preload base station mac:jobsite, mapId id Map
function loadMapMacJobsite()
{
   Jobsite.find({}, function(err, jobsite){
        if(err){
            console.log(err);
        }else{
            jobsite = jobsite instanceof Array ? jobsite : [];
            jobsite.forEach(function(j){
                Beacon.getByJobsite(j._id, function(err1, beacon){
                    if(err1)
                    {
                        console.log(err1);
                    }else{
                        beacon = beacon instanceof Array ? beacon : [];
                        beacon.forEach(function(b){
                            mMapMacJobsite[b.wifiId] = 
                            {
                                jobsiteId: j._id,
                                buildingId: j.mapId,
                            }
                        });
                    }
                })
            });
        }
   }); 
}
loadMapMacJobsite();
