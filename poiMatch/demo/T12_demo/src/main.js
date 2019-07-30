/**
 * Created by zhaop on 2016/8/8.
 */
window.onload = function(){
    /*匹配工具上查看地图相关id*/
    var buildingName = 'T12 时尚购物中心';
    var buildingId = '55ff712fa21f7a1c21535fbf';
    var floors = [
        {FloorB1: '5600bfdea21f7a1c21536045'},
        {Floor1: '55ff7147a21f7a1c21535fc1'},
        {Floor2: '55ff7151a21f7a1c21535fc2'},
        {Floor3: '55ff7159a21f7a1c21535fc3'},
        {Floor4: '55ff715ea21f7a1c21535fc4'},
        {Floor5: '55ff7168a21f7a1c21535fc5'},
        {Floor6: '55ff7173a21f7a1c21535fc6'},
        {Floor7: '55ff7178a21f7a1c21535fc7'},
        {Floor8: '55ff717da21f7a1c21535fc8'},
        {Floor9: '55ff7182a21f7a1c21535fc9'},
        {Floor10: '55ff7187a21f7a1c21535fca'},
        {Floor11: '55ff7190a21f7a1c21535fcb'},
        {Floor12: '55ff7197a21f7a1c21535fcc'}
    ]

    /*--------------- 分割线 -----------------*/

    var headerTitle = document.querySelector('#header .title');
    var searchSwitch = document.querySelector('#header .search-switch');
    var searchBar = document.querySelector('#header .search-bar');
    var mapContainer = document.getElementById('mapContainer');
    var poiDetailDom = document.getElementById('poiDetail');
    var startBtn = document.getElementById('startBtn');
    var endBtn = document.getElementById('endBtn');
    var navBtn = document.getElementById('navBtn');
    var searchBtn = searchBar.querySelector('button');
    var searchKeyword = searchBar.querySelector('input');
    var searchResult = document.getElementById('searchResult');
    var searchContent = searchResult.querySelector('.content');
    var closeResult = searchResult.querySelector('span');

    var eventFunc = (function() {
        if ('ontouchstart' in window) {
            return {
                click: 'touchend'
            };
        } else {
            return {
                click: 'click'
            };
        }
    })();

    var jsonpCall = function(url, callback) {
        var script = document.createElement('script');
        script.setAttribute('src', url + '&callback=_jsonpCallback');
        document.body.appendChild(script);
        _jsonpCallback = function(data) {
            document.body.removeChild(script);
            if (data) {
                callback(data);
            } else {
                callback(null);
            }
        }
    };

    //page style init
    (function() {
        document.getElementById('header').style.height = '50px';
        document.getElementById('header').style.width =  mapContainer.style.width =  '100%';
        mapContainer.style.height = (document.body.clientHeight - 50) + 'px';
        headerTitle.textContent = buildingName;
        var isSearchBarShow = false;
        searchSwitch.addEventListener(eventFunc.click, function(){
            if(!isSearchBarShow){
                searchBar.style.display = 'block';
                isSearchBarShow = true;
            }else{
                searchBar.style.display = 'none';
                isSearchBarShow = false;
            }
        })
    })();
    /*------------------------------------------*/
    // 调用地图sdk
    var curFloor,
        navStartCoord = null,
        navEndCoord = null,
        curPoiCoord = null;;

    var mapSdk = new Atlas({
        width: mapContainer.offsetWidth,
        height: mapContainer.offsetHeight,
        floorList: floors,

        mapDiv: 'mapContainer',
        maxZoom: 15,
        minZoom: 0.5,
        initFloor: 'Floor1',
        serverHost: 'ap.atlasyun.com',
        initZoom : 1,
        initMarkPoi: 'xxx',
        enFloorUI: true,
        enFacUI: true,
        enBufferUI: true,
        poiClick: function (poi) {
            showDetal(poi)
            curPoiCoord = {x: poi.x, y: poi.y, floor: curFloor};
        },
        floorChange: function(floorName){
            curFloor = floorName;
        },
        initCallback: function () {

        }
    })
    var showDetal = function(poi){
        if(document.querySelector('.atlas-nav-bar')) return;
        poiDetailDom.style.display = 'block';
        poiDetailDom.querySelector('.poi').textContent = poi.name;
        poiDetailDom.querySelector('.floor').textContent = curFloor;
        if(!navStartCoord){
            startBtn.style['display'] = 'inline-block';
            endBtn.style['display'] = 'none';
        }else{
            startBtn.style['display'] = 'none';
            endBtn.style['display'] = 'inline-block';
        }
    }
    startBtn.addEventListener(eventFunc.click, function(e) {
        if(curPoiCoord){
            navStartCoord = curPoiCoord;
            curPoiCoord = null;
            startBtn.style['display'] = 'none';
            endBtn.style['display'] = 'inline-block';

        }else{
            alert('请点击poi!')
        }
    });
    endBtn.addEventListener(eventFunc.click, function(e) {
        if(curPoiCoord){
            navEndCoord = curPoiCoord;
            curPoiCoord = null;
        }else{
            alert('请点击poi!')
        }
    });
    navBtn.addEventListener(eventFunc.click, function(e) {
        if(mapSdk && navStartCoord && navEndCoord){
            mapSdk.setNavPath(navStartCoord,navEndCoord, true, function(data){
                navStartCoord = null;
                navEndCoord = null;
                poiDetailDom.style['display'] = 'none';
            });
        }
    });
    searchBtn.addEventListener(eventFunc.click, function(e){
        var kw = (searchKeyword.value || '').trim();
        if(!kw){
            alert('请输入商铺名')
        }else{
            var queryUrl = "http://ap.atlasyun.com/poi/shop/search?kw={kw}&bid={bid}"
                .replace('{kw}', encodeURIComponent(kw)).replace('{bid}', buildingId);
            jsonpCall(queryUrl, function(data){
                if(!data || data.length ==0){
                    searchResult.style.display = 'block';
                    searchContent.innerHTML = '<h3>暂无数据</h3>';
                }else{
                    searchContent.innerHTML = '';
                    while(searchContent.hasChildNodes()){
                        searchContent.removeChild(searchContent.firstChild)
                    }
                    var ul = document.createElement('ul');
                    data.forEach(function(item){
                        var li = document.createElement('li');
                        li.textContent = item.floor.name + ', ' + item.ch_name;
                        li.addEventListener(eventFunc.click, function(){
                            if(mapSdk){
                                mapSdk.setFloor(item.floor.name, function(){
                                    mapSdk.moveToPoiId(item.id);
                                    mapSdk.tagToPoiId(item.id);
                                })
                            }
                            searchResult.style.display = 'none';
                        })
                        ul.appendChild(li);
                    })
                    searchContent.appendChild(ul);
                    searchResult.style.display = 'block';
                }
            })
        }
    })
    closeResult.addEventListener(eventFunc.click, function(){
        searchResult.style.display = 'none';
    })
}