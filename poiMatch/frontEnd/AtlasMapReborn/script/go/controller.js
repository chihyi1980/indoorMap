'use strict';

angular
  .module('atlas')
  .controller('goCtrl', ['$scope', 'global', '$route', '$sce', '$window',
    function($scope, global, $route, $sce, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }

      var goloc = $route.current.params.goloc;
      var golat = $route.current.params.golat;
      var gomallname = $route.current.params.gomallname;
      $scope.gomallname = $route.current.params.gomallname;
      var goiframeurl = 'http://mo.amap.com/?q=' + golat + ',' + goloc + '&name=' + gomallname + '&dev=0';
      $scope.goiframeurl = $sce.trustAsResourceUrl(goiframeurl);
      console.log(goiframeurl);

      $scope.$on('$viewContentLoaded', function() {
        var allheight = window.screen.availHeight;
        document.getElementById("goiframe").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通")+ " " + $route.current.params.gomallname + " 室外地图";
      });
      $scope.$watch('$viewContentLoaded', function() {
        var allheight = window.screen.availHeight;
        document.getElementById("goiframe").style.height = allheight + "px";
      });
      window.addEventListener("resize", function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("goiframe").style.height = allheight + "px";
      });
    }
  ]);