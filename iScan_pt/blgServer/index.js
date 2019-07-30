/**
 * Created by chihyi 2017/10/25 
 * for new blg server, it binds port 3030.
 * the new function use poiMatch /map/beacon/getLocate
 */
var dgram = require('dgram');
var serverSocket = dgram.createSocket('udp4');
serverSocket.bind(3030);

serverSocket.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

var msgCtrl =  require('./message');

serverSocket.on("message", function (msg) {

    var len = msg.length;
    var list = [];
    if(len){
        for(var i=0; i< len; ++i){
            list[i] = msg[i];
        }
        try{
            msgCtrl.blg_convert(list);
        }catch (e){
            console.log(e)
        }
    }
});

serverSocket.on("listening", function () {
    var address = serverSocket.address();
    console.log("server listening " +
        address.address + ":" + address.port);
});

