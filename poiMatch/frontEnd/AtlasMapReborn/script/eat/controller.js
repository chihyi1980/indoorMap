'use strict';

angular
  .module('atlas')
  .controller('eatCtrl', ['$scope', 'global', 'searchHotkey', '$route','$window',
    function($scope, global, searchHotkey, $route, $window) {
      $scope.thisuid = null;
      if (!global.uid) {
        global.uid = $route.current.params.uid;
        $scope.thisuid = global.uid;
      };
        if(localStorage.getItem('sctReferrer')){
            var refer = localStorage.getItem('sctReferrer').split('_');
            $window.document.title = refer[0] == 'gmega'? 'GMEGA商场地图': '商场通';
        }
      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
        $scope.tabType = type;
      };
      console.log(searchHotkey);
      $scope.searchHotkey = searchHotkey.data;
      $scope.kword = $route.current.params.keyword;
    }
  ]);