var mapJsonpCallback;

//var sct_host = 'http://map.atlasyun.com/weixin';
var sct_host = 'http://localhost/poi';

window.onload = function() {
    var domInit = function() {
        var mapBody = document.querySelector('div.map-body');
        mapBody.style['height'] = (window.innerHeight - 50) + 'px';
        mapBody.style['width'] = '100%';
    };
    domInit();
    window.addEventListener('resize', function(e) {
        domInit();
    });

    document.getElementsByTagName('title')[0].innerHTML = 'Atlas Mall';

    var eventFunc = (function() {
        if ('ontouchstart' in window) {
            return {
                click: 'touchend'
            };
        } else {
            return {
                click: 'click'
            };
        }
    })();

    var jsonpCall = function(url, callback) {
        var script = document.createElement('script');
        script.setAttribute('src', url + '&callback=mapJsonpCallback');
        document.body.appendChild(script);
        mapJsonpCallback = function(data) {
            if (data.result == 'succeed') {
                document.body.removeChild(script);
                callback(data.data);
            } else {
                if (data) {
                    callback(data);
                } else {
                    callback(null);
                }

            }
        }
    };

    //var bUrl = 'http://'+ getUrlArgs.type + '.atlasyun.com/poi/map/building/getSimple?id=' + getUrlArgs.bid;
    var bUrl = 'http://localhost/poi/map/building/getSimple?id=' + getUrlArgs.bid;
    
    var poiDetailDom = document.getElementById('poi-detail');
    var detailButton = document.querySelector('#poi-detail button#detailBtn');
    var currentMarkName = document.querySelector('#poi-detail .poi');
    var currentFloorName = document.querySelector('#poi-detail .floor');
    var atlasLogo = document.getElementById('atlas-logo');
    var couponDetailDom = document.getElementById('coupon-detail');
    var couponImg = document.querySelector('#coupon-detail img');
    var couponDesc = document.querySelector('#coupon-detail .desc');
    var couponCurPrice = document.querySelector('#coupon-detail .cur-price');
    var couponOldPrice = document.querySelector('#coupon-detail .old-price');

    var navButton = document.querySelector('#poi-detail button#navBtn');
    var startButton = document.querySelector('#poi-detail button#startBtn');
    var endButton = document.querySelector('#poi-detail button#endBtn');

    var navStartCoord = null,
        navEndCoord = null,
        curPoiCoord = null;

    jsonpCall(bUrl, function(data) {
        if (data) {
            var mapBuilding = data;
            var scope = {};

            document.querySelector('.header .nav h1').innerHTML = mapBuilding[1];

            scope.floors = (function() {
                var floors = mapBuilding[7],
                    list = [],

                    json = {};
                for (var i in floors) {
                    var obj = {},
                        key = Object.keys(floors[i])[0];
                    obj.name = key.indexOf('B') > -1 ? key.replace('Floor', '') : key.replace('loor', '');
                    obj.id = floors[i][key];
                    obj.detailName = key;
                    json[obj.name] = obj.id;
                    list.push(obj);
                }
                return {
                    list: list,
                    json: json
                };
            })();

            scope.initMap = (function() {
                scope.curFloorId = getUrlArgs.fid || scope.floors.list[0].id;
                scope.curShopId = getUrlArgs.sid;
                var floorNames = (function(id, list) {
                    var name, detailName;
                    for (var i in list) {
                        if (list[i].id == id) {
                            name = list[i].name;
                            detailName = list[i].detailName;
                            break;
                        }
                    }
                    return [name, detailName];
                })(scope.curFloorId, scope.floors.list);
                if (!floorNames[0] || !floorNames[1]) {
                    throw new Error('Invalid floorId:' + scope.curFloorId);
                }
                scope.curFloorName = floorNames[0];
                scope.initFloorName = floorNames[1];
                var params = {
                    width: document.getElementById('atlas').clientWidth,
                    height: document.getElementById('atlas').clientHeight,
                    floorList: mapBuilding[7],
                    mapDiv: 'atlas',
                    maxZoom: 15,
                    minZoom: 0.5,
                    initFloor: scope.initFloorName || 'Floor1',
                    initZoom: 1,
                    enFloorUI: true,
                    enFacUI: true,
                    enBufferUI: true,
                    serverHost: 'localhost',
                    initCallback: function() {

                        document.getElementById('FacFuti').addEventListener(eventFunc.click, function(e) {
                            scope.mapSdk.enFacility([3]);
                            document.getElementById('search-content').style['display'] = 'none';
                        });
                        document.getElementById('FacXishoujian').addEventListener(eventFunc.click, function(e) {
                            scope.mapSdk.enFacility([8, 9, 10]);
                            document.getElementById('search-content').style['display'] = 'none';
                        });
                        document.getElementById('FacZhiti').addEventListener(eventFunc.click, function(e) {
                            scope.mapSdk.enFacility([1]);
                            document.getElementById('search-content').style['display'] = 'none';
                        });
                        document.getElementById('FacATM').addEventListener(eventFunc.click, function(e) {
                            scope.mapSdk.enFacility([16]);
                            document.getElementById('search-content').style['display'] = 'none';
                        });

                        var data2;
//document.getElementById('discount-hidden').style['display'] = 'inline-block';
                        if (scope.curShopId) {
                            loadXMLDocPoiName();
                            setTimeout(function() {
                                var PoiData = strToJson(data2);
                                scope.mapSdk.moveToPoiId(scope.curShopId, true);
                                scope.mapSdk.tagToPoiId(scope.curShopId);
                                scope.showPoiDetail(scope.curShopId, PoiData.ch_name, '65px');

                                function strToJson(str) {
                                    return JSON.parse(str);
                                }
                            }, 1000);
                        }

                        function loadXMLDocPoiName() {
                            var xmlhttp;
                            if (window.XMLHttpRequest) {
                                xmlhttp = new XMLHttpRequest();
                            } else {
                                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                            }

                            xmlhttp.onreadystatechange = function() {
                                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                                    if (xmlhttp.status == 200) {
                                        data2 = xmlhttp.responseText;

                                    } else if (xmlhttp.status == 400) {
                                        alert('There was an error 400')
                                    } else {
                                        alert('something else other than 200 was returned')
                                    }
                                }
                            }
                            // var url_base = 'http://ap.atlasyun.com';
                            var url_base = navigator.userAgent.indexOf("MSIE") > -1 ? window.location.pathname.split('/')[0] : window.location.origin;
                            var url = url_base + '/api_test/shop/pid/' + getUrlArgs.sid + '/53d5e4c85620fa7f111a3f67';

                            xmlhttp.open("GET", url, true);
                            xmlhttp.send();
                        }

                    },
                    poiClick: function(poi) {
                        scope.showPoiDetail(poi.id, poi.name, '65px');
/*if (scope.checkCurPoiIdIsCoupon() && scope.isShowDiscount) {
 scope.showCouponDetail(scope.coupon);
 } else {
 couponDetailDom.style['display'] = 'none';
 }*/
                        curPoiCoord = {x: poi.x, y: poi.y, floor: scope.mapSdk.curFloor};
                    },
                    floorChange: function(fname){
                        scope.curFloorName = fname;
                        scope.clearMarkDetail();
                    }
                };
                scope.mapSdk = new Atlas(params);
            })();

            scope.showPoiDetail = function(poiId, name, logoBottom) {
                if(scope.mapSdk && scope.mapSdk.__navSteps){
                    return;
                }
                if (poiId.length != 24) {
                    detailButton.style['display'] = 'none';
                } else {
                    detailButton.style['display'] = 'inline-block';
                    detailButton.addEventListener(eventFunc.click, function(e) {
                        scope.setState();
                    });
                }
                scope.curPoiId = poiId;
                poiDetailDom.style['display'] = 'inline-block';
                currentMarkName.innerHTML = name;
                currentFloorName.innerHTML = scope.curFloorName;
                atlasLogo.style['bottom'] = logoBottom;
                if(!navStartCoord){
                    startButton.style['display'] = 'inline-block';
                    endButton.style['display'] = 'none';
                }else{
                    startButton.style['display'] = 'none';
                    endButton.style['display'] = 'inline-block';
                }
            };
            startButton.addEventListener(eventFunc.click, function(e) {
                if(curPoiCoord){
                    navStartCoord = curPoiCoord;
                    curPoiCoord = null;
                    startButton.style['display'] = 'none';
                    endButton.style['display'] = 'inline-block';

                }else{
                    alert('请点击poi!')
                }
            });
            endButton.addEventListener(eventFunc.click, function(e) {
                if(curPoiCoord){
                    navEndCoord = curPoiCoord;
                    curPoiCoord = null;
                }else{
                    alert('请点击poi!')
                }
            });
            navButton.addEventListener(eventFunc.click, function(e) {
                if(scope.mapSdk && navStartCoord && navEndCoord){
                    scope.mapSdk.setNavPath(navStartCoord,navEndCoord, true, function(data){
                        navStartCoord = null;
                        navEndCoord = null;
                        poiDetailDom.style['display'] = 'none';
                    });
                }
            });
            scope.showCouponDetail = function(coupon) {
                couponDetailDom.style['display'] = 'inline-block';
                couponDetailDom.setAttribute('title', coupon.desc);
                couponCurPrice.innerHTML = '￥' + coupon.current_price + ' ';
                couponOldPrice.innerHTML = coupon.list_price;
                couponDesc.innerHTML = coupon.desc;
                couponImg.setAttribute('src', coupon.pic_url);
            };

            scope.isShowMarkDetail = false;
            scope.isShowDiscount = false;
            scope.isShowCoupon = false;
            scope.discount = {};
            scope.floors.list.forEach(function(floor) {
                scope.discount[floor.name] = [];
            });

            var couponUrl = 'http://' + 'localhost' + '/api_test/shops/mid/' + getUrlArgs.mid + '/53d5e4c85620fa7f111a3f67?hascoupon=true';
            jsonpCall(couponUrl, function(coupons) {
                if (coupons) {
                    coupons.forEach(function(item) {
                        if (item.hasCoupon === true && item.floor !== undefined) {
                            var floorName = item.floor.ch_name;
                            if (floorName.indexOf('F') > -1) {
                                floorName = 'F' + floorName.replace('F', '');
                            }
                            try {
                                scope.discount[floorName].push(item);
                            } catch (e) {
                                throw new Error('Floors not match between map and mall.');
                            }
                        }
                    });

                    scope.checkCurPoiIdIsCoupon = function() {
                        var flag = false;
                        if (!scope.discount[scope.curFloorName]) {
                            return false;
                        }
                        scope.discount[scope.curFloorName].forEach(function(item) {
                            if (scope.curPoiId == item.poi_id) {
                                flag = true;
                                scope.coupon = item.coupons[0];
                            }
                        });
                        return flag;
                    }
                }
            });

            scope.setState = function() {
                //var url = '#/map/' + $scope.parentId + '/' + $scope.curFloorId + '/' + $scope.curPoiId;
                //history.pushState({url: url});
                location.href = sct_host + '/AtlasMapReborn/#/shop/53d5e4c85620fa7f111a3f67/' + scope.curPoiId + '?uid=' + getUrlArgs.uid;
            };

            scope.showDiscount = function() {
                var discount = [];
                scope.isShowDiscount = true;
                if (!scope.discount[scope.curFloorName]) {
                    return false;
                }
                if (!scope.mapSdk) {
                    return;
                }
                scope.discount[scope.curFloorName].forEach(function(item) {

                });
                if (discount.length > 0) {
                    scope.mapSdk.addTagImgs(discount);
                }

            };

            scope.hiddenDiscount = function() {
                if (scope.mapSdk) {
                    scope.mapSdk.removeImgs();
                    scope.isShowDiscount = false;
                    couponDetailDom.style['display'] = 'none';
                }
            };
            scope.clearMarkDetail = function() {
                couponDetailDom.style['display'] = 'none';
                poiDetailDom.style['display'] = 'none';
                atlasLogo.style['bottom'] = '20px';
            }

        }
        /*
         document.getElementById('discount-show').addEventListener(eventFunc.click, function(e) {
         if (e.preventDefault) {
         e.preventDefault();
         }
         scope.hiddenDiscount();
         this.style['display'] = 'none';
         document.getElementById('discount-hidden').style['display'] = 'inline-block';
         });
         document.getElementById('discount-hidden').addEventListener(eventFunc.click, function(e) {
         if (e.preventDefault) {
         e.preventDefault();
         }
         scope.showDiscount();
         this.style['display'] = 'none';
         document.getElementById('discount-show').style['display'] = 'inline-block';
         });*/
    })

};

