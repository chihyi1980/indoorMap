var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var analysisSchema = new Schema({
    date: String,
    record: {},
    type: String,
    recordId: String,
    ownerId: {type:ObjectId,default:null}
});

analysisSchema.index({date:1,recordId:1},{unique:true});
analysisSchema.index({date:1});
analysisSchema.index({recordId:1});

analysisSchema.statics.findOneByCompositeIndex = function(date, recordId, callback){
    this
        .findOne({date: date, recordId: recordId})
        .select('-__v')
        .exec(callback)
};

analysisSchema.statics.findSomeInPeriod = function(recordId, begin, end, callback){
    this
        .find({recordId: recordId, date:{'$gte': begin, '$lte': end}})
        .sort({date: 1})
        .exec(callback);
};

analysisSchema.set('collection', 'analysis');
module.exports = analysisSchema;