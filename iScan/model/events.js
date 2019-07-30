/**
 * Created by zhaop on 2016/4/26.
 */
/**
 * Created by zhaop on 2016/1/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventsSchema = new Schema({
    userId: String,
    iscanId: String,
    loc : {
        floorId: String,
        x: Number,
        y: Number
    },
    loc_desc: String,
    ownerId: String,
    desc: {type: String, default: '發生緊急事件'},
    resolved: { type:Boolean, default: false},
    createAt: {type: Date, default: Date.now}
});
eventsSchema.index({createAt:1});
eventsSchema.set('collection', 'events');
module.exports = eventsSchema;