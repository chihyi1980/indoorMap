angular
    .module('iScan')
    .controller('jobsiteCtrl',['$scope','$location','$http','features',
        function($scope, $location, $http, features){

            $scope.features = features;

            var prefix = iScan_config.api_prefix;
            var all_url = prefix + '/jobsite/all';
            var add_url = prefix + '/jobsite/add';
            var remove_url = prefix + '/jobsite/';
            var beacon_get_url = prefix + '/beacon/all';
            var beacon_get_by_jobsite = prefix + '/jobsite/getBeacon/';
            var update_url = prefix + '/jobsite/update';

            //分页查询beacon
            $scope.queryBeacon = function(pageNum, kw){
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                var paramStr = '?l=10&s=' + (pNo - 1) * 10 + '&kw=' + (kw || '');
                $http.get(beacon_get_url + paramStr)
                    .success(function(ret){
                        $scope.beacons = ret[1];
                        $scope.curPageOfBeacon = pNo;
                        $scope.totalPagesOfBeacon = ret[0];
                        $scope.iscanPos = {};
                        ret[1].forEach((function(item){
                            $scope.iscanPos[item.iscanId] = {
                                area: (item.area || '').replace('|', '').replace('|', ''),
                                address: item.address || '',
                                desc: item.desc || ''
                            }
                        }))

                    }).error(function(err){
                        $scope.beacons = [];
                    })
            };
            $scope.queryBeacon();

            $scope.queryJobsite= function(pageNum, kw){
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                var paramStr = '?l=10&s=' + (pNo - 1) * 10 + '&kw=' + (kw || '');
                $http.get(all_url + paramStr)
                    .success(function(ret){
                        $scope.jobsites = ret[1];
                        $scope.curPageOfJobsite = pNo;
                        $scope.totalPagesOfJobsite = ret[0];

                    }).error(function(err){
                        $scope.jobsites = null;
                    })
            };
            $scope.queryJobsite();

            //左侧栏分页，跳转到num页
            $scope.setLeftPageNum = function(kw, num){
                if(num > $scope.totalPagesOfJobsite){
                    num = $scope.totalPagesOfJobsite
                }else if(num < 1){
                    num = 1;
                }
                if(num != $scope.curPageOfJobsite)
                    $scope.queryJobsite(num, kw);
            };
            //右侧栏分页，跳转到num页
            $scope.setRightPageNum = function(kw, num ){
                if(num > $scope.totalPagesOfBeacon ){
                    num = $scope.totalPagesOfBeacon
                }else if(num < 1){
                    num = 1;
                }
                if(num != $scope.curPageOfBeacon)
                    $scope.queryBeacon(num, kw);
            };
            //左侧栏查询
            $scope.leftSearch = function(kw){
                //查询后，默认第1页
                $scope.queryJobsite(1, kw);
            };
            //右侧栏查询
            $scope.rightSearch = function(kw){
                $scope.queryBeacon(1, kw);
            };
            //省市区json数据
            $scope.division = iScan_config.china;
            //初始化新建工地
            $scope.newJobsite = {};
            //是否展示匹配栏
            $scope.showMatch = false;

            //保存新增加的工地
            $scope.saveAdd = function(){
                $scope.newJobsite.area = '';
                var newJobsite = trim($scope.newJobsite);
                $http.post(add_url, newJobsite)
                    .success(function(ret){
                        $scope.jobsites.push(ret);
                        $scope.newJobsite = {};
                        $scope.address = {};
                    }).error(function(err){
                        console.log(err);
                    })
            };
            //删除工地
            $scope.removeJobsite = function(jobsite, beacons){
                if(beacons.length > 0){
                    return alert('該工地上有匹配的iScan，不能刪除！')
                }
                if(confirm('確認删除吗？')){
                    $http.put(remove_url + jobsite.id)
                        .success(function(ret){
                            $scope.showMatch = false;
                            var index;
                            for(var i in $scope.jobsites){
                                if($scope.jobsites[i].id == jobsite.id){
                                    index = i;
                                    break;
                                }
                            }
                            if(index !== undefined){
                                $scope.jobsites.splice(index, 1);
                            }
                        }).error(function(err){
                            console.log(err)
                        })
                }
            };

            //工地编辑功能
            $scope.editJobsite = function(){
                $scope.isEdit = true;
            };
            //保存编辑。目前只编辑工地名称
            $scope.saveEdit = function(jobiste, newJobsiteName){
                var oldName = jobiste.name;
                jobiste.name = newJobsiteName;
                var update = {
                    name: newJobsiteName,
                    id: jobiste.id
                }
                $http.post(update_url, {jobsite: update})
                    .success(function(ret){
                        $scope.isEdit = false;
                    }).error(function(err){
                        console.log(err);
                        $scope.isEdit = false;
                        jobiste.name = oldName;
                        alert('保存失敗！');
                    });
            };
            //不显示匹配栏
            $scope.closeMatch = function(){
                $scope.showMatch = false;
                $scope.newJobsite = {};
                $scope.address = {};
                $scope.curJobsite = null;
            };

            //选择工地
            $scope.selectCurJobsite = function(jobsite, target){
                $scope.curJobsite = jobsite;
                $scope.showMatch = true;
                $http.get(beacon_get_by_jobsite + jobsite.id)
                    .success(function(ret){
                        $scope.curIscans = ret;
                    }).error(function(err){
                        console.log(err)
                    })
            };
            //选择beacon
            $scope.selectCurBeacon = function(iscan, e){
                $scope.usedIscan = null;
                $scope.usedPlayer = null;
                if (iscan.floorId) {
                    if (!confirm('該iScan已使用，是否查看所在工地？')) {
                        return;
                    }
                    $scope.usedIscan = iscan;
                    $http.get(prefix + '/jobsite/' + iscan.jobsiteId)
                        .success(function (jobsite) {
                            prompt('工地名稱:', jobsite.name);
                        }).error(function (err) {
                            console.log(err)
                        });
                } else {
                    //匹配栏不显示时，停止操作
                    if (!$scope.showMatch) {
                        return;
                    }
                    $scope.curIscan = iscan;
                    $('#iscanTip').remove();
                    //创建跟随鼠标的div
                    $("body").append('<div id="iscanTip" class="alert alert-warning">' + e.target.innerHTML + '</div>');
                    $('#iscanTip').css({
                        "top": (e.pageY + 5) + "px",
                        "left": e.pageX + 5 + "px",
                        'position': 'absolute',
                        'width': 'auto',
                        'border': 'solid 1px #EEddff',
                        'z-index': '1060'
                    });
                    e.stopPropagation();
                    $('body').on('mousemove', function (e) {
                        $('#iscanTip').css({
                            "top": (e.pageY + 5) + "px",
                            "left": e.pageX + 5 + "px"
                        });
                    })
                    $('body').on('click', function (evt) {
                        $scope.tipClear();
                        $scope.menuClear();
                    })
                }
            };

            //右侧栏beacon列表状态：
            $scope.setBeaconMatchStatus = function(beacons, item, value){
                var  res = inArray(item, beacons);
                if(res.exists){
                    beacons[res.index].floorId = value;
                }
                $scope.beacons = beacons;
            };
            //iscan地图设置 开始
            $scope.checkValue = function(){
                var val = $scope.indoorMapId || '';
                val = val.replace(/^\s+|\s+$/gi, '');
                if(val.indexOf('Ctrl+C') > -1){
                    val = val.substring(0, 24);
                    $scope.indoorMapId = val;
                }
            };
            $scope.getDisableStatus = function(mapId){
                if(!mapId){
                    return true;
                }else if(mapId.length != 24){
                    return true;
                }
                return false;
            }
            $scope.iscanMapInit = function(){
                $scope.curMapFloor = null;
                $scope.mapfloorList = [];
                $('#atlas-map').html('');
            }

            $scope.setIndoorMapId = function(mapId){
                if($scope.curJobsite){
                    var jobiste = JSON.parse(JSON.stringify($scope.curJobsite));
                    jobiste.mapId = mapId || $('#indoorMapId').val();
                    $http.post(update_url, {jobsite: jobiste})
                        .success(function(ret){
                            alert('設置成功！');
                            $scope.curJobsite.mapId = jobiste.mapId;
                        }).error(function(err){
                            if(err && err.msg){
                                if(err.msg.indexOf('not found') > -1){
                                    alert('地圖id未找到，請更換')
                                }else if(err.msg.indexOf('MapId type need "building"') > -1){
                                    alert('地圖id類型錯誤，請設置buildingId')
                                }else if(err.msg.indexOf('used') > -1){
                                    alert('地圖id已被使用')
                                }
                            }else{
                                console.log(err);
                                alert('保存失敗！');
                            }
                        });
                }
            }
            var build_get_url =  prefix + '/indoorMap/build/detail?id=';
            $scope.showIscanMatchModal = function(){
                $scope.iscanMapInit();
                $('#atlas-map').height($('#iscanMatch-modal').height() - 120);
                $http.get(build_get_url + $scope.curJobsite.mapId)
                    .success(function (ret) {
                        if (ret && ret.result == 'succeed') {
                            var floorList = ret.data.floors;
                            var mapfloorList = [];
                            floorList.forEach(function(floor){
                                var key =  Object.keys(floor)[0];
                                mapfloorList.push({
                                    id: floor[key],
                                    name: key
                                })
                            })
                            $scope.mapfloorList = mapfloorList;
                        }else{
                            $('#atlas-map').html('<h4 class="text-center text-danger">地圖Id設置不正確，未能獲取到地圖</h4>');
                        }
                    }).error(function(err){
                        $('#atlas-map').html('<h4 class="text-center text-danger">地圖Id設置不正確，未能獲取到地圖</h4>');
                    })
            }

            var iscans_by_floor = prefix + '/iscan/listByFloor';
            $scope.getFloorIscan = function(floorId, jobsiteId, callback){
                if(getIscansCache(floorId)){
                    //return callback(getIscansCache(floorId))
                }
                $http.post(iscans_by_floor, {floorId: floorId, jId: jobsiteId})
                    .success(function(iscans){
                        //cacheIscans(floorId, iscans);
                        callback(iscans);
                    }).error(function(err){
                        callback([]);
                        console.log(err)
                    })
            }

            $scope.loadMap = function(floor){
                $scope.curMapFloor = floor;
		console.log(floor)
                var floorObj = {};
                floorObj[floor.name] = floor.id;
                $('#atlas-map').html('');
                $scope.menuClear();
                $scope.tipClear();
                $scope.getFloorIscan(floor.id, $scope.curJobsite.id, function(beacons){
                    $scope.mapInit([floorObj], floor.name, beacons);
                });
            }

            $scope.mapInit = function(floorList, initFloor, beacons){
                $scope.mapSdk = new Atlas({
                    width: $('#modal-map-container').width(),
                    height: $('#modal-map-container').height(),
                    floorList: floorList,
                    mapDiv: 'atlas-map',
                    maxZoom: 15,
                    minZoom: 0.5,
                    initFloor: initFloor,
                    initZoom : 1,
                    initCallback: function(){
                        if($scope.mapSdk.pathSvg){
                            $($scope.mapSdk.pathSvg).remove();
                        }
                        $scope.mapSdk.zoomDiv.addEventListener('click', function(e){
                            var coord = $scope.mapSdk.getXAndY(e.offsetX || e.layerX, e.offsetY || e.layerY);
                            console.log(+coord.x, +coord.y)
                            $scope.addIscanForMap(+coord.x, +coord.y);
                            e.stopPropagation();
                        },false);
                        $scope.mapSdk._addBeacon();
                    },
                    logoInit: true,
                    enFloorUI: false,
                    enFacUI: false,
                    enBufferUI: false,
                    apiUrl: prefix + '/indoorMap/floor/simple',
                    beacons: beacons
                });
            }
            var match_iscan_url = prefix + '/iscan/setToMap';
            $scope.addIscanForMap = function(x, y){
                if(x < 0 || y < 0){
                    console.log('Invalid click')
                    return;
                }
                if($scope.curIscan ){
                    var beaconMark = {
                        type: 'beacon',
                        text: $scope.curIscan.iscanId,
                        id: $scope.curIscan.iscanId,
                        name: $scope.curIscan.desc,
                        x: x,
                        y: y
                    }
                    if($scope.mapSdk){
                        var obj = {
                            iscanId: $scope.curIscan.iscanId,
                            floorId : $scope.curMapFloor.id,
                            jId: $scope.curJobsite.id,
                            x: x,
                            y: y
                        }
                        $http.post(match_iscan_url, obj)
                            .success(function(ret){
                                $scope.mapSdk.addBeacon(beaconMark);
                            }).error(function(){
                                alert('添加失敗！')
                            })
                        $scope.setBeaconMatchStatus($scope.beacons, $scope.curIscan, $scope.curMapFloor.id);
                        $scope.$apply();
                    }
                }
                $scope.menuClear();
                $scope.tipClear();
            };

            document.oncontextmenu=function (){
                return false;
            };
            $scope.rclickBeacon = function(iscan, e){
                if(e.button == '2'){
                    $scope.curIscanTemp = iscan;
                    $scope.beaconRightMenu(e);
                }
            }
            $('body').on('mousedown', '#atlas-map .atlas-text div[type=beacon]', function(event){
                if(!event.target.getAttribute('coordinate')){
                    $scope.target = $(event.target.parentNode)
                }else{
                    $scope.target = $(event.target)
                }
                $scope.curIscanTemp = {
                    iscanId: $scope.target.attr('uniqueId'),
                    desc: $scope.target.attr('title')
                }
                if($scope.target.hasClass('atlas-beacon')){
                    $scope.beaconRightMenu(event);
                }
                event.stopPropagation();
            })
            $scope.menuClear = function(){
                $scope.curIscan = null;
                $('#my-menuTip').remove();
            }
            $scope.tipClear = function(){
                $('#iscanTip').remove();
                $('#beaconTip').remove();
            }
            $scope.beaconRightMenu = function(e){
                $scope.menuClear();
                $scope.tipClear();
                if(e.button == '2'){
                    var menuDrag = $('<ul id="my-menuTip" style="width: 60px">' +
                        '<li class="beacon-remove">删除</li>' +
                        '<li class="beacon-drag">拖</li>' +
                        '</ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px",
                        "position": "absolute",
                        "z-index": 1060
                    });
                }
            }
            $scope.removeBeaconMarker = function(flag){
                flag = flag || null;
                if($scope.curIscan){
                    $('#atlas-map .atlas-text div.atlas-beacon[uniqueId="'+ $scope.curIscan.iscanId +'"]').remove();
                    $scope.setBeaconMatchStatus($scope.beacons, $scope.curIscan, null);
                    $scope.$apply();
                    if(flag){
                        var obj = {
                            iscanId: $scope.curIscan.iscanId,
                            floorId : null,
                            jId: null,
                            x: null,
                            y: null
                        }
                        $http.post(match_iscan_url, obj)
                            .success(function(ret){
                                $scope.menuClear();
                            }).error(function(){
                                alert('删除失敗！')
                            })
                    }else{
                        $scope.menuClear();
                    }
                }
            }
            $('body').on('click', '#my-menuTip .beacon-remove', function(e){
                if($scope.curIscanTemp){
                    $scope.curIscan = $scope.curIscanTemp;
                    $scope.removeBeaconMarker(true);
                }
                e.stopPropagation();
            });

            $('body').on('click', '#my-menuTip .beacon-drag', function(event){
                if($scope.curIscanTemp){
                    var newIscan = JSON.stringify($scope.curIscanTemp);
                    $scope.curIscan = JSON.parse(JSON.stringify($scope.curIscanTemp));
                    $scope.removeBeaconMarker();
                    $scope.beaconDrag(event, newIscan);
                }
                event.stopPropagation();
            })

            //beacon drag and drop
            $scope.beaconDrag = function(e, iscanStr){
                $scope.curIscan = JSON.parse(iscanStr);
                var beaconDrag = $('<span id="beaconTip" class="speech-outer"><span class="speech">'+ $scope.curIscan.iscanId +'</span></span>');
                $("body").append(beaconDrag);
                beaconDrag.css({
                    "top" : (e.pageY + 5) + "px",
                    "left" : e.pageX + 5 + "px",
                    "position": "absolute",
                    'z-index': 1060
                });
                $('body').on('mousemove',function(e){
                    beaconDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px"
                    });
                })
            }
            /*end*/
        }
    ]);


var inArray = function(item, arr){
    var res = {exists: false, index: -1};
    for (var i in arr){
        if(arr[i] == item || arr[i].iscanId.toString() == item.iscanId.toString()){
            res.exists = true;
            res.index = i;
            break;
        }
    }
    return res;
};
var cacheIscans = function(floorId, iscans){
   return localStorage.setItem(floorId + '_iscan', JSON.stringify(iscans));
}
var getIscansCache = function(floorId){
    if(localStorage.getItem(floorId)){
        return JSON.parse(localStorage.getItem(floorId + '_iscan'));
    }else{
        return null;
    }
}
