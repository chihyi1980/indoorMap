angular
    .module('iScan')
    .controller('analysisCtrl',['$scope','$location','$http',
        function($scope, $location, $http){
            //获取控制器leftMenu.js传递的参数值。
            $scope.$on('leftMenu', function(event, data){
                //页面类型。分为user和jobsite。会根据这两个维度查询分析数据。
                $scope.curPageType = data.curPageType;
                //工地的map数据。{id: name} <==>{工地id：工地名称}
                $scope.jMap = data.jMap;
                //当前左菜单所选择的工地
                $scope.curJobsite = data.curJobsite;
                //当前左菜单所选择的用户
                $scope.curDevice = data.curDevice;
                //当前条件下查询到的数据
                $scope.curDrawData = data.changeData;
            });

            //api查询url
            var prefix = iScan_config.api_prefix;
            //当天的分析数据
            var analysis_daily_url = prefix + '/analysis/daily';

            /*            日期控件部分   开始          */
            //当天日期
            var currentDay = new Date().toISOString().replace(/T.*/g, '');
            $scope.currentDate = currentDay;

            $('#dateSelect').val($scope.currentDate);
            $(document).ready(function() {
                $('#dateSelect')
                    .daterangepicker({
                        singleDatePicker: true
                    }, function(start, end) {
                        $scope.currentDate = $('#dateSelect').val();
                        $('#overviewSearch').attr('disabled', false);
                    });
            });
            /*         日期控件部分   结束         */

            //下拉选单，离开时间间隔：超过6分钟或15分钟以上离开就算作离开。
            $scope.minutes = [15,20,30];
            $scope.minutesObj = {15:'15', 20: '20', 30: '30'};

            //设置时间为今天
            $scope.setToToday = function(){
                $scope.currentDate = currentDay;
                $('#dateSelect').val($scope.currentDate);
                $('#overviewSearch').attr('disabled', false);
            };

            //根据工地id查询analysis数据。
            $scope.searchDataByJobsiteId = function(){
                if($scope.curPageType == 'user') return;
                if(!$scope.curJobsite){
                    return alert('請在左側邊欄，選擇所要查詢的場地！')
                }
                $http.post(analysis_daily_url,{date: $scope.currentDate, id:$scope.curJobsite.id, type: 'byJobsite'} )
                    .success(function(ret){
                        if(ret && ret.record && $scope.jMap){
                            $scope.errMsg = null;
                            $scope.curChartTitle = ret.date +' 場地（'+ $scope.jMap[ret.recordId] + '）人員概況';
                            var data;
                            if(!$scope.minuteSpace){
                                data = ret.record['20']
                            }else{
                                data = ret.record[$scope.minutesObj[$scope.minuteSpace]];
                            }
                            $scope.curDrawData = data;
                            $scope.curChartType = 'bar';
                            drawBarChart(data, $scope.curChartTitle);
                        }else{
                            $scope.errMsg = 'no data!';
                            $scope.curChartTitle = null;
                            $scope.curDrawData = null;
                        }
                    }).error(function(err) {
                        $scope.errMsg = 'Error:' + err;
                    });
            };

            //根据用户id查询analysis数据
            $scope.searchDataByUserId = function(){
                if($scope.curPageType == 'jobsite') return;
                if(!$scope.curDevice || ! $scope.curDevice.userId){
                    return alert('請在左側邊欄，選擇所要查詢的人員！')
                }
                $http.post(analysis_daily_url,{date: $scope.currentDate, id:$scope.curDevice.userId, type: 'byUser'})
                    .success(function(ret){
                        if(ret && ret.record && $scope.jMap){
                            $scope.errMsg = null;
                            $scope.curChartTitle = ret.date + ' 人員（' + ret.recordId + '）出勤狀況';
                            var data;
                            if(!$scope.minuteSpace){
                                data = ret.record['20']
                            }else{
                                data = ret.record[$scope.minutesObj[$scope.minuteSpace]];
                            }
                            $scope.curDrawData = data;
                            $scope.curChartType = 'bar';
                            drawBarChart(data, $scope.curChartTitle);
                        }else{
                            $scope.errMsg = 'no data!';
                            $scope.curChartTitle = null;
                            $scope.curDrawData = null;
                        }
                    }).error(function(err) {
                        $scope.errMsg = 'Error:' + err;
                    });
            };

            //画甘特图
            $scope.drawBarChart = function(){
                if($scope.curChartType == 'bar') return;
                $scope.curChartType = 'bar';
                drawBarChart( $scope.curDrawData, $scope.curChartTitle );
            };

            //画圆饼图
            $scope.drawCakeChart = function(){
                if($scope.curChartType == 'cake') return;
                $scope.curChartType = 'cake';
                drawCakeChart( $scope.curDrawData, $scope.curChartTitle );
            };

            //画柱状图
            $scope.drawPillarChart = function(){
                if($scope.curChartType == 'pillar') return;
                $scope.curChartType = 'pillar';
                drawPillarChart( $scope.curDrawData, $scope.curChartTitle );
            };

        }
    ]);

