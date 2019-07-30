var models = require('../model');
var User = models.User;
var crypto = require('crypto');

var getMd5Str = function(str){
    var md5 = crypto.createHash('md5');
    return md5.update(str.trim()).digest('hex');
};

exports.initUser = function(req, res){
    User.update({name: 'atlas'}, {$set: {
        name: 'atlas',
        email: 'api@atlasyun.com',
        password: getMd5Str('atlas123'),
        isAdmin: true
    }},{upsert: true}, function(err, ret ){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(201, ret);
        }
    });
};

exports.addNewUser = function(req, res){
    var newName = req.body.name,
        pwd = req.body.pwd,
        email = req.body.email;
    if(!newName || !pwd){
        return res.json(500, {message: 'Error: Lost args.'});
    }
    var newUser = new User({
        name: newName,
        email: email,
        password: getMd5Str(pwd),
        isAdmin: false
    });
    newUser.save(function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(201, ret);
        }
    })
};

exports.updateUser = function(req, res){
    var id = req.body._id,
        newName = req.body.name,
        pwd = req.body.pwd,
        email = req.body.email || '',
        enabled = req.body.enabled;
    if(!newName){
        return res.json(500, {message: 'Error: Lost args.'});
    }
    var update;
    if(pwd){
        update = {
            name : newName,
            email : email,
            password: getMd5Str(pwd),
            enabled: enabled
        }
    }else{
        update = {
            name : newName,
            email : email,
            enabled: enabled
        }
    }
    User.update({_id: id},{$set: update},function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, {message: 'ok'});
        }
    })
};

exports.getAllUsers = function(req, res){
    User.getAll(function(err, ret){
        if (err) {
            res.json(500, {message: err.toString()});
        }else{
            res.json(200, ret);
        }
    })
};

exports.checkUser = function(req, res){
    var userName = req.body.ume;
    var pwd = getMd5Str(req.body.pwd);
    User.getOneByNameAndPassword(userName, pwd, function(err, ret){
        if(err){
            res.json(500, {message: err.toString()});
        }else{
            req.session.loginUser = ret;

            console.log(req.session.loginUser);

            res.json(200, ret);
        }
    })
};

exports.loginOut = function(req, res){
    req.session.destroy();
    res.json({message: 'ok'});
};

exports.isOnline = function(req, res){
    var flag = false;
    if(req.session.loginUser){
       flag = true;
    }
    res.jsonp(200, {status: flag});
}
