var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var taggerSchema = new Schema({
    blt_status: String,
    blt_mac: String,
    userId: String,
    floorId: {type:String,default:null},
    coord: {},
    ownerId: String,
    jobsiteId: {type:String,default:null},
    createAt: {type: Date, default: Date.now}
});

taggerSchema.set('toJSON', {getters: true, transform: function(doc, ret, options){
    return {
        blt_status: ret.blt_status,
        blt_mac: ret.blt_mac,
        userId: ret.userId,
        floorId: ret.floorId,
        coord: ret.coord,
        createAt: new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss")
    }
}});

taggerSchema.statics.getByJobsiteIdInPeriod = function(jobsiteId, beginTime, endTime, limit, skip, callback){
    this.find({jobsiteId: jobsiteId,  createAt:{'$gte': new Date(beginTime), '$lt': new Date(endTime)}})
        .limit(+limit)
        .skip(+skip)
        .sort({createAt: -1})
        .lean()
        .exec(callback);
};
taggerSchema.statics.getByUserIdInPeriod = function(userId, beginTime, endTime, limit, skip, callback){
    this.find({userId: userId,  createAt:{'$gte': new Date(beginTime), '$lt': new Date(endTime)}})
        .limit(+limit)
        .skip(+skip)
        .sort({createAt: -1})
        .lean()
        .exec(callback);
};
taggerSchema.index({createAt:1});
taggerSchema.index({jobsiteId:1});

taggerSchema.set('collection', 'tagger');
module.exports = taggerSchema;

