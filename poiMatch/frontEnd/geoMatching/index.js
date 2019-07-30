var mapJsonpCallback;
var jsonpCall = function(url, callback) {
    var script = document.createElement('script');
    script.setAttribute('src', url + '&callback=mapJsonpCallback');
    document.body.appendChild(script);
    mapJsonpCallback = function(data) {
        if (data.result == 'succeed') {
            callback(data.data);
        } else {
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        }
        document.body.removeChild(script);
    }
};
/******************** add by zhaop **********/
// 指定floorId
var floorId = localStorage.getItem('curFloorIdOfAtlas') || '11';
$(window).bind('beforeunload',function(){
    return '若有数据未保存，将会丢失！';
});

$(window).bind('unload', function(){
    localStorage.removeItem('curFloorIdOfAtlas');
});
/********************  end  *****************/

/*
    API - /api/mapeditor/geo/:floorId
    method: GET - {shape, geoInfo: {clon, clat, width, height, rotation}}
    method: POST - {clon, clat, width, height, rotation}
*/
//var actionPrefix = 'http://ap.atlasyun.com/api/mapeditor/geo/';

// 定义POST方法 
// demo方法(需要跨域) 需要更改
var postGeoinfo = function(formBody) {
    $.ajax({
        type: 'POST',
        url: config.GEO_POST_URL,//旧的：actionPrefix + floorId
        data: {floorId: floorId, data: formBody},//旧的：formBody
        success: function(data){
            console.log(data);
            alert('配准成功');
        },
        error: function(data){
            console.log(data);
        }
    });
};

