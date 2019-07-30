require('../db/mongodb');
var models = require('../model');
var Tagger = models.Tagger,
    Beacon = models.Beacon,
    Device = models.Device;

Tagger.find({}, function(err, ret){
    if(!err && ret){
        ret.forEach(function(item){
            Beacon.findOne({beaconId: item.beaconId}, function(err, res){
                if(!err && res){
                    Tagger.update({_id: item._id}, {$set: {jobsiteId : res.jobsiteId}}, function(e, r){
                        if(e || r == 0){
                            console.log(e)
                        }else{
                            console.log('success!')
                        }
                    })
                }else{
                    console.log('failed:' + item._id);
                }
            });
        })
    }
});