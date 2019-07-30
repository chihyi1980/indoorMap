var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var jobsiteSchema = new Schema({
    name: String,
    area: String,
    address: String,
    mapId: String,
    mapIdOfConsole: {},
    ownerId: {type:ObjectId,default:null},
    isDel: {type: Boolean, default: false},
    createAt: {type: Date, default: Date.now}
});

jobsiteSchema.index({createAt:1});
jobsiteSchema.index({name:1},{unique:true});

jobsiteSchema.set('toJSON', {getters: true, transform: function(doc, ret, options){
    return {
        id: ret._id,
        name: ret.name,
        area: ret.area,
        address : ret.address,
        isDel: ret.isDel,
        mapId: ret.mapId,
        createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss"): ret.createAt
    }
}});

jobsiteSchema.statics.getAll = function(limit, skip, condition, callback){
    this
        .find(condition)
        .select('-__v')
        .limit(+(limit || 10))
        .skip(+(skip || 0))
        .sort({createAt: -1})
        .exec(callback);
};

jobsiteSchema.statics.getOneById = function (id,callback){
    this
        .findOne({isDel: false, _id:id})
        .select('-__v')
        .exec(callback);
};

jobsiteSchema.set('collection', 'jobsite');
module.exports = jobsiteSchema;
