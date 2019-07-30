/**
 * Created by zhaop on 2016/3/22.
 */
require('../db/mongodb');
require('../util');
var models = require('../model');
var Tagger = models.Tagger,
    Device = models.Device,
    Track = models.Track;

Device.find({})
    .select('userId ownerId')
    .exec(function(err, ret){
        ret.forEach(function(someOne){
            Tagger.update({userId: someOne.userId}, {$set:{ownerId: someOne.ownerId}}, {multi: true}, function(e, r){
                console.log(r)
            })
            Track.update({userId: someOne.userId}, {$set:{ownerId: someOne.ownerId}}, {multi: true}, function(e, r){
                console.log(r)
            })
        })
    })