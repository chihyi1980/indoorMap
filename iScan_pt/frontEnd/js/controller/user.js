angular
    .module('iScan')
    .controller('userCtrl',['$scope','$location','$http','usersAll',
        function($scope, $location, $http, usersAll){

            var cookie = localStorage.getItem('iAd');
            if(+cookie !== 1){
                return $location.path('/home');
            }

            $scope.users = usersAll;
            $scope.showUserList = true;

            var prefix = iScan_config.api_prefix;
            var add_url = prefix + '/user/add';
            var edit_url = prefix + '/user/edit';

            $scope.addUser = function(){
                $scope.newUser = {};
                $scope.showUserList = false;
                $scope.isEdit = false;
            };

            $scope.cancelAdd = function(){
                $scope.showUserList = true;
            };

            $scope.saveAdd = function(){
                var newUser = trim($scope.newUser);
                $http.post(add_url, newUser)
                    .success(function(ret){
                        $scope.users.push(ret);
                        $scope.showUserList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('添加失败！');
                    })
            };

            $scope.editUser = function(user){
                $scope.newUser = user;
                $scope.curUser = user;
                $scope.showUserList = false;
                $scope.isEdit = true;
            };

            $scope.saveEdit = function(){
                var newUser = trim($scope.curUser);
                $http.post(edit_url, newUser)
                    .success(function(ret){
                        $scope.showUserList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('新增失敗！');
                    })
            }
        }
    ]);

var trim = function(obj){
    if(typeof(obj) == 'string'){
        return obj.replace(/^\s*|\s*$/g,'');
    }else{
        var newObj = {};
        for(var i in obj){
            if(typeof(obj[i]) == 'string'){
                newObj[i] = obj[i].replace(/^\s*|\s*$/g,'');
            }else{
                newObj[i] = obj[i];
            }
        }
        return newObj;
    }
};
