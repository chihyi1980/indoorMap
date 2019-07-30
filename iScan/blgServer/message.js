function check_header(msg){
    var type = 0;
    if(msg && msg[0] && msg[1]){
        if(msg[0].toString(16) === '76' && msg[1].toString(16) === '47') type = 1;
        if(msg[0].toString(16) === '76' && msg[1].toString(16) === '46') type = 2;
        if(msg[0].toString(16) === '77' && msg[1].toString(16) === '46') type = 3;
    }
    return type;
}
function get_hex_str(num){
    return num < 16 ?  '0'.concat(num.toString(16)): num.toString(16);
}
function get_mac(offset, list){
    var macStr = '';
    for(var i=0; i<6;++i){
        macStr += (i=== 5 ? get_hex_str(list[offset + i]) : get_hex_str(list[offset + i]).concat(':'));
    }
    return macStr.toUpperCase();
}
function get_timestamp(offset, list){
    var  hexStr = '';
    for(var i=0; i<8;++i){
        hexStr += get_hex_str(list[offset + i]);
    }
    return parseInt(hexStr, 16);
}
function get_average_rssi(beacons){
    beacons = beacons instanceof Array ? beacons : [];
    var temp = {};
    beacons.forEach(function(b){
        if(temp[b.beaconId] == null || temp[b.beaconId] === undefined){
            temp[b.beaconId] = {};
            temp[b.beaconId].rssi = [b.rssi];
        }else{
            temp[b.beaconId].rssi.push(b.rssi);
        }
    })
    var result = [];
    for(var i in temp){
        var tempRssi = eval(temp[i].rssi.join('+')) / temp[i].rssi.length;
        result.push({ beaconId: i, rssi: tempRssi.toFixed(0)});
    }
    return result;
}
function get_client_data(cursor_index, blt_num, list){
    var index = cursor_index;
    var blts = {};
    for(var i=0; i < blt_num; i++){
        var blt_mac = get_mac(index, list);
        var blt_work_status = list[index+6];
        var blt_beacon_num = list[index+7];
        var blt_timestamp = get_timestamp(index + 8, list);
        var blt_beacons = [], tempIndex;

        for(var j=0; j<blt_beacon_num; ++j){
            var uuid = '';
            for(var k=0; k< 16; ++k){
                uuid += list[index + 16 + k + 21 * j].toString(16);
            }

            var major = (parseInt(list[index + 16  + 16 + 21 * j].toString(16).concat(list[index + 16 + 17 + 21 * j].toString(16)), 16)).toString();
            
            //var blt_beacon_id = (parseInt(list[index + 16  + 18 + 21 * j].toString(16).concat(list[index + 16 + 19 + 21 * j].toString(16)), 16) % 8192).toString();
            var blt_beacon_id = (parseInt(list[index + 16  + 18 + 21 * j].toString(16).concat(list[index + 16 + 19 + 21 * j].toString(16)), 16)).toString();
            
            
            var blt_rssi = +list[index + 16 + 20 + 21 * j] - 256;
            blt_beacons.push({rssi: blt_rssi, beaconId: blt_beacon_id});
            tempIndex = index + 16 + 21  + 21 * j;
        }
        index = tempIndex;
        var tempBlt = {mac: blt_mac, workStatus: blt_work_status, timestamp: blt_timestamp, beacons: blt_beacons};

        blts[tempBlt.mac] = tempBlt;
        /*
        if(blts[tempBlt.mac] == null || blts[tempBlt.mac] == undefined){
            blts[tempBlt.mac] = tempBlt;
        }else{ //不做缓存 如果有缓存 需要根据时间判断
            blts[tempBlt.mac].beacons = blts[tempBlt.mac].beacons.concat(tempBlt.beacons);
            if(tempBlt.timestamp > blts[tempBlt.mac].timestamp){
                blts[tempBlt.mac].timestamp = tempBlt.timestamp;
            }
        }
        */
    }
    var result = [];
    for(var i in blts){
        //blts[i].beacons = get_average_rssi(blts[i].beacons);
        result.push(blts[i])
    }
    return result;
}

function get_client_data_V3(cursor_index, blt_num, list){
    var index = cursor_index;
    var blts = {};
    for(var i=0; i < blt_num; i++){
        var blt_mac = get_mac(index, list);
        var blt_work_status = list[index+7];
        var blt_beacon_num = list[index+8];
        var blt_beacons = [], tempIndex;

        for(var j=0; j<blt_beacon_num; ++j){
            var uuid = '';
            for(var k=0; k< 16; ++k){
                uuid += list[index + 30 + k + 21 * j].toString(16);
            }

            var major = (parseInt(list[index + 30  + 16  + 21 * j].toString(16).concat(list[index + 30 + 17 + 21 * j].toString(16)), 16)).toString();
            var blt_beacon_id = (parseInt(list[index + 30  + 18 + 21 * j].toString(16).concat(list[index + 30 + 19 + 21 * j].toString(16)), 16)).toString();
                        
            var blt_rssi = +list[index + 30 + 20 + 21 * j] - 256;
            blt_beacons.push({rssi: blt_rssi, beaconId: blt_beacon_id});
            tempIndex = index + 30 + 21  + 21 * j;
        }
        index = tempIndex;
        var tempBlt = {mac: blt_mac, workStatus: blt_work_status, beacons: blt_beacons};

        blts[tempBlt.mac] = tempBlt;

    }

    var result = [];
    for(var i in blts){
        result.push(blts[i])
    }
    return result;
}


