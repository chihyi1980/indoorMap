var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    enabled: {type: Boolean, default: true},
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
});

userSchema.index({name:1},{unique:true});

userSchema.set('toJSON', {getters: true, transform: function(doc, ret, options){
    return {
        _id: ret._id,
        name: ret.name,
        email : ret.email,
        password: ret.password,
        isAdmin :ret.isAdmin,
        enabled : ret.enabled,
        createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss"): '',
        updateAt : ret.updateAt && true ? new Date(ret.updateAt).Format("yyyy-MM-dd hh:mm:ss"): ''
    }
}});

userSchema.statics.getAll = function(callback){
    this
        .find()
        .select('-__v')
        .sort({updateAt: -1, createAt: -1})
        .exec(callback);
};

userSchema.statics.getOneByNameAndPassword = function(name, password, callback){
    this
        .findOne({name:name, password:password})
        .select('-__v')
        .exec(callback);
};

userSchema.set('collection', 'user');
module.exports = userSchema;