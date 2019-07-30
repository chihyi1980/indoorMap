angular
    .module('iScan')
    .controller('navCtrl',['$scope','$location','$http','features',
        function($scope, $location, $http, features){
            var loginOut_url = iScan_config.api_prefix + '/loginOut',
                user_online_url = iScan_config.api_prefix + '/user/isOnline';
            iScan_config.params.isAutoSearch = false;
            iScan_config.params.isIscanOnline = false;
            if(iScan_config.params.onlineTimer !== undefined){
                clearTimeout(iScan_config.params.onlineTimer);
            }
            (function(){
                var cookie = localStorage.getItem('!@#$%');
                $http.get(user_online_url)
                    .success(function(ret){
                        if(ret.status && cookie){
                            $scope.loginUser = cookie.split('&')[1];
                        }else{
                            $location.path('/login');
                        }
                    })
                $scope.logout = function(){
                    $http.get(loginOut_url);
                    localStorage.removeItem('iAd');
                    localStorage.removeItem('!@#$%');
                    localStorage.clear();
                    $location.path('/login');
                }
            })();
        }
    ]);
