/**
 * Created by zhaop on 2016/11/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var coordSchema = new Schema({
    blt: String,
    coord: {},
    _coord: {},
    list: [],
    time: {type: Date, default: Date.now}
});
coordSchema.set('collection', 'test_coord');
module.exports = coordSchema;