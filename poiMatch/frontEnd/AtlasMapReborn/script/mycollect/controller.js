'use strict';

angular
  .module('atlas')
  .controller('mycollectCtrl', ['$scope', 'global', 'API_PREFIX', '$http', 'IMAGE_PREFIX', '$routeParams', 'Search', 'Localstorage', '$location', '$filter', 'Brand', 'Districts', '$window', '$anchorScroll', 'Subway', '$route',
    function($scope, global, API_PREFIX, $http, IMAGE_PREFIX, $routeParams, Search, Localstorage, $location, $filter, Brand, Districts, $window, $anchorScroll, Subway, $route) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };

        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      
      $scope.showiconnotice = false;
      $scope.likeShop = Localstorage.getLike().shops;
      $scope.likeBuilding = Localstorage.getLike().buildings;
      console.log($scope.likeShop)
      console.log($scope.likeBuilding)
      $scope.isShopNull = isNullObj($scope.likeShop);
      $scope.isBuildingNull = isNullObj($scope.likeBuilding);

      function isNullObj(obj) {
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            return false;
          }
        }
        return true;
      }

      $scope.uid = global.uid;

      if (global.uid) {
        console.log(1)
        $http({
          method: 'GET',
          url: API_PREFIX + '/api_test/favorite/' + global.uid
        }).success(function(data) {
          $scope.wxcollect = data;
          console.log($scope.wxcollect)
          $scope.likeWxShop = $scope.wxcollect.shops;
          $scope.likeWxBuilding = $scope.wxcollect.malls;
        });
      }


      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = "我的收藏";
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