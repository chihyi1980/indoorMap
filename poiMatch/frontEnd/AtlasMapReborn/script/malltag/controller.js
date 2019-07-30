'use strict';

angular
  .module('atlas')
  .controller('mallTagCtrl', ['$scope', 'global', 'Localstorage', '$route', 'mallProd', '$location', '$window',
    function($scope, global, Localstorage, $route, mallProd, $location, $window) {

      $scope.kword = $route.current.params.keyword;
      $scope.bpid = $route.current.params.buildingid;
      $scope.cityId = $route.current.params.cityid;
      console.log($scope.bpid)

      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
        $scope.tabType = type;
      };
      $scope.mallprod = mallProd;
      console.log($scope.mallprod)
      $scope.goShop = function(poiid) {
        $location.path('/shop/' + $scope.cityId + '/' + poiid);
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.mallprod[0].building.ch_name;
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
      });

      $scope.ItHasCoupon = true;
      for(var i in $scope.malltag){
        if($scope.malltag[i].coupons.length > 0){
          $scope.ItHasCoupon = false;
        }
      }

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
      for (var i in $scope.mallprod) {
        var shops = $scope.mallprod;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }
    }
  ]);