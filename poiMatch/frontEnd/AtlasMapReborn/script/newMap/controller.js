'use strict';
var app = angular.module('atlas');

app.controller('newMapCtrl', ['$scope', '$http', '$route', 'mapBuilding', 'shopsOfMall', 'MapOfBuilding',
    function($scope, $http, $route, mapBuilding, shopsOfMall, MapOfBuilding) {
        $scope.mallname = mapBuilding[1];

        $scope.domInit = function() {
            $('.map-body').css('height', $(window).innerHeight() - 40);
        }
        $(function() {
            $scope.domInit();
        });
        $(window).on('resize', $scope.domInit);

        //地图数据
        if (mapBuilding) {
            $scope.floors = (function() {
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

            if ($route.current.params) {
                $scope.curFloorId = $route.current.params.floorId || null;
                $scope.curShopId = $route.current.params.shopId || null;
                $scope.parentId = $route.current.params.parentId || null;
            } else {
                $scope.curFloorId = null;
                $scope.curShopId = null;
                $scope.parentId = null;
            }
        } else {
            return console.log('Error: no building ' + $route.current.params.parentId.split('&')[1]);
        }

        //地图展示及楼层选单
        $scope.rollFloor = function(flag) {
            var sl = $('.map-floor-list').scrollLeft(),
                step = $('.map-floor-list li').width() * 2,
                maxSl = $('.map-floor-list ul').width() - $('body').width() * 0.8 + 5,
                newSl;
            if (flag == -1)
                newSl = (sl - step >= 0) ? (sl - step) : 0;
            if (flag == 1)
                newSl = (sl + step <= maxSl) ? (sl + step) : maxSl;
            $('.map-floor-list').animate({
                scrollLeft: newSl + "px"
            }, "slow");
        }


        $scope.mapDataOfFloors = {};
        $scope.goCurFloor = function(target, floor) {
            if ($scope.mapSdk) {
                $('.map-floor-list li').removeClass('active');
                $(target).addClass('active');
                $scope.clearMarkDetail();
                $scope.curFloorId = floor.id;
                $scope.curFloorName = floor.name;
                $scope.mapSdk.setFloor(floor.detailName);
                $scope.hiddenDiscount();
                moveToCenter(target);
            }
        };

        var moveToCenter = function(target) {
            $('.map-floor-list').animate({
                scrollLeft: (target.offsetLeft - target.offsetWidth * 2.5) + "px"
            }, "slow");
        };

        $scope.initMap = (function() {
            var floorId = $scope.curFloorId || $scope.floors.json['F1'],
                screenW = $(window).innerWidth(),
                screenH = $(window).innerHeight() - 80;
            $scope.curFloorId = floorId;
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
            })($scope.curFloorId, $scope.floors.list);
            $scope.curFloorName = floorNames[0];
            $scope.initFloorName = floorNames[1];
            var params = {
                width: screenW,
                height: screenH,
                floorList: mapBuilding[7],
                mapDiv: 'atlas',
                maxZoom: 30,
                minZoom: 1,
                initFloor: $scope.initFloorName || 'Floor1',
                initZoom: 2,
                enFloorUI: false,
                enFacUI: true,
                enBufferUI: false,

                initCallback: function() {
                    $('#loading').hide();
                    moveToCenter($('.map-floor-list li.active')[0]);
                    if ($scope.curShopId) {
                        $scope.mapSdk.moveToPoiId($scope.curShopId);
                    }
                },
                poiClick: function(poi) {
                    if (poi.id.length != 24) {
                        $scope.isShowDetailButton = false;
                    } else {
                        $scope.isShowDetailButton = true;
                    }
                    $scope.curPoiId = poi.id;
                    $scope.isShowMarkDetail = true;
                    $scope.curMarkName = poi.name;
                    $scope.$apply();
                    $('#atlas-logo').css('bottom', '65px');
                }
            }
            $scope.mapSdk = new Atlas(params);
        })();

        //优惠和详情
        $scope.isShowMarkDetail = false;
        $scope.isShowDiscount = false;
        $scope.isShowCoupon = false;
        $scope.discount = {};
        $scope.floors.list.forEach(function(floor) {
            $scope.discount[floor.name] = [];
        })
        if (shopsOfMall) {
            shopsOfMall.forEach(function(item) {
                if (item.hasCoupon === true && item.floor !== undefined) {
                    var floorName = item.floor.ch_name;
                    if (floorName.indexOf('F') > -1) {
                        floorName = 'F' + floorName.replace('F', '');
                    }
                    try {
                        $scope.discount[floorName].push(item);
                    } catch (e) {
                        console.log('Floors not match between map and mall.');
                    }
                }
            });
            $scope.checkCurPoiIdIsCoupon = function() {
                var flag = false;
                if (!$scope.discount[$scope.curFloorName]) {
                    return false;
                }
                $scope.discount[$scope.curFloorName].forEach(function(item) {
                    if ($scope.curPoiId == item.poi_id) {
                        flag = true;
                        $scope.coupon = item.coupons[0];
                    }
                });
                return flag;
            };

            $scope.setState = function() {
                var url = '#/map/' + $scope.parentId + '/' + $scope.curFloorId + '/' + $scope.curPoiId;
                history.pushState({
                    url: url
                });
                location.href = '#/shop/' + $scope.curPoiId;
            };

            $scope.showDiscount = function() {
                var discount = [];
                $scope.isShowDiscount = true;
                if (!$scope.discount[$scope.curFloorName]) {
                    return false;
                }
                $scope.discount[$scope.curFloorName].forEach(function(item) {
                    var dom = document.querySelector('#atlas #atlas-text div[poiId="' + item.poi_id + '"]');
                    if (dom) {
                        var coordinate = dom.getAttribute('coordinate').split('&');
                        discount.push({
                            x: parseFloat(coordinate[0]),
                            y: parseFloat(coordinate[1]),
                            width: 25,
                            height: 30,
                            url: './newMap/images/tuan.png',
                            action: function() {
                                $scope.coupon = item.coupons[0];
                                $scope.curMarkName = item.ch_name;
                                $scope.curPoiId = item.poi_id;
                                $scope.isShowMarkDetail = true;
                                $scope.isShowDetailButton = true;
                                $scope.isShowCoupon = true;
                                $scope.$apply();
                            }
                        })
                    }
                })
                if ($scope.mapSdk && discount.length > 0) {
                    $scope.mapSdk.addImgs(discount);
                }
            };

            $scope.hiddenDiscount = function() {
                $scope.isShowDiscount = false;
                $scope.isShowCoupon = false;
                if ($scope.mapSdk) {
                    $scope.mapSdk.removeImgs();
                }
            }

        }
        $scope.clearMarkDetail = function() {
            $scope.isShowMarkDetail = false;
            $scope.isShowDetailButton = false;
            $('#atlas-logo').css('bottom', '20px')
        }
    }
]);

app.directive("ngListWidth", function() {
    return {
        restrict: 'A',
        link: function($scope, el) {
            if ($scope.floors) {
                var num = $scope.floors.list.length + 4;
                //el[0].style.cssText = 'width:200px';
                el[0].style.width = $('body').width() * 0.16 + 'px';
                el[0].parentNode.style.width = $('body').width() * 0.16 * num + 'px';
            }
        }
    }
})