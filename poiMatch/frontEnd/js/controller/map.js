angular.module('Atlas')
    .controller('MapCtrl', ['$scope','$location','$http','malls','$route','$timeout',
        function($scope, $location, $http, malls, $route, $timeout ){
            //set page height or width
            if(!malls || malls.length == 0){
                console.log('此账户无数据！');
                //return;
            }
            $scope.base_url = BASE_URL || '';
            $scope.setLocalFloorId = function(id){
                localStorage.setItem('curFloorIdOfAtlas', id);
            };

            $scope.autoSizeSetting = function(){
                var allH = parseFloat($(window).height());
                var mainH = allH - parseFloat($('#nav').css('height'));
                $('#main').css('height', mainH);

                var searchContentH = mainH - parseFloat($('.head-title').css('height'))-20;
                $('.search-content').css('height', searchContentH);
                $('.s-con-body').css('height', searchContentH - 130);
                $('.s-con-body-2').css('height', searchContentH - 130);
                $('.s-con-body-3').css('height', searchContentH - 130);

                var allW = parseFloat($(window).width());
                var mapDisplayW =allW -  parseFloat($('.sidebar').outerWidth());
                $('.rightSlider').css('width', mapDisplayW);
                $('.map-display').css('height', mainH);
            };
            // mall list
            $scope.initPage = function(){
                $scope.autoSizeSetting();
                $(window).on('resize',$scope.autoSizeSetting);
                $scope.is_aliases = config.aliases || false;

                $scope.items = [''];
                $scope.city = $scope.items[0];
                $scope.malls = malls;
                $scope.currentParams = $route.current.params;
                document.oncontextmenu=function (){
                    return false;
                };
                myStorage.removeItem('isPathDraw');
                $('body').off();
            };
            $scope.initPage();
            //cityId
            (function(){
                if(config.mallCities){
                    var cityId = $scope.currentParams && $scope.currentParams.cityId;
                    var tempCities = [],
                        selectedCity = '上海';
                    for(var i in config.mallCities){
                        tempCities.push(i);
                        if(config.mallCities[i] == cityId){
                            selectedCity = i;
                        }
                    }
                    $scope.mallCities = tempCities;
                    $scope.selectedCity = selectedCity;
                    $scope.cityId = cityId;
                    $scope.selectCity = function(cityName){
                        $location.path('/mall/' + config.mallCities[cityName]);
                    }
                }})();

            //map style
            $scope.getMapShowWidth = function(){
                return $('.rightSlider').width();
            }

            //show mall
            $scope.isMallList = true;
            $scope.matchedId = [];
            $scope.showMall = function(mall){
                $scope.mall = mall;
                $http.get(config.MALL_JSON1_URL + '?id=' + mall._id)
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                            $scope.$mall = ret.data.mall;
                            $scope.$pois = ret.data.pois;
                            $scope.buildings = getBuildingsById($scope.$pois);
                            $scope.getFloors = function(building){
                                if(building && building._id){
                                    var res = getFloorsById(building._id, $scope.$pois, $scope.$mall);
                                    res.sort(function(a, b){
                                        var keyA = a.displayName,
                                            keyB = b.displayName,
                                            numA = keyA.match(/\d+/g) ? parseInt(keyA.match(/\d+/g)[0]) : keyA,
                                            numB = keyB.match(/\d+/g) ? parseInt(keyB.match(/\d+/g)[0]) : keyB;
                                        if(keyA.indexOf('B') > -1){
                                            numA = -numA;
                                        }
                                        if(keyB.indexOf('B') > -1){
                                            numB = -numB;
                                        }
                                        return numA - numB;
                                    });
                                    return  res;
                                }else{
                                    return [];
                                }
                            };
                            $scope.getShops = function(floor){
                                if(floor && floor._id){
                                    var shops = getShopsById(floor._id, $scope.$pois, $scope.$mall);
                                    return shops;
                                }else{
                                    return [];
                                }
                            }
                        }
                    })
                    .error(function(err){
                        console.log(err)
                    })
                $scope.isMallList = false;
            }
            $scope.pageInitByParams = (function(){
                /*
                if($scope.currentParams && $scope.currentParams.mallId){
                    $scope.showMall(malls[0]);
                    $('#toggleToMall').hide();
                    var timer = setInterval(function(){
                        if($scope.buildings && $scope.getFloors){
                            $('.c-rank-1').trigger('click')
                            clearInterval(timer);
                        }
                    }, 500)
                }*/
            })()

            // close current mall
            $scope.shutDownDetail = function(){
                $scope.clear();
                $scope.isMallList = true;
                $scope.menuClear();
            }
            //改动4
            $scope.clear = function(){
                $scope.buildings = [];
                $scope.floors = [];
                $scope.shops = [];
                $scope.status = {};
                $scope.shopQuery = '';
                $scope.isFacShow = false;
                $scope.isToolShow = false;
                $scope.mapFloor = null;
                $scope.isFenceDraw = false;
                $scope.isPathDraw = false;
                $scope.tipClear();
                $scope.mapClear();
                $scope.menuClear();
            }

            //show shop and floor
            $scope.status = {};

            $scope.toggleChild = function(target, index, obj){
                var pNode = $(target);
                var pre = pNode.find('span').first();
                if(!$scope.status[index]){
                    for(var i in $scope.status){
                        if(i.indexOf('floor')> -1){
                            $scope.status[i] = false;
                        }
                    }
                    if(index.indexOf('floor') > -1){
                        $scope.loadFloorMap(obj);
                        $scope.pathEndDraw();
                        $scope.pathEndEdit();
                        myStorage.removeItem('isFenceDraw');
                        $scope.isFenceDraw = false;
                    }
                    $scope.status[index] = true;
                }else{
                    //$scope.curMapFloor = null;
                    //pNode.nextAll().show();
                    $scope.status[index] = false;
                }
            }

            $scope.getStatus = function(index){
                if($scope.shopQuery){
                    return true;
                }else{
                    return $scope.status[index];
                }
            }
            //shop drag and drop
            $scope.shopDrag = function(e, shop){
                if(myStorage.getItem('isPathDraw') || myStorage.getItem('isFenceDraw')){
                    return;
                }
                $scope.tipClear();
                $scope.dragShop = {
                    id: shop._id,
                    name: shop.displayName || shop.ch_name || shop.en_name,
                    prodId: shop.prodId || 21,
                    saz: shop.saz || 50
                };
                $scope.funcName = '$scope.shopDrop';
                var shopTip = '<div id="shoptip" >' + (shop.displayName || shop.ch_name || shop.en_name) + '</div>';
                $("body").append(shopTip);
                $("#shoptip").css({
                    "top" : (e.pageY + 5) + "px",
                    "left" : e.pageX + 5 + "px"
                });
                $('body').on('mousemove',function(e){
                    $("#shoptip").css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px"
                    });
                })
            };

            $scope.shopDrop = function(e){
                $('#shoptip').remove();
                if(!$scope.mapFloor){
                    return alert('Error: 请先载入地图！');
                }
                if(!$scope.dragShop)
                    return alert('Error: 无可用数据！');
                var shop = {
                    id: $scope.dragShop.id,
                    name: $scope.dragShop.name,
                    x: $scope.mapX,
                    y: $scope.mapY,
                    prodId: $scope.dragShop.prodId,
                    saz: $scope.dragShop.saz
                };
                var shopId = $scope.dragShop.id;
                $scope.cacheShopOrBeacon(shop,'shop','add');
                var oldShop = $('#atlas .atlas-text div[uniqueId="'+ shopId +'"]');
                oldShop.remove();
                $scope.matchedId.push(shopId);
                $scope.mapSdk.addShop(shop);
                //clear the drag
                $scope.tipClear();
            }

            $scope.isShopMatched = function(shop){
                var ids = $scope.matchedId,
                    flag;
                for(var i in ids){
                    if(ids[i] == shop._id){
                        flag = true;
                        break;
                    }
                }
                return flag;
            }

            //public service
            $scope.isFacShow = false;
            $scope.isToolShow = false;
            $scope.getFacilities = function(){
                if(!$scope.isFacShow){
                    $http.post(config.FACILITY_GET_URL)
                        .success(function(data){
                            if(data.result == 'succeed'){
                                $scope.closePub();
                                var facs = data.data;
                                facs.forEach(function(fac){
                                    fac.class = 'atlas ' + config.icons[fac.id];
                                })
                                $scope.facs = facs;
                            }
                            $scope.isFacShow = true;
                            $('.c-con-pub .btn-info').addClass('active');
                        }).error(function(err){
                            $scope.isFacShow = true;
                            $('.c-con-pub .btn-info').addClass('active');
                        })
                }else{
                    $scope.isFacShow = false;
                    $('.c-con-pub .btn-info').removeClass('active');
                }
            }

            $scope.getTools = function(){
                if(!$scope.isToolShow){
                    $scope.closePub();
                    $scope.isToolShow = true;
                    $('.c-con-pub .btn-warning').addClass('active');
                }else{
                    $scope.isToolShow = false;
                    $('.c-con-pub .btn-warning').removeClass('active');
                }
            }
            $scope.getBeacons = function(){

            }
            $scope.closePub = function(){
                $scope.tipClear();
                $scope.menuClear();
                if($scope.isFacShow){
                    $scope.isFacShow = false;
                    $('.c-con-pub .btn-info').removeClass('active');
                }
                if($scope.isToolShow){
                    $scope.isToolShow = false;
                    $('.c-con-pub .btn-warning').removeClass('active');
                }
            }

            //fac drag and drop
            $scope.facDrag = function(e, fac){
                if(myStorage.getItem('isPathDraw') || myStorage.getItem('isFenceDraw')){
                    return;
                }
                $scope.tipClear();
                $scope.dragFac = {
                    type: fac.id,
                    text: fac.displayName,
                    saz: fac.saz || 50
                };
                $scope.funcName = '$scope.facDrop';
                var facTip = '<span id="factip" class="'+ fac.class + '"></span>';
                $("body").append(facTip);
                $("#factip").css({
                    "top" : (e.pageY + 5) + "px",
                    "left" : e.pageX + 5 + "px"
                });
                $('body').on('mousemove',function(e){
                    $("#factip").css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px"
                    });
                })
            }
            $scope.facDrop = function(e){
                $('#factip').remove();
                if(!$scope.mapFloor){
                    return alert('Error: 请先载入地图！');
                }
                if(!$scope.dragFac)
                    return alert('Error: 无可用数据！');

                var fac = {
                    type: $scope.dragFac.type,
                    x: $scope.mapX,
                    y: $scope.mapY,
                    text : $scope.dragFac.text,
                    saz: $scope.dragFac.saz
                };
                $scope.cacheFacOrText(fac,'fac','add');
                $scope.mapSdk.addFac(fac);
                //clear the drag
                $scope.tipClear();
            }

            // toolbar edit drag and drop
            $scope.isTextShow = true;
            $scope.isTextSave = false;
            $scope.editText = function(){
                if($scope.isTextShow){
                    $scope.isTextShow = false;
                }else{
                    if( $scope.isTextSave){
                        $scope.isTextSave = false
                    }
                }
            }
            $scope.clearText = function(){
                $scope.isTextSave = false;
                $scope.isTextShow = true;
                $scope.mapText = '';
            }
            $scope.toggleSaveStatus = function(){
                if($scope.isTextShow) return;
                if(!$scope.isTextSave){
                    $scope.isTextSave = true;
                }
            }
            $scope.textDrag = function(e, txt){
                $scope.tipClear();
                $scope.dragTxt = {
                    txt: txt.text,
                    saz : txt.saz || 50
                };
                $scope.funcName = '$scope.textDrop';
                var textDrag = $('<pre id="txtTip">'+ txt.text +'</pre>');
                $("body").append(textDrag);
                textDrag.css({
                    "top" : (e.pageY + 5) + "px",
                    "left" : e.pageX + 5 + "px",
                    "position": "absolute",
                    "font-family": "inherit"
                });
                $('body').on('mousemove',function(e){
                    textDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px"
                    });
                })
            };
            $scope.textDrop = function(e){
                $('#txtTip').remove();
                if(!$scope.mapFloor){
                    return alert('Error: 请先载入地图！');
                }
                if(!$scope.dragTxt)
                    return alert('Error: 无可用数据！') ;

                var text = {
                    txt: $scope.dragTxt.txt,
                    x: $scope.mapX,
                    y: $scope.mapY,
                    saz: $scope.dragTxt.saz
                };
                $scope.cacheFacOrText(text, 'text', 'add');
                $scope.mapSdk.addText(text);
                $scope.tipClear();
            }

            //beacon drag and drop
            $scope.beaconDrag = function(e, beacon){
                if(myStorage.getItem('isPathDraw') || myStorage.getItem('isFenceDraw')){
                    return;
                }
                $scope.tipClear();
                $scope.curSelectBeacon = beacon;
                $scope.dragBeacon = {
                    type: 'beacon',
                    id: beacon.id,
                    name: beacon.name
                };
                $scope.funcName = '$scope.beaconDrop';
                var beaconDrag = $('<span id="beaconTip" class="speech-outer"><span class="speech"><span class="glyphicon glyphicon-bold"></span></span></span>');
                $("body").append(beaconDrag);
                beaconDrag.css({
                    "top" : (e.pageY + 5) + "px",
                    "left" : e.pageX + 5 + "px",
                    "position": "absolute"
                });
                $('body').on('mousemove',function(e){
                    beaconDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px"
                    });
                })
            }

            $scope.beaconDrop = function(){
                $('#beaconTip').remove();
                if(!$scope.mapFloor){
                    return alert('Error: 请先载入地图！');
                }
                if(!$scope.dragBeacon)
                    return alert('Error: 无可用数据！') ;
                var beacon = {
                    type: $scope.dragBeacon.type,
                    name: $scope.dragBeacon.name,
                    id: $scope.dragBeacon.id,
                    x: $scope.mapX,
                    y: $scope.mapY
                }
                var beaconId = $scope.dragBeacon.id;
                $scope.cacheShopOrBeacon(beacon,'beacon','add');
                var oldBeacon = $('#atlas .atlas-text div[uniqueId="'+ beaconId +'"]');
                oldBeacon.remove();
                $scope.mapSdk.addBeacon(beacon);
                //clear the drag
                $scope.tipClear();

                $scope.curSelectBeacon.matched = true;
            };



            // drop function
            $scope.funcName = null;
            $scope.dropFunc = function(e){
                if($scope.isMallList) return;
                $scope.menuClear();

                if(!$scope.mapSdk || ($scope.mapSdk && $scope.mapSdk.__noData)){
                    $scope.tipClear();
                    alert('没有地图数据！')
                    return;
                };
                if(myStorage.getItem('isPathDraw') || myStorage.getItem('isFenceDraw')){
                    return;
                }
                if($scope.funcName){
                    var func = $scope.funcName + '(e)';
                    return eval(func);
                }
            };
            // tip clear
            $scope.tipClear = function(){
                $('#txtTip').remove();
                $('#factip').remove();
                $('#shoptip').remove();
                $('#beaconTip').remove();
                $scope.dragTxt = null;
                $scope.dragFac = null;
                $scope.dragShop = null;
                $scope.dragBeacon = null;
                $scope.funcName = null;
            }

            // upload config file and import map
            $scope.showUpAttr = function(building, floors){
                $scope.destBuilding = building;
                $scope.destFloors = floors;
                $('#attrDiv').addClass('openAttr');
            }

            $('body').on('change','#file-sel',function(){
                console.log($scope.destBuilding)
                console.log($scope.destFloors)
                var fd = new FormData();
                fd.append("configFile", $scope.file);
                fd.append("building",JSON.stringify($scope.destBuilding));
                fd.append("floors", JSON.stringify($scope.destFloors));
                $http.post(config.CONFIG_FILE_UPLOAD,
                    fd,
                    {
                        withCredentials: true,
                        headers: {'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).success(function(data){
                        console.log(data);
                        if(data.result == 'succeed'){
                            $scope.uploadMsg = data.data;
                        }else{
                            $scope.uploadMsg = 'Error：'+ data.msg;
                        }
                    }).error(function(err){
                        console.log(err);
                    });
            })

            $scope.closeAttrDiv = function(){
                $scope.file = null;
                $('#file-sel').val('');
                $scope.destBuilding = null;
                $scope.destFloors = null;
                $scope.uploadMsg = null;
                $('#attrDiv').removeClass('openAttr')
            }

            $scope.pickFile = function(){
                $('#file-sel').trigger('click');
            }

            //Map show //改动1
            $scope.isMapShow = false;
            $scope.loadFloorMap = function(floor){
                if($scope.mapFloor && $scope.pathShape){
                    var lastFloorId = $scope.mapFloor._id;
                    var pathData = $scope.pathShape.getDrawData(),
                        nextId = $scope.pathShape.getPathId(),
                        data = {
                            nextId: nextId,
                            data: pathData
                        };
                    $scope.localCache(lastFloorId, data);
                }

                $scope.curMapFloor = floor;
                if(!$scope.curMapFloor){
                    return;
                }
                $scope.mapClear();
                //for beacon
                $scope.curFloorBeacons = [];
                $.ajax({
                    type: 'GET',
                    url: config.MAP_BEACON_GET + '?floorId=' + floor._id,
                    async: false,
                    success: function(data){
                        if(data.result == 'succeed'){
                            $scope.curFloorBeacons = data.data;
                        }
                    },
                    error: function(err){
                        console.log(err)
                    }
                });
                var floorObj = {},
                    initFloor = $scope.curMapFloor.displayName;
                floorObj[initFloor] = $scope.curMapFloor._id;

                $scope.isMapShow = true;
                $scope.mapInit([floorObj], initFloor);
                $scope.mapTitle = $scope.mall.ch_name + '：' + floor.displayName + '（'+ floor.ch_name +'）';
                $scope.mapFloor = floor;
                // refresh map area
                $scope.menuClear();
                $scope.tipClear();

                $scope.curFloorAnchor = [];
                $scope.curFloorTempAnchor = {};
                $http.get(config.ANCHOR_GET_URL + '?floorId=' + floor._id)
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                            $scope.curFloorAnchor = ret.data;
                        }
                    }).error(function(err){
                        console.log(err);
                    })
            }

            //init map // 改动2
            $scope.mapInit = function(floorList, initFloor){
                $scope.mapSdk = new Atlas({
                    width: $('.map-display').width() - 10,
                    height: $('.map-display').height() - 20,
                    floorList: floorList,
                    mapDiv: 'atlas',
                    maxZoom: 55,
                    minZoom: 0.5,
                    initFloor: initFloor,
                    initZoom : 3,
                    initCallback: function(){
                        $scope.mapSdk.zoomDiv.addEventListener('click', function(e){
                            var coord = $scope.mapSdk.getXAndY(e.offsetX || e.layerX, e.offsetY || e.layerY);
                            $scope.mapX = coord.x;
                            $scope.mapY = coord.y;
                            console.log($scope.mapX, $scope.mapY)
                            //console.log($scope.mapSdk.scroller.__zoomLevel)
                        },false);
                        var geoInfo = $scope.mapSdk._floorData[11];
                        var geoScaleX = (!geoInfo || geoInfo.owidth == undefined || geoInfo.width == undefined) ? 1 : (+geoInfo.owidth / +geoInfo.width).toFixed(3);
                        var geoScaleY = (!geoInfo || geoInfo.oheight == undefined || geoInfo.height == undefined) ? 1 : (+geoInfo.oheight / +geoInfo.height).toFixed(3);
                        $scope.geoScale = {x: +geoScaleX, y: +geoScaleY};
                        $scope.curFloorData = $scope.mapSdk._floorData;
                        $scope.poiCache();
                        if(myStorage.getItem('isPathDraw')){
                            $scope.openPathDraw();
                        }
                    },
                    logoInit: true,
                    enFloorUI: false,
                    enFacUI: false,
                    enBufferUI: false,
                    apiUrl: config.MAP_JSON_GET,
                    beacons: $scope.curFloorBeacons

                });
            }
            //cache  poi
            $scope.poiCache = function(){
                if($scope.mapSdk){
                    var mapData = $scope.mapSdk.__poiData;
                    $scope.curMapShops = mapData.shops;
                    $scope.curMapFac = mapData.fac;
                    $scope.curMapText = mapData.text;
                    $scope.curMapBeacons = mapData.beacons;
                    $scope.matchedId = mapData.matchedShopsId;
                    $scope.$apply();
                    myStorage.setItem('atlas-shop', JSON.stringify($scope.curMapShops));
                    myStorage.setItem('atlas-fac', JSON.stringify($scope.curMapFac));
                    myStorage.setItem('atlas-text', JSON.stringify($scope.curMapText));
                    myStorage.setItem('atlas-beacon', JSON.stringify($scope.curMapBeacons));
                }
            }
            $scope.cacheShopOrBeacon = function(shopOrBeacon, type, addOrDel){
                var data = JSON.parse(myStorage.getItem('atlas-' + type));
                if(!data) return;
                if(!addOrDel || !type || !shopOrBeacon){
                    return;
                }
                var query = function(shops, kw){
                    var len = shops.length - 1;
                    if(len >= 0){
                        while(shops[len].id != kw){
                            --len;
                            if(len < 0){
                                break;
                            }
                        }
                    }
                    return len;
                };
                var index = query(data, shopOrBeacon.id);
                if(addOrDel == 'add'){
                    if(index < 0){
                        data.push(shopOrBeacon);
                    }else{
                        data[index] = shopOrBeacon;
                    }
                }else if(addOrDel == 'del'){
                    if(index >= 0){
                        data.splice(index, 1);
                    }
                }
                myStorage.setItem('atlas-' + type, JSON.stringify(data));
            };
            $scope.cacheFacOrText = function(facOrText, type, addOrDel){
                var data = JSON.parse(myStorage.getItem('atlas-' + type));
                if(!data) return;
                if(!addOrDel || !type || !facOrText){
                    return;
                }
                var query = function(data, fc){
                    var len = data.length - 1;
                    if(len >= 0){
                        while(+data[len].x != +fc.x || +data[len].y != +fc.y){
                            --len;
                            if(len < 0){
                                break;
                            }
                        }
                    }
                    return len;
                };
                var index = query(data, facOrText);
                if(addOrDel == 'add'){
                    if(index < 0){
                        data.push(facOrText);
                    }else{
                        data[index] = facOrText;
                    }
                }else if(addOrDel == 'del'){
                    if(index >= 0){
                        data.splice(index, 1);
                    }
                }
                myStorage.setItem('atlas-' + type, JSON.stringify(data));
            };

            //改动3
            $scope.mapClear = function(){
                $scope.mapJsonData = null;
                $scope.isMapShow = false;
                $scope.mapBuild = null;
                $scope.mapFloor = null;
                $scope.mapTitle = null;
                $scope.curFloorBeacons = null;
                $scope.curMapShops = null;
                $scope.curMapFac = null;
                $scope.curMapText = null;
                $scope.curMapBeacons = null;
                $('#atlas').html('');
                myStorage.removeItem('atlas-shop');
                myStorage.removeItem('atlas-fac');
                myStorage.removeItem('atlas-text');
                myStorage.removeItem('atlas-beacon');
                //localStorage.removeItem('curFloorIdOfAtlas');
            };

            //改动4 旧方法 导出svg 已废弃
            $scope.svgExport = function(){
                if($scope.mapSdk){
                    var svgDom = $scope.mapSdk.svgDom,
                        innerHtml = $scope.mapSdk.gDom.innerHTML;
                    var viewBox = svgDom.getAttribute('viewBox'),
                        style = svgDom.getAttribute('style'),
                        res = '';
                    var viewBoxArr = viewBox.split(/\s+/),
                        svgWidth = +viewBoxArr[2] * 2,
                        svgHeight = +viewBoxArr[3] * 2;
                    res += '<svg viewBox="' + viewBox + '" width="' + svgWidth + '" height="' + svgHeight + '" version="1.1" xmlns="http://www.w3.org/2000/svg">';
                    res += innerHtml;
                    res += '</svg>';
                    var downloadFile = function (fileName, content){
                        var aLink = document.createElement('a');
                        var blob = new Blob([content]);
                        var evt = document.createEvent("HTMLEvents");
                        evt.initEvent("click", false, false);
                        aLink.download = fileName;
                        aLink.href = URL.createObjectURL(blob);
                        aLink.dispatchEvent(evt);
                    }
                    downloadFile('demo.svg', res);
                }
            }

            //right click
            $('body').on('mousedown', '#atlas .atlas-text div[type!=beacon]', function(event){
                if(myStorage.getItem('isPathDraw') || myStorage.getItem('isFenceDraw')){
                    return;
                }
                $scope.target = $(event.target);
                //alert($scope.targetPoint.attr('class'));
                $scope.rightMenu(event);
            })

            $scope.rightMenu = function(e){
                $scope.menuClear();
                if(e.button == '2'){
                    var coord = $scope.target.attr('coordinate').split('&');
                    $scope.currentMark = {
                        floorId: $scope.mapFloor._id,
                        x: coord[0],
                        y: coord[1],
                        type: $scope.target.attr('type'),
                        text: $scope.target.text() || $scope.target.attr('title'),
                        saz: $scope.target.attr('saz') || 50
                    }
                    if($scope.target.attr('uniqueId')){
                        $scope.currentMark.id = $scope.target.attr('uniqueId');
                    }
                    if($scope.target.attr('prodId')){
                        $scope.currentMark.prodId = $scope.target.attr('prodId');
                    }
                    var menuDrag = $('<ul id="menuTip">' +
                        '<li id="map-remove">删除</li>' +
                        '<li id="map-drag">拖</li>' +
                        '<li id="map-text">文字 <span class="caret"></span></li>' +
                        '<li id="map-saz">saz(0~100) <span class="caret"></span></li></ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px",
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                }
                $scope.menuCoord = {
                    x: e.pageX,
                    y: e.pageY
                }
            }

            $scope.menuClear = function(){
                $scope.currentMark = null;
                $('#menuTip').remove();
                $('.dropdown-menu').remove();
            }

            $('body').on('click', '#map-remove', function(){
                $scope.removeMark();

            })

            $scope.removeMark = function(){
                var mark = $scope.currentMark,
                    type = mark.type;
                if(type == 'shop'){
                    $scope.cacheShopOrBeacon(mark, type, 'del');
                    var ids = $scope.matchedId;
                    var newIds = [];
                    //console.log(mark.id)
                    for(var i in ids){
                        if(ids[i].indexOf(mark.id) > -1 || ids[i] == mark.id){
                            continue;
                        }
                        newIds.push(ids[i]);
                    }
                    $scope.matchedId = newIds;
                    $scope.$apply();
                }else if(type == 'fac' || type == 'text'){
                    $scope.cacheFacOrText(mark, type, 'del');
                }
                var coord = $scope.target.attr('coordinate');
                $('#atlas .atlas-text div[coordinate="'+ coord +'"]').remove();
                $scope.target = null;

                $scope.menuClear();
            }

            $('body').on('click', '#map-drag', function(event){
                var type = $scope.currentMark.type,
                    newDrag;
                switch (type){
                    case 'shop':
                        newDrag = {
                            _id: $scope.currentMark.id,
                            ch_name: $scope.currentMark.text,
                            saz: $scope.currentMark.saz,
                            prodId: $scope.currentMark.prodId
                        }
                        $scope.shopDrag(event, newDrag);
                        break;
                    case 'text':
                        newDrag = {
                            text: $scope.currentMark.text,
                            saz: $scope.currentMark.saz
                        }
                        $scope.textDrag(event, newDrag);
                        break;
                    case 'fac':
                        newDrag = {
                            id: $scope.currentMark.id,
                            displayName: $scope.currentMark.text,
                            saz: $scope.currentMark.saz,
                            class: $scope.target.attr('class')
                        }
                        $scope.facDrag(event, newDrag);
                        break;
                }
                $scope.removeMark();
            })

            $('body').on('click', '#map-text', function(event){
                $('.dropdown-menu').remove();
                var menu = $('<ul class="dropdown-menu"><li><input type="text" id="text-val" /></li>' +
                    '<li><button type="button" id="text-ok" class="btn btn-success">ok</button></li></ul>');
                menu.css({
                    "top" : $scope.menuCoord.y + 126,
                    "left" : $scope.menuCoord.x,
                    "position": "absolute"
                });
                $('body').append(menu);
                if($scope.currentMark.type == 'fac'){
                    $('#text-val').val($scope.target.attr('title'))
                }else{
                    $('#text-val').val($scope.target.text());
                }

                $('body').on('keyup', '#text-val', function(){
                    if(!$(this).val()){
                        $('#text-ok').attr('disabled',true);
                        return;
                    }else{
                        $('#text-ok').attr('disabled',false);
                    }
                })

            })

            $('body').on('click','#text-ok', function(){
                var mark = $scope.currentMark;
                mark.text = $('#text-val').val();
                $http.post(config.MAP_MARK_UPDATE, {mark: JSON.stringify(mark)})
                    .success(function(data){
                        if(data.result == 'succeed'){
                            if(mark.type == 'fac'){
                                $scope.target.attr('title', mark.text);
                            }else{
                                $scope.target.text(mark.text);
                            }
                            $scope.menuClear();
                            $scope.loadFloorMap($scope.mapFloor);
                        }
                    }).error(function(err){
                        console.log(err);
                    })
            })

            $('body').on('click', '#map-saz', function(event){
                $('.dropdown-menu').remove();
                var menu = $('<ul class="dropdown-menu"><li><div id="slider"></div></li>' +
                    '<li><input type="text" id="slider-val" />' +
                    '<button type="button" id="slider-ok" class="btn btn-success">ok</button></li></ul>');
                menu.css({
                    "top" : $scope.menuCoord.y + 126,
                    "left" : $scope.menuCoord.x,
                    "position": "absolute"
                });
                $('body').append(menu);

                $("#slider").slider(
                    {
                        min: 0,
                        max: 100,
                        step: 1,
                        change: function(event, ui){
                            $("#slider-val").val(ui.value);
                        }
                    }
                );

                $('#slider-val').val($scope.currentMark.saz);
                $("#slider").slider("option", "value", $scope.currentMark.saz);

                $('body').on('keyup', '#slider-val', function(){
                    if(!$(this).val().match(/^[0-9]+$/)){
                        $('#slider-ok').attr('disabled',true);
                        return;
                    }else{
                        $('#slider-ok').attr('disabled',false);
                        $("#slider").slider("option", "value", $(this).val());
                    }
                })
            })

            $('body').on('click', '#slider-ok', function(){
                var mark = $scope.currentMark;
                mark.saz = parseFloat($('#slider-val').val());
                $http.post(config.MAP_MARK_UPDATE, {mark: JSON.stringify(mark)})
                    .success(function(data){
                        if(data.result == 'succeed'){
                            $scope.target.attr('saz', mark.saz);
                            $scope.menuClear();
                            $scope.loadFloorMap($scope.mapFloor);
                        }
                    }).error(function(err){
                        console.log(err);
                    })
            })

            //poi part
            $scope.mallSet = function(e, mall){
                if(!mall) return;
                if($scope.currentParams && $scope.currentParams.mallId) return;
                if(e.button == '2'){
                    if(confirm('确定删除商场(' + mall.ch_name + ')？')){
                        alert('Are you sure？');
                        if(confirm('删除后将不可回复，请慎重！')){
                            $http.post(config.POI_REMOVE_URL, {id: mall._id, type:'mall'})
                                .success(function(ret){
                                    if(ret.result == 'succeed'){
                                        alert('删除成功！');
                                        $scope.shutDownDetail();
                                        $scope.mallQuery = '';
                                        var malls = $scope.malls;
                                        for(var i=0; i < malls.length; ++i){
                                            if(malls[i].ch_name == mall.ch_name && malls[i]._id == mall._id){
                                                malls.splice(i,1)
                                                break;
                                            }
                                        }
                                    }
                                }).error(function(error){
                                    console.log(error)
                                })
                        }
                    }
                }
            }

            $scope.buildingSet = function(e, build){
                $scope.menuClear();
                $scope.tipClear();
                if(e.button == '2'){
                    $scope.currentPoiName = build.ch_name;
                    $scope.currentPoiId = build._id;
                    $scope.currentType = 'building';
                    var menuDrag = $('<ul id="menuTip">' +
                        '<li class="menuTitle" onclick="prompt(\'ID:\',\'' + build._id +'\')">'+ (build.ch_name) +'</li>' +
                        '<li id="poi-add" type="add">添加floor</li>' +
                        '<li id="poi-clear-deleted">清理已删除</li>' +
                        '<li id="set-close">关闭</li></ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : '120px',
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                }
            }

            $scope.floorSet = function(e, floor){
                $scope.menuClear();
                $scope.tipClear();
                if(e.button == '2'){
                    $scope.curMapFloor = floor;
                    $scope.currentPoiName = floor.ch_name;
                    $scope.currentPoiId = floor._id;
                    $scope.currentType = 'floor';
                    var menuDrag = $('<ul id="menuTip">' +
                        '<li class="menuTitle">'+ (floor.ch_name) +'</li>' +
                        '<li id="poi-add" type="add">添加shop</li>' +
                        '<li id="poi-edit" type="edit">编辑</li>' +
                        '<li id="poi-remove">删除</li>' +
                        '<li id="set-close">关闭</li></ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : '120px',
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                }
            }

            $scope.shopSet = function(e, shop){
                $scope.menuClear();
                $scope.tipClear();
                if(e.button == '2'){
                    $scope.currentPoiId = shop._id;
                    $scope.currentPoiName = shop.displayName || shop.ch_name || shop.en_name;
                    $scope.currentType = 'shop';
                    var menuDrag = $('<ul id="menuTip">' +
                        '<li class="menuTitle">'+ (shop.displayName || shop.ch_name || shop.en_name) +'</li>' +
                        '<li id="poi-edit" type="edit">编辑</li>' +
                        '<li id="poi-remove">删除</li>' +
                        '<li id="set-close">关闭</li></ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : '120px',
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                }
            }
            $('body').on('click', '#poi-clear-deleted', function(){
                $http.get( BASE_URL + '/clearDeleted/' + $scope.mall._id)
                    .success(function(){
                        alert('清理成功')
                    })
                    .error(function(err){
                        alert(err)
                    })
            })
            $('body').on('click', '#set-close', function(){
                $scope.menuClear();
                $scope.poiAttrs = null;
                $scope.curBeacon = {};
            })

            $('body').on('click', '#poi-edit,#poi-add', function(event){
                $scope.opType = $(event.target).attr('type');
                var currentType;
                if($scope.opType == 'add'){
                    switch ($scope.currentType){
                        case 'mall':
                            currentType = 'building';
                            break;
                        case 'building':
                            currentType = 'floor';
                            break;
                        case 'floor':
                            currentType = 'shop';
                            break;
                    }
                    $scope.poiPostUrl = config.POI_ADD_URL;
                }else{
                    currentType = $scope.currentType;
                    $scope.poiPostUrl = config.POI_UPDATE_URL;
                }
                $scope.poiType = currentType;
                $scope.prods = config.prods;
                $http.get(config.attrsConfig + currentType +'Attrs.json')
                    .success(function(data){
                        if($scope.opType == 'edit' && $scope.currentPoiId){
                            $http.post(config.POI_GET_URL, {id: $scope.currentPoiId})
                                .success(function(ret){
                                    if(ret.result == 'succeed'){
                                        $scope.poiAttrs = data;
                                        $scope.currentPoi = ret.data;
                                        if($scope.currentPoi.logo && $scope.currentPoi.logo.domain && $scope.currentPoi.logo.key){
                                            $scope.curShoplogoUrl = $scope.currentPoi.logo.domain + $scope.currentPoi.logo.key;
                                        }
                                        $('#poiDiv').addClass('openAttr');
                                        $scope.menuClear();
                                    }else{
                                        console.log('fail')
                                    }

                                }).error(function(err){
                                    console.log(err);
                                })
                        }else{
                            $scope.poiAttrs = data;
                            $scope.currentPoi = {
                                poi_type: currentType,
                                pid : $scope.currentPoiId
                                //floor: $scope.currentPoiName
                            };
                            $('#poiDiv').addClass('openAttr');
                            $scope.menuClear();
                        }

                    }).error(function(err){
                        console.log(err);
                    })
            })
            $scope.closePoiDiv = function(){
                $scope.currentPoiId = null;
                $scope.curShoplogoUrl = null;
                $scope.currentPoi = null;
                $("#poiDiv").removeClass("openAttr");
            }

            $scope.addMall = function(){
                $http.get(config.attrsConfig +'buildingAttrs.json')
                    .success(function(data){
                        $scope.mallAttrs = data;
                        $scope.newMall = {};
                        $('#mallDiv').addClass('openAttr');
                        $scope.menuClear();

                    }).error(function(err){
                        console.log(err);
                    })
            }
            $scope.closeMallDiv = function(){
                $scope.newMall = null;
                $("#mallDiv").removeClass("openAttr");
            }

            $scope.saveMall = function(){
                $http.post(config.MALL_ADD_URL, {data: trim($scope.newMall), cityId: $scope.cityId || null})
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                            $scope.closeMallDiv();
                            $scope.malls.push(ret.data);
                        }
                    }).error(function(e){
                        console.log(e);
                    })
            }

            $scope.savePoi = function(){
                $http.post($scope.poiPostUrl, {data: trim($scope.currentPoi)})
                    .success(function(ret){
                        if($scope.opType == 'edit'){
                            $scope.closePoiDiv();
                            setTimeout(function(){
                                $scope.loadFloorMap($scope.mapFloor);
                            })
                        }else{
                            if(ret.result == 'succeed'){
                                $scope.poiRefresh();
                                $scope.closePoiDiv();
                            }else{
                                console.log('fail')
                            }
                        }
                    }).error(function(err){
                        console.log(err);
                    })
                if($scope.currentPoi.poi_type == 'shop' && $scope.opType == 'edit'){
                    $scope.updateProdIdOfMall($scope.currentPoi._id, $scope.currentPoi.prodId, $scope.currentPoi.displayName);
                }
            }

            $scope.updateProdIdOfMall = function(shopId, prodId, displayName){
                $http.post(config.SHOP_PRODID_SET, {shopId: shopId, prodId:prodId, dpName: displayName})
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                        }
                    }).error(function(e){
                        console.log(e);
                    })
            }

            $scope.poiRefresh = function(){
                //$scope.clear();
                $http.post(config.MALL_JSON1_URL,{id:$scope.mall._id})
                    .success(function(res){
                        if(res.result == 'succeed'){
                            $scope.$mall = res.data.mall;
                            $scope.$pois = res.data.pois;
                            $scope.buildings = getBuildingsById($scope.$pois);
                        }
                    }).error(function(err){
                        console.log(err);
                    })
            }

            $('body').on('click', '#poi-remove', function(){
                if(!confirm('确定删除“'+ $scope.currentPoiName +'”吗？')){
                    return;
                }
                $http.post(config.POI_REMOVE_URL, {id: $scope.currentPoiId, type: $scope.currentType})
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                            var mark = {
                                floorId: $scope.mapFloor._id,
                                type: 'shop',
                                uniqueId : $scope.currentPoiId
                            };
                            $scope.poiRefresh();
                            $scope.menuClear();
                            $http.post(config.MAP_MARK_REMOVE,{mark:JSON.stringify(mark)})
                                .success(function(data){
                                    $scope.loadFloorMap($scope.mapFloor);
                                }).error(function(err){
                                    console.log(err)
                                })
                        }else{
                            console.log(ret.msg);
                        }
                    }).error(function(err){
                        console.log(err)
                    })
            })
            // add beacon op in map
            $('body').on('mousedown', '#atlas .atlas-text div[type=beacon]', function(event){
                if(!event.target.getAttribute('coordinate')){
                    $scope.target = $(event.target.parentNode)
                }else{
                    $scope.target = $(event.target)
                }
                $scope.beaconRightMenu(event);
            })
            $scope.beaconRightMenu = function(e){
                if(myStorage.getItem('isPathDraw')){
                    return;
                }
                $scope.menuClear();
                if(e.button == '2'){
                    var coord = $scope.target.attr('coordinate').split('&');
                    $scope.currentMark = {
                        floorId: $scope.mapFloor._id,
                        id: $scope.target.attr('uniqueId'),
                        x: coord[0],
                        y: coord[1],
                        type: $scope.target.attr('type'),
                        name: $scope.target.text() || $scope.target.attr('title'),
                        saz: $scope.target.attr('saz') || 50
                    };

                    var menuDrag = $('<ul id="menuTip" style="width: 80px">' +
                        '<li class="beacon-remove">删除</li>' +
                        '<li class="beacon-drag">拖</li>' +
                        '<li class="beacon-url">示例url</li>' +
                        '</ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : e.pageX + 5 + "px",
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                }
                $scope.menuCoord = {
                    x: e.pageX,
                    y: e.pageY
                }
            }
            $('body').on('click', '#menuTip .beacon-remove', function(){
                $scope.removeBeaconMarker();
            });

            $('body').on('click', '#menuTip .beacon-drag', function(event){
                var newDrag = null;
                for(var i in $scope.curFloorBeacons){
                    if($scope.curFloorBeacons[i].id == $scope.currentMark.id){
                        newDrag = $scope.curFloorBeacons[i];
                        break;
                    }
                }
                if(newDrag){
                    $scope.beaconDrag(event, newDrag);
                    $scope.removeBeaconMarker();
                }
            })
            $('body').on('click', '#menuTip .beacon-url', function(){
                if($scope.currentMark){
                    jump('http://iscan.atlasyun.com/weixin/demo.html?' + $scope.currentMark.id);
                    $scope.menuClear();
                }
            });
            $scope.removeBeaconMarker = function(){
                if($scope.currentMark){
                    var mark = $scope.currentMark;
                    var coord = $scope.target.attr('coordinate');
                    $('#atlas .atlas-text div.atlas-beacon[coordinate="'+ coord +'"]').remove();
                    for(var i in $scope.curFloorBeacons){
                        if($scope.curFloorBeacons[i].id == mark.id){
                            $scope.curFloorBeacons[i].matched = false;
                            $scope.$apply();
                            break;
                        }
                    }
                    $scope.cacheShopOrBeacon(mark, 'beacon', 'del');
                    $scope.menuClear();
                }
            }

            $scope.saveMapPoi = function(mapFloor){
                var data = {
                    shops: JSON.parse(myStorage.getItem('atlas-shop')),
                    fac: JSON.parse(myStorage.getItem('atlas-fac')),
                    text: JSON.parse(myStorage.getItem('atlas-text')),
                    beacons: JSON.parse(myStorage.getItem('atlas-beacon'))
                };
                if($scope.curMapFloor._id){
                    $http.post(config.MAP_SAVE_URL,{data: JSON.stringify(data), floorId: $scope.curMapFloor._id})
                        .success(function(ret){
                            alert('保存成功！')
                        }).error(function(e){
                            console.log(e);
                        })
                }else{
                    alert('Please check floor!')
                }
            };

            $(window).bind('beforeunload',function(e){
                return '若有数据未保存，将会丢失！';
            });
            $(window).bind('unload',function(){
                $http.get(config.LOGOUT_URL);
            });
            $scope.logout = function(){
                $http.get(config.LOGOUT_URL);
                window.location.href = $scope.base_url + '/login';
            };
            // beacon 编辑
            $scope.curBeacon = {};
            $scope.showBeaconAttr = function(type){
                $('#beaconDiv').addClass('openAttr');
                $scope.bOpType = type;
                if(type == 'add'){
                    $scope.curBeacon = {};
                    $scope.isBeaconEdit = false;
                }else if(type == 'edit'){
                    $scope.isBeaconEdit = true;
                    $scope.$apply();
                }
            }
            $scope.closeBeaconAttr = function(){
                $('#beaconDiv').removeClass('openAttr');
                $scope.curBeacon = {};
            }
            $scope.saveBeacon = function(){
                if(!$scope.mapFloor) return;
                var beacon = trim($scope.curBeacon),
                    floorId = $scope.curMapFloor._id;
                if(beacon.wifiId) beacon.wifiId = beacon.wifiId.toUpperCase();
                if($scope.bOpType == 'add'){
                    $http.post(config.MAP_BEACON_ADD, {beacon: JSON.stringify(beacon), floorId:floorId})
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.curFloorBeacons.push(ret.data);
                                $scope.closeBeaconAttr();
                            }
                        }).error(function(e){
                            console.log(e)
                        })
                }else if($scope.bOpType == 'edit'){
                    $http.post(config.MAP_BEACON_SAVE, {beacon: JSON.stringify(beacon), floorId:floorId})
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.closeBeaconAttr();
                            }
                        }).error(function(e){
                            console.log(e)
                        })
                }
            }

            //开始定位点Beacon扫描
            //create by chihyi  2017/10/18
            $scope.startScanBeacon = function(){
                $http.post(config.MAP_BEACON_START_SCAN, {scanAddNum:$scope.curBeacon.scanAddNum, scanBeaconId: $scope.curBeacon.id })
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.curBeacon.scanStatus = 'SCANNING';
                                $scope.curBeacon.checkTimer = $timeout($scope.check, 1000);
                            }
                        }).error(function(e){
                            console.log(e)
                        });
            }

            //停止定位点Beacon扫描
            //create by chihyi  2017/10/18
            $scope.stopScanBeacon = function(){
                $http.post(config.MAP_BEACON_STOP_SCAN)
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.curBeacon.scanStatus = 'STOPPED';
                                $timeout.cancel($scope.curBeacon.checkTimer);
                            }
                        }).error(function(e){
                            console.log(e)
                        });

            }

            //每秒檢查目前已經掃描個數是否到達目標值
            //create by chihyi  2017/10/18
            $scope.check = function()
            {
                $http.get(config.MAP_BEACON_SCAN_LEFT_NUM).success(function(ret){
                    var num = ret.data;
                    $scope.curBeacon.scanAddNum = num;
                    if(num <= 0)
                    {
                        $scope.curBeacon.scanStatus = 'STOPPED';
                        $timeout.cancel($scope.check);
                    }else{
                        $scope.curBeacon.checkTimer = $timeout($scope.check,1000);
                    }
                });
            }

            $scope.beaconSet = function(e, beacon){
                $scope.menuClear();
                $scope.tipClear();
                if(e.button == '2'){
                    $scope.curBeacon = beacon;

                    //add by chihyi 2017/10/18
                    $scope.curBeacon.scanAddNum = 200;
                    $scope.curBeacon.scanStatus = 'STOPPED';
                    
                    $scope.currentType = 'shop';
                    var menuDrag = $('<ul id="menuTip">' +
                        '<li class="menuTitle">'+ beacon.name +'</li>' +
                        '<li id="beacon-edit" type="edit">编辑</li>' +
                        '<li id="beacon-remove">删除</li>' +
                        '<li id="beacon-scan">扫描</li>' +
                        '<li id="set-close">关闭</li></ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top" : (e.pageY + 5) + "px",
                        "left" : '120px',
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                }
            }

            //定位点Beacon扫描
            //create by chihyi  2017/10/17
            $scope.closeBeaconScanAttr = function(){
                $('#beaconScanDiv').removeClass('openAttr');
            }

            $scope.showBeaconScanAttr = function(type){
                $('#beaconScanDiv').addClass('openAttr');
                $scope.menuClear();
            }
            $('body').on('click', '#menuTip #beacon-scan', function(){
                $scope.showBeaconScanAttr('edit');
            })
            //定位点Beacon扫描

            $('body').on('click', '#menuTip #beacon-edit', function(){
                $scope.showBeaconAttr('edit');
                $scope.menuClear();
            })
            $('body').on('click', '#menuTip #beacon-remove', function(){
                if(confirm('确认删除此Beacon ' + $scope.curBeacon.name + '!')){
                    var beacon = trim($scope.curBeacon),
                        floorId = $scope.curMapFloor._id;
                    $http.post(config.MAP_BEACON_REMOVE, {beacon: JSON.stringify(beacon), floorId:floorId})
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                for(var i in $scope.curFloorBeacons){
                                    if($scope.curFloorBeacons[i].id == beacon.id){
                                        $scope.curFloorBeacons.splice(i, 1);
                                        $('#atlas .atlas-text div.atlas-beacon[uniqueId="'+ beacon.id +'"]').remove();
                                        break;
                                    }
                                }
                            }
                            $scope.menuClear();
                        }).error(function(err){
                            console.log(err)
                        })
                }
            })
            $scope.tagToPoi = function(e, poi, type){
                if($scope.mapSdk){
                    if(type == 'beacon'){
                        $scope.mapSdk.tagToPoiId(poi.id);
                    }else if(type == 'shop'){
                        $scope.mapSdk.tagToPoiId(poi._id);
                    }
                }
            }
            /* 路径 部分 */
            $scope.openPathDraw = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.isPathDraw = true;
                $scope.isAnchorSet = true;
                myStorage.setItem('isPathDraw', 'true');
                if($scope.mapSdk){
                    $scope.mapSdk.resetMark();
                    $scope.mapSdk._setFontDivSize();
                    $scope.anchorEvent();
                    $scope.initPathShape($scope.mapFloor._id);
                }
            };
            var joinAnchorStyle = function(data){
                data = data || {};
                var classStr = '';
                for(var i in data){
                    var tempArr = data[i] || [];
                    tempArr.forEach(function(item){
                        if(item.type === 'anchor'){
                            classStr += 'div.atlas-fac[coordinate|="{coord}"],'.replace('{coord}', item.point[0] +'&' + item.point[1]);
                        }
                    })
                }
                classStr = classStr.substring(0,classStr.length-1);
                $(classStr).css('border', '2px red dashed');
            };
            $scope.initPathShape = function(floorId){
                $scope.pathShape = null;
                var pathCacheData = $scope.getLocalCache(floorId + '_path');
                if(pathCacheData){
                    pathCacheData.initScale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale;
                    $scope.pathShape = new AtlasDraw.Shape($scope.mapSdk.pathSvg, pathCacheData);
                    joinAnchorStyle(pathCacheData.data);
                }else{
                    $http.get(config.PATH_GET_URL + '?floorId=' + floorId)
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                ret.data.initScale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale;
                                $scope.pathShape = new AtlasDraw.Shape($scope.mapSdk.pathSvg, ret.data);
                                $scope.localCache(floorId + '_path', ret.data);
                                joinAnchorStyle(ret.data.data);
                            }
                        }).error(function(err){
                            console.log(err)
                        })
                }
            }
            $scope.closePathDraw = function(){
                if(!confirm('确认关闭路径绘制吗？请先保存！')){
                    return;
                }
                $scope.tipClear();
                $scope.menuClear();
                $scope.isPathDraw = false;
                $scope.isAnchorSet = false;
                $scope.isPathEdit = false;
                myStorage.removeItem('isPathDraw');
                if($scope.mapSdk){
                    $scope.mapSdk.resetMark();
                    $scope.mapSdk._setFontDivSize();
                }
                $scope.pathEndDraw();
            }
            $scope.pathBeginDraw = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.pathEndEdit();
                $scope.isToDraw = true;
                $scope.isAnchorSet = false;
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = false;
                    $scope.mapSdk.scroller.options.scrollingY = false;
                    $scope.drawEvent();
                }
            }
            $scope.drawEvent = function(){
                if(!$scope.pathShape) return;
                var ctx = $scope.pathShape.getContext(),
                    shape = $scope.pathShape;
                $(ctx).unbind();
                var clcNum = 0;
                var lastClcX, lastClcY;
                ctx.addEventListener('click', function(e){
                    if(e.target != ctx){
                        return;
                    }
                    if(!$scope.isToDraw)return;
                    var scale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale,
                        x = parseInt((e.offsetX || e.layerX) / scale),
                        y = parseInt((e.offsetY || e.layerY) / scale);
                    ++clcNum;
                    if(clcNum == 1){
                        lastClcX = x;
                        lastClcY = y;
                        shape.utils.setDrawZoom(scale);
                        shape.setDrawStatus('click');
                        shape.polyLine.setVertex(x, y);
                    }
                    if(clcNum == 2){
                        if(Math.abs(lastClcX - x) > 1  || Math.abs(lastClcY - y) > 1){
                            shape.setDrawStatus('dblclick');
                            shape.polyLine.clearVertexes();
                            clcNum = 0;
                            lastClcX = null;
                            lastClcY = null;
                        }else{
                            clcNum = 1;
                        }
                    }
                }, true);
                $(ctx).bind('contextmenu', function(e){
                    e.preventDefault();
                    if(!$scope.isToDraw)return;
                    shape.setDrawStatus('dblclick');
                    shape.polyLine.clearVertexes();
                });
                /*
                 $(ctx).dblclick(function(e){
                 if(!$scope.isToDraw)return;
                 if(shape.getCurDrawStatus() != 'move')return;
                 shape.setDrawStatus('dblclick');
                 shape.polyLine.clearVertexes();
                 });*/
                ctx.addEventListener('mousemove', function(e){
                    if(e.target != ctx){
                        return;
                    }
                    if(!$scope.isToDraw)return;
                    if(!shape.getCurDrawStatus() ||shape.getCurDrawStatus() == 'dblclick'){return;}
                    var scale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale,
                        x = parseInt((e.offsetX || e.layerX) / scale),
                        y = parseInt((e.offsetY || e.layerY) / scale);
                    shape.setDrawStatus('move');
                    shape.polyLine.setVertex(x, y);
                    shape.polyLine.draw();
                });
            }
            $scope.pathEndDraw = function(){
                $scope.isToDraw = false;
                $scope.isAnchorSet = true;
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = true;
                    $scope.mapSdk.scroller.options.scrollingY = true;
                }
            }
            $scope.pathClear = function(){
                if(!confirm('确定删除吗？')) return;
                if($scope.pathShape && $scope.mapSdk){
                    $scope.pathShape.updateDrawData({});
                    $scope.mapSdk.pathSvg.innerHTML = '';
                }
            }
            $scope.savePath = function(floor){
                if($scope.pathShape && floor){
                    if($scope.pathShape.getCurDrawStatus() !== 'dblclick'){
                        $scope.pathShape.setDrawStatus('dblclick');
                        $scope.pathShape.polyLine.clearVertexes();
                    }
                    var pathData = $scope.pathShape.getDrawData(),
                        nextId = $scope.pathShape.getPathId(),
                        data = {
                            nextId: nextId,
                            data: pathData
                        };
                    var covertToPoint = function(arr){
                        var res = [],
                            len = arr.length;
                        for(var i=0; i < len; ++i){
                            if(i == len -1 || len < 2){
                                break;
                            }else{
                                var temp = arr[i].point.concat(arr[i+1].point);
                                res.push(temp);
                            }
                        }
                        return res;
                    };
                    var floorId = floor._id;
                    $http.post(config.PATH_SAVE_URL, {floorId: floorId, data: data})
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.pathEndDraw();
                                $scope.pathEndEdit();
                                $scope.localCache(floorId + '_path', data);
                                var result = [];
                                for(var i in pathData){
                                    var temp = pathData[i];
                                    if(temp){
                                        var points = covertToPoint(temp);
                                        result = result.concat(points);
                                    }
                                }
                                var segmments = countIntersections(result);
                                var formBody = {
                                    bid: $scope.buildings[0]._id,
                                    floor:{
                                        id: $scope.mapFloor._id,
                                        name: $scope.mapFloor.displayName
                                    },
                                    segments: segmments || []
                                }
                                $http.post( '/api/mapeditor/points/' + $scope.mapFloor._id, formBody)
                                    .success(function(ret){
                                        alert('路径保存成功！');
                                        $scope.loadFloorMap(floor);
                                    }).error(function(e){
                                        console.log(e);
                                        alert('路径保存失败！');
                                    })
                            }
                        }).error(function(e){
                            console.log(e)
                        })
                }
            }
            /*  路径编辑 */
            $scope.pathBeginEdit = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.isPathEdit = true;
                $scope.pathEndDraw();
                $scope.editEvent();
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = false;
                    $scope.mapSdk.scroller.options.scrollingY = false;
                }
            }
            $scope.editEvent = function(){
                if(!$scope.pathShape && $scope.mapSdk) return;
                if($scope.pathShape.getCurDrawStatus() !== 'dblclick'){
                    $scope.pathShape.setDrawStatus('dblclick');
                    $scope.pathShape.polyLine.clearVertexes();
                }
                var pathData = $scope.pathShape.getDrawData();
                var ctx = $scope.pathShape.getContext();
                $('.atlas-text svg path').unbind();
                $('.atlas-text svg path').bind('contextmenu', function(e){
                    if(!$scope.isPathEdit) return;
                    $scope.menuClear();
                    $('.path-control').remove();
                    var menuDrag = $('<ul id="menuTip" style="width: 80px">' +
                        '<li class="path-del">删除</li>' +
                        '</ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top": e.pageY + "px",
                        "left": e.pageX + "px",
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                    var target = e.target,
                        pathId = $(target).attr('id'),
                        curPathData = pathData[pathId];
                    $('#menuTip .path-del').unbind();
                    $('#menuTip .path-del').bind('click', function(e){
                        ctx.removeChild(target);
                        delete pathData[pathId];
                        $scope.pathShape.updateDrawData(pathData);
                        $scope.menuClear();
                    })
                })
                $('.atlas-text svg path').bind('click',function(e){
                    if(!$scope.isPathEdit) return;
                    $('.path-control').remove();
                    var target = e.target,
                        pathId = $(target).attr('id'),
                        curPathData = pathData[pathId];
                    var i = 1;
                    $(ctx).unbind();
                    var scale = $scope.mapSdk.__svgScale * $scope.mapSdk.scroller.__zoomLevel;
                    $scope.pathShape.utils.setDrawZoom(scale);
                    curPathData.forEach(function(item){
                        var id = 'pathCtrl' + i;
                        var circle = $scope.pathShape.utils.drawControlCircle(item.point, id);
                        var mouseDown=false;
                        $(circle).unbind();
                        $(circle).bind('mousedown', function(){
                            mouseDown=true;
                        });
                        $(ctx).bind('mouseup', function(){
                            mouseDown=false;
                        });
                        ctx.addEventListener('mousemove', function(e){
                            if(e.target != ctx){
                                return;
                            }
                            if(mouseDown)
                            {
                                var scale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale,
                                    x = parseInt((e.offsetX || e.layerX) / scale),
                                    y = parseInt((e.offsetY || e.layerY) / scale);
                                $(circle).attr('cx', x);
                                $(circle).attr('cy', y);
                                item.point = [+x, +y];
                                var d = $scope.pathShape.utils.getPathD(curPathData);
                                $(target).attr('d', d);
                            }
                        });
                        ++i;
                    })
                })
            }

            $scope.pathEndEdit = function(){
                $('.path-control').remove();
                $scope.isPathEdit = false;
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = true;
                    $scope.mapSdk.scroller.options.scrollingY = true;
                }
            }
            /* local cache */
            $scope.localCache = function(id, data){
                if(data instanceof Object){
                    data = JSON.stringify(data);
                }
                myStorage.setItem(id.toString(), data)
            }
            $scope.getLocalCache = function(id){
                var data = myStorage.getItem(id.toString())
                if(data){
                    data = JSON.parse(data);
                }else{
                    data = null;
                }
                return data;
            }
            $scope.clearLocalCache = function(id){
                if(id){
                    myStorage.removeItem(id.toString());
                }else{
                    myStorage.clear();
                }
            }
            $scope.clearLocalCache();

            /*   锚点设置  */
            $scope.openAnchorSet = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.isAnchorSet = true;
                $scope.isPathDraw = false;
                myStorage.setItem('isPathDraw', 'true');
                if($scope.mapSdk){
                    $scope.mapSdk.resetMark();
                    $scope.mapSdk._setFontDivSize();
                }
                $scope.anchorEvent();
            }
            $scope.closeAnchorSet = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.isAnchorSet = false;
                myStorage.removeItem('isPathDraw');
                if($scope.mapSdk){
                    $scope.mapSdk.resetMark();
                    $scope.mapSdk._setFontDivSize();
                }
            }
            //锚点事件处理
            $scope.anchorEvent = function(){
                $('body').on('mouseup','#atlas .atlas-text div.atlas-fac[uniqueId=3],#atlas .atlas-text div.atlas-fac[uniqueId=2],#atlas .atlas-text div.atlas-fac[uniqueId=1]', function(e){
                    if(!myStorage.getItem('isPathDraw')) return;
                    var target = e.target;
                    var coordinate = target.getAttribute('coordinate').split('&');
                    $scope.anchorX = coordinate[0];
                    $scope.anchorY = coordinate[1];
                    $scope.menuClear();
                    if(e.button == '2') {
                        if(!$scope.isAnchorSet) return;
                        $scope.curAnchor = {
                            floorId: $scope.mapFloor._id,
                            type: target.getAttribute('uniqueId'),
                            x: +$scope.anchorX,
                            y: +$scope.anchorY
                        };
                        var menuDrag = $('<ul id="menuTip" style="width: 80px">' +
                            '<li class="anchor-set">设置锚点</li>' +
                            '</ul>');
                        $("body").append(menuDrag);
                        menuDrag.css({
                            "top": (e.pageY + 5) + "px",
                            "left": e.pageX + 5 + "px",
                            "position": "absolute",
                            "font-family": "inherit"
                        });
                        var floors = $scope.getFloors($scope.buildings[0]);
                        var queryFloor = function(floors, id){
                            var len = floors.length - 1;
                            if(len >= 0){
                                while(floors[len]._id != id){
                                    --len;
                                    if(len < 0){
                                        break;
                                    }
                                }
                            }
                            return len;
                        };
                        var index = queryFloor(floors, $scope.curAnchor.floorId);
                        if(index < 0){
                            alert('Error: Floor invalid!')
                        }else{
                            $scope.downFloorJoins = null;
                            $scope.upFloorJoins = null;
                            if(index == 0){
                                $scope.downFloorJoins = null;
                                $scope.upFloorJoins = (floors.concat([])).slice(1);
                            }else if(index == floors.length -1){
                                $scope.downFloorJoins = (floors.concat([])).slice(0,-1);
                                $scope.upFloorJoins = null;
                            }else{
                                $scope.downFloorJoins = (floors.concat([])).slice(0,index);
                                $scope.upFloorJoins = (floors.concat([])).slice(index+1);
                            }
                        }
                    }else{
                        if($scope.isToDraw && $scope.pathShape){
                            $scope.pathShape.setDrawStatus('click');
                            $scope.pathShape.polyLine.setVertex($scope.anchorX, $scope.anchorY, 'anchor');
                        }
                    }
                })
            };
            //anchor
            $('body').on('click', '#menuTip .anchor-set', function(e){

                $scope.setFacsForjoinFloor = function(curFloor){
                    $.ajax({
                        type: 'POST',
                        url: config.FAC_GET_URL,
                        data: {floorId: curFloor._id, fac: $scope.curAnchor},
                        async: false,
                        success: function(data){
                            if(data.result == 'succeed'){
                                curFloor.fac = data.data;
                            }else{
                                curFloor.fac = []
                            }
                        },
                        error: function(err){
                            curFloor.fac = [];
                            console.log(err)
                        }
                    });
                }

                $scope.curAnchorJoins = null;
                var data = $scope.curAnchor;
                $scope.curFloorAnchor.forEach(function(anchor){
                    if(anchor.floorId == data.floorId
                        && +anchor.x == +data.x
                        && +anchor.y == +data.y
                        && +anchor.type == +data.type){
                        $scope.curAnchorJoins = anchor.joins;
                    }
                });
                $scope.initJoin = {};
                $scope.anchorMatchedData = {};
                $scope._initJoin = (function(){
                    if($scope.curAnchorJoins && $scope.curAnchorJoins.length > 0 ){
                        var joins = $scope.curAnchorJoins;
                        if($scope.downFloorJoins){
                            var downFloorId;
                            $scope.downFloorJoins.forEach(function(floor){
                                var flag = (floor._id == joins[0].floorId) || (joins[1] && joins[1].floorId == floor._id);
                                if(flag){
                                    $scope.initJoin['down'] = floor;
                                    downFloorId = floor._id;
                                    $scope.setFacsForjoinFloor($scope.initJoin.down);
                                }
                            })
                            if(downFloorId){
                                if(joins[0].floorId == downFloorId){
                                    $scope.anchorMatchedData['down'] = joins[0];
                                }else if(joins[1] && joins[1].floorId == downFloorId){
                                    $scope.anchorMatchedData['down'] = joins[1];
                                }
                            }else{
                                $scope.initJoin['down'] = $scope.downFloorJoins[$scope.downFloorJoins.length -1];
                                $scope.setFacsForjoinFloor($scope.initJoin.down);
                            }
                        }
                        if($scope.upFloorJoins){
                            var upFloorId;
                            $scope.upFloorJoins.forEach(function(floor){
                                var flag = (floor._id == joins[0].floorId) || (joins[1] && joins[1].floorId == floor._id);
                                if(flag){
                                    $scope.initJoin['up'] = floor;
                                    upFloorId = floor._id;
                                    $scope.setFacsForjoinFloor($scope.initJoin.up);
                                }
                            })
                            if(upFloorId){
                                if(joins[0].floorId == upFloorId){
                                    $scope.anchorMatchedData['up'] = joins[0];
                                }else if(joins[1] && joins[1].floorId == upFloorId){
                                    $scope.anchorMatchedData['up'] = joins[1];
                                }
                            }else{
                                $scope.initJoin['up'] = $scope.upFloorJoins[0];
                                $scope.setFacsForjoinFloor($scope.initJoin.up);
                            }
                        }
                    }else{
                        if($scope.downFloorJoins){
                            $scope.initJoin['down'] = $scope.downFloorJoins[$scope.downFloorJoins.length -1];
                            $scope.setFacsForjoinFloor($scope.initJoin.down);
                        }
                        if($scope.upFloorJoins){
                            $scope.initJoin['up'] = $scope.upFloorJoins[0];
                            $scope.setFacsForjoinFloor($scope.initJoin.up);
                        }
                    }
                })();
                atlasDemoMap([{floor: $scope.mapFloor._id}], 'anchor-source-map', $scope.curAnchor);
                $('#anchorDiv').addClass('openAttr');
                $scope.anchorIsSelected = function(fac, floorId){
                    if($scope.curAnchorJoins){
                        var joins = $scope.curAnchorJoins;
                        var flag = false;
                        joins.forEach(function(join){
                            if(floorId == join.floorId
                                && +fac.x == +join.x
                                && +fac.y == +join.y
                                && +fac.type == +join.type){
                                flag = true;
                            }
                        });
                        return flag;
                    }else{
                        return false;
                    }
                };
                $scope.$apply();
                $scope.menuClear();

            });
            $scope.closeAnchorAttr = function(){
                $('#anchorDiv').removeClass('openAttr');
                $(".anchor-floor-map").html('');
                $scope.curAnchor = null;
                $scope.anchorMatchedData = {};
                $scope.downFloorJoins = null;
                $scope.upFloorJoins = null;
                $scope.initJoin = {};
            }
            $('body').on('change', '.anchor-floor-sel', function(e){
                var floor =  !!this.value ? JSON.parse(this.value) : null,
                    type = this.getAttribute('type');
                if(floor){
                    $scope.initJoin[type] = floor;
                    $scope.setFacsForjoinFloor($scope.initJoin[type]);
                    $(this).parent().next().html('');
                    $scope.$apply();
                }
            });

            $('body').on('change', '.anchor-matched', function(e){
                var fac = !!this.value ? JSON.parse(this.value) : null,
                    type = this.getAttribute('type'),
                    floorId = this.getAttribute('floorId'),
                    divId = $(this).parent().next().attr('id');
                if(fac){
                    atlasDemoMap([{floor: floorId}], divId, fac);
                    $scope.anchorMatchedData[type] = {
                        floorId: floorId,
                        x: +fac.x,
                        y: +fac.y,
                        type: fac.type
                    };
                }else{
                    $scope.anchorMatchedData[type] = null;
                    document.getElementById(divId).style['display'] = 'none';
                }
            })
            $scope.saveAnchor = function(){
                var data =  $scope.anchorMatchedData;
                var curAnchor = $scope.curAnchor;
                var joins = [];
                if(data.down){
                    joins[0] = data.down;
                }
                if(data.up){
                    joins.push(data.up);
                }
                curAnchor.joins = joins;
                $http.post(config.ANCHOR_SAVE_URL, {data: curAnchor})
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                            $scope.closeAnchorAttr();
                            var index;
                            for(var i=0; i< $scope.curFloorAnchor.length; ++i){
                                var temp = $scope.curFloorAnchor[i];
                                if(temp.floorId == curAnchor.floorId
                                    && +temp.x == +curAnchor.x
                                    && +temp.y == +curAnchor.y
                                    && +temp.type == +curAnchor.type){
                                    index = i;
                                }
                            }
                            if(index == undefined){
                                $scope.curFloorAnchor.push(curAnchor);
                            }else{
                                $scope.curFloorAnchor[index] = curAnchor;
                            }
                        }
                    }).error(function(err){
                        console.log(err);
                    })
            }
            //logo 上传
            $scope.pickupImg = function(){
                $('#logoToUpload').val('');
                $('#logoToUpload').trigger('click');
                $scope.destShopId = $scope.currentPoi._id;
            }
            $('body').on('change','#logoToUpload',function(){
                console.log($('#logoToUpload').val())
                if(!$scope.destShopId || !$scope.file) return;
                if($scope.file.size > 500 * 1024){
                    return alert('图片大小超过500KB')
                };
                $scope.logoUploadMsg = '上传中...';
                $('#logoUpMsg').fadeIn();
                var fd = new FormData();
                fd.append("logoFile", $scope.file);
                fd.append("shopId", $scope.destShopId)
                $http.post(config.SHOP_LOGO_URL,
                    fd,
                    {
                        withCredentials: true,
                        headers: {'Content-Type': undefined },
                        transformRequest: angular.identity
                    }).success(function(data){
                        console.log(data);
                        $scope.logoUploadMsg = '上传成功！';
                        $scope.curShoplogoUrl = data.url;
                        $('#logoUpMsg').fadeOut('slow');
                        $scope.file = null;
                    }).error(function(err){
                        console.log(err);
                        $('#logoUpMsg').fadeOut();
                        $scope.file = null;
                    });
            })
            $scope.reomveShopLogo = function(id){
                if(!id) return;
                if(!confirm('确定删除吗？')) return;
                $http.post(config.SHOP_LOGO_REMOVE, {id: id})
                    .success(function(){
                        $scope.curShoplogoUrl = null;
                    }).error(function(){

                    })
            }
            /* 地理围栏*/
            $scope.isFenceDraw = false;
            $scope.openFenceDraw = function(){
                $scope.isFenceDraw = true;
                $scope.isPathDraw = false;
                $scope.isToDrawFence = false;
                $scope.isFenceEdit = false;
                myStorage.setItem('isFenceDraw', 'true');
                if($scope.mapSdk){
                    $scope.mapSdk.resetMark();
                    $scope.mapSdk._setFontDivSize();
                    $scope.initFenceShape($scope.mapFloor._id);
                }
            };
            $scope.closeFenceDraw = function(){
                if(!confirm('确认关闭围栏绘制吗？请先保存！')){
                    return;
                }
                $scope.tipClear();
                $scope.menuClear();
                $scope.isFenceDraw = false;
                $scope.isPathDraw = false;
                $scope.fenceIds = {};
                myStorage.removeItem('isFenceDraw');
                if($scope.mapSdk){
                    $scope.mapSdk.resetMark();
                    $scope.mapSdk._setFontDivSize();
                }
                $scope.fenceEndDraw();
            }
            $scope.initFenceShape = function(floorId){
                $scope.fenceShape = null;
                $scope.fenceIds = {};
                var lenceCacheData = $scope.getLocalCache(floorId + '_fence');
                if(lenceCacheData){
                    $scope.fenceShape = new AtlasDraw.Shape($scope.mapSdk.pathSvg, lenceCacheData, '#BF15CB');
                    $scope.fenceIds = lenceCacheData.fids || {};
                }else{
                    $http.get(config.FENCE_GET_URL + '?floorId=' + floorId)
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.fenceShape = new AtlasDraw.Shape($scope.mapSdk.pathSvg, ret.data, '#BF15CB');
                                $scope.localCache(floorId + '_fence', ret.data);
                                var shapes = ret.data.data;
                                $scope.fenceIds = ret.data.fids || {};
                                if(shapes){
                                    for(var i in $scope.fenceIds){
                                        if(!shapes[i]){
                                            delete  $scope.fenceIds[i];
                                        }
                                    }
                                }
                            }
                        }).error(function(err){
                            console.log(err)
                        })
                }
            }
            $scope.fenceBeginDraw = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.fenceEndEdit();
                $scope.isToDrawFence = true;
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = false;
                    $scope.mapSdk.scroller.options.scrollingY = false;
                    $scope.drawFenceEvent();
                }
            }
            $scope.drawFenceEvent = function(){
                if(!$scope.fenceShape) return;
                var ctx = $scope.fenceShape.getContext(),
                    shape = $scope.fenceShape;
                $(ctx).unbind();
                ctx.addEventListener('click', function(e){
                    if(!$scope.isToDrawFence)return;
                    var scale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale,
                        x = parseInt((e.offsetX || e.layerX) / scale),
                        y = parseInt((e.offsetY || e.layerY) / scale);
                    shape.utils.setDrawZoom(scale);
                    shape.setDrawStatus('click');
                    shape.polygon.setVertex(x, y);
                });
                $(ctx).bind('contextmenu', function(e){
                    e.preventDefault();
                    if(!$scope.isToDrawFence)return;
                    shape.setDrawStatus('dblclick');
                    shape.polygon.clearVertexes();
                });
                ctx.addEventListener('mousemove', function(e){
                    if(!$scope.isToDrawFence)return;
                    if(!shape.getCurDrawStatus() || shape.getCurDrawStatus() == 'dblclick'){return;}
                    var scale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale,
                        x = parseInt((e.offsetX || e.layerX) / scale),
                        y = parseInt((e.offsetY || e.layerY) / scale);
                    shape.setDrawStatus('move');
                    shape.polygon.setVertex(x, y);
                    shape.polygon.draw();
                });
            }
            $scope.fenceEndDraw = function(){
                $scope.isToDrawFence = false;
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = true;
                    $scope.mapSdk.scroller.options.scrollingY = true;
                }
            }
            $scope.saveFence = function(floor){
                if($scope.fenceShape && floor){
                    if($scope.fenceShape.getCurDrawStatus() !== 'dblclick'){
                        $scope.fenceShape.setDrawStatus('dblclick');
                        $scope.fenceShape.polygon.clearVertexes();
                    }
                    var pathData = $scope.fenceShape.getDrawData(),
                        nextId = $scope.fenceShape.getPathId(),
                        data = {
                            nextId: nextId,
                            data: pathData,
                            fids: $scope.fenceIds || {}
                        };
                    var floorId = floor._id;
                    $http.post(config.FENCE_SAVE_URL, {floorId: floorId, data: data})
                        .success(function(ret){
                            if(ret.result == 'succeed'){
                                $scope.fenceEndDraw();
                                $scope.fenceEndEdit();
                                $scope.localCache(floorId + '_fence', data);
                                alert('保存成功');
                            }
                        }).error(function(e){
                            console.log(e)
                        })
                }
            }
            /*编辑 地理围栏*/
            $scope.fenceBeginEdit = function(){
                $scope.tipClear();
                $scope.menuClear();
                $scope.isFenceEdit = true;
                $scope.curSelFenceId = null;
                $('#fenceId-set').val('');
                $('#fenceName-set').val('');
                $scope.fenceEndDraw();
                $scope.fenceEditEvent();
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = false;
                    $scope.mapSdk.scroller.options.scrollingY = false;
                }
            }
            $scope.fenceEditEvent = function(){
                if(!$scope.fenceShape && $scope.mapSdk) return;
                if($scope.fenceShape.getCurDrawStatus() !== 'dblclick'){
                    $scope.fenceShape.setDrawStatus('dblclick');
                    $scope.fenceShape.polygon.clearVertexes();
                }
                var pathData = $scope.fenceShape.getDrawData();
                var ctx = $scope.fenceShape.getContext();
                $('.atlas-text svg path').unbind();
                $('.atlas-text svg path').bind('contextmenu', function(e){
                    if(!$scope.isFenceEdit) return;
                    $scope.menuClear();
                    $('.path-control').remove();
                    var menuDrag = $('<ul id="menuTip" style="width: 80px">' +
                        '<li class="path-del">删除</li>' +
                        '</ul>');
                    $("body").append(menuDrag);
                    menuDrag.css({
                        "top": e.pageY + "px",
                        "left": e.pageX + "px",
                        "position": "absolute",
                        "font-family": "inherit"
                    });
                    var target = e.target,
                        pathId = $(target).attr('id'),
                        curPathData = pathData[pathId];
                    $('#menuTip .path-del').unbind();
                    $('#menuTip .path-del').bind('click', function(e){
                        ctx.removeChild(target);
                        delete pathData[pathId];
                        delete $scope.fenceIds[pathId];
                        $scope.fenceShape.updateDrawData(pathData);
                        $scope.menuClear();
                    })
                })
                $('.atlas-text svg path').bind('click',function(e){
                    if(!$scope.isFenceEdit) return;
                    $('.path-control').remove();
                    var target = e.target,
                        pathId = $(target).attr('id'),
                        curPathData = pathData[pathId];
                    $scope.curSelFenceId = pathId;
                    if($scope.fenceIds && $scope.fenceIds[pathId]){
                        var fenceAttr = $scope.fenceIds[pathId].split('~');
                        $('#fenceId-set').val(fenceAttr[0]);
                        $('#fenceName-set').val(fenceAttr[1] || '');
                    }else{
                        $('#fenceId-set').val(pathId);
                        $('#fenceName-set').val( '');
                    }
                    var i = 1;
                    $(ctx).unbind();
                    var scale = $scope.mapSdk.__svgScale * $scope.mapSdk.scroller.__zoomLevel;
                    $scope.fenceShape.utils.setDrawZoom(scale);
                    curPathData.forEach(function(item){
                        var id = 'fenceCtrl' + i;
                        var circle = $scope.fenceShape.utils.drawControlCircle(item.point, id);
                        var mouseDown = false;
                        $(circle).unbind();
                        $(circle).bind('mousedown', function(){
                            mouseDown = true;
                        });
                        $(ctx).bind('mouseup', function(){
                            mouseDown = false;
                        });
                        ctx.addEventListener('mousemove', function(e){
                            if(mouseDown)
                            {
                                var scale = $scope.mapSdk.scroller.__zoomLevel * $scope.mapSdk.__svgScale,
                                    x = parseInt((e.offsetX || e.layerX) / scale),
                                    y = parseInt((e.offsetY || e.layerY) / scale);
                                $(circle).attr('cx', x);
                                $(circle).attr('cy', y);
                                item.point = [+x, +y];
                                var d = $scope.fenceShape.utils.getPathD(curPathData);
                                $(target).attr('d', d);
                            }
                        });
                        ++i;
                    })
                })
            }
            $('body').on('input propertychange', '#fenceId-set', function(e){
                if($scope.curSelFenceId && $scope.fenceIds){
                    $scope.fenceIds[$scope.curSelFenceId] = this.value.trim() + '~' + $('#fenceName-set').val().trim();
                }
            });
            $('body').on('input propertychange', '#fenceName-set', function(e){
                if($scope.curSelFenceId && $scope.fenceIds){
                    $scope.fenceIds[$scope.curSelFenceId] = $('#fenceId-set').val().trim() + '~' + this.value.trim();
                }
            });
            $scope.fenceEndEdit = function(){
                $('.path-control').remove();
                $('#fenceId-set').val('');
                $('#fenceName-set').val('');
                $scope.isFenceEdit = false;
                if($scope.mapSdk){
                    $scope.mapSdk.scroller.options.scrollingX = true;
                    $scope.mapSdk.scroller.options.scrollingY = true;
                }
            }
            // export img
            $scope.exportFontsize = 20;
            $scope.exportImgsize = '原尺寸';
            $scope.isShowImgScale = true;
            $scope.exportFloorImg = function(floor){
                var imgScale = 1;
                if($scope.exportImgsize && $scope.exportImgsize.indexOf('/') > -1){
                    var temp =  $scope.exportImgsize.split('/');
                    imgScale = +temp[0] / +temp[1];
                }else{
                    imgScale = +$scope.exportImgsize
                }
                $('#exportDownloadBtn').attr('disabled', true);
                var floorId = floor._id;
                var img = new AtlasImgExport({
                    floorData: $scope.curFloorData,
                    floorId: floorId,
                    container: document.getElementById('exportDiv'),
                    showImage: false,
                    fontSize: +$scope.exportFontsize,
                    imgScale: $scope.exportImgsize == '原尺寸'? 1: imgScale,
                    showScale: $scope.isShowImgScale,
                    apiUrl: config.MAP_JSON_GET,
                    callback: function(){
                        img.exportImage();
                        $('#exportDownloadBtn').attr('disabled', false);
                    }
                })
            }

            //brand aliases
            var aliases = {};

            $scope.openAliases = function(){
                var currentPoi = $scope.currentPoi;
                if(!currentPoi.brand_id || currentPoi.brand_id.length !== 24){
                    return console.log('Invalid brandId.');
                }
                $('#aliasModalDiv').addClass('openAttr');
                aliases.todos = [];
                aliases.todoText = currentPoi.ch_name;
                $http.post( config.GET_BRAND_URL, {brand_id: currentPoi.brand_id})
                    .success(function(ret){
                        if(ret.result == 'succeed'){
                            var curBrand = ret.data;
                            var tempAliases = curBrand.aliases || [];
                            tempAliases.forEach(function(alias){
                                if(alias){
                                    aliases.todos.push({text: alias, done:false});
                                }
                            })
                        }
                    }).error(function(err){
                        console.log(err)
                    })
            };

            aliases.addTodo = function() {
                if(!aliases.todoText || !aliases.todoText.trim()) return;
                aliases.todos.push({text: aliases.todoText, done:false});
                aliases.todoText = '';
            };

            aliases.remaining = function() {
                var count = 0;
                angular.forEach(aliases.todos, function(todo) {
                    count += todo.done ? 0 : 1;
                });
                return count;
            };

            aliases.archive = function() {
                var oldTodos = aliases.todos;
                aliases.todos = [];
                angular.forEach(oldTodos, function(todo) {
                    if (!todo.done) aliases.todos.push(todo);
                });
            };
            aliases.save = function(brandId){
                var todos = aliases.todos || [];
                var tempAliases = [];
                todos.forEach(function(todo){
                    if(todo.text && todo.text.trim() != ''){
                        tempAliases.push(todo.text);
                    }
                })
                $http.post(config.UPDATE_BRAND_URL, {_id: brandId, aliases: tempAliases})
                    .success(function(err){
                        $('#aliasModalDiv').removeClass('openAttr');
                        $scope.aliases.todos = [];
                    }).error(function(err){
                        console.log(err);
                        alert('Something wrong!');
                    })
            }
            $scope.aliases = aliases;

            $('body').on('change','#img-sel',function(){
                var fd = new FormData();
                if($scope.file.type != 'image/png' && $scope.file.type != 'image/jpeg'){
                    alert('图片格式不正确!');
                    return;
                }
                fd.append("configFile", $scope.file);
                $http.post(config.FLOOR_IMG_UPLOAD.replace('{floorId}', $scope.mapFloor._id ),
                    $scope.file,
                    {
                        withCredentials: true,
                        headers: {'Content-Type': 'application/octet-stream' },
                        transformRequest: angular.identity
                    }).success(function(data){
                        if(data.result == 'succeed'){
                            $scope.uploadImgMsg = data.data;
                        }else{
                            $scope.uploadImgMsg = 'Error：'+ data.msg;
                        }
                        $('#img-sel').val('')
                    }).error(function(err){
                        console.log(err);
                    });
            })
            $scope.pickImgFile = function(){
                $('#img-sel').trigger('click');
            };

            $scope.removeImgFile = function(){
                $http.post(config.FLOOR_IMG_REMOVE.replace('{floorId}', $scope.mapFloor._id ))
                    .success(function(data){
                        if(data.result == 'succeed'){
                            $scope.uploadImgMsg = data.data;
                        }else{
                            $scope.uploadImgMsg = 'Error：'+ data.msg;
                        }
                    }).error(function(err){
                        console.log(err);
                    });
            };
        }]);

