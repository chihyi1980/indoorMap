var rfCache = {};

exports.cacheRf = function(rf){
    rfCache['rf'] = rf;
};

exports.getRfCache = function(){
    return rfCache['rf'] || null;
};

exports.clearRfCache = function(){
    rfCache = {};
};
