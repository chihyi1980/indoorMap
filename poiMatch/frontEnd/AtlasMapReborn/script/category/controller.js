'use strict';

angular
  .module('atlas')
  .controller('categoryCtr', ['$scope', 'global', '$timeout', 'Localstorage', '$route', 'building', '$location', '$window',
    function($scope, global, $timeout, Localstorage, $route, building, $location, $window) {
      $scope.building = building;
      // console.log('------------')
      // console.log(building)
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $scope.htmlTitle = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      // console.log(like);
      $scope.cityId = $route.current.params.cityid;
      var catebpid;
      var searchhis;
      $scope.searchhis = Localstorage.getSearchHis();
      // console.log($scope.searchhis);
      $scope.showHis = false;
      $scope.searchmall = function(kword) {
        var keyword = encodeURIComponent(kword);
        var mallid = $scope.catebpid;
        // console.log(keyword)
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
          $scope.searchmall(keyword.toLowerCase());
          if (keyword) {
            var searchhis = Localstorage.getSearchHis();
            searchhis.push(keyword);
            searchhis = searchhis.slice(-7);
            Localstorage.setSearchHis(searchhis);
            $location.path('/searchinmall/' + mallid + '/' + keyword);
          }
        }
      }
      $scope.catebpid = $route.current.params.bid;
      $scope.cityId = $route.current.params.cityid;
      $scope.ngBlurHis = function() {
        $timeout(function() {
          $scope.showHis = false;
        }, 100);
      }

      $scope.$on('$viewContentLoaded', function() {
        var allheight = document.body.offsetHeight;
        document.getElementById("content").style.height = allheight + "px";
        $window.document.title = ($scope.htmlTitle || "商场通") + " " + $scope.building.ch_name + " 商户分类";
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