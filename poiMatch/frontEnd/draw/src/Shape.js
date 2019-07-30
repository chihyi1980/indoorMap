/**
 * Created by zhaop on 2015/3/30.
 */

window.AtlasDraw = window.AtlasDraw || {};

(function(global){
    var Shape = function(canvas, param, lineColor){
        global.Canvas.call(this, canvas, param, lineColor);
    };

    var p = Shape.prototype = Object.create(global.Canvas.prototype);

    p.utils = global.utils;

    p.setGraphType = function(type){
        global.utils.setGraphType.call(this, type);
    };
    p.setDirective = function(type){
        global.utils.setDirective.call(this, type);
    };
    p.setDrawStatus =  function(status){
        global.utils.setDrawStatus.call(this, status);
    };

    p.getCurDirective = function(){
        return global.__curDirective|| 'L';
    };
    p.getCurDrawStatus = function(){
        return global.__curDrawStatus || null;
    };

    p.getDrawData = function(){
        return global.localData;
    };
    p.getPathId = function(){
        return +global.pathId;
    };

    p.updateDrawData = function(data){
        global.localData = data;
        var temp = -1;
        for(var i in data){
            if(data[i]){
                var index = +i.split('_')[1];
                temp = Math.max(temp, index);
            }else{
                delete global.localData[i]
            }
        }
        global.pathId = temp + 1;
    }

    p.polyLine = {
        setVertex: function(x, y, type){
            var status = p.getCurDrawStatus();
            if(!p.getCurDrawStatus()){
                return console.log('Not in drawing.');
            }
            var self = this,
                point = [x, y],
                directives = global.directives,
                drawStatus = global.drawStatus,
                curDirective = p.getCurDirective();
            self.catchPoints = self.catchPoints || [];
            var tempPoint,cache;
            var len = self.catchPoints.length;
            if(len == 0){
                tempPoint = {directive:directives.moveTo, point:point}
            }else{
                tempPoint = {directive:curDirective, point:point}
            }
            if(type === 'anchor'){
                tempPoint['type'] = type;
            }
            if(status == drawStatus.click){
                if(len == 0 || (len > 0 && JSON.stringify(self.catchPoints[len-1].point) != JSON.stringify(tempPoint.point))){
                    self.catchPoints.push(tempPoint)
                }
            }
            cache = JSON.parse(JSON.stringify(self.catchPoints)) || [];
            var cachePoint = {directive:curDirective, point:point};
            if(JSON.stringify(self.catchPoints[len-1]) != JSON.stringify(cachePoint)){
                cache.push(cachePoint);
            }
            self.vertexes = global.utils.catchPointsToVertexes(cache, false);
        },
        clearVertexes: function(){
            global.utils.overCurPath(this.vertexes);
            this.vertexes = [];
            this.catchPoints = [];
        },
        getVertexes: function(){
            return this.vertexes || [];
        },
        draw: function(){
            if(!p.getCurDrawStatus()){
                return console.log('Not in drawing.');
            }
            var d = global.utils.getPathD(this.vertexes);
            global.utils.draw(d);
        }
    };

    p.polygon = {
        setVertex: function(x, y){
            var status = p.getCurDrawStatus();
            if(!p.getCurDrawStatus()){
                return console.log('Not in drawing.');
            }
            var self = this,
                point = [x, y],
                directives = global.directives,
                drawStatus = global.drawStatus,
                curDirective = p.getCurDirective();
            self.catchPoints = self.catchPoints || [];
            var tempPoint,cache;
            var len = self.catchPoints.length;
            if(len == 0){
                tempPoint = {directive:directives.moveTo, point:point}
            }else{
                tempPoint = {directive:curDirective, point:point}
            }
            if(status == drawStatus.click && JSON.stringify(self.catchPoints[len-1]) != JSON.stringify(tempPoint)){
                self.catchPoints.push(tempPoint)
            }
            cache = JSON.parse(JSON.stringify(self.catchPoints)) || [];
            var cachePoint = {directive:curDirective, point:point};
            if(JSON.stringify(self.catchPoints[len-1]) != JSON.stringify(cachePoint)){
                cache.push(cachePoint);
            }
            self.vertexes = global.utils.catchPointsToVertexes(cache, true);
        },
        clearVertexes: function(){
            global.utils.overCurPath(this.vertexes);
            this.vertexes = [];
            this.catchPoints = [];

        },
        getVertexes: function(){
            return this.vertexes || [];
        },
        draw: function(){
            if(!p.getCurDrawStatus()){
                return console.log('Not in drawing.');
            }
            var d = global.utils.getPathD(this.vertexes);
            global.utils.draw(d);
        }
    };

    global.Shape = Shape;

})(window.AtlasDraw);