var myLocalCache = {};
var myStorage = {
    setItem: function(key, str){
        myLocalCache[key] = str;
    },
    removeItem: function(key){
        if(myLocalCache[key] !== undefined){
            delete myLocalCache[key];
        }
    },
    getItem: function(key){
        return myLocalCache[key];
    },
    clear : function(){
        myLocalCache = {};
    }
};

function trim(obj){
    //console.log(obj)
    if(typeof(obj) == 'string'){
        return obj.replace(/^\s*|\s*$/g,'');
    }else{
        var newObj = {};
        for(var i in obj){
            if(typeof(obj[i]) == 'string'){
                newObj[i] = obj[i].replace(/^\s*|\s*$/g,'');
            }
            if(typeof(obj[i]) == 'number'){
                newObj[i] = obj[i];
            }
        }
        return newObj;
    }
}

// The old Malls method
function getBuildingsById(pois){
    var lists = [];
    pois.forEach(function(poi){
        if(poi.poi_type == 'building'){
            lists.push(poi);
        }
    })
    return changeListType(lists);
}

function getFloorsById(poi_id, pois, mallObj){
    var buildings = mallObj.buildings;
    for(var index in buildings){
        var building = buildings[index];
        if(building.poi_id == poi_id){
            return changeListType(getPoisBycommonId(pois,building.floors));
        }
    }
}

