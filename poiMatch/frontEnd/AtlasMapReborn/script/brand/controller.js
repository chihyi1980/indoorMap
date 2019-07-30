'use strict';

angular
  .module('atlas')
  .controller('brandCtrl', ['$scope', 'global', 'Localstorage', 'searchBrand', '$route', '$filter', '$window',
    function($scope, global, Localstorage, searchBrand, $route, $filter, $window) {
      $scope.swipegoback = function() {
        history.go(-1);
      };
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      // console.log(searchBrand);
      $scope.searchBrand = searchBrand.data;
      $scope.kword = $route.current.params.keyword;
      $scope.bname = $route.current.params.name;
      $scope.cityId = $route.current.params.cityid;

      var gps = $filter('gps');
      for (var i in $scope.searchBrand) {
        $scope.searchBrand[i].location = gps($scope.searchBrand[i].loc);
      }

      function sortBrandshop(shopArr) {
        if (!shopArr.length) {
          return [];
        }
        for (var i in shopArr) {
          //不需要排序的情况
          if (!shopArr[i].location || shopArr[i].location === '--') {
            return mallArr;
          }
          shopArr = shopArr.sort(function(a, b) {
            return a.location * 1 - b.location * 1;
          });
          return shopArr;
        }
      }
      for (var i in $scope.searchBrand) {
        var shops = $scope.searchBrand;
        var sortedShop;
        $scope.sortedShop = sortBrandshop(shops);
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title =  ($scope.htmlTitle || "商场通") + " " + $scope.bname;
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