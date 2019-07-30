/**
 * Created by zhaop on 2016/1/14.
 */
var mongo = require('mongoose');
var Schema = mongo.Schema;

var mallSchema = new Schema({
    poi_id: Schema.ObjectId,
    buildings  : [],
    last_updated : {type: Date, default: Date.now}
}, {versionKey: false});

mallSchema.set('collection', 'mall_editor');
module.exports = mallSchema;
