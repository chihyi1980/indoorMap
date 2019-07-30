var mongoose 	= require('mongoose');
var config 		= require('../config');

var iscan_conn = mongoose.createConnection(config.DB_URI.iscan);
var oak_conn = mongoose.createConnection(config.DB_URI.oak);

var dbs = [{conn: iscan_conn, url: config.DB_URI.iscan }, {conn: oak_conn, url: config.DB_URI.oak}];

dbs.forEach(function(db){
    var conn = db.conn;
    conn.on('connected', function(){
        console.log('-- mongoDB connection opened: %s --', db.url);
    });

    conn.on('error', function(err){
        console.log('-- mongoDB error: %s --', err);
    });

    conn.on('disconnected', function(){
        console.log('-- mongoDB connection closed: %s', db.url);
    });

    process.on('SIGINT', function(){
        conn.close(function(){
            console.log('mongoDB connection closed through app termination, %s', db.url);
            process.exit(0);
        })
    });
});

module.exports = {
    iscan_conn : iscan_conn,
    oak_conn : oak_conn
};
