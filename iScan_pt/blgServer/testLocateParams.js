/*
    created by chihyi 20171106
    用來測試單一building底下，所有beacon在KNN排序中最好的參數選擇，包括該從多少數量上去比較、計算出position最多次數至少應該多少
*/

/*
	modify by chihyi 20171208
	debug
*/

var mAllDataAry = [];
var mTrainDataAry = [];
var mTestDataAry = [];
//var mBeaconMap = {};
//var mBeaconAntiMap = {};
var mMapBeaconKeys = {}

var mFloorList = {};
var mTotal = 0;

var sMaxBeaconLength = 1; //取樣beacon數量必須高於此數，不然捨棄
var sMaxSortAryLength = 5; //用來比較的KNN排序後Array長度最不高於此數
//var sMaxTopPosVal = 5; //比較KNN排序後最常出現的position至少要高於此數，不然捨棄
var sMinResRatio = 0.1; //捨棄後的數量不得低於此比例, 以確保大多數傳進來比較的訊號都有return
var sMinPassRatio = 0.1; //準確率至少高於此數
var sMinRssi = -120;  //低於此rssi捨棄
var sTestDataNumRatio = 0.1 //取樣Test數據比例

var mBuildingId = '5aa779912801d4c801bd6440';
var mBeaconLength = 0;
var mSortAryLength = 0;
var mTopPosVal = 0;
var mMinRssi = 0;

var mTotalCalNum = 0;
var mNowCalNum = 0;

var mResSet = [];


//以rssi差值^2比較出dis, 並且排序，dis越大代表越接近
function getKNNResSortAry(tagData) {

    var orgDataAry = [];
    mTrainDataAry.forEach(function (d) {

        var dis = 0;
        for (var b in mMapBeaconKeys) {
            var tt = tagData['beacons'][b];
            var dd = d['beacons'][b];
            var tt_rssi = '';
            var dd_rssi = '';
            if (tt)
                tt_rssi = parseInt(tt);
            else
                tt_rssi = -120;

            if (dd)
                dd_rssi = parseInt(dd);
            else
                dd_rssi = -120;

            if (tt_rssi < mMinRssi)
                tt_rssi = -120;

            if (dd_rssi < mMinRssi)
                dd_rssi = -120;

            if (!(dd_rssi == -120 && tt_rssi == -120))
                dis += (80 - Math.abs(tt_rssi - dd_rssi)) * (80 - Math.abs(tt_rssi - dd_rssi)) *  Math.abs(-120 - tt_rssi);
            else
                dis += 0;
        }

        var temp = {};
        temp['posId'] = d['posId'];
        temp['dis'] = dis;
        orgDataAry.push(temp);

    });

    orgDataAry.sort(function (a, b) {
        return b.dis - a.dis;
    });

    return orgDataAry;
}

//test the pos is right or not
function runTestPos(tagData) {
    var tPos = tagData['posId'];
    var resAry = getKNNResSortAry(tagData);
    var pass = 0;

    var temp = {};
    for (var i = 1; i < mSortAryLength+1 ; i++) {
        if (temp[resAry[i]['posId']])
            temp[resAry[i]['posId']]++;
        else
            temp[resAry[i]['posId']] = 1;
    }

    var topPosId = '';
    var topPosValue = 0;
    for (var key in temp) {
        if (temp[key] > topPosValue)
        {
            topPosValue = temp[key];
            topPosId = key;
        }
    }
    
    if (topPosValue < mTopPosVal)
        return 2; 
    
    mTotal++;

    //console.log(topPosId);
    //console.log(tPos);

    if (topPosId == tPos)
        return 1;
    else
        return 0;
}

/*
function buildBeacons() {
    var index = 0;
    mAllDataAry.forEach(function (d) {
        d['beacons'].forEach(function (b) {
            var beaconId = b['beaconId'];
            if (!mBeaconMap[beaconId]) {
                mBeaconMap[beaconId] = 1;
                mBeaconAntiMap[index] = beaconId;
                index++;
            } else {
                mBeaconMap[beaconId]++;
            }
        });
    });

    console.log(mBeaconMap);

}
*/

function combineTag(newTag, oldTag)
{
    if(newTag.id != oldTag.id)
        return newTag;

    var tempNewTag = JSON.parse(JSON.stringify(newTag));
    for (var key in oldTag['beacons']) {
        if (!tempNewTag['beacons'][key]) {
            tempNewTag['beacons'][key] = oldTag['beacons'][key];
        }
        else {
            tempNewTag['beacons'][key] = (parseInt(tempNewTag['beacons'][key]) + parseInt(oldTag['beacons'][key])) / 2;
        }
    }
    return tempNewTag;
}