function get_blt_info(cursor_index, blt_num, list){
    var index = cursor_index;
    var result = [];
    for(var i=0; i < blt_num; i++){
        var blt_mac = get_mac(index, list);
        var blt_battery = list[index+6];
        var blt_work_status = list[index+7];
        var blt_timestamp = get_timestamp(index + 9, list);
        result.push({
            mac: blt_mac,
            battery: blt_battery,
            status: blt_work_status,
            time: blt_timestamp
        });
        index = index + 17;
    }
    return result;
}

function get_blt_info_V3(cursor_index, blt_num, list){
    var index = cursor_index;
    var result = [];
    for(var i=0; i < blt_num; i++){
        var blt_mac = get_mac(index, list);
        var blt_battery = list[index+6];
        var blt_work_status = list[index+7];
        var blt_timestamp = get_timestamp(index + 9, list);
        result.push({
            mac: blt_mac,
            battery: blt_battery,
            status: blt_work_status,
            time: blt_timestamp
        });
        index = index + 22;
    }
    return result;
}


//以一個map保存每一個基站的固件版本  by chihyi 2018.04.05
var mapBlgVersion = {};

function _convert(list){
    var msgType = check_header(list);
    if(msgType === 1){
        var blg_version = list[2];
        var blg_data_len = parseInt(list[3].toString(16).concat(list[4].toString(16)), 16);
        var blg_mac = get_mac(5, list);
        var blg_timestamp = get_timestamp(11, list);
        var blt_num = list[19];

        mapBlgVersion[blg_mac] = blg_version;

        var blt_data = {};
        if(blg_version == 2)
        {
            blt_data = (blg_data_len > 0) && (blg_data_len + 20 === list.length) ? get_client_data(20, blt_num, list) : null;
        }else
        {
            blt_data = (blg_data_len > 0) && (blg_data_len + 20 === list.length) ? get_client_data_V3(20, blt_num, list) : null;
        }

        return {type: 1, data: blt_data, blg_mac: blg_mac};
    }else if(msgType === 2){
        var blt_info_len = parseInt(list[3].toString(16).concat(list[4].toString(16)), 16);
        var blg_mac = get_mac(5, list);
        var blg_timestamp = get_timestamp(11, list);
        var blt_num = list[19];

        var blg_version = mapBlgVersion[blg_mac];
        var blt_info = {};
        if(!blg_version)
        {
            blt_info = null;
        }else if(blg_version == 2)
        {
            blt_info = blt_info_len > 20 ? get_blt_info(20, blt_num, list) : null;
        }else if(blg_version == 3)
        {
            blt_info = blt_info_len > 20 ? get_blt_info_V3(20, blt_num, list) : null;
        }
        return {type: 2, data: blt_info};
    }else if(msgType === 3){
        console.log(list);
        return null;
    }else{
        console.log('Invalid data.');
        return null;
    }
}

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
exports.blg_convert = function(list){
    var data = _convert(list);
    
	//console.log(JSON.stringify(data));

	if(data && data.type === 1){

          dataBuffer(data.data, data.blg_mac);

    }else if(data && data.type === 2){
        Handle.updateBlt(data.data);
    }else if(data && data.type === 3){
        console.log('pass');
    }
};

//buffer data for 3 sec and send
var mapDataBuffer  = {};
var mapBltBlgMac = {};
function dataBuffer(data, blg_mac)
{
	for(var i = 0 ; i < data.length ; i++)
	{
		//var tempAry = mapDataBuffer[data[i]['mac']];
		if(!mapDataBuffer[data[i]['mac']])
		{
			mapDataBuffer[data[i]['mac']] = [];
		}
		mapDataBuffer[data[i]['mac']].push(data[i]);
		mapBltBlgMac[data[i]['mac']] = blg_mac;
		
	}
	//var tempdata = mapDataBuffer[data['mac']];
    //console.log(mapDataBuffer);
}

function sendBufferedData()
{
	var ansDataObj = {};

	for(var mac in mapDataBuffer)
	{
		var tempAry = mapDataBuffer[mac];
		var ansObj = {};
		ansObj['mac'] = mac;
		ansObj['beacons'] = [];
        //console.log(JSON.stringify(mapDataBuffer[mac]));
        ansObj['workStatus'] = mapDataBuffer[mac][tempAry.length-1]['workStatus'];

		var bidMap = {};
		for(var i = 0 ; i < tempAry.length ; i++ )
		{
			var beaconsAry = tempAry[i]['beacons'];
			for(var j = 0 ; j < beaconsAry.length ; j++)
			{
				var bId = beaconsAry[j]['beaconId'];
				bidMap[bId] = 0;
			}
		}


		for(var i = 0 ; i < tempAry.length ; i++ )
		{
			var beaconsAry = tempAry[i]['beacons'];
			for(var j = 0 ; j < beaconsAry.length ; j++)
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

            		if(tempObj['rssi'] && parseInt(tempObj['rssi']) > -70)
                		ansBeacons.push(tempObj);

		}
		ansObj['beacons'] = ansBeacons;
		
		var blgMac = mapBltBlgMac[ansObj['mac']];

		if(ansDataObj[blgMac])
		{
			//console.log(JSON.stringify(ansObj));
			ansDataObj[blgMac].push(ansObj);
		}
		else
		{
			ansDataObj[blgMac]=[];
			ansDataObj[blgMac].push(ansObj);
		}

	}

	return ansDataObj;
}

setInterval(function(){
	var data = sendBufferedData();

	for(var key in data)
	{
		console.log(JSON.stringify(data[key]));
		console.log(key);
		Handle.saveData2(data[key],key);
		sendScanData(data[key]);
	}	

	//sendScanData(data);
	mapDataBuffer = {};
},3000);
