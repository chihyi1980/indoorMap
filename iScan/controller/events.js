/**
 * Created by zhaop on 2016/4/27.
 */
var models = require('../model');
var tagEvents = models.tagEvents;
var async = require('async');

exports.getEvents = function(req, res){
    var limit = req.query['l'] || 10,
        skip = req.query['s'] || 0,
        kw = req.query['kw'] || null;
    var loginUser = req.session.loginUser;
    if(!loginUser || !loginUser._id){
        //return res.json(500, {message: 'Invalid user.'});
    }
    //var ownerId = loginUser._id;
    var condition = {};//{ownerId: ownerId};
    if(kw){
        condition.$or = [
            {iscanId: {$regex: kw, $options: 'gi'}},
            {loc_desc: {$regex: kw, $options: 'gi'}},
            {userId: {$regex: kw, $options: 'gi'}}
        ];
    }
    async.series([
        function(callback){
            tagEvents.count(condition,function(err,nums){
                if(err){
                    callback(err, 1);
                }else{
                    var total = Math.ceil(parseInt(nums)/parseInt(limit));
                    callback(null, total);
                }
            });
        },
        function(callback){
            tagEvents.find(condition)
                .select('-__v')
                .limit(limit)
                .skip(skip)
                .sort({createAt: -1})
                .exec(function(err, ret){
                    callback(err, ret);
                })
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });
}