function genTestData() {
    var newTrainDataAry = [];
    var newTestAry = [];
    mAllDataAry.forEach(function (d) {
        //if (d.beacons.size >= mBeaconLength) {
            var r = Math.random();
            if (r <= sTestDataNumRatio)
            {
                newTestAry.push(d);
                newTrainDataAry.push(d);
            }else
            {
                newTrainDataAry.push(d);
            }
        //}

    });

    for(var i = 1 ; i < newTestAry.length ; i++)
    {
        var ansObj = combineTag(newTestAry[i], newTestAry[i-1]);
        mTestDataAry.push(ansObj);
    }

    for(var i = 1 ; i < newTrainDataAry.length ; i++)
    {
        var ansObj = combineTag(newTrainDataAry[i], newTrainDataAry[i-1]);
        mTrainDataAry.push(ansObj);
    }


    //mTrainDataAry = newTrainDataAry;
    //mTestDataAry = newTestAry;
    console.log('mTrainDataAry length :' + mTrainDataAry.length);
    console.log('mTestDataAry length :' + mTestDataAry.length);
}

function calPassRatio() {
    var pass = 0.0;
    var total = 0.0;
    mTotal = 0.0;
    mTestDataAry.forEach(function (d) {
        total++;
        var res = runTestPos(d);
        if (res==1)
            pass++;
    });

    console.log('progress: ' + mNowCalNum + '/' + mTotalCalNum);
    console.log('found : ' + mResSet.length);

    if (mTotal / mTestDataAry.length >= sMinResRatio && pass / mTotal >= sMinPassRatio)
    {
        var tmp = {
            passRatio: pass / mTotal,
            beaconLength: mBeaconLength,
            sortAryLength: mSortAryLength,
            topPosVal: mTopPosVal,
            resRatio: mTotal / mTestDataAry.length,
            minRssi: mMinRssi,
        };
        mResSet.push(tmp);
    }
}

function loadFloorsByBuildingId(buildingId, next)
{
    var request = require('request');
    var retAry = [];
    var options = {
        url: 'http://127.0.0.1/poi/map/building/getSimple',
        method: 'GET',
        json: true,
        body: { id: buildingId },
    };

    var callback = function (err, res, data) {
        if (data['data']) {
            mFloorList = data['data'][7][0];
            next();
        } else {
            throw err;
        }
    }

    request(options, callback);
}

// 將 ScanData 的 data, 轉換成一筆一筆的tag型式
function getTagFromScan(s) {
    var beacons = s['beacons'];
    var newbeacons = {};
    for (var i = 0; i < beacons.length; i++) {
        newbeacons[beacons[i]['beaconId']] = parseInt(beacons[i]['rssi']);

        //load beacon keys map
        if (!mMapBeaconKeys[beacons[i]['beaconId']]) {
            mMapBeaconKeys[beacons[i]['beaconId']] = 1;
        } else
        {
            mMapBeaconKeys[beacons[i]['beaconId']] ++;
        }
    }
    return newbeacons;
}
function loadBeaconListByFloorId(floorId, next)
{

    var request = require('request');
    var retAry = [];
    var options = {
        url: 'http://127.0.0.1:3009/map/beacon/listByFloor',
        method: 'GET',
        json: true,
        body: { floorId: floorId },
    };

    var callback = function (err, res, data)
    {
        if (err) {
            console.log(err);
        }
        if (data['data']) {
            data['data'].forEach(function (d) {
                var posId = d['id'];
                var scanData = d['scanData'];
                var name = d['name'];
                if (scanData) {
                    scanData.forEach(function (s) {
                        var beacons = s['beacons'];
                        if (beacons.length != 0)
                        {
                            var newTagData = {};
                            newTagData['posId'] = posId;
                            newTagData['beacons'] = getTagFromScan(s);
                            newTagData['name'] = name;
                            retAry.push(newTagData);
                        }
                    });
                }
            });

            mAllDataAry = retAry;
            next();
        }

    }

    request(options, callback);

}

function sortResSet()
{
    mResSet.sort(function (a, b) {
        return b.passRatio - a.passRatio;
    });

    console.log(mResSet[0]);
    console.log(mResSet[1]);
    console.log(mResSet[2]);
    console.log(mResSet[3]);
    console.log(mResSet[4]);
}

function run() {

    var async = require('async');
    async.series([
        function (next) {
            loadFloorsByBuildingId(mBuildingId, next);
        },
        function (next) {
            if (mFloorList) {
                console.log(mFloorList);
                for (var key in mFloorList) {
                    loadBeaconListByFloorId(mFloorList[key], next);
                }
            }
        },
        function () {
            //buildBeacons();

            
            for (var bl = sMaxBeaconLength; bl > 0; bl--) {
                for (var sl = sMaxSortAryLength; sl >= 1; sl--) {
                    for (tpv = 1; tpv < sl * 0.6; tpv++) {
                        for (rssi = -120; rssi <= sMinRssi; rssi = rssi + 5) {
                            mTotalCalNum++;
                        }
                    }
                }
            }

            for (var bl = sMaxBeaconLength; bl > 0; bl--)
            {
                mBeaconLength = bl;
                genTestData();

                for (var sl = sMaxSortAryLength; sl >= 1; sl--)
                {
                    mSortAryLength = sl;
                    for (tpv = 1; tpv < sl * 0.6; tpv++){
                        mTopPosVal = tpv;

                        for (rssi = -120; rssi <= sMinRssi; rssi = rssi + 5)
                        {
                            mMinRssi = rssi;
                            calPassRatio();
                            mNowCalNum++;
                        }
                        
                    }
                    
                }
            }

            sortResSet();


        }

    ], function (err, rst) {
        if (err) throw err;
    });
}

run();
