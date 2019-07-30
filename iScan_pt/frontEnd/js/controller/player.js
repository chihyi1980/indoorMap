angular
    .module('iScan')
    .controller('playerCtrl',['$scope','$http', '$location', 'beaconsAll','$route',
        function($scope, $http, $location, playersAll, $route){

            var prefix = iScan_config.api_prefix;
            var list_url = prefix + '/player/list';
            var add_url = prefix + '/player/add';
            var edit_url = prefix + '/player/edit';
            var remove_url = prefix + '/player/remove';

            $scope.players = playersAll[1];
            $scope.totalPages = playersAll[0];
            $scope.kw = decodeURIComponent(playersAll[2]);
            $scope.curPage = +$route.current.params.pageNo;
            var varyPageNo = function(total, curPage){
                var pageNums = new Array();
                if(total <= 5){
                    for(var i=1; i<= total;i++){
                        pageNums[i-1] = i;
                    }
                }else{
                    var t = total;
                    var j = curPage;
                    switch(j){
                        case 1:
                        case 2:
                        case 3:
                            pageNums = [1,2,3,4,5];
                            break;
                        case (t-1):
                        case t:
                            pageNums = [t-4,t-3,t-2,t-1,t];
                            break;
                        default:
                            pageNums = [j-2,j-1,j,j+1,j+2];
                    }
                }
                return pageNums;
            };

            $scope.pageNums = varyPageNo($scope.totalPages, $scope.curPage);
            var trim = function(obj){
                if(typeof(obj) == 'string'){
                    return obj.replace(/^\s*|\s*$/g,'');
                }else{
                    var newObj = {};
                    for(var i in obj){
                        if(typeof(obj[i]) == 'string'){
                            newObj[i] = obj[i].replace(/^\s*|\s*$/g,'');
                        }
                        if(typeof(obj[i]) == 'number'){
                            newObj[i] = obj[i];
                        }
                    }
                    return newObj;
                }
            };

            $scope.showPlayerList = true;
            //$scope.division = iScan_config.china;

            $scope.searchData = function(kw){
                if(!kw) kw = '';
                location.href = '#/player/1?'+ kw;
                $scope.kw = kw;
            };

            $scope.addPlayer = function(){
                $scope.newPlayer = {};
                $scope.address = {};
                $scope.showPlayerList = false;
                $scope.isAdd = true;
            };

            $scope.cancelAdd = function(){
                $scope.showPlayerList = true;
            };

            $scope.saveAdd = function(){
                console.log($scope.newPlayer)
                $http.post(add_url, trim($scope.newPlayer))
                    .success(function(ret){
                        $scope.players.push(ret);
                        $scope.showPlayerList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('新增失敗！');
                    })
            };

            $scope.editPlayer = function(player){
                $scope.newPlayer = player;
                $scope.showPlayerList = false;
                $scope.isAdd = false;
            };

            $scope.saveEdit = function(){
                $http.put(edit_url, trim($scope.newPlayer))
                    .success(function(ret){
                        $scope.showPlayerList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('保存失敗！');
                    })
            };

            $scope.removePlayer = function(player){
                if(confirm('確認删除該player嗎？')){
                    $http.delete(remove_url + '?id=' + player.id)
                        .success(function(ret){
                            var pos;
                            for(var i=0; i < $scope.players.length; ++i ){
                                if($scope.players[i].id == player.id){
                                    pos = i;
                                    break;
                                }
                            }
                            if(pos !== undefined){
                                $scope.players.splice(pos, 1);
                            }
                        }).error(function(err){
                            console.log(err);
                            alert('删除失敗！');
                        })
                }
            };
            $scope.selected = function(target) {
                target.style['color'] = '#428bca';
            };
            $scope.unselected = function(target) {
                target.style['color'] = '#000';
            }
        }
    ]);
