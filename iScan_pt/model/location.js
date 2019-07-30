/**
 * Created by zhaop on 2016/1/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    time: String,
    deviceId: String,
    floorId: String,
    x: Number,
    y: Number,
    typeId: String,
    createAt: {type: Date, default: Date.now}
});
locationSchema.index({time:1, deviceId: 1});

locationSchema.set('collection', 'location');
module.exports = locationSchema;
