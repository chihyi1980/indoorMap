'use strict';

angular.module('atlas')
    .filter('prodname', ['IMAGE_PREFIX', function(IMAGE_PREFIX) {
        return function(prod) {
            switch (prod) {
                case 0:
                    return '吃';
                case 1:
                    return '喝';
                case 2:
                    return '玩';
                case 3:
                    return '家用百货';
                case 4:
                    return '生活服务';
                case 5:
                    return '食品';
                case 6:
                    return '儿童用品';
                case 7:
                    return '服装饰品';
                case 8:
                    return '男装';
                case 9:
                    return '女装';
                case 10:
                    return '运动休闲';
                case 11:
                    return '箱包皮具';
                case 12:
                    return '化妆品';
                case 13:
                    return '电器';
                case 14:
                    return '数码产品';
                case 15:
                    return '家具';
                case 16:
                    return '文化办公';
                case 17:
                    return '金银珠宝';
                case 18:
                    return '钟表眼镜';
                case 19:
                    return '会议';
                case 20:
                    return '促销特卖';
                case 21:
                    return '其它';
            }
        };
    }]);