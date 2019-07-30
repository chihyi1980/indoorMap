/**
 * Created by zhaop on 2016/11/25.
 */

(function(global){
    var p = global.prototype;
    p._initExtra = function(){
        var self = this;
        if(self.rotateDiv){
            var width = self.options.width,
                height = self.options.height;
            var trackCanvas = document.createElement('canvas');
            var diagonalLen = Math.floor(Math.sqrt(width * width + height * height));
            var left = -(diagonalLen - width) / 2,
                top = -(diagonalLen - height) / 2;
            var style = {
                'position': 'absolute',
                'display': 'block',
                'left': left + 'px',
                top: top + 'px',
                'z-index': 9
            };
            trackCanvas._upsertStyle(style);
            trackCanvas.width = diagonalLen;
            trackCanvas.height = diagonalLen;
            self.rotateDiv.appendChild(trackCanvas);
            self.trackCanvas = trackCanvas;
        }else{
            self.trackCanvas = null;
        }
    };
    p._initDom_ = p._initDom;
    p._initDom = function(){
        var self = this;
        self._initDom_();
        self._initExtra();
    };
    p._getFloorFences = function(callback){
        var self = this;
        var floorId = self.floorObj[self.curFloor];
        if( self.__fences[floorId] !== undefined){
            callback(self.__fences[floorId]);
        }else{
            var url = self.options['fenceUrl'] +'?floorId=' + floorId;
            self._jsonpCall(url, function(data){
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
    p._drawTrack = function(points, callback){
        var self = this;
        self.inFences = {};
        self._getFloorFences(function(fence){
            if(fence){
                var data = {
                    drawScale: self.__drawScale,
                    points: points,
                    fences: fence
                };
                for(var i=0; i < points.length; ++i){
                    var fenceIds = self.getFenceIds(points[i].x, points[i].y);
                    if(fenceIds && fenceIds[0]){
                        if(self.inFences[fenceIds[0]] == undefined || self.inFences[fenceIds[0]] == null){
                            self.inFences[fenceIds[0]] = [points[i]];
                        }else{
                            var lastOne = self.inFences[fenceIds[0]][self.inFences[fenceIds[0]].length -1];
                            if(points[i].time - lastOne.time >= 20 * 1000){
                                self.inFences[fenceIds[0]].push(points[i]);
                            }
                        }
                    }
                }
                self._renderTrack(self.trackCanvas, data);
                (callback || function(){})(colors);
            }
        })
    };

    p._renderTrack = function(canvas, data){
        var self = this;
        if(canvas){
            var _lastRepaintZoom,_lastRepaintLeft, _lastRepaintTop, _lastTrackImg;
            var trackCtx = canvas.getContext('2d');
            var width = canvas.width,
                height = canvas.height;
            if(data){
                data.width = canvas.width;
                data.height = canvas.height;
            }
            var values = self.__drag.getValues();
            _lastTrackImg = getTrackMap(values.zoom, values.left,values.top, data);
            trackCtx.clearRect(0, 0, width, height);
            trackCtx.drawImage(_lastTrackImg, 0, 0, width,height, 0, 0, width, height);

            self.customDoing = function(left, top, zoom){
                var curScale = +(zoom / _lastRepaintZoom).toFixed(6);
                var translateLeft, translateTop;
                translateLeft =  +(left - curScale * _lastRepaintLeft).toFixed(6);
                translateTop = +(top - curScale * _lastRepaintTop).toFixed(6);
                if(_lastTrackImg){
                    trackCtx.clearRect(0, 0, width, height);
                    trackCtx.save();
                    trackCtx.translate(-translateLeft, -translateTop);
                    trackCtx.scale(curScale, curScale);
                    trackCtx.drawImage(_lastTrackImg, 0, 0, width, height, 0, 0, width, height);
                    trackCtx.restore();
                }
            };
            self.customDone = function(left, top, zoom){
                _lastRepaintLeft = left;
                _lastRepaintTop = top;
                _lastRepaintZoom = zoom;
                _lastTrackImg = getTrackMap(zoom, left, top, data);
                trackCtx.clearRect(0, 0, width, height);
                trackCtx.drawImage(_lastTrackImg, 0, 0, width,height, 0, 0, width, height);

            }
        }

    };
    var createImgDom = function(src, width, height){
        var img = document.createElement('img');
        if(width){
            img.width = width;
        }
        if(height){
            img.height = height;
        }
        img.src = src;
        var isLoad = false;
        img.onload = function(){
            isLoad = true;
        };
        return img;
    };
    var cameraImg = createImgDom('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADGElEQVRYR9VXXVLaYBQ998uM9q10BaU7SHEBxgfRt9oFiHEF2hUUV1BcQQE3QN8EH4QFgOkKiiuQPlYn3+ncQBBCwq/OtN8LTHKTe+757jn3i2DOcg99z7E8g+AIRACgTzCwggDW3Ac3Vb220ZKsp13Pz5kt/hJBbl4GAn1RYGRbfy3Zv7u56iyLKhNA4aBUEcjZsi9KxpEYiCAgEYiwby0DPjk/g3Z1MBmbCsA99PMO+Wvd5Es811bmQCp7s6tQLLVFZHeJFy0dQmtPreO0AeSNtZ4IXEA+zQB4lerJWrdV9xVtVBzkgYKBEJ+zm/DQz0doGSrSPAhXIC4Eb5cuGwDJTq9V9/SZZHEEL7ObsFhqA3KXbCBVB97ANWGYh4iC9CDIC+R9GjDCfuk1ryojAJ5D3kZxI1aymvA5cPat4wZS6dFx7oPran+cwCJHWGXrXNlSNfRatXcj+ssi8jVOrtfSm3D/2Bdjvq9C9aRRqR8Acknac31PKPJBQeoWGGt9+2gqsRyzVDBEuskaUbxTPBmEj5LXhNF/I0fBdVXVEK1UADsHpYZKZKP84KX9Y8rOFvvdVi2nveNs8yFm4/UBEANEUmNHJRjNFfK226xNFZ3ehIp2y1YgcrIOCwTvI1UQv0Mjru5/4eD4HBS/16q7C604DtgplqrrgCB5YY3Rfe7HCikUS2V1v26zfrQ0gLF5WLgU60VmtIRFq/QsZS8e14X9Yx9ivkHsRewJ4x7QqQcKBQxCYzox4izqh5VMKyQU2dN49Xg1JgUZTUPIKYRnID5SbDmZPFJBcvBMGkcaiCwAk9KKmNv3XWNCT21c1ZAcw88MpEy+ZKdOAhmekqwf98Zov6uLmMtidIYBDZwHIOnpi2IXqej/AaB76hi7q1pGdJgYrldjIBq723bXQFS3ngA6ep8XWQNMo9uqNhbRPO9+6hYAUBOJDhHTiz9o2bBPTiOrq1cFkwVgstQXTzrlhOkH0Jev9EVluCrNK/fApp29CsC1fGCVBIti/z0AepjoNevTml9Uxgb3JTp0DD8g2vrptO5QWRfDXyRt5IwojCHCAAAAAElFTkSuQmCC');
    var getRandomColor = function() {
        var randomColor1 = Math.floor(Math.random() * 200) + 30;
        var randomColor2 = Math.floor(Math.random() * 200) + 30;
        var randomColor3 = Math.floor(Math.random() * 200) + 30;
        return ("rgb(" + randomColor1 + ", " + randomColor2 + ", " + randomColor3 + ")");
    };
    var line = function(ctx ,x1,y1,x2,y2) {
        ctx.save();
        ctx.strokeStyle = '#67D8A7';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.fill();
        ctx.stroke();

        var pos = [(x1+ x2) / 2, (y1 + y2) / 2];
        var radians = Math.atan((y2-y1)/(x2-x1));
        radians +=((x2>x1)?90:-90)*Math.PI/180;
        drawArrow(ctx, pos[0], pos[1], radians);
        ctx.restore();
    };
    var drawArrow = function(ctx, x, y, radians){
        ctx.save();
        ctx.beginPath();
        ctx.translate(x,y);
        ctx.rotate(radians);
        ctx.moveTo(0,0);
        ctx.lineTo(3,10);
        ctx.lineTo(0,5);
        ctx.lineTo(-3,10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };
    var  colors = {};
    var  getTrackMap = function(zoom, left, top, data){
        var scale = data.drawScale * zoom,
            width = data.width,
            height = data.height,
            fences = data.fences,
            points = data.points || [];
        var offlineCanvas = document.createElement('canvas'),
            offlineCtx = offlineCanvas.getContext('2d');
        offlineCanvas.width = width;
        offlineCanvas.height = height;
        offlineCtx.translate(-left, -top);
        offlineCtx.save();
        for(var k=0; k< points.length; ++k){
            var tx = points[k].x * scale,
                ty= points[k].y * scale,
                uid = points[k].uid || null;
            if(uid != null){
                if(colors[uid] == undefined){
                    colors[uid] = getRandomColor();
                }
            }
            offlineCtx.save();
            offlineCtx.fillStyle = colors[uid] || '#B233FF';
            //offlineCtx.strokeStyle = '#B2AAFF';
            offlineCtx.beginPath();
            offlineCtx.arc(tx, ty, 4, 0, Math.PI*2, true);
            offlineCtx.fill();
            //offlineCtx.stroke();
            offlineCtx.restore();
            if(k > 0 && false){
                var stx = points[k-1].x * scale,
                    sty= points[k-1].y * scale;
                line(offlineCtx, stx, sty, tx, ty);
            }
        }
        for(var i  in fences.fences){
            if(fences.fenceIds[i] && fences.fenceIds[i].trim() == 'alert') continue;
            var fencePoints = fences.fences[i];
            var pX = [], pY = [];
            offlineCtx.save();
            offlineCtx.globalAlpha= 0.2;
            offlineCtx.fillStyle = '#535353';
            offlineCtx.strokeStyle = '#272727';
            offlineCtx.beginPath();
            for(var j = 0; j < fencePoints.length; ++j){
                var x = fencePoints[j][0] * scale,
                    y= fencePoints[j][1] * scale;
                pX.push(x);
                pY.push(y);
                if(j==0){
                    offlineCtx.moveTo(x, y);
                }else{
                    offlineCtx.lineTo(x, y);
                }
            }
            offlineCtx.closePath();
            offlineCtx.fill();
            offlineCtx.stroke();
            offlineCtx.restore();
            var avgX = Math.floor(eval(pX.join('+')) / pX.length) - 10,
                avgY = Math.floor(eval(pY.join('+')) / pY.length) - 20;
            offlineCtx.drawImage(cameraImg, 0, 0, 32, 32, avgX, avgY, 32, 32);
        }
        return offlineCanvas;
    };

    p._layerEventHandle = function(pageX, pageY){
        var self = this;
        if(isNaN(pageX) || isNaN(pageY)){
            throw new Error("Invalid click.");
        }else if(pageX <= 0 || pageX <= 0){
            throw new Error("Invalid click.");
        }
        var values = self.__drag.getValues();
        var scale = values.zoom  *  self.__drawScale;
        var relXY = IndoorMap.Utils.getRelLayerXY(pageX, pageY, self.__initDeg, self.trackCanvas);
        var relX = (relXY.layerX  + values.left) / scale,
            relY = (relXY.layerY  + values.top) / scale;
        if(self.inFences != null){
            self._getFloorFences(function(fence){
                (self.options.layerClick || function(){})(self.getFenceIds(relX, relY)[0], self.inFences[self.getFenceIds(relX, relY)[0]]);
            })
        }
    };


})(Atlas);
