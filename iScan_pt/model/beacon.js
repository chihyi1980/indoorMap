var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var beaconSchema = new Schema({
    iscanId: String,
    beaconId: String,
    wifiId: String,
    seekcyId: String,
    company: String,
    desc: String,
    floorId: String,
    x: Number,
    y: Number,
    ownerId: {type:ObjectId,default:null},
    jobsiteId: {type:ObjectId,default:null},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
});
beaconSchema.index({beaconId:1},{unique:true});
beaconSchema.index({iscanId:1},{unique:true});
beaconSchema.index({jobsiteId:1});

beaconSchema.set('toJSON', {getters: true, transform: function(doc, ret, options){

    return {
        iscanId: ret.iscanId,
        beaconId: ret.beaconId,
        seekcyId: ret.seekcyId,
        company : ret.company,
        desc: ret.desc,
        wifiId: ret.wifiId,
        floorId: ret.floorId,
        x: +ret.x,
        y: +ret.y,
        jobsiteId: ret.jobsiteId,
        createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss"): ret.createAt,
        updateAt : ret.updateAt && true ? new Date(ret.updateAt).Format("yyyy-MM-dd hh:mm:ss"): ret.updateAt
    }
}});

beaconSchema.statics.removeByBeaconId = function(beaconId, callback){
    this.remove({beaconId: beaconId}, callback);
};

beaconSchema.statics.findOneByBeaconId = function(beaconId, callback){
    this
        .findOne({beaconId: beaconId})
        .select('-__v')
        .exec(callback);
};

beaconSchema.statics.findOneByIscanId = function(iscanId, callback){
    this
        .findOne({iscanId: iscanId})
        .select('-__v')
        .exec(callback);
};

beaconSchema.statics.getAll = function(limit, skip, condition, callback){
    this
        .find(condition)
        .select('-__v')
        .limit(+(limit || 10))
        .skip(+(skip || 0))
        .sort({createAt: -1})
        .exec(callback);
};
beaconSchema.statics.simpleList = function(condition, callback){
    this
        .find(condition)
        .select('iscanId beaconId wifiId')
        .sort({updateAt: -1, createAt: 1})
        .exec(callback);
};

beaconSchema.statics.getByArea = function(area,callback){
    this
        .find({area: area})
        .select('-__v')
        .sort({updateAt: -1, createAt: 1})
        .exec(callback);
};

beaconSchema.statics.getLatAndLonByIscanId = function(iscanId, callback){
    this
        .findOne({iscanId: iscanId})
        .select('iscanId lat lon updateAt')
        .exec(callback)
};

beaconSchema.statics.getByJobsite = function(jobsiteId, callback){
    this
        .find({jobsiteId: jobsiteId})
        .select('-__v')
        .exec(callback)
};
beaconSchema.set('collection', 'beacon');
module.exports = beaconSchema;
