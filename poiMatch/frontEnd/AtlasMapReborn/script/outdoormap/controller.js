'use strict';

angular
  .module('atlas')
  .controller('outdoormapCtrl', ['$scope', '$window',
    function($scope, $window) {
      $scope.tabType = 'shanghu';
      $scope.changeTab = function(type) {
          $scope.tabType = type;
        }
        // 步行路线


    }
  ]);