/**
 * Created by zhaop on 2015/11/11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var trackSchema = new Schema({
    userId: String,
    enterTime: String,//  时间字符串 0秒或30秒时刻
    jobsiteId: String,
    mapFloorId: String,
    coordinate: [],
    trackId: String, // enterTime + userId的md5字符串
    ownerId: String
});
trackSchema.index({jobsiteId: 1});
trackSchema.index({enterTime: 1});
trackSchema.index({trackId: 1},{unique:true});

trackSchema.set('collection', 'track');
module.exports = trackSchema;
