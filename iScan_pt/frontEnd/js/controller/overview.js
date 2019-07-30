angular
    .module('iScan')
    .controller('overviewCtrl',['$scope','$location','$http',
        function($scope, $location, $http){

            //获取控制器leftMenu.js传递的参数值。
            $scope.$on('leftMenu', function(event, data){
                $scope.curPageType = data.curPageType;
                $scope.jMap = data.jMap;
                $scope.curJobsite = data.curJobsite;
                $scope.curDevice = data.curDevice;
                $scope.taggers = data.changeData;
            });

            //api查询url
            var prefix = iScan_config.api_prefix;
            //按时间段查询
            var analysis_period_url = prefix + '/analysis/period';
            //excel数据导出
            var tagger_export_url = prefix + '/analysis/exportToCsv';

            // bootstrap dateRang 控件
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
                opens: 'left'
            }, function(start, end) {
                $scope.currentDateRange = $('#datePicker').val();
            });

            //当天日期段
            $scope.currentDateRange = new Date().Format('yyyy-MM-dd') + ' ~ ' + new Date().Format('yyyy-MM-dd');
            $scope.isExport = false;

            //根据工地id去查询某段时间的analysis数据。
            $scope.searchDataByJobsiteId = function(){
                if($scope.curPageType == 'user') return;
                if(!$scope.curJobsite){
                    return alert('請在左側邊欄，選擇所要查询的場地！')
                }
                $('#overviewSearch').attr('disabled', true);
                var dateRange = $scope.currentDateRange.split(' ~ ');
                $http.post(analysis_period_url,{begin: dateRange[0], end:dateRange[1], id: $scope.curJobsite.id })
                    .success(function(ret){
                        $scope.taggers = ret;
                        if(ret && ret.length > 0){
                            $scope.isExport = true;
                        }
                        $('#overviewSearch').attr('disabled', false);
                    }).error(function(err) {
                        $('#overviewSearch').attr('disabled', false);
                    });
            };
            //根据用户id去查询某地时间内的analysis数据
            $scope.searchDataByUserId = function(){
                if($scope.curPageType == 'jobsite') return;
                if(!$scope.curDevice || ! $scope.curDevice.userId){
                    return alert('請在左側邊欄，選擇所要查詢的用户！')
                }
                $('#overviewSearch').attr('disabled', true);
                var dateRange = $scope.currentDateRange.split(' ~ ');
                $http.post(analysis_period_url,{begin: dateRange[0], end:dateRange[1], id:$scope.curDevice.userId})
                    .success(function(ret){
                        $scope.taggers = ret;
                        if(ret && ret.length > 0){
                            $scope.isExport = true;
                        }
                        $('#overviewSearch').attr('disabled', false);
                    }).error(function(err) {
                        $('#overviewSearch').attr('disabled', false);
                    });
            };

            //excel导出
            $scope.exportData = function(encode){
                if($scope.taggers && $scope.taggers.length > 0){
                    $http.post(tagger_export_url, {data: $scope.taggers, type: $scope.curPageType})
                        .success(function(ret){
                            if(ret && ret.url){
                                var file_url = prefix + ret.url + '?encode=' + (encode || '');
                                window.location = file_url;
                            }else{
                                alert('下载失敗！');
                            }
                        }).error(function(err){
                            alert('下载失敗！');
                        })
                }else{
                    alert('no data!');
                }
            };

            //展示高德地图
            $scope.showGDMap = function(lat, lon){
                GDMap(lon, lat);
                //打开模态框
                $('#attrDiv').addClass('openAttr');
            };
            //关闭高德地图
            $scope.closeGDMap = function(){
                //关闭模态框
                $('#attrDiv').removeClass('openAttr');
            };
            //table数据的样式
            $scope.getStyle = function(index){
                if(index % 4 == 1) return 'info';
                else if(index % 4 == 2) return 'danger';
                else if(index % 4 == 3) return 'success';
                else return 'warning';
            };
        }
    ]);
