var net = require('net');
var StringDecoder = require('string_decoder').StringDecoder;

var server = net.createServer(function(socket) {
    //console.log('有TCP客户端连接进入');

    socket.on('end', function() {
        //console.log('客户端连接断开');
    });

});

server.on('connection', function(socket)
{
    var decoder = new StringDecoder('utf8');
    socket.on('data', function(data) {
        var string = decoder.write(data);
        var obj =  JSON.parse(string);
        sendLocate(obj, '40:A3:6B:C1:0E:39');
    });
});

//send scan data into poiMatch beacon position
function sendScanData(scanData)
{

	if(!scanData||scanData.length == 0)
		return;

	var request=require('request');
	var options = {
			url: 'http://127.0.0.1/poi/map/beacon/sendScanBeacon',
			method: 'POST',
			json: true,
			body: {'scanData': scanData},
	};

	function callback(error, response, data) {
		if (!error) {
			//console.log('----info------',data);
		}else{
			//console.log('----err------',response.statusCode);
			//console.log('----err------',data);
		}
	}

	request(options, callback);
}


var Handle = require('./dataHandle');
function sendLocate(data, blg_mac)
{
	//console.log(JSON.stringify(data.data));
        //Handle.saveData2(data.data, blg_mac);
		dataBuffer(data.data);
	//sendScanData(data.data);
}



//TCP服务器开始端口监听
server.listen(3031, function() {
    console.log('TCP服务启动');
});

//buffer data for 3 sec and send
var mapDataBuffer  = {};
function dataBuffer(data)
{
	for(var i=0;i<data.length;i++)
	{
		var tempAry = mapDataBuffer[data[i]['mac']];
		if(!tempAry)
		{
			tempAry = [];
			mapDataBuffer[data[i]['mac']] = tempAry;
		}else{
			tempAry.push(data[i]);
		}
	}
	var tempdata = mapDataBuffer[data['mac']];
}

function sendBufferedData()
{
	var ansAry = [];
	for(var mac in mapDataBuffer)
	{
		var tempAry = mapDataBuffer[mac];
		var ansObj = {};
		ansObj['mac'] = mac;
		ansObj['beacons'] = [];
		var bidMap = {};
		for(var i =0;i< tempAry.length;i++)
		{
			var beaconsAry = tempAry[i]['beacons'];
			for(var j =0;j< beaconsAry.length;j++)
			{
				var bId = beaconsAry[j]['beaconId'];
				bidMap[bId] = 0;
			}
		}

		for(var i =0;i< tempAry.length;i++)
		{
			var beaconsAry = tempAry[i]['beacons'];
			for(var j =0;j< beaconsAry.length;j++)
			{
				var bid = beaconsAry[j]['beaconId'];
				var rssi =  beaconsAry[j]['rssi'];
				if(bidMap[bid] == 0)
				{
					bidMap[bid]= parseInt(rssi);
				}else
				{
					bidMap[bid] = (parseInt(rssi) + bidMap[bid]) / 2;
				}
			}
		}
		var ansBeacons = [];
		
		for(var key in bidMap)
		{
			var tempObj = {};
			tempObj['beaconId'] = key;
			tempObj['rssi'] = bidMap[key].toFixed(2);
			ansBeacons.push(tempObj);
		}
		ansObj['beacons'] = ansBeacons;

		ansAry.push(ansObj);
	}

	return ansAry;
}

setInterval(function(){
	var data = sendBufferedData();
	console.log(JSON.stringify(data));
	Handle.saveData2(data, '11:11:11:11:11:11');
	sendScanData(data);
	mapDataBuffer = {};
},3000);
