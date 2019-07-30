/**
 * Created by zhaop on 2015/12/2.
 */
require('../db/mongodb');
require('../util');
var models = require('../model');
var Tagger = models.Tagger;

var arr = [{rssi:111},{rssi:222}];
Tagger.create(arr, function(err, rets){
    console.log(err,rets)
})