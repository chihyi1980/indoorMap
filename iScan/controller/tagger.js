/**
 * Created by zhaop on 2016/11/10.
 */
var models = require('../model');
var Tagger = models.Tagger;
var async = require('async');

exports.getByJobsite = function(req, res){
    var begin = req.body.begin,
        end = req.body.end,
        jobsiteId = req.param('jid');
    var limit = req.body['l'] || 10,
        skip = req.body['s'] || 0;
    async.series([
        function(callback){
            Tagger.count({jobsiteId: jobsiteId,  createAt:{'$gte': new Date(begin), '$lt': new Date(end)}})
                .exec(function(err,nums){
                if(err){
                    callback(err, 1);
                }else{
                    if(!limit){
                        callback(null ,1)
                    }else{
                        var total = Math.ceil(parseInt(nums)/parseInt(limit));
                        callback(null, total);
                    }
                }
            });
        },
        function(callback){
            Tagger.getByJobsiteIdInPeriod(jobsiteId, begin, end, limit, skip, callback)
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });

};

exports.getInPeriodBySite = function(req, res){
    var start = +req.body.start,
        end = +req.body.end,
        jobsiteId = req.param('jid');
    Tagger.find({jobsiteId: jobsiteId,  createAt:{'$gte': new Date(start), '$lte': new Date(end)}})
        .select('coord createAt userId')
        .sort({createAt: 1})
        .lean()
        .exec(function(err, ret){
            if(err){
                res.json(500, {message: err.toString()});
            }else{
                res.json(200, ret);
            }
        });
};

exports.getByUid = function(req, res){
    var begin = req.body.begin,
        end = req.body.end,
        userId = req.param('uid');
    var limit = req.body['l'] || 10,
        skip = req.body['s'] || 0;
    async.series([
        function(callback){
            Tagger.count({userId: userId,  createAt:{'$gte': new Date(begin), '$lt': new Date(end)}})
                .exec(function(err,nums){
                    if(err){
                        callback(err, 1);
                    }else{
                        if(!limit){
                            callback(null ,1)
                        }else{
                            var total = Math.ceil(parseInt(nums)/parseInt(limit));
                            callback(null, total);
                        }
                    }
                });
        },
        function(callback){
            Tagger.getByUserIdInPeriod(userId, begin, end, limit, skip, callback)
        }
    ],function(err,values){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, values);
        }
    });
};