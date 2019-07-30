/**
 * Created by zhaop on 2017/11/26.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var monitorSchema = new Schema({
    jobsiteId: String,
    userId: String,
    cameraId: String,
    cameraName: String,
    createAt: {type: Date, default: Date.now}
});
monitorSchema.set('toJSON', {getters: true, transform: function(doc, ret, options){

    return {
        jobsiteId: ret.jobsiteId,
        userId: ret.userId,
        cameraId: ret.cameraId,
        cameraName : ret.cameraName,
        time: ret.createAt,
    }
}});

monitorSchema.statics.getAll = function(limit, skip, condition, callback){
    this
        .find(condition)
        .select('-__v')
        .limit(+(limit || 10))
        .skip(+(skip || 0))
        .sort({createAt: -1})
        .exec(callback);
};
monitorSchema.index({createAt: 1});
monitorSchema.index({cameraId: 1});

monitorSchema.set('collection', 'monitor');
module.exports = monitorSchema;
