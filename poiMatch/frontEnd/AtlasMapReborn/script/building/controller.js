'use strict';

angular
  .module('atlas')
  .controller('buildingCtrl', ['$scope', 'global', 'API_PREFIX', '$http', '$route', '$location', '$filter', 'building', 'Localstorage', '$window', '$timeout',
    function($scope, global , API_PREFIX, $http, $route, $location, $filter, building, Localstorage, $window, $timeout) {
      
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      $scope.swipegoback = function() {
        history.go(-1);
      };

      var catebpid;
      var searchhis;
      $scope.searchhis = Localstorage.getSearchHis();
      console.log($scope.searchhis);
      $scope.showHis = false;
      $scope.showHisGo = false;

      $scope.cityId = $route.current.params.cityid;

      $scope.searchmall = function(kword) {
        var keyword = encodeURIComponent(kword);
        var mallid = $scope.catebpid;
        console.log(keyword)
        if (keyword) {
          var searchhis = Localstorage.getSearchHis();
          searchhis.push(keyword);
          searchhis = searchhis.slice(-7);
          Localstorage.setSearchHis(searchhis);
          $location.path('/searchinmall/' + $scope.cityId + '/' + mallid + '/' + keyword);
        }
      };
      $scope.entersearch = function(event, keyword) {
        if (event.keyCode === 13) {
          var searchhis = Localstorage.getSearchHis();
          searchhis.push(keyword);
          searchhis = searchhis.slice(-7);
          Localstorage.setSearchHis(searchhis);
          $scope.searchmall(keyword.toLowerCase());
        }
      }
      $scope.catebpid = building.poi_id;
      $scope.ngBlurHis = function() {
        $timeout(function() {
          $scope.showHis = false;
        }, 100);
      }

      var gps = $filter('gps');
      for (var i in building) {
        building.location = gps(building.loc);
      }

      $scope.building = building;
      $scope.floors = building.buildings[0].floors;
      console.log($scope.building);
      $scope.showNotice = false;

      function showNotice(content) {
        $scope.noticeContent = content;
        $scope.showNotice = true;
        $timeout(function() {
          $scope.showNotice = false;
        }, 1000);
      }
      if (building.buildings[0].pics.length != 0) {
        var storeBuilding = {};
        storeBuilding.id = building.poi_id;
        storeBuilding.ch_name = building.ch_name;
        storeBuilding.img = building.buildings[0].pics[0].key;
        $scope.isLike = Localstorage.isLikeBuilding(storeBuilding);
      } else {
        var storeBuilding = {};
        storeBuilding.id = building.poi_id;
        storeBuilding.ch_name = building.ch_name;
        storeBuilding.img = './img/1.jpg';
        $scope.isLike = Localstorage.isLikeBuilding(storeBuilding);
      }


      $scope.toogleLikeBuilding = function(building) {
        if (global.uid) {
          $scope.isLike = !$scope.isLike;
          if ($scope.isLike === true) {
            var data = {
              poi_id: $route.current.params.bid,
              city_id: $route.current.params.cityid,
            }
            var url = API_PREFIX + '/api_test/favorite/malls/' + global.uid;
            $http.post(url, data).
            success(function(data, status, headers, config) {
              console.log("success post");
            }).error(function(data, status, headers, config) {
              console.log("error" + status);
            });
          } else {
            $http({
                method: 'DELETE',
                url: API_PREFIX + '/api_test/favorite/malls/' + global.uid + '/' + $route.current.params.bid,
              })
              .success(function(data, status, headers, config) {
                console.log("success delete");
              }).error(function(data, status, headers, config) {
                console.log("error" + status);
              });
          }
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
          console.log($scope.isLike);
        } else {
          $scope.isLike = !$scope.isLike;
          var storeBuilding = {};
          storeBuilding.id = building.poi_id;
          storeBuilding.cityid = $route.current.params.cityid;
          storeBuilding.ch_name = building.ch_name;
          storeBuilding.img = building.buildings[0].pics[0].key;
          Localstorage.toogleLikeBuilding(storeBuilding);
          var content;
          if ($scope.isLike) {
            content = "收藏成功";
          } else {
            content = "取消收藏";
          };
          showNotice(content);
        }


        // $scope.isLike = !$scope.isLike;
        // var storeBuilding = {};
        // storeBuilding.id = building.poi_id;
        // storeBuilding.ch_name = building.ch_name;
        // storeBuilding.img = building.buildings[0].pics[0].key;
        // Localstorage.toogleLikeBuilding(storeBuilding);
        // var content;
        // if ($scope.isLike) {
        //   content = "收藏成功";
        // } else {
        //   content = "取消收藏";
        // };
        // showNotice(content);
      };

      $scope.Gohistoryback = function() {
        $window.history.back();
      };

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.building.ch_name;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
    }
  ]);