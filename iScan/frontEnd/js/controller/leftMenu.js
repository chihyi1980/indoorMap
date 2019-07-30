angular
    .module('iScan')
    .controller('leftMenuCtrl',['$scope','$location','$http',
        function($scope, $location, $http){
            $scope.curPath = $location.path();
            if($scope.curPath == '/indoorMap'){
                //$('#userTab').remove();
            }
            //初始化页面类型。分为user和jobsite。会根据这两个维度查询分析数据。
            $scope.curPageType = 'jobsite';
            //api url
            var prefix = iScan_config.api_prefix;
            var jobsite_get_url = prefix + '/jobsite/all';
            var device_get_url = prefix + '/device/all';

            //切换页面类型
            $scope.changePageType = function(type){
                $scope.curPageType = type;
                $scope.address = null;
                $scope.setInstance();
                if(type == 'user'){
                    $scope.queryDevice();
                }else if(!$scope.jobsites){
                    $scope.queryJobsite();
                }
            };

            // 省市区json数据
            $scope.division = iScan_config.china;

            //工地的map数据。{id: name} <==>{工地id：工地名称}
            $scope.jMap = {};
            $http.get(jobsite_get_url + '?l=&s=', {cache: true})
                .success(function(ret){
                    ret[1].forEach(function(item){
                        $scope.jMap[item.id] = item.name;
                    });
                    $scope.setInstance();
                });

            //按分页查询工地。客户要求的临时加上的。
            $scope.queryJobsite= function(pageNum, kw, area){
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                var paramStr = '?l=10&s=' + (pNo - 1) * 10 + '&kw=' + (kw || '') + '&area=' + (area || '') + '&rd=' + Math.random();
                $http.get(jobsite_get_url + paramStr)
                    .success(function(ret){
                        $scope.jobsites = ret[1];
                        $scope.curPage = pNo;
                        $scope.totalPages = ret[0];
                        $scope.setInstance();
                    }).error(function(err){
                        $scope.jobsites = null;
                    })
            };
            //选择要查询的工地
            $scope.selectCurJobsite = function(jobsite){
                $scope.curJobsite = jobsite;
                $scope.setInstance();
            };

            //按分页查询用户
            $scope.queryDevice = function(pageNum, kw, area){
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                var paramStr = '?l=10&s=' + (pNo - 1) * 10 + '&kw=' + (kw || '') + '&area=' + (area || '') + '&rd=' + Math.random();
                $http.get(device_get_url + paramStr)
                    .success(function(ret){
                        $scope.devices = ret[1];
                        $scope.curPage = pNo;
                        $scope.totalPages = ret[0];
                    }).error(function(err){
                        $scope.devices = [];
                    })
            };

            //选择要查询的用户
            $scope.selectCurDevice = function(device){
                $scope.curDevice = device;
                $scope.setInstance();
            };
            //左菜单分页，跳转页面
            $scope.setLeftPageNum = function(kw, num){
                if(num > $scope.totalPages ){
                    num = $scope.totalPages
                }else if(num < 1){
                    num = 1;
                }
                $scope.searchData(kw, num);
            };

            //左菜单，查询，按地区、关键字来查询工地(jobsite)或工人(device)
            $scope.searchData = function(kw, num){
                var area;
                if($scope.address && $scope.address.province){
                    area = $scope.address.province + '|';
                    if($scope.address.city){
                        area = area + $scope.address.city + '|';
                    }
                    if($scope.address.district){
                        area = area + $scope.address.district;
                    }
                }
                if($scope.curPageType == 'jobsite'){
                    $scope.queryJobsite(num, kw, area);
                }else if($scope.curPageType == 'user'){
                    $scope.queryDevice(num, kw, area);
                }
            };
            //初始化时查询工地
            if($scope.curPageType == 'jobsite'){
                $scope.queryJobsite();
            }
            //向父控制器传递变量
            $scope.setInstance = function() {
                var instance1 = {
                    curPageType: $scope.curPageType,
                    jMap: $scope.jMap,
                    curJobsite: $scope.curJobsite || null,
                    curDevice: $scope.curDevice || null,
                    //切换查询维度（工地或工人），隐藏查询结果
                    changeData: null
                };
                $scope.$emit('leftMenu', instance1);
            };
        }
    ]);
