var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var deviceSchema = new Schema({
    userId: String,
    serialId: String,
    area: String,
    note: String,
    blt: {},
    ownerId: {type:ObjectId,default:null},
    isDel: {type: Boolean, default: false},
    createAt: {type: Date},
    updateAt: {type: Date}
});
deviceSchema.index({userId:1});
deviceSchema.index({serialId:1});
deviceSchema.index({userId:1,serialId:1},{unique:true});

deviceSchema.set('toJSON',{getters: true, transform: function(doc, ret, options){
    return {
        id: ret._id,
        userId : ret.userId,
        serialId: ret.serialId,
        area: ret.area,
        note: ret.note,
        blt: ret.blt || {},
        createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss"): '',
        updateAt : ret.updateAt && true ? new Date(ret.updateAt).Format("yyyy-MM-dd hh:mm:ss"): ''
    }
}});

deviceSchema.statics.findOneBySerialId = function(serialId, callback){
    this
        .findOne({serialId: {$regex: serialId, $options: 'ig'}, isDel: false})
        .sort({updateAt: -1})
        .select('-__v')
        .exec(callback);
};

deviceSchema.statics.findByUserName = function(userId, callback){
    this.findOne({userId: userId})
        .select('-__v')
        .exec(callback);
};
deviceSchema.statics.removeById = function(id, callback){
    this.remove({_id: id}, callback);
    //this.findOneAndUpdate({_id: id}, {$set:{isDel: true}}, callback);
};

deviceSchema.statics.getAll = function(limit, skip, condition, callback){
  this
      .find(condition)
      .select('-__v')
      .limit(+(limit || 10))
      .skip(+(skip || 0))
      .sort({updateAt: -1, createAt: -1})
      .exec(callback);
};

deviceSchema.statics.getByArea = function(area,ownerId, callback){
    this
        .find({area: area, ownerId: ownerId})
        .select('-__v')
        .sort({updateAt: -1, createAt: 1})
        .exec(callback);
};

deviceSchema.statics.getAll2 = function(callback){
    this
        .find()
        .select('-__v')
        .sort({updateAt: -1, createAt: 1})
        .exec(callback);
};

deviceSchema.set('collection', 'device');
module.exports = deviceSchema;