function openSearch() {
    document.getElementById('search-content').style['display'] = "block";
    document.getElementById('searchList').innerHTML = '';
    document.getElementById('fac-list').style['display'] = "block";
    document.getElementById('searchOut').value = '';
    setTimeout(function() {
        try {
            document.getElementById('SearchinMallInput').focus();
        } catch (e) {}
    }, 200);

    document.getElementById('SearchinMallInput').value = ''
}

function CategoryFood() {
    window.location.href = sct_host + '/AtlasMapReborn/#/malltag/53d5e4c85620fa7f111a3f67/' + getUrlArgs.mid + '/0';
}

function CategoryDrink() {
    window.location.href = sct_host + '/AtlasMapReborn/#/malltag/53d5e4c85620fa7f111a3f67/' + getUrlArgs.mid + '/1';
}

function CategoryBaby() {
    window.location.href = sct_host + '/AtlasMapReborn/#/malltag/53d5e4c85620fa7f111a3f67/' + getUrlArgs.mid + '/6';
}

function CategoryBianlidian() {
    window.location.href = sct_host + '/AtlasMapReborn/#/malltag/53d5e4c85620fa7f111a3f67/' + getUrlArgs.mid + '/3+4';
}

function closeSearch() {
    document.getElementById('search-content').style['display'] = "none";
    document.getElementById('searchOut').value = '';
}
var getUrlArgs = (function() {
    var curWwwPath = window.document.location.href;
    var argsStr = curWwwPath.split('?')[1];
    if (!argsStr) {
        throw new Error('invalid arguments!');
    }
    var argsArr = argsStr.split('/');
    var pid, fid, sid;
    pid = argsArr[0].split('&');
    if (!pid || pid.length > 3) {
        throw new Error('invalid arguments!');
    }
    return {
        mid: pid[0],
        bid: pid[1],
        type: pid[2] || 'map',
        fid: argsArr[1] || null,
        sid: argsArr[2] || null,
        uid: argsArr[3] || pid[2]

    };
})();

function SearchinMall() {
    var key = document.getElementById("SearchinMallInput").value;
    window.location.href =  sct_host +  '/AtlasMapReborn/#/searchinmall/53d5e4c85620fa7f111a3f67/'+getUrlArgs.mid+'/'+ key;
}
