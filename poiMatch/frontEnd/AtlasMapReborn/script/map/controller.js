'use strict';
var app = angular.module('atlas');

app.controller('newMapCtrl', ['$scope', '$http', '$route', 'mapBuilding', 'MapOfBuilding',
    function($scope, $http, $route, mapBuilding, MapOfBuilding) {
        $scope.domInit = function() {

        }
        if (mapBuilding) {
            console.log($route.current.params)
            $scope.floors = (function() {
                var floors = mapBuilding[7],
                    list = [],
                    json = {};
                for (var i in floors) {
                    var obj = {},
                        key = Object.keys(floors[i])[0];
                    obj.name = key.indexOf('B') > -1 ? key.replace('Floor', '') : key.replace('loor', '');
                    obj.id = floors[i][key];
                    json[obj.name] = obj.id;
                    list.push(obj);
                }
                return {
                    list: list,
                    json: json
                };
            })();

            if ($route.current.params.floorId && $route.current.params.shopId) {
                $scope.curFloorId = $route.current.params.floorId;
                $scope.curShopId = $route.current.params.shopId;
            } else {
                $scope.curFloorId = null;
                $scope.curShopId = null;
            }
        }

        $scope.rollFloor = function(flag) {
            var sl = $('.map-floor-list').scrollLeft(),
                step = $('.map-floor-list li').width(),
                maxSl = $('.map-floor-list ul').width() - $('body').width() * 0.7,
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
        $scope.goCurFloor = function(target, floorId) {
            $('.map-floor-list li').removeClass('active');
            $(target).addClass('active');
            $scope.curFloorId = floorId;
            if (!$scope.mapDataOfFloors[floorId]) {
                var floorMap = MapOfBuilding.mapFloor(floorId);
                floorMap.then(function(floorData) {
                    $scope.mapDataOfFloors[floorId] = floorData;
                    $scope.mapSdk.setFloorJSON(floorData);
                }, function(err) {
                    console.log(err)
                })
            } else {
                $scope.mapSdk.setFloorJSON($scope.mapDataOfFloors[floorId]);
            }
        }

        $scope.initMap = (function() {
            var floorId = $scope.curFloorId || $scope.floors.json['F1'],
                screenW = $(window).innerWidth(),
                screenH = $(window).innerHeight() - 80,
                floorMap = MapOfBuilding.mapFloor(floorId);

            floorMap.then(function(floorData) {
                $scope.mapDataOfFloors[floorId] = floorData;
                $scope.mapSdk = new SDK({
                    mapData: floorData,
                    maxZoom: 2,
                    minZoom: 0.2,
                    width: screenW,
                    height: screenH,
                    initZoom: undefined,
                    onClickFunc: function(x, y) {
                        console.log('getX:' + x + ' and getY:' + y);
                    },
                    onCompleteFunc: function() {
                        console.log('finished!');
                        $scope.mapSdk.resetMark();
                    },
                    onZoomingFunc: function() {
                        // console.log('zooming!!!');
                        $scope.mapSdk.locateMark();
                        //$scope.mapSdk.resetMark();
                    },
                    initCallback: function() {
                        $('#loading').hide();
                        console.log('init!');
                        if (!('ontouchstart' in window)) {
                            $($scope.mapSdk.zoomDiv).on('mousewheel', function(e) {
                                $scope.mapSdk.resetMark();
                            })
                        }
                        if ($scope.curShopId) {
                            $scope.mapSdk.moveToEnId($scope.curShopId);
                        }
                    }
                })
            }, function(err) {
                console.log(err);
            });
        })();
    }
]);


app.directive("ngAutoWidth", function() {
    return {
        restrict: 'A',
        link: function($scope, el) {
            var num = $scope.floors.list.length
            el[0].style.width = $('body').width() * 0.1 + 'px';
            el[0].parentNode.style.width = $('body').width() * 0.1 * num + 'px';
        }
    }
})