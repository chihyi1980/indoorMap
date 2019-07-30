/**
 * Created by zhaop on 2016/1/27.
 */
angular
    .module('iScan')
    .controller('menuCtrl',['$scope','$location','$http','features',
        function($scope, $location, $http, features){
            $scope.features = features;
            $scope.curPath = $location.path();
        }
    ]);