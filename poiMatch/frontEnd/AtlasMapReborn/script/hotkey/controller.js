'use strict';

angular
  .module('atlas')
  .controller('hotkeyCtrl', ['$scope', 'global', 'Localstorage', 'searchHotkey', '$route', 'Hotkey', '$window',
    function($scope, global, Localstorage, searchHotkey, $route, Hotkey, $window) {
      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
        $scope.tabType = type;
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

      $scope.swipegoback = function() {
        history.go(-1);
      };
      $scope.searchHotkey = searchHotkey.data;

      console.log($scope.searchHotkey);
      $scope.kword = $route.current.params.keyword;
      $scope.hPoi_id = $route.current.params.pid;

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通")+ " " + $route.current.params.keyword;
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
      for (var i in $scope.searchHotkey) {
        var shops = $scope.searchHotkey;
        var sortedShop;
        $scope.sortedShop = sortShop(shops);
      }
    }
  ]);