(function(){

    /* SVG support check */
    if (!SVG.supported)
        return alert('浏览器不支持SVG，使用最新的Chrome, Firefox浏览器可以解决问题');

    /* 
        Request geo infos of a floor
        @param {stirng} floorId
        @param {requestCallback} callback - The callback that handles the response
    */
    function getPathAttr(floorId, callback) {
        jsonpCall(config.GEO_GET_URL + '?floorId=' + floorId, function(ret) {
            if(ret) return callback(ret);
            callback('');
        });
        /*
        jsonpCall(actionPrefix + floorId + '?1=1', function(data) {
            if(data) return callback(data);
            callback('');
        });*/
    }

    /* 
        SVG
        @doc http://documentup.com/wout/svg.js#create-an-svg-document
        @plugin draggy - https://github.com/jillix/svg.draggy.js
        @plugin select - https://github.com/fuzzyma/svg.select.js
        @plugin resize - https://github.com/fuzzyma/svg.resize.js
        Some changes have been applied on these plugins.
    */
    var $svgdiv, dataHandler;
    
    $svgdiv = $('#drawing');

    dataHandler = function(data) {
        if(!data || !data.shape) return alert('楼层外边框数据不存在或者传入了错误的楼层ID');

        /* 高德地图初始化 */
        var viewOption, mapOption;
        viewOption = {
            zoom: 18,
            rotation: 0
        };
        mapOption = {
            lang: 'zh_cn', 
            isHotspot: false, 
            rotateEnable: false
        };
        // reproduce if geo info exists
        if(data.geoInfo) {
            viewOption.zoom = 18;
            viewOption.center = new AMap.LngLat(data.geoInfo.clon, data.geoInfo.clat);
        }
        var view2D = new AMap.View2D(viewOption);
        mapOption.view = view2D;
        var map = new AMap.Map('map-container', mapOption);
        map.plugin(['AMap.MapType'], function () {
            var type = new AMap.MapType({ defaultType: 0, showRoad: true });
            map.addControl(type);
        });
        // add by zhaop
        try{
            addAutoSearch(map);
        }catch (e){}


        /* SVG */
        var svg, pathAttr, path;
        svg = new SVG('drawing').size('100%', '100%');
        // update by zhaop, for rect
        if(/([x=|y=|width=|height=]+)/g.test(data.shape)){
            eval('shapeStr={'+data.shape.replace(/=+/g, ':').replace(/\s+/g, ',') +'}');
            pathAttr = shapeStr;
            pathAttr['fill'] = '#73E473';
            pathAttr['fill-opacity'] = '0.3';
            pathAttr['stroke'] = 'green';
            pathAttr['stroke-width'] = 2;
            path = svg.rect().attr(pathAttr);
        }else{
            pathAttr = {fill: '#73E473', 'fill-opacity': '0.3', stroke: 'green', 'stroke-width': 2};
            path = svg.path(data.shape).attr(pathAttr);
        }

        var owidth = Math.round(path.bbox().width);
        var oheight = Math.round(path.bbox().height);
        $('#originWH').parent().show();
        $('#originWH').text('宽:'+ owidth + 'px, 高:' + oheight + 'px');
        // better view resize if first matching
        if(!data.geoInfo || !data.geoInfo.scale) {
            var bbox = path.bbox();
            var width = bbox.width;
            var height = bbox.height;
            if(width > 300 || height > 300) {
                if(width > height) {
                    height = height * 300 / width;
                    width = 300;
                } else {
                    width = width * 300 / height;
                    height = 300;
                }
                path.size(width, height);
            }
        }
        // apply plugins
        path.select().resize();
        path.draggy();

        // start | pause matching 
        $('#button-edit').on('click', function(e) {
            switchButton($(this)) ? startMatching() : pauseMatching();
        });
        // end matching & post data
        $('#button-end-edit').on('click', function(e) {
            endMatching();
        });

        // if geo info exists,
        // do size, move & rotation
        if(data.geoInfo) {
            var resolution, geoInfo; 
            resolution= map.getResolution();
            geoInfo = data.geoInfo;
            $('#originWH').parent().show();
            $('#originWH').text('宽:'+ geoInfo.owidth + 'px, 高:' + geoInfo.oheight + 'px');
            $('#winput').attr('placeholder', geoInfo.width);
            $('#hinput').attr('placeholder', geoInfo.height);
            var pw = Math.round(geoInfo.width / resolution);
            var ph = Math.round(geoInfo.height / resolution);

            var cx = geo2pixel(geoInfo.clon, geoInfo.clat).x;
            var cy = geo2pixel(geoInfo.clon, geoInfo.clat).y;

            var ro = isNaN(Math.floor(+geoInfo.rotation)) ? 0 : Math.floor(+geoInfo.rotation);
            path
            .size(pw, ph)
            .center(cx, cy)
            .rotate(ro, cx, cy);

            $('#button-edit').click();
        }
        
        function startMatching() {
            $svgdiv.addClass('matching');
        }
        function pauseMatching() {
            $svgdiv.removeClass('matching');

            var formBody = collectData();
            // debug
            $('#map-info').html(
                '中心点: [' + formBody.clon+' ,' + formBody.clat +  '], 宽:' + formBody.width.toFixed(2) + '米, 高: ' + formBody.height.toFixed(2) + ' 米'
            );
        }
        function endMatching() {
            var formBody = collectData();
            formBody.width = +$('#winput').val() || formBody.width;
            formBody.height = +$('#hinput').val() || formBody.height;
            postGeoinfo(formBody);
        }
        function collectData() {
            var cx, cy, clon, clat, width, height, pixelWidth, pixelHeight, rotation, mapResolution;

            // rotation center pixel point
            cx = path.rbox().cx;
            cy = path.rbox().cy;
            // rotation center geo point
            var cgeo = pixel2geo(cx, cy);
            clon = cgeo.lon;
            clat = cgeo.lat;
            // 当前比例尺 meter/pixel
            mapResolution = map.getResolution();
            // bbox rect in pixel
            pixelWidth = path.bbox().width;
            pixelHeight = path.bbox().height;
            // bbox physical width & height, 楼层外框未旋转的实际长、宽 (meter)
            width = (pixelWidth * mapResolution).toFixed(3);
            height = (pixelHeight * mapResolution).toFixed(3);
            // angle of rotation, 与经线的偏角
            rotation = path.transform().rotation % 360;

            // what we need - floor.frame.geoInfo = {width, height, rotation, clon, clat}
            return {
                width: +width,
                height: +height,
                rotation: isNaN(Math.floor(+rotation))? '0' : Math.floor(+rotation).toString(),
                clon: clon,
                clat: clat,
                owidth: +owidth,
                oheight: +oheight
            }
        }
        function switchButton($btn) {
            if($btn.hasClass('disable')) {
                $btn.data('matching', 'false');
                $btn.val('开始编辑');
                $btn.removeClass('disable');
                return false;
            } else {
                $btn.data('matching', 'true');
                $btn.val('暂停编辑');
                $btn.addClass('disable');
                return true;
            }
        }
        function pixel2geo(x, y) {
            var geo = map.containTolnglat(new AMap.Pixel(x, y));
            return {
                lon: geo.getLng(),
                lat: geo.getLat()
            }
        }
        function geo2pixel(lon, lat) {
            var pixel = map.lnglatTocontainer(new AMap.LngLat(lon,lat));
            return {
                x: pixel.getX(),
                y: pixel.getY()
            }
        }

        //add by zhaop
        window.updateCustomWidthHeightInput = function(e){
            var tempData = collectData();
            $('#winput').attr('placeholder', tempData.width);
            $('#hinput').attr('placeholder', tempData.height);
        }
    }

    /* Exec */
    getPathAttr(floorId, dataHandler);

})(floorId, postGeoinfo);

//custom width height,add by zhaop
$('#customeWidthHeight input[type="text"]').on('input propertychange', function(){
    if($(this).val() && isNaN(+$(this).val())){
        if(/([\d+|\d+\.\d+]+)/g.test($(this).val())){
            $(this).val(RegExp.$1);
        }else{
            $(this).val('');
        }
    }
})