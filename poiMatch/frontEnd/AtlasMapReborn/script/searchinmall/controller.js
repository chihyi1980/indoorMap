'use strict';

angular
  .module('atlas')
  .controller('searchInMallCtrl', ['$scope', 'global', 'searchMall', '$route', '$window',
    function($scope, global, searchMall, $route, $window) {

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
      $scope.searchMall = searchMall.data;
      $scope.kword = $route.current.params.keyword;
      $scope.mpoiid = $route.current.params.mallId;

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
      for (var i in $scope.searchMall) {
        var shops = $scope.searchMall;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }
    }
  ]);