'use strict';

angular.module('atlas')
    .factory('Localstorage', [
        function() {
            return {
                getLike: function() {
                    var like = localStorage.getItem('like');
                    if (!like) {
                        like = {};
                        like.buildings = {};
                        like.shops = {};
                        this.setLike(like);
                        return like;
                    }
                    return JSON.parse(like);
                },
                setLike: function(like) {
                    like = JSON.stringify(like);
                    localStorage.setItem('like', like);
                },
                toogleLikeBuilding: function(storebuilding) {
                    var like = this.getLike();
                    var buildings = like.buildings;
                    var isLike = this.isLikeBuilding(storebuilding, like);
                    if (isLike) {
                        //delete
                        delete buildings[storebuilding.id]
                    } else {
                        //add
                        buildings[storebuilding.id] = storebuilding;
                    }
                    this.setLike(like);
                },
                isLikeBuilding: function(storebuilding, like) {
                    var isLike = false;
                    if (!like) {
                        like = this.getLike();
                    }
                    var buildings = like.buildings;
                    angular.forEach(buildings, function(building) {
                        if (building.id === storebuilding.id) {
                            isLike = true;
                        }
                    });
                    console.log(isLike);
                    return isLike;
                },
                isLikeShop: function(storeshop, like) {
                    var isLike = false;
                    if (!like) {
                        like = this.getLike();
                    }
                    var shops = like.shops;
                    angular.forEach(shops, function(shop) {
                        if (shop.id === storeshop.id) {
                            isLike = true;
                        }
                    });
                    return isLike;
                },
                toogleLikeShop: function(storeshop) {
                    var like = this.getLike();
                    var shops = like.shops;
                    var isLike = this.isLikeShop(storeshop, like);
                    if (isLike) {
                        //delete
                        delete shops[storeshop.id]
                    } else {
                        //add
                        shops[storeshop.id] = storeshop;
                    }
                    this.setLike(like);
                },
                setGPS: function(lat, lon) {
                    var gps = {};
                    gps.lat = lat;
                    gps.lon = lon;
                    gps = JSON.stringify(gps);
                    localStorage.setItem('gps', gps);
                },
                getGPS: function() {
                    var gps = localStorage.getItem('gps');
                    if (!gps) {
                        gps = {};
                        gps.lat = 0;
                        gps.lon = 0;
                        gps = JSON.stringify(gps);
                        localStorage.setItem('gps', gps);
                    }
                    return JSON.parse(gps);
                },
                setSearchHis: function(searchhis) {
                    function unique(arr) {
                        for (var i = 0; i < arr.length; i++)
                            for (var j = i + 1; j < arr.length; j++)
                                if (arr[i] === arr[j]) {
                                    arr.splice(j, 1);
                                    j--;
                                }
                        return arr;
                    }
                    searchhis = unique(searchhis).join(',');
                    localStorage.setItem('searchhis', searchhis);
                },
                getSearchHis: function() {
                    var searchhis = localStorage.getItem('searchhis');
                    if (!searchhis) {
                        searchhis = '';
                        localStorage.setItem('searchhis', '');
                    }
                    return searchhis.split(',');
                },
                removeSearchHis: function() {
                    localStorage.removeItem('searchhis');
                    return;
                }
            };
        }
    ]);