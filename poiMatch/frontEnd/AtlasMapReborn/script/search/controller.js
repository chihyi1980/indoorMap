'use strict';

angular
  .module('atlas')
  .controller('searchCtrl', ['$scope', 'global','Localstorage', 'searchNext', 'searchAll', '$route', '$sce', '$filter', '$window',
    function($scope, global, Localstorage, searchNext, searchAll, $route, $sce, $filter, $window) {

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
      $scope.cityId = $route.current.params.cityid;
      $scope.kword = decodeURIComponent($route.current.params.keyword);
      $scope.pagedown = parseInt($route.current.params.p) + 1;
      $scope.pageup = parseInt($route.current.params.p) - 1;

      $scope.searchAll = searchAll.data;
      $scope.searchNext = searchNext.data;
      // console.log($scope.searchAll.shops)
      // console.log($scope.searchNext.shops)

      $scope.pagination_down = true;
      $scope.pagination_up = true;
      if ($scope.pageup < 1) {
        $scope.pagination_up = false;
      }
      console.log($scope.searchNext.shops.length == 0);
      if ($scope.searchNext.shops.length == 0) {
        $scope.pagination_down = false;
      }

      var gps = $filter('gps');
      for (var i in $scope.searchAll.shops) {
        $scope.searchAll.shops[i].location = gps($scope.searchAll.shops[i].loc);
        console.log($scope.searchAll.shops[i].location)
      }
      for (var i in $scope.searchAll.malls) {
        $scope.searchAll.malls[i].location = gps($scope.searchAll.malls[i].loc);
        console.log($scope.searchAll.malls[i].location)
      }
      sortSearchshop($scope.searchAll.shops);
      sortSearchshop($scope.searchAll.malls);

      function sortSearchshop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          //不需要排序的情况
          if (!shopArr[i].location || shopArr[i].location === '--') {
            return shopArr;
          }
          shopArr = shopArr.sort(function(a, b) {
            return a.location * 1 - b.location * 1;
          });
          return shopArr;
        }
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.kword;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });

      function sortShop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          shopArr = shopArr.sort(function(a, b) {
            return b.hasCoupon * 1 - a.hasCoupon * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.searchAll.shops) {
        var shops = $scope.searchAll.shops;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }

      function isEmpty(obj) {
        for (var name in obj) {
          return false;
        }
        return true;
      };
    }
  ]);