//使用highCharts
var drawPillarChart = function(source, title){
    if(!source || !title){
        return;
    }

    //制造柱状图所需要数据。-------开始
    var data = [],
        tempList;
    for(var i= 0; i < source.YList.length; ++i){
        tempList = source.data[source.YList[i]];
        var value = 0;
        for(var j = 0; j < tempList.length; ++j){
            if(tempList[j].type == 0 || j == 0){
                continue;
            }else{
                value += tempList[j].value - tempList[j-1].value;
            }
        }
        data.push([source.YList[i], value])
    }
    //-----------------------结束，同下
    $('#chart-render').highcharts({
        chart: {
            type: 'column',
            margin: [ 50, 50, 100, 80]
        },
        title: {
            text: title
        },
        xAxis: {
            categories:source.YList,
            labels: {
                rotation: 0,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    fontWeight: 'bold'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '單位（小時）'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function(){
                var time = this.point.y,
                    hour = parseInt(time),
                    minute = parseInt((+time - hour) * 60),
                    str;
                if(hour > 0){
                    str = '<b>' + this.point.name + '</b><br/>出勤' + hour + '小時' + minute + '分鐘';
                }else{
                    str = '<b>' + this.point.name + '</b><br/>出勤' + minute + '分鐘';
                }
                return str;
            }
        },
        credits:{
            enabled: true,
            text: '數據來源iScan'
        },
        series: [{
            name: 'Population',
            data: data,
            dataLabels: {
                enabled: true,
                rotation: 0,
                color: '#666699',
                align: 'right',
                x: 0,
                y: 0,
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif',
                    fontWeight: 'bold'
                },
                formatter: function(){
                    var time = this.point.y,
                        hour = parseInt(time),
                        minute = parseInt((+time - hour) * 60),
                        str;
                    if(hour > 0){
                        str = hour + '時' + minute + '分';
                    }else{
                        str = minute + '分';
                    }
                    return str;
                }
            }
        }]
    });
};

