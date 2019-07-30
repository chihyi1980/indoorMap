/**
 * Created by zhaop on 2016/11/21.
 */

(function(global){
    var parent = global.prototype;
    var isMouseLeaveOrEnter = function (e, handler) {
        if (e.type != 'mouseout' && e.type != 'mouseover') return false;
        var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;
        while (reltg && reltg != handler)
            reltg = reltg.parentNode;
        return (reltg != handler);
    };
    parent.addText = function(text){
        var marker = {
            x: text.x,
            y: text.y,
            content: text.content,
            color: text.color || null,
            fontSize: text.fontSize || null
        };
        var wd = Math.max((marker.content || '').length * 15 ,60);
        var self = this,
            textDiv = self.textDiv,
            pos = self.getMarkerPosition(marker.x, marker.y),
            left = pos.left,
            top = pos.top,
            item = document.createElement('div');
        item.className = 'atlas-txt user-defined';
        item.innerHTML = marker.content;
        var styleStr = "position:absolute;top:" + top + "px; left:" + left + "px;width"+ wd + "px;z-index:" + self.__mapZIndex.poi + ';';
        if(marker.color){
            styleStr += 'color:' + marker.color + ';';
        }
        if(marker.fontSize){
            styleStr += 'font-size:' + marker.fontSize + ';';
        }
        item.style.cssText = styleStr;
        item.setAttribute('coordinate', marker.x + '&' + marker.y);
        textDiv.appendChild(item);
        return item;
    };

    parent.setPersonnelLocus = function(data){
        var self = this,
            zIndex = self.__mapZIndex.info,
            zoom = self.scroller.__zoomLevel;
        if(!data || !data.length) return;
        data.forEach(function(item){

            var info = self.addText({content:item.userId,x:item.coords.x,y:item.coords.y});
            //var info = self.addWindowInfo({content:item.userId,coords:item.coords,offset: item.offset,size:{width:wd}, arrows: true});
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

    parent._getFloorFences = function(callback){
        var self = this;
        var floorId = self.floorObj[self.curFloor];
        if( self.__fences[floorId] !== undefined){
            callback(self.__fences[floorId]);
        }else{
            var url = self.options['fenceUrl'] +'?floorId=' + floorId;
            AtlasUtils.jsonpCall(url, function(data){
                if(data && data.fenceIds){
                    self.__fences[floorId] = data;
                }else{
                    console.log('Error: check the fence draw in PoiMacth Tool!');
                    self.__fences[floorId] = null;
                }
                callback(self.__fences[floorId]);
            })
        }
    };
    parent.drawAlertFence = function(){
        var self = this;
        self._getFloorFences(function(fence){
            if(fence){
                var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                for(var i  in fence.fences){
                    if(fence.fenceIds[i] && fence.fenceIds[i].trim() == 'alert'){
                        var fencePoints = fence.fences[i];
                        var d = 'M';
                        for(var j = 0; j < fencePoints.length; ++j){
                            var x = fencePoints[j][0],
                                y= fencePoints[j][1],
                                endD = 'L';
                            if(j === fencePoints.length -1){
                                endD = 'Z';
                            }
                            d += [x, y].join(',').concat(endD);
                        }
                        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', d);
                        path.style.cssText = 'opacity: 0.5; stroke: red;';
                        g.appendChild(path);
                    }
                }
                self.svgDom.appendChild(g);
            }
        })
    };
})(Atlas);
