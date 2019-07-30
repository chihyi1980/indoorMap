exports.loginRequired = function(req,res,next){
	if(req.headers['user-agent'].indexOf('Chrome') > -1){

    }else{
        //return res.send('请使用高版本IE内核（IE9以上）的浏览器，或者谷歌、火狐浏览器！')
    }
    if(!req.session.loginUser){
        //res.redirect('/');
        res.jsonp(403, { msg: 'api forbidden.'})
    }else{
        next();
    }
};

var crypto = require('crypto');
var getMd5Str = function(str){
    var md5 = crypto.createHash('md5');
    return md5.update(str.trim()).digest('hex');
};
var lastReq = {};
exports.requireLimit = function(req, res, next){
    var userId = req.body.userId;
    var reqId = getMd5Str(req.headers.host + req.url + userId);
    if(lastReq[reqId] == null ||  lastReq[reqId] == undefined){
        lastReq[reqId] = new Date().getTime();
        next()
    }else if(lastReq[reqId] && Math.abs(lastReq[reqId] - new Date().getTime()) <= 5 * 1000 ){
        res.jsonp(403, { msg: 'The number of requests is too frequent, please wait for 5 second.'})
    }else{
        lastReq[reqId] = new Date().getTime();
        next()
    }
};


