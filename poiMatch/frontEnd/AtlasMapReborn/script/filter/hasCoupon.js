'use strict';

angular.module('atlas')
    .filter('hasCoupon', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(shops) {
            // console.log(shops)
            for (var i in shops) {
                if (shops[i].hasCoupon == true) {
                    // shops[i].push(-1);
                    // return 1;
                    console.log(1)
                        // shops.unshift(shops[i]);
                }
            };


            return shops;
        };
    }]);