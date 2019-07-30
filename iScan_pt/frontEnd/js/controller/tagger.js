angular
    .module('iScan')
    .controller('taggerCtrl',['$scope','$location','$http','features',
        function($scope, $location, $http, features){

            $scope.features = features;

            //获取控制器leftMenu.js传递的参数值。
            $scope.$on('leftMenu', function(event, data){
                $scope.curPageType = data.curPageType;
                $scope.jMap = data.jMap;
                $scope.curJobsite = data.curJobsite;
                $scope.curDevice = data.curDevice;
                $scope.taggers = data.changeData;
            });

            //api 查询url
            var prefix = iScan_config.api_prefix;
            var list_by_jobsite_url = prefix + '/tagger/getByJobsiteId/';
            var list_by_device_url = prefix + '/tagger/getByUserId/';

            //bootstrap dateange 控件
            $('#datePicker').daterangepicker({
                dateLimit: {day: 90},
                ranges: {
                    '今天': [moment(), moment()],
                    '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    '近7天': [moment().subtract('days', 6), moment()],
                    '近30天': [moment().subtract('days', 29), moment()],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                timePicker: false,
                timePickerIncrement: 1,
                format: 'YYYY-MM-DD',
                opens: 'left',
                timePicker12Hour: false
            }, function(start, end) {
                $scope.currentDateRange = $('#datePicker').val();
            });
            $scope.currentDateRange = new Date().Format('yyyy-MM-dd') + ' ~ ' + new Date().Format('yyyy-MM-dd');

            $scope.division = iScan_config.china;
            $scope.isExport = false;

            //根据工地id查询数据
            $scope.searchDataByJobsiteId = function(pageNum){
                if($scope.curPageType == 'user') return;
                if(!$scope.curJobsite){
                    return alert('請在左側邊欄，選擇所要查詢的工地！')
                }
                $('#overviewSearch').attr('disabled', true);
                var curBeaconId = $scope.curJobsite.id;
                var dateRange = $scope.currentDateRange.split(' ~ ');
                var begin = dateRange[0] + ' 00:00:00',
                    end = dateRange[1] + ' 23:59:59';
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                $http.post(list_by_jobsite_url + curBeaconId,{begin: begin, end: end, l:10,s:(pNo-1) * 10})
                    .success(function(ret){
                        $scope.taggers = ret[1];
                        $scope.curPage = pNo;
                        $scope.totalPages = ret[0];
                        $scope.pageNums = varyPageNo(ret[0], pNo);
                        if(ret && ret.length > 0){
                            $scope.isExport = true;
                        }
                        $('#overviewSearch').attr('disabled', false);
                    }).error(function(err) {
                        $('#overviewSearch').attr('disabled', false);
                    });
            };

            $scope.tagProxy = function(tagger){
                var status = {
                    1: '異常',
                    2: '休眠',
                    0: '正常',
                    4: '警報',
                    6: '警報解除',
                };
                return {
                    time: new Date(tagger.createAt).Format('yyyy-MM-dd hh:mm:ss'),
                    status: status[tagger.blt_status] || '-',
                    uid: tagger.userId || tagger.blt_mac || '-',
                    coord: tagger.coord ? tagger.coord.x +" , " +  tagger.coord.y : '-'
                }
            };

            //根据用户id查询数据
            $scope.searchDataByUserId = function(pageNum){
                if($scope.curPageType == 'jobsite') return;
                if(!$scope.curDevice || ! $scope.curDevice.userId){
                    return alert('請在左側邊欄，選擇所要查詢的用户！')
                }
                $('#overviewSearch').attr('disabled', true);
                var curDeviceId = $scope.curDevice.userId;
                var dateRange = $scope.currentDateRange.split(' ~ ');
                var begin = dateRange[0] + ' 00:00:00',
                    end = dateRange[1] + ' 23:59:59';
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                $http.post(list_by_device_url + curDeviceId,{begin: begin, end: end, l:10, s:(pNo-1) * 10 })
                    .success(function(ret){
                        $scope.taggers = ret[1];
                        $scope.curPage = pNo;
                        $scope.totalPages = ret[0];
                        $scope.pageNums = varyPageNo(ret[0], pNo);
                        if(ret && ret.length > 0){
                            $scope.isExport = true;
                        }
                        $('#overviewSearch').attr('disabled', false);
                    }).error(function(err) {
                        $('#overviewSearch').attr('disabled', false);
                    });
            };

            //跳转到num页的查询数据
            $scope.setPageNum = function(num){
                if(num > $scope.totalPages ){
                    num = $scope.totalPages
                }else if(num < 1){
                    num = 1;
                }
                if($scope.curPageType == 'jobsite'){
                    $scope.searchDataByJobsiteId(+num);
                }else if($scope.curPageType == 'user'){
                    $scope.searchDataByUserId(+num);
                }
            };

            $scope.showMap = function(tag){
                var host = iScan_config.mapHost;
                var buildUrl = host  + '/indoorMap/build/detail?id=' + tag.floorId;
                jsonpCall(buildUrl, function (build) {
                    if (build) {
                        var floorList = build.floors;
                        var params = {
                            width: $('#iCenter').width(),
                            height: Math.max($('#iCenter').height(),$('#mapModal').height()),
                            cityId: "",
                            floorList: floorList,
                            mapDiv: 'iCenter',
                            maxZoom: 15,
                            minZoom: 0.5,
                            initFloor: '',
                            initZoom: 1,
                            initMarkPoi: '',
                            initCallback: function () {
                                var floorName = tempSdk.floorKeys[tag.floorId];
                                if(tempSdk.curFloor != floorName){
                                    tempSdk.setFloor(floorName)
                                }

                            },
                            poiClick: function (poi) {
                            },
                            enFloorUI: true,
                            enFacUI: false,
                            enBufferUI: true,
                            apiUrl: host + '/indoorMap/floor/simple',
                            floorChange: function (floorName) {
                                var floorId = tempSdk.floorObj[floorName];
                                tempSdk.removeTag();
                                if(floorId == tag.floorId){
                                    tempSdk.tagTo(tag.coord.x, tag.coord.y);
                                }
                            }
                        };
                        var tempSdk = new Atlas(params);
                    }
                });
                $('#mapModal').ccModal({
                    parent: '#modal-container',
                    collapsible: true,
                    minimizable: true,
                    left: '50%',
                    top: '30%',
                    onOpen: function(){


                    },
                    onClose: function(){

                    }
                })
            }
        }
    ]);
//页码展示部分，最多展示5个页码
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

