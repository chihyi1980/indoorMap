(function(global){
    var parent = global.prototype;
    // 覆盖sdk的方法
    parent.__poiData = {};
    parent._setFontDivSize = function(){
        var  self = this,
            zoom = self.scroller.__zoomLevel,
            poiDivs = self.__poiDivs || [],
            degree = -self.scroller.__rotateDegree;
        for(var i = 0, len = poiDivs.length; i < len; ++i){
            if(poiDivs[i].tagName == 'svg') continue;
            var curDom = poiDivs[i],
                coordinate = curDom.getAttribute('coordinate'),
                className = curDom.className,
                isTag = (className.indexOf('atlas-tag') > -1) ? true : false,
                isImg = (className.indexOf('atlas-img') > -1) ? true : false;
            if(self.__navigation && curDom == self.__navigation.dom){
                continue;
            }

            coordinate = coordinate.split('&');
            var position = self.getMarkerPosition(coordinate[0], coordinate[1], zoom);
            curDom.style['left'] = position.left + 'px';
            curDom.style['top'] = position.top + 'px';
            curDom.style['display'] = '';
            //self._setTransform(curDom, degree, isTag)
            curDom.style[self.__vendorPrefix + 'TransformOrigin'] = '50% 50%';
            if(isTag || isImg){
                var diffHeight = curDom.offsetHeight / 2,
                    cos = Math.cos(-degree * Math.PI / 180),
                    sin = Math.sin(-degree * Math.PI / 180),
                    diffTop = Math.round(-diffHeight * cos ) - (diffHeight - 10),// 5 = tag的高度/2（30） - poi的高度/2（20）; 10=poi的高度/2
                    diffLeft = Math.round(-diffHeight * sin);
                curDom.style[self.__vendorPrefix + 'Transform'] = 'translate('+(diffLeft) +'px,'+(diffTop) +'px) rotate(' + degree +'deg)';
            }else{
                curDom.style[self.__vendorPrefix + 'Transform'] = 'rotate(' + degree +'deg)';
            }
        }
    };

    parent._markBehavior = function(){
        var self = this,
            marks = self.textDiv.children;
        for(var i= 0;i < marks.length; ++i){
            marks[i].addEventListener('click',function(e){
                e.stopPropagation();
            })
        }
    };
    parent._setMarker = function(marker){
        var self = this,
            textDiv = self.textDiv,
            res = self.getMarkerPosition(marker.x, marker.y),
            left = res.left,
            top = res.top,
            item;
        item = document.createElement('div');
        if(marker.type){
            item.setAttribute('type', marker.type);

            if(marker.type == 'fac'){
                item.className = marker.className + ' atlas-fac';
                item.setAttribute('title', marker.title);
            }
            if(marker.type == 'shop'){
                item.className = 'atlas-shop glyphicon glyphicon-map-marker';
                item.innerHTML = marker.text;
                item.setAttribute('prodId', marker.prodId);
            }
            if(marker.type == 'text'){
                item.className = 'atlas-text';
                item.innerHTML = marker.text;
            }
            if(marker.type == 'beacon'){
                item.className = 'atlas-beacon speech-outer';
                item.innerHTML = '<span class="speech">'+ marker.text + '</span>';
                item.setAttribute('title', marker.name);
            }
        }
        item.style.cssText = "position:absolute; top:" + top + "px; left:" + left + "px;z-index:" + self.__mapZIndex.poi;
        if(marker.coordinate) item.setAttribute('coordinate', marker.coordinate);
        if(marker.id) item.setAttribute('uniqueId', marker.id);
        if(marker.saz) item.setAttribute('saz', marker.saz);
        textDiv.appendChild(item);
    };
    parent._addText = function(){
        var self = this,
            floor = self.curFloor,
            texts = self.svg.floors[floor].text;
        self.__poiData.text = [];
        texts.forEach(function(text){
            var marker = {
                type: 'text',
                x: text[0],
                y: text[1],
                text: text[3],
                coordinate: text[0] + '&' + text[1],
                saz : text[2]
            };
            if(!myStorage.getItem('isPathDraw')){
                self._setMarker(marker);
            }
            var txt = {
                x: text[0],
                y: text[1],
                saz: text[2],
                txt: text[3]
            }
            self.__poiData.text.push(txt)
        });
    };

    parent._addFac = function(){
        var self = this,
            floor = self.curFloor,
            facs = self.svg.floors[floor].fac;
        self.__poiData.fac = [];
        facs.forEach(function(fac){
            var marker = {
                type: 'fac',
                x: fac[0],
                y: fac[1],
                className: 'atlas ' + self.icons[fac[3]],
                title: fac[4] || '',
                coordinate: fac[0] + '&' + fac[1],
                id: fac[3],
                saz: fac[2]
            };
            if(myStorage.getItem('isPathDraw')){
                if(+fac[3] == 1 || +fac[3] == 2 || +fac[3] == 3){
                    self._setMarker(marker);
                }
            }else{
                self._setMarker(marker);
            }

            var fc = {
                x: fac[0],
                y: fac[1],
                saz: fac[2],
                type: fac[3],
                text: fac[4]
            };
            self.__poiData.fac.push(fc);
        });
    };
    parent._addShop = function(){
        var self = this,
            floor = self.curFloor,
            shops = self.svg.floors[floor].shops;
        self.__poiData.shops = [];
        self.__poiData.matchedShopsId = [];
        shops.forEach(function(shop){
            var marker = {
                type: 'shop',
                x: shop[0],
                y: shop[1],
                text: shop[4],
                coordinate: shop[0] + '&' + shop[1],
                className: 'atlas ' + self.prods[shop[5]],
                id: shop[3],
                saz: shop[2],
                prodId: shop[5]
            };
            if(!myStorage.getItem('isPathDraw')){
                self._setMarker(marker);
            }

            var shp = {
                x: shop[0],
                y: shop[1],
                saz: shop[2],
                id: shop[3],
                name: shop[4],
                prodId: shop[5]
            }
            self.__poiData.shops.push(shp);
            self.__poiData.matchedShopsId.push(shop[3]);
        });
    };

    parent.addFac = function(fac){
        var self = this;
        var marker = {
            type: 'fac',
            x: fac.x,
            y: fac.y,
            className: 'atlas ' + self.icons[fac.type],
            id: fac.type,
            saz: fac.saz || '',
            title: fac.text || '',
            coordinate: fac.x + '&' + fac.y
        };
        self._setMarker(marker);
        self._setFontDivSize();
    };

    parent.addText = function(text){
        var self = this;
        var marker = {
            type: 'text',
            x: text.x,
            y: text.y,
            text: text.txt,
            id: '',
            saz: text.saz,
            coordinate: text.x + '&' + text.y
        };
        self._setMarker(marker);
        self._setFontDivSize();
    };
    parent.addShop = function(shop){
        var self = this;
        var marker = {
            type: 'shop',
            x: shop.x ,
            y: shop.y ,
            text: shop.name || '空',
            id: shop.id,
            saz: shop.saz,
            coordinate: shop.x + '&' + shop.y
        };
        if(typeof(shop.prodId) != 'undefined'){
            marker.prodId = shop.prodId
        }
        self._setMarker(marker);
        self._setFontDivSize();
    };

    parent.getXAndY = function(left, top){
        var self = this,
            zoom = self.scroller.__zoomLevel,
            originLeft = self.__svgOriginalLeft,
            originTop = self.__svgOriginalTop,
            res = {};
        if(!left || !top){
            return {x:0,y:0}
        }
        res.x = Math.round(((+left + 5) / zoom - originLeft) / self.__svgScale);
        res.y = Math.round(((+top + 5) / zoom - originTop) / self.__svgScale);
        return res;
    };

    parent._getFloorData = function(floorId, callback) {
        var self = this;
        if(!self.options['apiUrl']){return;}
        var apiUrl = self.options['apiUrl'] + '?callback=AtlasCallback&id=',
            url = apiUrl + floorId,
            script = document.createElement('script');
        script.setAttribute('src', url);
        document.body.appendChild(script);
        AtlasCallback = function (data) {
            if (data.result == 'succeed') {
                var floorData = JSON.parse(ATLASENCRPY.decrypt('ap.atlasyun.com', data.data));
                //var floorData = localMapData.data;
                self._floorData = floorData;
                try{
                    document.body.removeChild(script);
                }catch(e){}

                callback(true);
            } else {
                self._floorData = null;
                callback(null)
            }
        }
    };

    parent._addBeacon = function(){
        if(myStorage.getItem('isPathDraw')){
            return;
        }
        var self = this;
        if(!self.options['beacons']){return;}
        var beacons = self.options['beacons'];
        self.__poiData.beacons = [];
        beacons.forEach(function(beacon){
            if(beacon.matched){
                var marker = {
                    type: 'beacon',
                    x: beacon.x,
                    y: beacon.y,
                    text: 'B',
                    name: beacon.name,
                    coordinate: beacon.x + '&' + beacon.y,
                    id: beacon.id
                };
                self._setMarker(marker);
                var beacon = {
                    id: beacon.id,
                    x: beacon.x,
                    y: beacon.y,
                    txt: beacon.name
                }
                self.__poiData.beacons.push(beacon)
            }
        })
    }
    parent.addBeacon = function(beacon){
        var self = this;
        var beacons = self.options['beacons'];
        var marker = {
            type: 'beacon',
            id: beacon.id,
            x: beacon.x,
            y: beacon.y,
            text: 'B',
            name: beacon.name,
            coordinate: beacon.x + '&' + beacon.y
        };
        self._setMarker(marker);
        self._setFontDivSize();
    }
    parent.tagToPoiId = function(poiId) {
        var self = this,
            selector = '#' + self.mapDivId + ' .atlas-text div[uniqueId="' + poiId + '"]',
            curDom = document.querySelector(selector);
        if (curDom) {
            var coordinate = curDom.getAttribute('coordinate').split('&');
            self.tagTo(coordinate[0], coordinate[1]);
        } else {
            self.removeTag();
            console.log('Not found poi with id( "' + poiId + '" )!');
        }
    };

    parent.resetMark = function() {
        var self = this;
        self._removeEmphasize();
        self.removeTag();
        self.removeImgs();
        self.textDiv.innerHTML = '';
        self._addText();
        self._addFac();
        self._addShop();
        self._addBeacon();
        self._markBehavior();
        if(self.__navigation){
            self.setNavigationUI(self.__navigation.x, self.__navigation.y, self.__navigation.radius);
        }
        self.__poiDivs = self.textDiv.children;

        if(myStorage.getItem('isPathDraw') || myStorage.getItem('isFenceDraw')){
            var pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            self.textDiv.appendChild(pathSvg);
            self.pathSvg = pathSvg;
            self.mapDiv.style['backgroundColor'] = '#7C7C7C';
            self.svgDom.style['backgroundColor'] = '#FFF';

            self.pathSvg.setAttribute('style', self.svgDom.getAttribute('style'));
            self.pathSvg.setAttribute('viewBox', self.svgDom.getAttribute('viewBox'));
            self.pathSvg.style['backgroundColor'] = 'transparent';
            self.pathSvg.style['border'] = 'solid 2px green';
            var zIndex = 1;
            if(myStorage.getItem('isFenceDraw')){
                zIndex = 999;
            }
            self.pathSvg.style['zIndex'] = zIndex;
        }else{
            self.mapDiv.style['backgroundColor'] = '#FFF'
        }
    };
    parent._updateSvgStyle = function(){
        var self = this;
        self.svgDom.style['width'] = '' + (self.__svgOriginalWidth * self.scroller.__zoomLevel) + 'px';
        self.svgDom.style['height'] = '' + (self.__svgOriginalHeight * self.scroller.__zoomLevel) + 'px';
        self.svgDom.style['left'] = '' + (self.__svgOriginalLeft * self.scroller.__zoomLevel) + 'px';
        self.svgDom.style['top'] = '' + (self.__svgOriginalTop * self.scroller.__zoomLevel) + 'px';
        self.compassDiv.style[self.__vendorPrefix + 'TransformOrigin'] = '50% 50%';
        self.compassDiv.style[self.__vendorPrefix + 'Transform'] = 'rotate(' + (self.scroller.__rotateDegree - 26) +'deg)';
        self._updateNavigation();
        if(self.pathSvg){
            self.pathSvg.setAttribute('style', self.svgDom.getAttribute('style'));
            self.pathSvg.setAttribute('viewBox', self.svgDom.getAttribute('viewBox'));
            self.pathSvg.style['backgroundColor'] = 'transparent';
            self.pathSvg.style['border'] = 'solid 2px green';
            var zIndex = 1;
            if(myStorage.getItem('isFenceDraw')){
                zIndex = 999;
            }
            self.pathSvg.style['zIndex'] = zIndex;
            var children = self.pathSvg.children;
            var zoomLv = self.scroller.__zoomLevel * self.__svgScale;
            if(children){
                for(var i = 0, len = children.length; i < len; ++i){
                    if(children[i].tagName == 'circle'){
                        children[i].style['strokeWidth'] = 1 / zoomLv;
                        children[i].setAttribute('r', 4 / zoomLv)
                    }else{
                        children[i].style['strokeWidth'] = 2 / zoomLv;
                    }
                }
            }
        }
    };

    parent._initData = function() {
        var self = this,
            floorList = self.floorList;
        var extraInitFloor;
        floorList.forEach(function(item) {
            var key = Object.keys(item)[0];
            self.floorObj[key] = item[key];
            if(!extraInitFloor){
                extraInitFloor = item[key];
            }
        });
        if(self.floorObj[self.initFloor]){
            self._getFloorData(self.floorObj[self.initFloor], function(res){
                if(res){
                    self._initialize();
                }else{
                    console.log('There is no map data!');
                    self.__noData = true;
                }
            });
        }else{
            self._getFloorData(extraInitFloor, function(res){
                if(res){
                    self._initialize();
                }else{
                    console.log('There is no map data!');
                    self.__noData = true;
                }
            });
        }
    };
})(Atlas);
