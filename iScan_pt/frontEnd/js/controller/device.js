angular
    .module('iScan')
    .controller('deviceCtrl',['$scope', '$http', '$location', 'devicesAll', '$route',
        function($scope, $http, $location, devicesAll, $route){

            $scope.battery = {
                2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAC4jAAAuIwF4pT92AAABLUlEQVR42mNgGKrgi61mwWc7jQYY/u6goUBTC0EWfLbRcABjO83+z/aa/1GxxgWY/BcHVQPqWmyveR7TQvz4k73Ghy+2GgkUOwBo2Hpk3xGLP9lpLAA5hOKoARlCrk/AoQF0DMUOINeQkeEAfHFMFweAyoCBdYC9xn5c8nRzACjLDWwI4MjvdHUAsHieQHcH/HdQEIAV06CiF8SnuQNAQQ2tCQ+gl//oJSZNHACpG3BVQJoPaO8AUGWDw3JQbkBOjDRLA8D4vg+3GGgprvqfZg4AxTXc93hzCA1zATDI3w+oA4C5oH5AHQAtAwbOAdDEOH9AHQBrKQ9odYxe/I62CanuAHCph6WqJWg5tMimuJeEKPWAnRNQDUgshhbT1OmIAn2B3BElBlOlW0YPAAD13N3D7Lxf8AAAAABJRU5ErkJggg==',
                3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAwklEQVR42mNgGKpAYMrtAoGptxvgePp9BdpaCLRAYPJtBzCecrtfcOrt/8hYYMqtC3D5qbcMqGvx1Fvn0S0kAn8A6kug3AFTb69H8R2xeMqtBeCQoTRqwIYAfQIJCaQ4x4eBDoDrhbIpcwDIR9Nu2xMb/CBHjDpg1AGjDhh1wKgDRh0w6oBRB4w6YNQB1HcAEA+IA4BN8vsCU+9MIFkf1MEU95JAfQJ412vq7QPEYqieBdTpngF9QXSnBI6p0C2jBwAAI60FhPEY5icAAAAASUVORK5CYII='
            };

            $scope.devices = devicesAll[1];
            $scope.totalPages = devicesAll[0];
            $scope.curPage = +$route.current.params.pageNo;
            $scope.kw = decodeURIComponent(devicesAll[2]);
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

            var prefix = iScan_config.api_prefix;
            var api_post_url = prefix + '/device/add';
            var api_put_url = prefix + '/device/';
            var api_delete_url = prefix + '/device/';
            $scope.showDeviceList = true;
            $scope.division = iScan_config.china;

            $scope.searchData = function(kw){
                if(!kw) kw = '';
                location.href = '#/device/1?'+ kw;
                $scope.kw = kw;
            };

            $scope.addDevice = function(){
                $scope.newDevice = {
                };
                $scope.showDeviceList = false;
                $scope.isAdd = true;
            };

            $scope.cancelAdd = function(){
                $scope.showDeviceList = true;
            };

            $scope.saveAdd = function(){
                $scope.newDevice.area = '';
                var newDevice = trim($scope.newDevice);
                newDevice.position = [+newDevice.lon, +newDevice.lat];
                $http.post(api_post_url, newDevice)
                    .success(function(ret){
                        $scope.devices.push(ret);
                        $scope.showDeviceList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('新增失敗！');
                    })
            };

            $scope.editDevice = function(device){
                var address = device.area && true ? device.area.split('|') : '';
                $scope.address = {
                    province:   address[0],
                    city: address[1],
                    district: address[2]
                };
                $scope.newDevice = device;
                $scope.showDeviceList = false;
                $scope.isAdd = false;
            };

            $scope.saveEdit = function(){
                $scope.newDevice.area = '';
                $http.put(api_put_url + $scope.newDevice.serialId, trim($scope.newDevice))
                    .success(function(ret){
                        $scope.showDeviceList = true;
                    }).error(function(err){
                        console.log(err);
                        alert('保存失敗！');
                    })
            };

            $scope.removeDevice = function(device){
                if(confirm('確認删除該device嗎？')){
                    $http.delete(api_delete_url + device.id)
                        .success(function(ret){
                            var pos;
                            for(var i=0; i < $scope.devices.length; ++i ){
                                if($scope.devices[i].id == device.id){
                                    pos = i;
                                    break;
                                }
                            }
                            if(pos !== undefined){
                                $scope.devices.splice(pos, 1);
                            }
                        }).error(function(err){
                            console.log(err);
                            alert('刪除失敗！');
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
