/*! AtlasBeacon 2015-01-09 */
var controllers=require("../controller"),
    Beacon=controllers.Beacon,
    Device=controllers.Device,
    User=controllers.User,
    Jobsite=controllers.Jobsite,
    Analysis=controllers.Analysis,
    Tagger = controllers.Tagger,
    Track = controllers.Track,
    Monitor = controllers.Monitor,
    Auth = require("../controller/auth");
module.exports=function(a){
    a.get("/",function(req, res){
        /*
        res.setHeader({
            'keep-alive': 'close'
        });*/
        res.render("index");
    });
    a.get("/locDemo",function(req, res){
        res.render("locCanvas");
    });
    a.get("/mobile",function(req, res){
        res.render("mobile/index");
    });
    a.get("/poc",function(req, res){
        res.render("poc/index");
    });
    //a.get("/test",function(a,b){b.render("test")});

    a.get('/loginOut', User.loginOut);
    a.get('/user/isOnline', User.isOnline);

    a.get("/initUser", User.initUser);
    a.get("/user/all",User.getAllUsers);
    a.post("/login",User.checkUser);
    a.post("/user/add",User.addNewUser);
    a.post('/user/edit', User.updateUser);

    //對外開放api by chihyi 2018.01.29
    a.get("/device/list", Device.getAllDevices2);
    
    a.get("/device/all", Auth.loginRequired,Device.getAllDevices);
    a.post("/device/add",Auth.loginRequired,Device.addDevice);
    a.put("/device/:serialId",Auth.loginRequired,Device.updateDevice);
    a.get("/device/:serialId",Device.getOneDevice);
    a["delete"]("/device/:id",Auth.loginRequired,Device.removeDevice);
    a.post("/device/getByArea",Auth.loginRequired,Device.getDevicesByArea);
    a.post("/device/bltInfo", Device.updateBltDevices);

    a.get("/beacon/all",Auth.loginRequired,Beacon.getAllBeacons);
    a.get("/beacon/list",Beacon.getSimpleList);
    a.post("/beacon/add",Auth.loginRequired,Beacon.addBeacon);
    a.put("/beacon/:beaconId",Auth.loginRequired,Beacon.updateBeacon);
    a.get("/beacon/:beaconId",Beacon.getOneBeacon);
    a["delete"]("/beacon/:beaconId",Auth.loginRequired,Beacon.removeBeacon);
    a.post("/beacon/getByArea",Auth.loginRequired,Beacon.getBeaconsByArea);
    a.get("/jobsite/getBeacon/:jobsiteId", Beacon.getBeaconByJobsite);
    a.get("/beacon/getSimpleBeacons/:jobsiteId", Beacon.getSimpleBeaconByJobsite);

    a.post("/beacon/getLonLat", Beacon.getLatAndLon);
    a.post("/beacon/setLonLat", Beacon.setLatAndLon);

    //internal 迁移
    a.get('/beacon/new/id', Beacon.getNewIscanId);
    //internal end

    a.post('/worker/get', Device.getWorkInfo);

    a.get("/jobsite/all", Auth.loginRequired,Jobsite.getAllJobsites);
    a.post("/jobsite/add", Auth.loginRequired,Jobsite.addJobsite);
    a.post("/jobsite/jobsiteToBeacon",Auth.loginRequired, Jobsite.setJobsiteId);
    a.get("/jobsite/:jobsiteId", Jobsite.getOneJobsite);
    a.put("/jobsite/:jobsiteId",Auth.loginRequired, Jobsite.removeJobsite);
    a.post('/jobsite/upload', Auth.loginRequired,Jobsite.uploadJobsite);
    a.post('/jobsite/update', Auth.loginRequired,Jobsite.updateJobsite);

    a.post("/analysis/daily", Analysis.getInOneDay);
    a.post('/analysis/period', Analysis.getInPeriod);
    a.get('/analysis/period', Analysis.getInPeriod);
    a.post("/analysis/exportToCsv",Analysis.exportToXlsx);
    a.get("/analysis/getCsv/iscan.xlsx",Analysis.getXlsx);


    a.get('/track/getByJobsite', Track.getByJobsiteIdInPeriod);
    a.get('/track/getRightNow', Track.getByJobsiteRightNow);
    a.get('/track/getByUser', Track.getByUserId);
    
    //與getByUser功能相同，只是將時間分開為start與end兩個參數，並且改為timestamp格式，用來對外開放的API by chihyi 2018.1.10
    a.get('/track/getHistoryByUser', Track.getHistoryByUserId);
    a.get('/track/getUsers', Track.getUsersByJobsite);

    //------------------------new tagger--------------------------------
    a.post('/tagger/getByJobsiteId/:jid', Tagger.getByJobsite);
    a.post('/tagger/getByUserId/:uid', Tagger.getByUid);
    a.post('/tagger/getInPeriod/:jid', Tagger.getInPeriodBySite);

    a.get('/loc/now/:blt', Track.getCoord);

    //--------------------外部使用------------------------------


    a.get("/getRate", Beacon.getRate);
    a.get("/getSendDate", Beacon.getNextSendTime);
    a.get("/now", Beacon.getNowTime);
    a.get('/updateRf', Beacon.updateLocalIScanFile);
    // ----------------------------------分割线------------------
    //中兴保全
    a.get('/zxbq/csv48hours/download', require('../controller/zxbqCsv').getZip);

    a.get('/indoormap/build/detail', require('../controller/indoorMap').getBuildDetail);
    a.get('/indoormap/floor/simple', require('../controller/indoorMap').getFloorSimple);
    a.get('/indoormap/floor/fence', require('../controller/indoorMap').getFloorFence2);
    a.get('/iscan/listByJobsite', require('../controller/api').listIscansByJname);

    a.post('/iscan/listByFloor', require('../controller/api').listIscansByFloor);
    a.post('/iscan/setToMap',  require('../controller/api').setIscanToMap);
    a.post('/iscan/getStatus', require('../controller/api').getIscanStatus);


    a.post('/account/getAllUsers', require('../controller/api').getUsersByAccount);
    a.post('/account/userId/getTaggers',Auth.requireLimit, require('../controller/api').getTagsInPeriodByUser);

    a.get('/events/list', require('../controller/events').getEvents);

    a.get('/camera/list',  Monitor.getCameraList);
    a.post('/camera/track/byJobsite', Monitor.getInPeriod);
    a.post('/camera/track/byUser', Monitor.getInPeriod);

    a.get('/getFence/:floorId/:x/:y',  Monitor.getFence);
	
	
	//indoor Map background image 2018.01.22
	a.get('/map/:floorId/img',  require('../controller/indoorMap').getFloorImg);


    //對外開放api by chihyi 2018.01.29
    a.get('/indoormap/floor/fences', require('../controller/indoorMap').getFloorFence3);
    a.get('/camera/track/byJobsiteUser', Monitor.getInPeriod2);
};



