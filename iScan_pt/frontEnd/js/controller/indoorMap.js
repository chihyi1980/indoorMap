angular
    .module('iScan')
    .controller('indoorCtrl',['$scope','$location','$http','features',
        function($scope, $location, $http, features){
            if(!features.indoorMap) return;
            /*假数据代码部分*/
            var cookie = localStorage.getItem('!@#$%'),
                loginUser = cookie.split('&')[1],
                todayStr = moment().format('YYYY-MM-DD');
            /*end*/
            //获取控制器leftMenu.js传递的参数值。
            $scope.$on('leftMenu', function(event, data){
                $scope.curPageType = data.curPageType;
                $scope.jMap = data.jMap;
                $scope.curJobsite = data.curJobsite;
                $scope.curDevice = data.curDevice;
                $scope.taggers = data.changeData;
                $scope.loadMap();
                $scope.closeAutoSearch();
            });
            var host = iScan_config.mapHost;
            var prefix = iScan_config.api_prefix;
            var iscan_get_byJobsite = prefix + '/iscan/listByJobsite';
            var track_get_byJobsite = prefix + '/track/getByJobsite';
            var track_get_rightnow = prefix + '/track/getRightNow';
            var now_time = prefix + '/now';
            var jobsite_users_url = prefix + '/track/getUsers';

            /*            日期控件部分   开始          */
            //当天日期
            $scope.isHistorySearch = false;
            $scope.setNowTime = function(){
                $.ajax({
                    url: now_time,
                    async: false,
                    success: function(data){
                        $scope.currentDate = data.now;
                        try{
                            clearInterval(iScan_config.params.indoorMapTimer);
                        }catch (e){}
                        iScan_config.params.indoorMapTimer = window.setInterval(function(){
                            var  dateStr = $scope.currentDate;
                            var dateTime = moment(dateStr).unix() * 1000 + 1000;
                            $scope.currentDate = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
                            $('#dateSelect-indoorMap').val($scope.currentDate);
                        },  1000)// 20ms 执行代码
                    },
                    error: function(e){
                        console.log(e)
                    }
                });
            };
            $scope.setNowTime();
            $('#dateSelect-indoorMap').val($scope.currentDate);
            $('#dateSelect-indoorMap')
                .daterangepicker({
                    timePicker: true,
                    timePickerIncrement: 1,
                    format: 'YYYY-MM-DD HH:mm:ss',
                    singleDatePicker: true
                }, function(start, end) {
                    $scope.currentDate = $('#dateSelect-indoorMap').val();
                    $scope.isHistorySearch = true;
                    try{
                        clearInterval(iScan_config.params.indoorMapTimer);
                    }catch (e){}
                });
            /*         日期控件部分   结束         */

            $scope.getIscansByJobsite = function(jName, callback){
                $http.get(iscan_get_byJobsite + '?name=' + jName)
                    .success(function(ret){
                        $scope.curIscans = ret || [];
                        callback();
                    }).error(function(err){
                        console.log(err)
                    })
            };
            $scope.timeSpaceOption = [30, 20, 10, 5, 2];
            $scope.searchTimeSpace = 2;
            $scope.usersCache = [];
            $scope.getJobsiteUsers = function(jId){
                var dateStr;
                dateStr = $scope.currentDate;
                $http.get(jobsite_users_url + '?jobsiteId=' + jId + '&time=' + dateStr)
                    .success(function(ret){
                        $scope.usersCache = ret;
                    }).error(function(err){
                        console.log(err)
                    })
            };

            $scope.searchDataByJobsiteId = function(jId, callback){
                var dateStr;
                dateStr = $scope.currentDate;
                $http.get(track_get_byJobsite + '?jobsiteId=' + jId + '&time=' + dateStr)
                    .success(function(ret){
                        $scope.taggers = ret || [];
                        callback(ret || []);
                    }).error(function(err) {
                        callback([]);
                    });

            };


            $scope.loadMap = function(){
                $('#atlas').html('');
                $scope.mapSdk = null;
                $scope.curBeacons = null;
                if(!$scope.curJobsite)return;
                if($scope.curPageType == 'jobsite'){
                    $scope.getIscansByJobsite($scope.curJobsite.name, function(){
                        $scope.getBuildData($scope.curJobsite.mapId);
                    });
                    $scope.getJobsiteUsers($scope.curJobsite.id);
                }
            };

            $scope.getBuildData = function(buildId) {
                if (!buildId) {
                    return;
                }
                var buildUrl = host + '/indoorMap/build/detail?id=' + buildId;
                $http.get(buildUrl)
                    .success(function (ret) {
                        if (ret && ret.result == 'succeed') {
                            var build = ret.data;
                            var floorList = build.floors;
                            var params = {
                                serverHost: '116.62.139.42',
                                width: $('#mapContainer').width(),
                                height: $('#mapContainer').height(),
                                cityId: "",
                                floorList: floorList,
                                mapDiv: 'atlas',
                                maxZoom: 15,
                                minZoom: 0.5,
                                initFloor: '',
                                initZoom: 1,
                                initMarkPoi: '',
                                initCallback: function () {
                                },
                                poiClick: function (poi) {
                                },
                                enFloorUI: true,
                                enFacUI: false,
                                enBufferUI: true,
                                fenceUrl: '/indoorMap/floor/fence',
                                apiUrl: host + '/indoorMap/floor/simple',
                                floorChange: function (floorName) {
                                    var curFloorId = $scope.mapSdk.floorObj[floorName];
                                    $scope.mapSdk._getFloorFences(curFloorId);
                                /*
                                    var iscanDoms = {},
                                        iscanlist = [];
                                    $scope.curIscans.forEach(function(iscan){
                                        if(iscan.floorId == curFloorId){
                                            iscanlist.push(iscan.iscanId);
                                            iscanDoms[iscan.iscanId] = $scope.mapSdk.addText({
                                                x: iscan.x,
                                                y: iscan.y,
                                                content: iscan.iscanId,
                                                color: '#ffffff'
                                            });
                                        }
                                    });
                                    */
                                }
                            };
                            $scope.mapSdk = new Atlas(params);
                            $scope.floorList = floorList;
                        }
                })
            };

            //當Alert時播放當地及時影像
            $scope.alertVideoOpen = function(cameraId){
                var time = new Date(obj.time).getTime();
                var videoUrl = 'http://{ip:port}/media/{videoId}.webm'
                    .replace('{ip:port}',iScan_config.cameraHost)
                    .replace('{videoId}', cameraId)
                $('#demoIframe').attr('src', videoUrl);
                $('#videoModal').ccModal({
                    parent: '#modal-container',
                    collapsible: true,
                    minimizable: true,
                    left: '50%',
                    top: '30%',
                    onOpen: function(){

                    },
                    onClose: function(){

                    }
                })
            };

            $scope.showPersonnelLocus = function(){
                if($scope.curPageType == 'user') return;
                if(!$scope.curJobsite){
                    return alert('請在左側邊欄，選擇所要查詢的場地！')
                }
                if(!$scope.mapSdk) return;
                $scope.mapSdk._initLayer();
                var floorObj = $scope.mapSdk.floorObj,
                    curFloorId = floorObj[$scope.mapSdk.curFloor];

                if($scope.curPageType == 'jobsite') {
                    if($scope.usersCache.length == 0){
                        $scope.getJobsiteUsers($scope.curJobsite.id);
                    }
                    /*
                    var iscanDoms = {},
                        iscanlist = [];
                    $scope.curIscans.forEach(function(iscan){
                        if(iscan.floorId == curFloorId){
                            iscanlist.push(iscan.iscanId);
                            iscanDoms[iscan.iscanId] = $scope.mapSdk.addText({
                                x: iscan.x,
                                y: iscan.y,
                                content: iscan.iscanId,
                                color: '#FF0000'
                            });
                        }
                    });
                    */

                    $scope.mapSdk._setFontDivSize();

                    $scope.searchDataByJobsiteId($scope.curJobsite.id, function(taggers){
                        taggers = taggers || [];
                        if(taggers == null || typeof  taggers == 'string' || taggers.length == 0){
                            return _alert('沒有數據！');
                        }
                        var locusData = [];
                        
                        taggers.forEach(function(tag){
                            if($scope.searchUser){
                                if($scope.searchUser._id == tag.userId){
                                    locusData.push({
                                        userId: tag.userId,
                                        coords: tag.coord,
                                        offset: null,
                                        status: tag.blt_status,
                                    });
                                }
                            }else{
                                locusData.push({
                                    userId: tag.userId,
                                    coords: tag.coord,
                                    offset: null,
                                    status: tag.blt_status,
                                });
                            }
                           
                        });

                        //增加一鍵報警卡片功能  by chihyi 2018.04.06
                        locusData.forEach(function(loc){
                            if(loc.status && loc.status == 4)
                            {
                                _alert( loc.userId + '發出警報！');
                                $scope.mapSdk.setAlarm(loc.coords.x, loc.coords.y, loc.userId);
                                var fenceIds = $scope.mapSdk.getFenceIds(loc.coords.x, loc.coords.y);
                                if(fenceIds && fenceIds[0])
                                {
                                    var cid = fenceIds[0].split('~')[0];
                                    if(cid)
                                    {
                                        //$scope.alertVideoOpen(cid);
                                    }
                                }
                            }
                        });

                        if(locusData.length > 0){
                            $scope.mapSdk.setPersonnelLocus(locusData.reverse());
                        }else{
                            _alert('無效數據')
                        }

                    });
                }
            };

            //var list_by_device_url = prefix + '/tagger/getByUserId/';
            var list_by_userId = prefix + '/track/getByUser';
            //改掉这里
            //************** user 部分 **************

            $('#datePicker').daterangepicker({
                dateLimit: {day:0},
                timePicker: true,
                timePickerIncrement: 1,
                format: 'YYYY-MM-DD HH:mm:ss',
                opens: 'left'
            }, function(start, end) {
                $scope.currentDateRange = $('#datePicker').val();
            });
            $scope.currentDateRange = new Date().Format('yyyy-MM-dd 00:00:00') + ' ~ ' + new Date().Format('yyyy-MM-dd hh:mm:ss');

            $scope.searchDataByUserId = function(){
                if($scope.curPageType != 'user') return;
                if(!$scope.curDevice || ! $scope.curDevice.userId){
                    return alert('請在左側邊欄，選擇所要查詢的用户！')
                }
                $('#overviewSearch').attr('disabled', true);
                var curUserId = $scope.curDevice.userId;
                var time = $('#datePicker').val();
                /*
                if(loginUser == 'sigmu'){// 假数据代码
                    if(time.indexOf(todayStr) < 0 && time.trim() < todayStr)
                    time = time.replace(/-\d{2}-\d{2}/g, '-02-03');
                }*/
                $http.get(list_by_userId + '?userId=' + curUserId + '&time=' + time)
                    .success(function(ret){
                        console.log(ret.length);
                        $scope.tracks = ret;
                        $scope.setPageNum(1);
                        $('#overviewSearch').attr('disabled', false);
                    }).error(function(err) {
                        $('#overviewSearch').attr('disabled', false);
                    });
            };

            $scope.trackProxy = function(track){
                return {
                    time: (track.enterTime && track.enterTime.split(' ')[1]) || '-',
                    uid: track.userId || '-',
                    coord: track.coordinate ? track.coordinate[0] + " , " +  track.coordinate[1] : '-'
                }
            };
            $scope.setPageNum = function(num){
                if(!$scope.tracks || $scope.tracks.length == 0) return;
                $scope.totalPages = Math.ceil($scope.tracks.length / 10);
                if(num > $scope.totalPages ){
                    num = $scope.totalPages
                }else if(num < 1){
                    num = 1;
                }
                $scope.curPage = num || 1;
                $scope.pageNums = varyPageNo($scope.totalPages, num);
                $scope.skip = ($scope.curPage - 1) * 10;
                $scope.taggers = $scope.tracks.slice($scope.skip, $scope.skip + 10);

            };
            var getTrackTags = function(tracks){
                // flag：1直接定位，0连续2次同结果才定位
                var taggers = [].concat(tracks);
                taggers.reverse();
                var proxTags = {};
                var  result = [];
                for(var i = 0, len = taggers.length; i < len; ++i ){
                    var tag = taggers[i];
                    if(!tag.coordinate || isNaN(+tag.coordinate[0]) || isNaN(+tag.coordinate[1])){
                        continue;
                    }
                    var key = Math.floor(+tag.coordinate[0] / 10) * 10 + ',' + Math.floor(+tag.coordinate[1]/ 10) * 10;
                    if(proxTags[key] == undefined || proxTags[key] == null){
                        proxTags[key] = 1;
                        result.push(tag);
                    }
                }

                return result;
            };
            $scope.showIndoorMap = function(taggers){
                $('#attrDiv').addClass('openAttr');
                var tempTaggers = JSON.parse(JSON.stringify(taggers || []));
                if(tempTaggers.length == 0 ){
                    $('#iCenter').html('<h1 class="text-danger">no data!</h1>');
                    return;
                }
                var trackTags = getTrackTags(tempTaggers);
                if(trackTags.length == 0 ){
                    $('#iCenter').html('<h1 class="text-danger">no regular data!</h1>');
                    return;
                }
                var mapFloorId = trackTags[0].mapFloorId;
                var buildUrl = host + '/indoorMap/build/detail?id=' + mapFloorId;
                jsonpCall(buildUrl, function (build) {
                    if (build) {
                        var floorList = build.floors;
                        var params = {
                            width: $('#iCenter').width(),
                            height: Math.max($('#iCenter').height(),$('#mapModal').height()),
                            cityId: "",
                            floorList: floorList,
                            mapDiv: 'iCenter',
                            maxZoom: 15,
                            minZoom: 0.5,
                            initFloor: '',
                            initZoom: 1,
                            initMarkPoi: '',
                            initCallback: function () {
                            },
                            poiClick: function (poi) {
                            },
                            enFloorUI: true,
                            enFacUI: false,
                            enBufferUI: true,
                            fenceUrl: '/indoorMap/floor/fence',
                            apiUrl: host + '/indoorMap/floor/simple',
                            floorChange: function (floorName) {
                                var cuFloorId = tempSdk.floorObj[floorName];
                                var locusData = [];
                                trackTags.forEach(function(tt){
                                    if(cuFloorId == tt.mapFloorId){
                                        locusData.push({
                                            userId: tt.enterTime && tt.enterTime.split(' ')[1],
                                            coords: tt.coordinate && {x: tt.coordinate[0], y: tt.coordinate[1]},
                                            offset: {left: 0, top: 0}
                                        });
                                    }
                                });
                                //console.log(locusData)
                                tempSdk.setPersonnelLocus2(locusData.reverse());
                            }
                        };
                        var tempSdk = new Atlas(params);
                    }
                });
            };
            $scope.closeIndoorMap = function(){
                $('#iCenter').html('');
                $('#attrDiv').removeClass('openAttr');
            };

            $scope.toggleAutoSearch = function(self){
                if(self.checked){
                    $scope.openAutoSearch();
                }else{
                    $scope.closeAutoSearch();
                }
            };
            $scope.openAutoSearch = function(){
                $scope.setNowTime();
                var ts = +($scope.searchTimeSpace || 30) * 1000;
                iScan_config.params.isAutoSearch = true;
                (function loop(){
                    if(!iScan_config.params.isAutoSearch){
                        return null;
                    }else{
                        $scope.showPersonnelLocus();
                        setTimeout(function(){
                            loop();
                        }, ts)
                    }
                })();
            };
            $scope.closeAutoSearch = function(){
                iScan_config.params.isAutoSearch = false;
                $('#auto-search').attr('checked', false);
            };
            $scope.closeAutoSearch();

        }//end
    ]);

