/**
 * Created by zhaop on 2016/1/12.
 */
var mongo = require('mongoose');
var Schema = mongo.Schema;

var beaconSchema = new Schema({
    mac: String,
    uuid: String,
    major: String,
    minor: String,
    wifiId: String,
    floorId: Schema.ObjectId,
    coordinate: {
        x: Number,
        y: Number
    },
    matched:{type:Boolean,default:false},
    name: String,
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
}, {versionKey: false});

beaconSchema.index({floorId:1});

beaconSchema.set('collection', 'beacon_editor');

module.exports = beaconSchema;