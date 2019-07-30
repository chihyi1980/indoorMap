'use strict';

angular
  .module('atlas')
  .controller('couponCtrl', ['$scope', 'global', '$route', '$sce', '$location', '$window',
    function($scope, global, $route, $sce, $location, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      $scope.couponUrl = $sce.trustAsResourceUrl($route.current.params.url);
      $scope.couponShopname = $route.current.params.shopname;

      var mallid = $route.current.params.mallid;
      var buildingid = $route.current.params.buildingid;
      var floorid = $route.current.params.floorid;
      var shopid = $route.current.params.shopid;
      var mallname = $route.current.params.mallname;

      var couponindoormap = 'MapReborn/indoorMap.html?' + mallid + '&' + buildingid + '/' + floorid + '/' + shopid + '?mallname=' + mallname;
      $scope.couponindoormap = couponindoormap;
      console.log(couponindoormap);

      $scope.$on('$viewContentLoaded', function() {
        var allheight = window.screen.availHeight;
        document.getElementById("couponiframe").style.height = allheight + "px";

        var url = location.href;
        console.log(url);
        if (!$route.current.params.reflash) {
          url = location.href + '&reflash=1';
          console.log(url)
          window.location.href = url;
          location.reload();
        }
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("couponiframe").style.height = allheight + "px";
        $window.document.title = ($sope.htmlTitle || "商场通") + " " + $route.current.params.mallname + $route.current.params.shopname + " 团购";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("couponiframe").style.height = allheight + "px";
      });
    }
  ]);