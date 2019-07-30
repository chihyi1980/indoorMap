angular.module('Atlas')
    .factory('HttpRequestApi',['$http','$q',
        function ($http, $q) {
            return {
                getMalls: function(cityId){
                    var url;
                    if(cityId){
                        url = config.MALL_LIST_URL + '?cityId=' + cityId;
                    }else{
                        url = config.MALL_LIST_URL;
                    }
                    var deferred = $q.defer();
                    $http.get(url).success(function(ret){
                        deferred.resolve(ret.data);
                    });
                    return deferred.promise;
                }
            }
        }]);

angular.module('Atlas').directive("ngFileSelect",function() {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                $scope.file = (e.srcElement || e.target).files[0];
            });
        }
    }
});

//autoComplete of en_name in poi operate
angular.module('Atlas').directive("ngAutoComplete",function() {
    return {
        restrict: 'A',
        link: function ($scope, el, attrs) {
            if(attrs.ngAutoComplete == 'true'){
                el.bind("keyup focus click", function (e) {
                    if(e.preventDefault)e.preventDefault();
                    $('.autoCompleteExtender').remove();
                    var eleStr = '<ul class="autoCompleteExtender"></ul>';
                    $(this.parentNode).append(eleStr);
                    var brandUrl = attrs.name == 'ch_name' ? config.CNAME_LIST_URL : config.FNAME_LIST_URL;
                    $('.autoCompleteExtender').css({
                        top: $(e.target).position().top + 33
                    })
                    $('.autoCompleteExtender').html('');
                    if($(this).val()){
                        var prefix = $(this).val().replace(/^\s*|\s*$/g,'');
                        var oldPrefix = localStorage.getItem('fn-prefix');
                        if(oldPrefix == prefix){
                            showForeignList(JSON.parse(localStorage.getItem('fn-list')), attrs.name);
                            return ;
                        }else{
                            localStorage.setItem('fn-prefix',prefix);
                        }
                        $.post(brandUrl,{prefix: prefix},function(data){
                            if(data.result == 'succeed'){
                                if(data.data.length == 0){
                                    localStorage.setItem('fn-list',JSON.stringify([]))
                                    $('.autoCompleteExtender').hide();
                                    return;
                                }
                                var list = data.data.splice(0,9);
                                localStorage.setItem('fn-list',JSON.stringify(list))
                                showForeignList(list, attrs.name)
                            }else{
                                $('.autoCompleteExtender').hide();
                            }
                        })
                    }else{
                        $('.autoCompleteExtender').hide();
                    }
                });

                var showForeignList = function(list, type){
                    $('.autoCompleteExtender').html('');
                    list.forEach(function(brand){
                        var text = type == 'ch_name'? brand.chineseName : brand.foreignName;
                        var bStr = '<li brand-id="'+ brand._id +'">' + text + '</li>';
                        $('.autoCompleteExtender').append(bStr);
                        $('.autoCompleteExtender').show();
                    })
                }

                $('body').on('mousedown','.autoCompleteExtender li', function(){
                    $.post(config.GET_BRAND_URL, {brand_id:$(this).attr('brand-id')}, function(data){
                        if(data.result == 'succeed'){
                            var brand = data.data;
                            $scope.currentPoi["en_name"] = brand.foreignName;
                            $scope.currentPoi["displayName"] = brand.displayName;
                            $scope.currentPoi["alias"] = brand.alias;
                            $scope.currentPoi["website"] = brand.website;
                            $scope.currentPoi["email"] = brand.email;
                            $scope.currentPoi["sns"] = brand.sns;
                            $scope.currentPoi["brand_id"] = brand._id;
                            $scope.currentPoi["prodId"]  = brand.prodId;

                            var ch_name = brand.chineseName || brand.foreignName || brand.displayName;
                            if(ch_name){
                                $scope.currentPoi["ch_name"] = ch_name;
                            }
                            $scope.$apply();
                        }
                    })
                });

                el.bind('blur', function(e){
                    $('.autoCompleteExtender').remove();
                })
            }
        }
    }
});

angular.module('Atlas').filter('shopFilter',function(){
    return function(items, query){
        if(!query){
            return items;
        }
        var res = [],
            reg;
        angular.forEach(items,function(item){
            reg = '/'+ query +'/gi';
            if(item.ch_name.match(eval(reg)) || item.en_name.match(eval(reg))){
                res.push(item);
            }
        });
        return res;
    }
});
