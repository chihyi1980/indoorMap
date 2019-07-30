//调用的高德地图sdk，根据经纬度展示其地图上的地理位置。
function GDMap(lon, lat){
    return null;
    var mapObj = new AMap.Map("iCenter", {
        view: new AMap.View2D({
            center:new AMap.LngLat(lon,lat),//地图中心点
            zoom:13 //地图显示的缩放级别
        })
    });

    var lnglatXY = new AMap.LngLat(lon,lat);
    function geocoder() {
        var MGeocoder;
        //加载地理编码插件
        AMap.service(["AMap.Geocoder"], function() {
            MGeocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            //逆地理编码
            MGeocoder.getAddress(lnglatXY, function(status, result){
                if(status === 'complete' && result.info === 'OK'){
                    geocoder_CallBack(result);
                }
            });
        });
        //加点
        var marker = new AMap.Marker({
            map:mapObj,
            icon: new AMap.Icon({
                image: "http://api.amap.com/Public/images/js/mark.png",
                size:new AMap.Size(58,30),
                imageOffset: new AMap.Pixel(-32, -0)
            }),
            position: lnglatXY,
            offset: new AMap.Pixel(-5,-30)
        });
        mapObj.setFitView();
    }
    //回调函数
    function geocoder_CallBack(data) {
        var address;
        address = data.regeocode.formattedAddress;
        document.getElementById("map-address").innerHTML = address;
    }

    geocoder();
    document.querySelector('.amap-logo').style['display'] = 'none';
    document.querySelector('.amap-copyright').style['display'] = 'none';
}