var jsonpCall = function(url , callback){
    var script = document.createElement('script');
    script.setAttribute('src', url + '&callback=mapJsonpCallback');
    document.body.appendChild(script);
    mapJsonpCallback = function(data){
        try{document.body.removeChild(script);}catch (e){}
        if (data.result && data.result == 'succeed') {
            callback(data.data);
        }else if(data.result && data.result == 'failed') {
            callback(null);
        }else{
            if(data){
                callback(data);
            }else{
                callback(null);
            }
        }
    }
};

window._alert = function(str){
    var alertDom = document.getElementById('alert-dom');
    if(!alertDom){
        alertDom = document.createElement('div');
        alertDom.setAttribute('id', 'alert-dom');
        $(alertDom).appendTo( $('#mapContainer'));
    }
    $(alertDom).text(str);
    $(alertDom).css({
        width: str.length * 20 + 'px',
        height: '20px',
        textAlign: 'center',
        position: 'absolute',
        'left': '30%',
        'top': '20%',
        'font-size': '20px',
        'color': 'red',
        'background-color': '#FFF'
    })
    $(alertDom).fadeIn(100);
    setTimeout(function(){
        $(alertDom).fadeOut(1000);
    },3000)
}

function getRandomColor() {
    var randomColor1 = Math.floor(Math.random() * 201) + 30;
    var randomColor2 = Math.floor(Math.random() * 201) + 30;
    var randomColor3 = Math.floor(Math.random() * 201) + 30;
    return ("rgb(" + randomColor1 + ", " + randomColor2 + ", " + randomColor3 + ")");
}

var varyPageNo = function(total, curPage){
    var pageNums = new Array();
    if(total <= 5){
        for(var i=1; i<= total;i++){
            pageNums[i-1] = i;
        }
    }else{
        var t = total;
        var j = curPage;
        switch(j){
            case 1:
            case 2:
            case 3:
                pageNums = [1,2,3,4,5];
                break;
            case (t-1):
            case t:
                pageNums = [t-4,t-3,t-2,t-1,t];
                break;
            default:
                pageNums = [j-2,j-1,j,j+1,j+2];
        }
    }
    return pageNums;
};


