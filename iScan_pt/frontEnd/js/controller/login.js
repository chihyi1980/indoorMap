angular
    .module('iScan')
    .controller('loginCtrl',['$scope','$http','$location',
        function($scope, $http, $location){
            localStorage.clear();
            var loginUrl = iScan_config.api_prefix + '/login';
            $scope.login = function(){
                var user = $scope.user;
                $http.post(loginUrl,{ume:user.name, pwd: user.pwd})
                    .success(function(ret){
                        if(ret && ret.name == user.name){
                            if(ret.enabled){
                                $scope.errorMsg = '';
                                localStorage.setItem('!@#$%','1&' + user.name);
                                $location.path('/home');
                            }else{
                                $scope.errorMsg = 'Forbidden!';
                                localStorage.removeItem('!@#$%');
                            }
                            if(ret.isAdmin){
                                localStorage.setItem('iAd', '1');
                            }
                        }else{
                            $scope.errorMsg = '用户名或密碼錯誤!';
                            localStorage.removeItem('!@#$%');
                        }
                    }).error(function(err){
                        $scope.errorMsg = '系統錯誤:'+ err;
                    })
            }
        }
    ]);
