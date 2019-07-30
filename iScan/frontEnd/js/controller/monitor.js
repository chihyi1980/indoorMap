angular
    .module('iScan')
    .controller('monitorCtrl',['$scope','$location','$http',
        function($scope, $location, $http) {

            //获取控制器leftMenu.js传递的参数值。
            $scope.$on('leftMenu', function(event, data){
                $scope.curPageType = data.curPageType;
                $scope.jMap = data.jMap;
                $scope.curJobsite = data.curJobsite;
                $scope.curDevice = data.curDevice;
                $scope.isPageTypeChange = true;
            });

            $scope.cameraOptions = [];
            $scope.selectCamera = null;
            
            $scope.tagProxy = function(tagger){
                return {
                    time: new Date(tagger.time).Format('yyyy-MM-dd hh:mm:ss'),
                    cameraName: tagger.cameraName,
                    cameraId: tagger.cameraId,
                    userId: tagger.userId,
                    jobsiteId: tagger.jobsiteId
                };
            };

            //时间控件
            $('#datePicker').daterangepicker({
                dateLimit: {day:0},
                timePicker: true,
                timePickerIncrement: 1,
                format: 'YYYY-MM-DD HH:mm:ss',
                opens: 'left'
            }, function(start, end) {
                $scope.currentDateRange = $('#datePicker').val();
            });
            $scope.currentDateRange = new Date().Format('yyyy-MM-dd 00:00:00') + ' ~ ' + new Date().Format('yyyy-MM-dd hh:mm:ss');

            // api url
            var prefix = iScan_config.api_prefix;
            var camera_list_url = prefix + '/camera/list';
            var tag_get_byJobsite = prefix + '/camera/track/byJobsite';
            var tag_get_byUser = prefix + '/camera/track/byUser';

            $http.get(camera_list_url)
                .success(function(resp){
                    $scope.cameraOptions = resp || [];
                });

            $scope.videoOpen = function(obj){
                var time = new Date(obj.time).getTime();
                var videoUrl = 'http://{ip:port}/media/{videoId}.webm?pos={pos}&endPos={endPos}'
                    .replace('{ip:port}',iScan_config.cameraHost)
                    .replace('{videoId}', obj.cameraId)
                    .replace('{pos}', (+time - 20000))
                    .replace('{endPos}', (+time + 20000));
                $('#demoIframe').attr('src', videoUrl);
                $('#videoModal').ccModal({
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
            };
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
            //videoOpen();

            $scope.searchData = function(pageNum){
                $scope.isPageTypeChange = false;
                var time = $('#datePicker').val().split('~');
                var pNo = pageNum || 1;
                pNo = pNo < 1 ? 1: pNo;
                var queryCondition = {
                    start: time[0].trim(),
                    end: time[1].trim(),
                    limit: 10,
                    skip: (pNo-1) * 10
                };
                var queryUrl;
                if($scope.curPageType === 'user'){
                    if(!$scope.curDevice || ! $scope.curDevice.userId){
                        return alert('請在左側邊欄，選擇所要查詢的用户！')
                    }
                    queryUrl = tag_get_byUser;
                    queryCondition['userId'] = $scope.curDevice.userId;
                }else{
                    if(!$scope.curJobsite){
                        return alert('請在左側邊欄，選擇所要查詢的場地！')
                    }
                    queryUrl = tag_get_byJobsite;
                    queryCondition['jobsiteId'] = $scope.curJobsite.id;
                }
                if($scope.selectCamera){
                    queryCondition['cameraId'] = $scope.selectCamera.id;
                }
                $http.post(queryUrl, queryCondition)
                    .success(function(resp){
                        var tags = [];
                        $.each( resp.data || [], function(i, tagger){
                            tags.push({
                                time: new Date(tagger.time).Format('yyyy-MM-dd hh:mm:ss'),
                                cameraName: tagger.cameraName,
                                cameraId: tagger.cameraId,
                                userId: tagger.userId,
                                jobsiteId: tagger.jobsiteId
                            })
                        })
                        $scope.taggers = tags;
                        $scope.curPage = pNo;
                        $scope.totalPages = resp.total;
                        $scope.pageNums = varyPageNo(resp.total, pNo);
                     }).error(function(err){
                        console.log(err)
                    })
            };

            $scope.setPageNum = function(num){
                if(num > $scope.totalPages ){
                    num = $scope.totalPages
                }else if(num < 1){
                    num = 1;
                }
                $scope.searchData(+num);
            };
        }
    ]);


