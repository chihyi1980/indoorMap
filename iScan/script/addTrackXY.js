/**
 * Created by zhaop on 2016/3/3.
 */
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var models = require('../model');
var iscanBeacon = models.Beacon,
    Track = models.Track;

Track.findOne({mapFloorId: null, enterTime: {$gt: '2016-03-24 20:27:00'}})
    .exec(function(err, ret){
    if(ret){
        console.log(ret)
        return;
        iscanBeacon.findOne({iscanId: ret.iscanId},function(e, beacon){
            if(beacon){
                Track.update({iscanId: ret.iscanId},
                    {$set:{mapFloorId: beacon.floorId, coordinate:[+beacon.x, +beacon.y]}},{multi: true}, function(er, tr){
                        console.log(er, tr);
                    })
            }
        })
    }

})