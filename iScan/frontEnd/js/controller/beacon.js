angular
    .module('iScan')
    .controller('beaconCtrl',['$scope','$http', '$location', 'beaconsAll','$route',
        function($scope, $http, $location, beaconsAll, $route){
            console.log(beaconsAll)
            $scope.beacons = beaconsAll[1];
            $scope.totalPages = beaconsAll[0];
            $scope.kw = decodeURIComponent(beaconsAll[2]);
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

            var prefix = iScan_config.api_prefix;
            var api_post_url = prefix + '/beacon/add';
            var api_put_url = prefix + '/beacon/';
            var api_delete_url = prefix + '/beacon/';
            var beacon_new_id = prefix + '/beacon/new/id';
            var updateRf_url = prefix + '/updateRf';
            $scope.showBeaconList = true;
            $scope.division = iScan_config.china;

            $scope.searchData = function(kw){
                if(!kw) kw = '';
                location.href = '#/beacon/1?'+ kw;
                $scope.kw = kw;
            };

            $scope.addBeacon = function(){
                $http.get(beacon_new_id)
                    .success(function(ret){
                        $scope.newBeacon = {iscanId: ret.id};
                        $scope.address = {};
                        $scope.showBeaconList = false;
                        $scope.isAdd = true
                    }).error(function(err){
                        console.log(err);
                        alert('error: get authList failed！');
                    })
            };

            $scope.cancelAdd = function(){
                $scope.showBeaconList = true;
            };

            $scope.saveAdd = function(){
                if(!checkWifiIdFormat( $scope.newBeacon.beaconId)){
                    return alert('藍牙mac填寫格式錯誤!')
                }
                $scope.newBeacon.area = '';
                $http.post(api_post_url, trim($scope.newBeacon))
                    .success(function(ret){
                        $http.get(updateRf_url)
                            .success(function(){
                                $scope.beacons.push(ret);
                                $scope.showBeaconList = true;
                            }).error(function(err){
                                console.log(err);
                                alert('更新RF失敗！');
                            })

                    }).error(function(err){
                        console.log(err);
                        alert('新增失敗！');
                    })
            };

            $scope.editBeacon = function(beacon){
                var address = beacon.area && true ? beacon.area.split('|') : '';
                $scope.newBeacon = beacon;
                $scope.address = {
                    province:   address[0],
                    city: address[1],
                    district: address[2]
                };
                $scope.showBeaconList = false;
                $scope.isAdd = false;
            };

            $scope.saveEdit = function(){
                $scope.newBeacon.area = '';
                $http.put(api_put_url + $scope.newBeacon.beaconId, trim($scope.newBeacon))
                    .success(function(ret){
                        $scope.showBeaconList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('保存失敗！');
                    })
            };

            $scope.removeBeacon = function(beacon){
                if(confirm('確認删除該beacon嗎？')){
                    $http.delete(api_delete_url + beacon.beaconId)
                        .success(function(ret){
                            var pos;
                            for(var i=0; i < $scope.beacons.length; ++i ){
                                if($scope.beacons[i].beaconId == beacon.beaconId){
                                    pos = i;
                                    break;
                                }
                            }
                            if(pos !== undefined){
                                $scope.beacons.splice(pos, 1);
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

var checkWifiIdFormat = function(str){
    return !!str.match(/^([a-zA-Z0-9]{2}:){5}[a-zA-Z0-9]{2}$/g)
};