var BASE_URL = '/poi';//'/poi';
var config = {
    LOGOUT_URL : BASE_URL + '/logout' ,
// poi op
    MALL_LIST_URL : BASE_URL + '/internal/api/mall/list',
    MALL_JSON1_URL : BASE_URL + '/internal/api/mall/json1',
    MALL_UPLOAD_URL :  BASE_URL + '/internal/api/mall/modify',
    MALL_ADD_URL :  BASE_URL + '/internal/api/mall/add',
    MALL_GET_URL: BASE_URL + '/internal/api/mall/getOne',
    POI_UPDATE_URL :  BASE_URL + '/internal/api/poi/modify',
    POI_GET_URL :  BASE_URL + '/internal/api/poi/detail',
    POI_ADD_URL :  BASE_URL + '/internal/api/poi/add',
    POI_REMOVE_URL :  BASE_URL + '/internal/api/poi/remove',
    SHOP_PRODID_SET: BASE_URL + '/map/shopProdId/update',

//map op
    FLOOR_IMG_REMOVE: BASE_URL + '/map/{floorId}/img',
    FLOOR_IMG_UPLOAD: BASE_URL + '/map/{floorId}/imgUpload',
    CONFIG_FILE_UPLOAD :  BASE_URL + '/map/configFile/upload',
    FACILITY_GET_URL :  BASE_URL + '/map/facility/get',
    MAP_JSON_GET :  BASE_URL + '/map/floor/getSimple',
    MAP_FAC_ADD :  BASE_URL + '/map/fac/add',
    MAP_TEXT_ADD :  BASE_URL + '/map/text/add',
    MAP_SHOP_ADD :  BASE_URL + '/map/shop/add',
    MAP_MARK_REMOVE :  BASE_URL + '/map/mark/remove',
    MAP_MARK_GET :  BASE_URL + '/map/mark/get',
    MAP_MARK_UPDATE :  BASE_URL + '/map/mark/update',

    MAP_BEACON_ADD: BASE_URL + '/map/beacon/add',
    MAP_BEACON_REMOVE: BASE_URL + '/map/beacon/remove',
    MAP_BEACON_GET: BASE_URL + '/map/beacon/listByFloor',
    MAP_BEACON_SAVE: BASE_URL + '/map/beacon/save',

    //add by chihyi 2017/10/19
    MAP_BEACON_START_SCAN: BASE_URL + '/map/beacon/StartScan',
    MAP_BEACON_STOP_SCAN: BASE_URL + '/map/beacon/StopScan',
    MAP_BEACON_SCAN_LEFT_NUM: BASE_URL + '/map/beacon/getScanLeftNum',


    MAP_SAVE_URL: BASE_URL + '/map/poi/save',
    FAC_GET_URL: BASE_URL + '/map/poi/getFac',
    ANCHOR_SAVE_URL: BASE_URL + '/map/anchor/save',
    ANCHOR_GET_URL: BASE_URL + '/map/anchor/get',

    PATH_GET_URL: BASE_URL + '/map/path/get',
    PATH_SAVE_URL: BASE_URL + '/map/path/save',

    FENCE_GET_URL: BASE_URL + '/map/fence/get',
    FENCE_SAVE_URL: BASE_URL + '/map/fence/save',

//autoCompleteExtender for shop
    FNAME_LIST_URL :  BASE_URL + '/api/brand/listByForeignNamePrefix',
    CNAME_LIST_URL :  BASE_URL + '/api/brand/listByChineseNamePrefix',
    GET_BRAND_URL :   BASE_URL + '/api/brand/getById',
    UPDATE_BRAND_URL :   BASE_URL + '/api/brand/modify',
    SHOP_LOGO_URL: BASE_URL + '/shop/logo/upload',
    SHOP_LOGO_REMOVE: BASE_URL + '/shop/logo/remove',

    GEO_POST_URL: BASE_URL + '/geoMatching',
    GEO_GET_URL: BASE_URL + '/getGeoInfo',

    EDITOR_GET_URL: BASE_URL + '/svg/get',
    EDITOR_POST_URL: BASE_URL + '/svg/update',

    icons :[
    'atlas-mom-baby', 'atlas-lift', 'atlas-stairs',
    'atlas-escalator', 'atlas-gate', 'atlas-question-down',
    'atlas-cashier-desk', 'atlas-parking', 'atlas-toilet',
    'atlas-toilet-man', 'atlas-toilet-woman', 'atlas-vip-service',
    'atlas-handicapped', 'atlas-taxi', 'atlas-ticket-service',
    'atlas-metro', 'atlas-atm'
    ],
    prods :['atlas-eat', 'atlas-drink', 'atlas-play',
        'atlas-household', 'atlas-life-service', 'atlas-food',
        'atlas-child-product', 'atlas-clothing-ornament', 'atlas-menswear',
        'atlas-womenswear', 'atlas-sport-leisure', 'atlas-bag-accessory',
        'atlas-cosmetic', 'atlas-electrical-equipment', 'atlas-digital-product',
        'atlas-furniture', 'atlas-stationery', 'atlas-jewellery',
        'atlas-clock-glass', 'atlas-meeting', 'atlas-sale', 'atlas-other'],

    //mallCities: {'上海':'53d5e4c85620fa7f111a3f67',  '北京': '54a0c5430a2313755106951c'},
    mallCities: null,
    attrsConfig: BASE_URL + '/public/attrsConfig/',
    aliases: false
};

var ATLAS_POI_CONFIG = config;
