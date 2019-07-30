angular
    .module('iScan')
    .controller('eventsCtrl',['$scope','$http', '$location','$route',
        function($scope, $http, $location, $route) {
            var prefix = iScan_config.api_prefix;
            var events_list_url = prefix + '/events/list';
            $scope.getList = function(pNo){
                pNo = pNo || 1;
                $http.get(events_list_url + '?l=10&s='+ (pNo-1) * 10)
                    .success(function(data){
                        $scope.eventsList = data[1];
                        $scope.totalPage = data[0];
                        $scope.curPage = pNo;
                        $scope.pageNumInpt = pNo;
                    })
                    .error(function(){

                    })
            }
            $scope.getLocaleDateStr = function(dateStr){
                return moment(dateStr).format('YYYY-MM-DD HH:mm:ss')
            }

            $scope.prevPage = function(){
                if($scope.curPage && $scope.curPage > 1){
                    $scope.getList($scope.curPage - 1);
                }
            }
            $scope.nextPage = function(){
                if($scope.curPage && $scope.totalPage &&  $scope.curPage < $scope.totalPage){
                    $scope.getList($scope.curPage + 1);
                }
            }
            $scope.jumpPage = function(page){
                page = parseInt(page);
                if($scope.curPage && page == $scope.curPage) return;
                if(isNaN(page)) return alert('請輸入正確的頁碼');
                if($scope.totalPage && page <= $scope.totalPage && page >=1){
                    $scope.getList(page);
                }else{
                    alert('請輸入正確的頁碼');
                }
            }
        }
    ]);
