var mongo = require('../db/mongodb'),
    iscan_conn = mongo.iscan_conn,
    oak_conn = mongo.oak_conn;

module.exports = {
    //iscan db
    Beacon: iscan_conn.model('Beacon', require('./beacon'))
    ,Device: iscan_conn.model('Device', require('./device'))
    ,Tagger: iscan_conn.model('Tagger', require('./tagger'))
    ,User: iscan_conn.model('User', require('./user'))
    ,Analysis: iscan_conn.model('Analysis', require('./analysis'))
    ,Jobsite: iscan_conn.model('Jobsite', require('./jobsite'))
    ,Track: iscan_conn.model('Track', require('./track'))
    ,Location: iscan_conn.model('Location', require('./location'))
    ,tagEvents : iscan_conn.model('Events', require('./events'))
    ,testCoord: iscan_conn.model('TestCoord', require('./test_coord'))
    ,Monitor: iscan_conn.model('Monitor', require('./monitor'))
    //oak db
    ,OakMall: oak_conn.model('OakMall', require('./oak_mall'))
    ,OakBeacon: oak_conn.model('OakBeacon', require('./oak_beacon'))
    ,OakPoi: oak_conn.model('OakPoi', require('./oak_poi'))
};
