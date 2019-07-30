
angular.module('iScan')
    .factory('HttpRequestApi', ['$http','$q',
        function ($http, $q) {
            var api_prefix = iScan_config.api_prefix;
            var user_get_url = api_prefix + '/user/all?';
            var beacon_get_url = api_prefix + '/beacon/all';
            var tagger_get_url = api_prefix + '/tagger/all';
            var device_get_url = api_prefix + '/device/all';
            var player_get_url = api_prefix + '/player/list';

            return {
                getAllUsers: function(){
                    var deferred = $q.defer();
                    $http.get(user_get_url).success(function(data){
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.resolve({status: 403});
                    });;
                    return deferred.promise;
                },
                getAllBeacons: function(pageNo, queryStr){
                    var kw = '', type = '';
                    if(queryStr){
                        kw = queryStr.split('&')[0]|| '';
                        type = queryStr.split('&')[1]|| '';
                    }
                    var deferred = $q.defer();
                    if(pageNo < 1) pageNo = 1;
                    var paramStr = '?l=10&s=' + (pageNo - 1) * 10 + '&kw=' + kw;
                    $http.get(beacon_get_url + paramStr).success(function(data){
                        data[2] = kw;
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.resolve({status: 403});
                    });
                    return deferred.promise;
                },
                getAllTaggers: function(pageNo){
                    var deferred = $q.defer();
                    if(pageNo < 1) pageNo = 1;
                    var paramStr = '?l=10&s=' + (pageNo-1)* 10;
                    $http.get(tagger_get_url + paramStr).success(function(data){
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.resolve({status: 403});
                    });;
                    return deferred.promise;
                },
                getAllDevices: function(pageNo, queryStr){
                    var kw = '', type = '';
                    if(queryStr){
                        kw = queryStr.split('&')[0]|| '';
                        type = queryStr.split('&')[1]|| ''
                    }
                    var deferred = $q.defer();
                    if(pageNo < 1) pageNo = 1;
                    var paramStr = '?l=10&s=' + (pageNo-1)* 10 + '&kw=' + kw;
                    $http.get(device_get_url + paramStr).success(function(data){
                        data[2] = kw;
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.resolve({status: 403});
                    });;
                    return deferred.promise;
                },
                getAllPlayers: function(pageNo, queryStr){
                    var kw = '', type = '';
                    if(queryStr){
                        kw = queryStr.split('&')[0]|| '';
                        type = queryStr.split('&')[1]|| '';
                    }
                    var deferred = $q.defer();
                    if(pageNo < 1) pageNo = 1;
                    var paramStr = '?l=10&s=' + (pageNo-1)* 10 + '&kw=' + kw;
                    $http.get(player_get_url + paramStr).success(function(data){
                        data[2] = kw;
                        deferred.resolve(data);
                    }).error(function(err){
                        deferred.resolve({status: 403});
                    });;
                    return deferred.promise;
                }
            }
        }]);

angular.module('iScan').value('features', iScan_config.features);

angular.module('iScan').filter('myFilter',function(){
    return function(items, query){
        if(!query.id && (!query.area || (query.area && !query.area.province))){
            return items;
        }
        if(query.id && !query.area){
            var res = [],
                reg;
            angular.forEach(items,function(item){
                reg = '/'+ query.id +'/gi';
                if(item.userId && item.userId.match(eval(reg))){
                    res.push(item);
                }
                if(item.name && item.name.match(eval(reg))){
                    res.push(item);
                }
            });
            return res;
        }
        if(!query.id && query.area){

            var ret = [],
                reg2, str;
            angular.forEach(items,function(item){
                str = query.area.province + '\\|';
                if(query.area.city){
                    str = str + query.area.city + '\\|';
                    if(query.area.district){
                        str = str + query.area.district;
                    }
                }
                reg2 =  '/^'+ str +'/gi';
                var abc = item.area.match(eval(reg2));
                if(item.area && abc){
                    ret.push(item);
                }
            });
            return ret;
        }
        if(query.id && query.area){
            var ret3 = [],ret4 = [],
                reg3,reg4, str3;
            angular.forEach(items,function(item){
                str = query.area.province + '\\|';
                if(query.area.city){
                    str3 = str3 + query.area.city + '\\|';
                    if(query.area.district){
                        str3 = str3 + query.area.district;
                    }
                }
                reg3 =  '/^'+ str3 +'/gi';
                var abc = item.area.match(eval(reg2));
                if(item.area && abc){
                    ret3.push(item);
                }
            });
            angular.forEach(ret3,function(item){
                reg4 = '/'+ query.id +'/gi';
                if(item.userId && item.userId.match(eval(reg4))){
                    ret4.push(item);
                }
                if(item.name && item.name.match(eval(reg4))){
                    ret4.push(item);
                }
            });
            return ret4;
        }
    }
});

angular.module('iScan').filter('iscanFilter',function(){
    return function(items, query){
        if(!query){
            return items;
        }else{
            var res = [],
                reg,
                str;
            angular.forEach(items,function(item){
                reg = '/'+ query +'/gi';
                if(item.iscanId && item.iscanId.match(eval(reg))){
                    res.push(item);
                }else{
                    str = item.area.replace('|', '').replace('|', '') + (item.address || '') + (item.desc || '');
                    if(str.match(eval(reg))){
                        res.push(item);
                    }
                }
            });
            return res;
        }
    }
});

angular.module('iScan').filter('jobsiteFilter',function(){
    return function(items, query){
        if(!query){
            return items;
        }else{
            var res = [],
                reg,
                str;
            angular.forEach(items,function(item){
                reg = '/'+ query +'/gi';
                if(item.name && item.name.match(eval(reg))){
                    res.push(item);
                }else{
                    str = item.area.replace('|', '').replace('|', '') + (item.address || '') + (item.desc || '');
                    if(str && str.match(eval(reg))){
                        res.push(item);
                    }
                }
            });
            return res;
        }
    }
});

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
            if(typeof(obj[i]) == 'object'){
                newObj[i] = obj[i];
            }
        }
        return newObj;
    }
};

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};