function getShopsById(poi_id, pois, mallObj){
    for(var index in mallObj.buildings){
        var building = mallObj.buildings[index];
        for(var floorIndex in building.floors){
            var floor = building.floors[floorIndex];
            if(floor.poi_id == poi_id){
                return changeListType(getPoisBycommonId(pois,floor.shops));
            }
        }
    }
}

function getPoisBycommonId(pois, malls){
    var list = [];
    pois.forEach(function(poi){
        malls.forEach(function(mall){
            if(mall.poi_id == poi._id){
                if(mall.matched){
                    poi.matched = true;
                }
                list.push(poi);
            }
        })
    })
    return list;
}

function changeListType(list){
    var returnList = [];
    for(var index in list){
        var obj = {};
        var poiObj = list[index];
        obj["ch_name"] = poiObj["ch_name"];
        obj["_id"] = poiObj["_id"];
        obj["displayName"] = poiObj["displayName"];
        obj["en_name"] = poiObj["en_name"] || poiObj["ch_name"];
        if(poiObj.matched){
            obj['matched'] = true;
        }
        if(typeof(poiObj.prodId)!= 'undefined'){
            obj['prodId'] = poiObj['prodId'];
        }
        returnList.push(obj);
    }
    return returnList;
}

var jump = function (url){
    var aLink = document.createElement('a');
    aLink.setAttribute('href', url );
    aLink.setAttribute('target', '__blank');
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
};

function atlasDemoMap(floorList, divId, point){
    return new Atlas({
        width: 360,
        height: 350,
        floorList: floorList,
        mapDiv: divId,
        maxZoom: 15,
        minZoom: 0.5,
        initZoom : 1,
        initCallback: function(){
            if(point){
                this.tagTo(point.x, point.y)
            }
        },
        logoInit: false,
        enFloorUI: false,
        enFacUI: false,
        enBufferUI: false,
        apiUrl: config.MAP_JSON_GET
    })
}