var drawCakeChart = function(source, title){
    if(!source || !title){
        return;
    }
    var data = [],
        tempList;
    for(var i= 0; i < source.YList.length; ++i){
        tempList = source.data[source.YList[i]];
        var value = 0;
        for(var j = 0; j < tempList.length; ++j){
           if(tempList[j].type == 0 || j == 0){
               continue;
           }else{
               value += tempList[j].value - tempList[j-1].value;
           }
        }
        data.push([source.YList[i], value])
    }
    $('#chart-render').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: title
        },
        tooltip: {
            formatter: function(){
                var time = this.point.y,
                    hour = parseInt(time),
                    minute = parseInt((+time - hour) * 60),
                    str;
                if(hour > 0){
                    str = '<b>' + this.point.name + '</b><br/>出勤' + hour + '小時' + minute + '分鐘';
                }else{
                    str = '<b>' + this.point.name + '</b><br/>出勤' + minute + '分鐘';
                }
                return str;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function(){
                        var time = this.point.y,
                            hour = parseInt(time),
                            minute = parseInt((+time - hour) * 60),
                            str;
                        if(hour > 0){
                            str = '<b>' + this.point.name + '</b>：出勤' + hour + '小时' + minute + '分钟';
                        }else{
                            str = '<b>' + this.point.name + '</b>：出勤' + minute + '分钟';
                        }
                        return str;
                    }
                }
            }
        },
        credits:{
            enabled: true,
            text: '數據來源iScan'
        },
        series: [{
            type: 'pie',
            name: '在場時長',
            data: data
        }]
    });
};

var drawBarChart = function(source, title){
    if(!source || !title){
        return;
    }
    var data = [],
        tempList;
    var tempData = [];
    for(var i= 0; i < source.YList.length; ++i){
        tempData[i] = 0;
    }
    tempData = JSON.stringify(tempData);
    for(var i= 0; i < source.YList.length; ++i){
        tempList = source.data[source.YList[i]];
        for(var j = 0; j < tempList.length; ++j){
            var temp = {},
                end = {};
            var index = i;
            if(tempList[j].type === 0){
                temp.color = '#FFFFFF';
                temp.myType = 0;
            }
            if(tempList[j].type === 1){
                temp.color = '#a4ad45';
                temp.myType = 1;
            }
            temp.name = source.YList[i];

            var tData = JSON.parse(tempData);
            if(j > 0){
                tData[index] = tempList[j].value - tempList[j-1].value;
                temp.myMin = tempList[j-1].value;
                temp.myMax = tempList[j].value;
            }else{
                tData[index] = tempList[j].value;
                temp.myMin = 0;
                temp.myMax = tempList[j].value;
            }
            temp.data = tData;
            data.unshift(temp);
            if(j == tempList.length - 1){
                end.color = '#FFFFFF';
                end.name = source.YList[i];
                var eData = JSON.parse(tempData);
                eData[index] = 24 - tempList[j].value;
                end.data = eData;
                end.myType = 0;
                end.myMin = tempList[j].value;
                end.myMax = 24;
                data.unshift(end);
            }
        }
    }
    $('#chart-render').highcharts({
        chart: {
            type: 'bar',
            height: source.YList.length > 2 ? source.YList.length * 60 : source.YList.length * 100 + 60,
            width: $('#chart-display').width()
        },
        title: {
            text: title
        },
        credits:{
            enabled: true,
            text: '數據來源iScan'
        },
        xAxis: {
            categories: source.YList
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0,
            max: 24,
            labels:{
                step: 1,
                formatter: function(){
                    return this.value + ':00';
                }
            },
            type: 'datetime',
            tickWidth: 1
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: data,
        tooltip:{
            formatter: function(){
                var index = this.series.index,
                    curTip = data[index];
                if(curTip.myType == 0){
                    return curTip.name + '<br/>不在場';
                }else{
                    var end = curTip.myMax;
                    var begin = curTip.myMin;
                    var endMinute =  JSON.stringify(parseInt((end - parseInt(end)) * 60));
                    var beginMinute = JSON.stringify(parseInt((begin - parseInt(begin)) * 60));
                    if(endMinute.length == 1){
                        endMinute = '0' + endMinute;
                    }
                    if(beginMinute.length == 1){
                        beginMinute = '0' + beginMinute;
                    }
                    var endTime = parseInt(end) + ':' + endMinute;
                    var beginTime = parseInt(begin) + ':' + beginMinute;
                    var  tipText = '<b>' + curTip.name + '</b><br/>進場時間：' + beginTime + '<br/>離場時間：'+ endTime;
                    return  tipText;
                }
            }
        }
    });
};
