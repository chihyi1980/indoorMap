(function(global){
    var parent = global.prototype;
    var isMouseLeaveOrEnter = function (e, handler) {
        if (e.type != 'mouseout' && e.type != 'mouseover') return false;
        var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
        while (reltg && reltg != handler)
            reltg = reltg.parentNode;
        return (reltg != handler);
    };
    parent.setPersonnelLocus = function(data){
        var self = this,
            zIndex = self.__mapZIndex.info,
            zoom = self.scroller.__zoomLevel;
        if(!data || !data.length) return;
        data.forEach(function(item){
            var wd = Math.max((item.userId || '').length * 12 ,60);
            var info = self.addWindowInfo({content:item.userId,coords:item.coords,offset: item.offset,size:{width:wd}, arrows: true});
            info.addEventListener('mouseover', function(e){
                info.style['zIndex'] = zIndex + 1;
            });
            info.addEventListener('mouseout', function(e){
                if(isMouseLeaveOrEnter(e, this)){
                    info.style['zIndex'] = zIndex;
                }
            })
        });
        self._setFontDivSize();
    };

    parent.setPersonnelLocus2 = function(data){
        var self = this,
            zIndex = self.__mapZIndex.info,
            zoom = self.scroller.__zoomLevel,
            drawScale = self.__drawScale;
        if(!data || !data.length) return;
        var pathD = 'M';
        var randCach = {};
        var offsetMax = Math.floor(Math.min(self.__svgOriginalWidth, self.__svgOriginalHeight) / 2),
            offsetMin = -offsetMax,
            offsetConst = Math.floor(offsetMax / 10);
        var getScmd = function(start, end){
            var key = [start.x,start.y,end.x, end.y].join('_');
            if(!randCach[key] || randCach[key] == undefined){
                randCach[key] = {
                    plus: 0,
                    add: 0
                }
            }
            var mid = {
                x: ((+start.x) + (+end.x)) / 2,
                y: ((+start.y) + (+end.y)) / 2
            };
            if(randCach.plus  < offsetMin){
                randCach[key].plus -= Math.ceil(Math.random() * 10);
            }
            if(randCach.add > offsetMax){
                randCach[key].add += Math.ceil(Math.random() * 10);
            }
            if(start.x == end.x && start.y == end.y){
                return ' L' + [end.x, end.y].join(',');
            }else if(start.x < end.x){
                randCach[key].plus -= offsetConst;
                mid.x += randCach[key].plus;
                mid.y += randCach[key].plus;
            }else if(start.x == end.x){
                if(start.y < end.y){
                    randCach[key].add += offsetConst;
                    mid.x += randCach[key].add;
                    mid.y += randCach[key].add;
                }else{
                    randCach[key].plus -= offsetConst;
                    mid.x += randCach[key].plus;
                    mid.y += randCach[key].plus;
                }
            }else{
                randCach[key].add += offsetConst;
                mid.x += randCach[key].add;
                mid.y += randCach[key].add;
            }
            return ' L' + [start.x, start.y].join(',') +' S' + [mid.x, mid.y, end.x, end.y].join(',')
        };
        for(var i=0,len=data.length; i < len; ++i){
            var item = data[i];
            var info = self.addWindowInfo({content:item.userId,coords:item.coords,offset: 0,size:{width: 60}, arrows: false});
            self.addText({
                x: item.coords.x,
                y: item.coords.y,
                content: '●',
                color: 'red'
            });
            if(i == 0){
                pathD += [item.coords.x, item.coords.y].join(',');
            }
            if(i == len- 1) continue;
            pathD += getScmd(item.coords, data[i+1].coords);
        }
        console.log(pathD);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var sw = (2 / drawScale).toFixed(3);
        path.setAttribute('d', pathD);
        path.setAttribute('id', 'track-path');
        path.setAttribute('style', 'fill: #FFFFF; stroke: #6faac7; stroke-width: '+ sw + 'px; fill-opacity: 0;stroke-dasharray:20;stroke-linecap:round;');
        self.gDom.appendChild(path);

        self._setFontDivSize();
    };

    parent.setAlarm = function(x, y, title){
        var self = this,
            zoom = self.scroller.__zoomlevel,
            pos = self.getMarkerPosition(x, y, zoom);
        var img = document.createElement('img');
        img.src = '../img/alarm.gif';
        img.style.cssText = "position:absolute;width:30px;height: 30px; top:" + pos.top + "px; left:" + pos.left + "px;z-index:7";
        img.className = 'atlas-img';
        img.setAttribute('coordinate', x + '&' + y);
        img.setAttribute('title', title || 'SOS！');
        self.textDiv.appendChild(img);
        self._setFontDivSize();
    };
    // poimatch
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

    parent._addBeacon = function(){
        var self = this;
        var beacons = self.options['beacons'];
        beacons.forEach(function(beacon){
                var marker = {
                    type: 'beacon',
                    x: beacon.x,
                    y: beacon.y,
                    text: beacon.iscanId,
                    name: beacon.desc,
                    coordinate: beacon.x + '&' + beacon.y,
                    id: beacon.iscanId
                };
                self._setMarker(marker);
        })
    }

    parent.addBeacon = function(beacon){
        var self = this;
        var marker = {
            type: 'beacon',
            id: beacon.id,
            x: beacon.x,
            y: beacon.y,
            text: beacon.text,
            name: beacon.name,
            coordinate: beacon.x + '&' + beacon.y
        };
        self._setMarker(marker);
        self._setFontDivSize();
    }
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
    parent._setFontDivSize = function(){
        if(this.__isPoiHidden) return;
        var  self = this,
            zoom = self.scroller.__zoomLevel,
            poiDivs = self.__poiDivs || [],
            filtered = self._getFilterData(),
            degree = -self.scroller.__rotateDegree;
        self.zoomLevel = +zoom;
        var isInFiltered = function(coord, filtered){
            var len = filtered.length || 0,
                flag = false,
                item, tempStr;
            for(var i = 0; i < len; ++i){
                item = filtered[i];
                tempStr = item[0] + '&' + item[1];
                if(tempStr == coord){
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        for(var i = 0, len = poiDivs.length; i < len; ++i){
            if(poiDivs[i].tagName == 'svg' || (self.__navigation && poiDivs[i] == self.__navigation.dom)) continue;
            var curDom = poiDivs[i],
                coordinate = curDom.getAttribute('coordinate'),
                className = curDom.className,
                isTag = (className.indexOf('atlas-tag') > -1) ? true : false,
                isTagImg = (className.indexOf('atlasTagImg') > -1) ? true : false,
                isImg = (className.indexOf('atlas-img') > -1) ? true : false,
                isBeacon = (className.indexOf('atlas-beacon') > -1) ? true : false,
                isInfo = (className.indexOf('atlas-info') > -1) ? true : false,
                userDefined = (className.indexOf('user-defined') > -1)? true : false;
            if(isTag || isTagImg) continue;

            if(!userDefined && !isImg && !isInfo && !isBeacon && !isInFiltered(coordinate, filtered)){
                curDom.style['display'] = 'none';
            }else{
                coordinate = coordinate.split('&');
                var position = self.getMarkerPosition(+coordinate[0], +coordinate[1], zoom),
                    left = position.left,
                    top = position.top,
                    zIndex = self.__mapZIndex.poi;
                var width,height,diffWidth, diffHeight,extraStyle = '';
                width = curDom.offsetWidth;
                height = curDom.offsetHeight;
                if(userDefined){
                    var color = curDom.style['color'],
                        fontSize = curDom.style['fontSize'];
                    extraStyle = 'color:' + color + ';font-size:' + fontSize + ';' +  self.__vendorPrefix + '-transform:' + 'rotate(' + degree +'deg)';
                }else if(isInfo){
                    var offset = curDom.getAttribute('offset').split('&');
                    left = left - width / 2 + 15 + (+offset[0]);
                    top = top - height + 15 + (+offset[1]);
                    zIndex = self.__mapZIndex.info;
                    extraStyle = self.__vendorPrefix + '-transform:' + 'rotate(' + degree +'deg)';
                }
                
                else if(isImg){
                    width = curDom.getAttribute('wh').split('&')[0] || width;
                    height = curDom.getAttribute('wh').split('&')[1] || height;
                    left = left - width / 2 + 15;
                    top = top + 15;
                    diffHeight = height / 2;
                    var cos = Math.cos(-degree * Math.PI / 180),
                        sin = Math.sin(-degree * Math.PI / 180),
                        diffTop = Math.round(-diffHeight * cos ) - diffHeight,// 5 = tag的高度/2（30） - poi的高度/2（20）; 10=poi的高度/2
                        diffLeft = Math.round(-diffHeight * sin);
                    extraStyle = self.__vendorPrefix + '-transform:' + 'translate('+(diffLeft) +'px,'+(diffTop) +'px) rotate(' + degree +'deg)';
                    zIndex = self.__mapZIndex.img;
                }
                
                else{
                    extraStyle = self.__vendorPrefix + '-transform:' + 'rotate(' + degree +'deg)';
                }
                var  styleStr = 'position: absolute; width: '+ width +'px; height:' + height + 'px;top: '+top+'px; left: '+ left +'px; z-index:' + zIndex + ';' + self.__vendorPrefix + '-transform-origin: 50% 50% 0px;';
                curDom.style.cssText = styleStr + extraStyle;
            }
        }
    };

})(Atlas);