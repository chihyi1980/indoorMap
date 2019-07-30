var http = require('http');
var querystring = require('querystring');
var cronJob = require('cron').CronJob;

var httpRequest = function(apiName,params,callback){
    var contents = querystring.stringify(params);
    var options = {
        hostname: 'iscan2.atlasyun.com',
        port: 80,
        path: apiName,
        method: 'POST',
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    };
    var req = http.request(options,function(res){
        res.setEncoding('utf8');
        res.on('data',function(data){
            callback(data);
        });
    });
    req.write(contents);
    req.end();
};

/*
httpRequest('/iscan/beacon/setLonLat',{iscanId:'17', lat: 111, lon: 222, updateAt: '2015-01-20 12:11:00'}, function(data){
    console.log(data);
});
httpRequest('/iscan/beacon/getLonLat',{iscanId:'17'}, function(data){
    console.log(data);
});*/

var data1 = [
    { lon: '-1.0',
        lat: '-1.0',
        userId: '',
        enterTime: new Date(),
        wifiId: '2F:0C:0B:13:F5:D4',//ble_mac: '9C:65:F9:13:17:F3',
        beaconId: '',
        deviceId: '19:18:FC:00:70:F1',//scanned_ble_mac: 'FF:FF:FF:FF:FF:FF',
        rssi: '-1000'
    },
    { lon: '-1.0',
        lat: '-1.0',
        userId: '',
        enterTime: new Date(),
        wifiId: '9C:65:F9:13:0E:96',//ble_mac: '9C:65:F9:13:17:F3',
        beaconId: '',
        deviceId: '19:18:FC:00:70:F1',//scanned_ble_mac: 'FF:FF:FF:FF:FF:FF',
        rssi: '-1000'
    }
];
var data = [{"deviceId":"00:00:20:01:00:BE","userId":"","enterTime":1476863835588,"wifiId":"19:18:FC:01:9D:5C","rssi":"-35"},{"deviceId":"00:00:20:01:00:BE","userId":"","enterTime":1476863835588,"wifiId":"E3:32:00:00:FE:CF","rssi":"-62"},{"deviceId":"00:00:20:01:00:BE","userId":"","enterTime":1476863835588,"wifiId":"DE:32:00:00:FE:CF","rssi":"-72"},{"deviceId":"00:00:20:01:00:BE","userId":"","enterTime":1476863835588,"wifiId":"EE:32:00:00:FE:CF","rssi":"-72"},{"deviceId":"00:00:20:01:00:BE","userId":"","enterTime":1476863835588,"wifiId":"EB:32:00:00:FE:CF","rssi":"-76"},{"deviceId":"00:00:20:01:00:BE","userId":"","enterTime":1476863835588,"wifiId":"F0:32:00:00:FE:CF","rssi":"-80"}];
data = JSON.stringify(data);

/*httpRequest('/worker/get',{deviceId: '88:0F:10:21:17:15'}, function(data){
    console.log(data);
});*/

//* postByPhone
httpRequest('/tagger/postByPhone',{data:data}, function(data){
    console.log(data);
});
/*
httpRequest('/iscan/worker/update',{deviceId:'112111', userId:'112111'}, function(data){
    console.log(data);
});
 */

