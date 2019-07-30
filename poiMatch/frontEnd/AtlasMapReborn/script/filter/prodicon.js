'use strict';

angular.module('atlas')
    .filter('prodicon', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(prod) {
            switch (prod) {
                case 0:
                    return './img/食品.png';
                case 1:
                    return './img/drink.png';
                case 2:
                    return './img/play.png';
                case 3:
                    return './img/家用百货.png';
                case 4:
                    return './img/生活服务.png';
                case 5:
                    return './img/food.png';
                case 6:
                    return './img/儿童.png';
                case 7:
                    return './img/shoulian.png';
                case 8:
                    return './img/男装.png';
                case 9:
                    return './img/女装.png';
                case 10:
                    return './img/运动.png';
                case 11:
                    return './img/箱包.png';
                case 12:
                    return './img/化妆品.png';
                case 13:
                    return './img/电器.png';
                case 14:
                    return './img/数码.png';
                case 15:
                    return './img/家具.png';
                case 16:
                    return './img/办公.png';
                case 17:
                    return './img/饰品.png';
                case 18:
                    return './img/手表.png';
                case 19:
                    return './img/会议.png';
                case 20:
                    return './img/优惠.png';
                case 21:
                    return './img/其他.png';
            }
        };
    }]);